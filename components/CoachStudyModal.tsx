'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import { Chessboard, defaultArrowOptions, type Arrow } from 'react-chessboard';
import { ChessboardFrame } from '@/components/ChessboardFrame';
import { sounds } from '@/lib/sounds';
import { BrowserStockfishEngine } from '@/lib/engine/browserStockfish';
import { EngineEvalResult } from '@/lib/engine/types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  BookOpen,
  Award,
  Zap,
  Target,
  Clock,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { ChessPuzzle } from '@/lib/puzzles';

export interface CoachStudyItem {
  id: string;
  title: string;
  tier?: string;
  initialFen: string;
  playerColor: 'white' | 'black';
  userMoveSan?: string;
  bestMoveSan: string;
  status?: 'best' | 'inaccurate' | 'blunder' | 'solved';
  timeMs?: number;
  prompt?: string;
  ruleTitle?: string;
  ruleBody?: string;
  coachExplanation?: string;
  solutionMoves?: { from: string; to: string; san: string; explanation?: string }[];
  opponentResponses?: { from: string; to: string; san: string; explanation?: string }[];
  defaultRefutation?: { from: string; to: string; san: string; coachExplanation?: string };
}

interface CoachStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  items: CoachStudyItem[];
  initialIndex?: number;
}

export function CoachStudyModal({
  isOpen,
  onClose,
  title = 'Coach Study Session: Tactical Review',
  subtitle = 'Review your diagnostic puzzles move-by-move with private academy coach commentary.',
  items,
  initialIndex = 0,
}: CoachStudyModalProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(initialIndex);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [showEngine, setShowEngine] = useState<boolean>(false);
  const [engineEval, setEngineEval] = useState<EngineEvalResult | null>(null);
  const [isEngineEvaluating, setIsEngineEvaluating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);
  const engineRef = useRef<BrowserStockfishEngine | null>(null);

  const currentItem = items[selectedIdx] || items[0];

  // Build the chronological moves sequence for the current study position:
  // Step 0: Initial position
  // Step 1: Solution move 1
  // Step 2: Opponent reply 1 (if exists)
  // Step 3: Solution move 2 (if exists)
  const moveSequence = useMemo(() => {
    if (!currentItem) return [];
    const seq: {
      fen: string;
      san: string;
      from: string;
      to: string;
      label: string;
      explanation: string;
      isPlayer: boolean;
    }[] = [];

    try {
      const sim = new Chess(currentItem.initialFen);
      // Step 0: starting position
      seq.push({
        fen: sim.fen(),
        san: 'Start',
        from: '',
        to: '',
        label: 'Position Setup',
        explanation: currentItem.prompt || 'Evaluate the tactical tension and identify weaknesses in the opponent camp.',
        isPlayer: false,
      });

      const solutionMoves = currentItem.solutionMoves || [];
      const opponentMoves = currentItem.opponentResponses || [];

      for (let i = 0; i < solutionMoves.length; i++) {
        const sol = solutionMoves[i];
        const res = sim.move({ from: sol.from, to: sol.to, promotion: 'q' });
        if (res) {
          seq.push({
            fen: sim.fen(),
            san: res.san,
            from: sol.from,
            to: sol.to,
            label: `Master Move ${i + 1}`,
            explanation: sol.explanation || currentItem.coachExplanation || `Strong master continuation ${res.san}.`,
            isPlayer: true,
          });
        }

        if (opponentMoves[i]) {
          const opp = opponentMoves[i];
          const oppRes = sim.move({ from: opp.from, to: opp.to, promotion: 'q' });
          if (oppRes) {
            seq.push({
              fen: sim.fen(),
              san: oppRes.san,
              from: opp.from,
              to: opp.to,
              label: `Opponent Response ${i + 1}`,
              explanation: opp.explanation || `Opponent attempts ${oppRes.san} to defend.`,
              isPlayer: false,
            });
          }
        }
      }

      // If no solutionMoves array was provided, generate from bestMoveSan
      if (seq.length === 1 && currentItem.bestMoveSan) {
        const sim2 = new Chess(currentItem.initialFen);
        try {
          const res = sim2.move(currentItem.bestMoveSan);
          if (res) {
            seq.push({
              fen: sim2.fen(),
              san: res.san,
              from: res.from,
              to: res.to,
              label: 'Winning Move',
              explanation: currentItem.coachExplanation || `${res.san} breaks the opponent's defensive structure.`,
              isPlayer: true,
            });
          }
        } catch {}
      }
    } catch {}

    return seq;
  }, [currentItem]);

  // Reset step whenever selected item changes
  useEffect(() => {
    setStepIdx(0);
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
  }, [selectedIdx]);

  // Current FEN at step
  const currentFen = useMemo(() => {
    if (moveSequence[stepIdx]) {
      return moveSequence[stepIdx].fen;
    }
    return currentItem?.initialFen || '8/8/8/8/8/8/8/8 w - - 0 1';
  }, [moveSequence, stepIdx, currentItem]);

  // Auto-step player
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setStepIdx((prev) => {
          if (prev + 1 < moveSequence.length) {
            sounds.playMove();
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1400);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, moveSequence.length]);

  // Optional Stockfish Engine Analysis
  useEffect(() => {
    if (!showEngine || !isOpen) return;

    if (!engineRef.current) {
      engineRef.current = new BrowserStockfishEngine();
      engineRef.current.init();
    }

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) setIsEngineEvaluating(true);
    }, 0);

    engineRef.current
      .evaluatePosition(currentFen, 120000)
      .then((res) => {
        if (isMounted) {
          setEngineEval(res);
          setIsEngineEvaluating(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsEngineEvaluating(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [showEngine, currentFen, isOpen]);

  if (!isOpen || !currentItem) return null;

  const activeStep = moveSequence[stepIdx] || moveSequence[0];
  const isLastStep = stepIdx === moveSequence.length - 1;
  const isFirstStep = stepIdx === 0;

  // Arrow for the current move
  const currentArrow: Arrow | undefined =
    activeStep && activeStep.from && activeStep.to
      ? {
          startSquare: activeStep.from,
          endSquare: activeStep.to,
          color: activeStep.isPlayer ? '#10b981' : '#f59e0b',
        }
      : undefined;

  const handleStepForward = () => {
    if (stepIdx + 1 < moveSequence.length) {
      sounds.playMove();
      setStepIdx(stepIdx + 1);
    }
  };

  const handleStepBack = () => {
    if (stepIdx > 0) {
      sounds.playMove();
      setStepIdx(stepIdx - 1);
    }
  };

  const handleJumpToStart = () => {
    sounds.playMove();
    setStepIdx(0);
    setIsPlaying(false);
  };

  const handleJumpToEnd = () => {
    sounds.playMove();
    setStepIdx(moveSequence.length - 1);
    setIsPlaying(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[820px] rounded-3xl theme-surface border border-[var(--border-focus)] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--surface-muted)]/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold theme-text-primary truncate flex items-center gap-2">
                <span>{title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-bold shrink-0">
                  Coach Study
                </span>
              </h3>
              <p className="text-[11px] theme-text-secondary truncate hidden sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEngine(!showEngine)}
              className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                showEngine
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-xs'
                  : 'theme-surface theme-text-secondary hover:theme-text-primary border-[var(--border-subtle)]'
              }`}
              title="Toggle Stockfish engine analysis to inspect variations"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showEngine ? 'Engine On' : 'Check Engine'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl theme-surface-subtle theme-text-muted hover:theme-text-primary hover:bg-neutral-800 transition cursor-pointer"
              title="Close study session"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Puzzle Selector Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--border-subtle)] overflow-x-auto custom-scrollbar shrink-0 bg-black/20">
          <span className="text-[10px] font-mono theme-text-muted uppercase px-1 shrink-0">
            Puzzles:
          </span>
          {items.map((item, idx) => {
            const isSelected = idx === selectedIdx;
            const isBest = item.status === 'best' || item.status === 'solved';
            const isInaccurate = item.status === 'inaccurate';
            return (
              <button
                key={item.id || idx}
                onClick={() => setSelectedIdx(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-primary)] text-white shadow-sm'
                    : 'theme-surface border border-[var(--border-subtle)] theme-text-secondary hover:theme-text-primary'
                }`}
              >
                <span>P{idx + 1}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isBest
                      ? 'bg-emerald-400'
                      : isInaccurate
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Main Body: 2 Columns on Desktop */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-4 p-3 sm:p-5 overflow-y-auto">
          {/* Left Column: Interactive Chessboard & Move Stepper */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col items-center justify-center">
            <div className="w-full max-w-[380px] sm:max-w-[400px]">
              <ChessboardFrame
                boardOrientation={currentItem.playerColor}
                boardSize={360}
                bezelSize={20}
              >
                <Chessboard
                  options={{
                    position: currentFen,
                    boardOrientation: currentItem.playerColor,
                    showNotation: true,
                    allowDrawingArrows: true,
                    clearArrowsOnClick: true,
                    arrows: currentArrow ? [currentArrow] : undefined,
                    arrowOptions: {
                      ...defaultArrowOptions,
                      color: activeStep.isPlayer ? '#10b981' : '#f59e0b',
                      opacity: 0.9,
                    },
                  }}
                />
              </ChessboardFrame>

              {/* Stepper Controls */}
              <div className="mt-3 flex items-center justify-between p-2 rounded-2xl theme-surface border border-[var(--border-subtle)] shadow-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleJumpToStart}
                    disabled={isFirstStep}
                    className="p-1.5 rounded-lg theme-surface-subtle theme-text-secondary hover:theme-text-primary disabled:opacity-40 cursor-pointer"
                    title="Jump to Start"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleStepBack}
                    disabled={isFirstStep}
                    className="p-1.5 rounded-lg theme-surface-subtle theme-text-secondary hover:theme-text-primary disabled:opacity-40 cursor-pointer"
                    title="Previous Move"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    title={isPlaying ? 'Pause auto-step' : 'Auto-play solution'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={handleStepForward}
                    disabled={isLastStep}
                    className="p-1.5 rounded-lg theme-surface-subtle theme-text-secondary hover:theme-text-primary disabled:opacity-40 cursor-pointer"
                    title="Next Move"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleJumpToEnd}
                    disabled={isLastStep}
                    className="p-1.5 rounded-lg theme-surface-subtle theme-text-secondary hover:theme-text-primary disabled:opacity-40 cursor-pointer"
                    title="Jump to End"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[11px] font-mono theme-text-muted px-2">
                  Step {stepIdx + 1} of {moveSequence.length}
                </div>
              </div>

              {/* Move Buttons Ribbon */}
              <div className="mt-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
                {moveSequence.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sounds.playMove();
                      setStepIdx(idx);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                      stepIdx === idx
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'theme-surface-subtle theme-text-secondary hover:theme-text-primary border border-[var(--border-subtle)]'
                    }`}
                  >
                    {m.san}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Coach Pedagogical Breakdown */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col gap-3 justify-between">
            {/* Coach Speech Bubble */}
            <div className="p-4 sm:p-5 rounded-3xl theme-surface border border-[var(--border-subtle)] shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎓</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                    Coach Commentary
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface-muted)] border theme-text-muted">
                  {activeStep.label}
                </span>
              </div>

              {/* What happens on this move */}
              <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-extrabold text-sm text-emerald-400">
                    {activeStep.san}
                  </span>
                  {activeStep.isPlayer && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-bold">
                      Winning continuation
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm theme-text-primary leading-relaxed">
                  {activeStep.explanation}
                </p>
              </div>

              {/* What the student played during the test */}
              {currentItem.userMoveSan && (
                <div className="p-3 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)] text-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider theme-text-muted block mb-1">
                    Your Move in the Assessment:
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold ${
                        currentItem.status === 'best'
                          ? 'text-emerald-400'
                          : currentItem.status === 'inaccurate'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {currentItem.userMoveSan}
                    </span>
                    <span className="text-[10px] theme-text-muted">
                      {currentItem.status === 'best'
                        ? '✓ Matched master move'
                        : currentItem.status === 'inaccurate'
                        ? '! Minor inaccuracy'
                        : '✗ Blunder refutation exists'}
                    </span>
                  </div>
                </div>
              )}

              {/* Tactical Golden Rule */}
              {currentItem.ruleTitle && currentItem.ruleBody && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wide mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Grandmaster Golden Rule</span>
                  </div>
                  <span className="text-xs font-bold theme-text-primary block mb-0.5">
                    {currentItem.ruleTitle}
                  </span>
                  <p className="text-[11px] theme-text-secondary leading-relaxed">
                    {currentItem.ruleBody}
                  </p>
                </div>
              )}
            </div>

            {/* Optional Engine Eval Bar / Lines */}
            {showEngine && (
              <div className="p-3 rounded-2xl theme-surface border border-emerald-500/30 bg-emerald-500/5 font-mono text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Stockfish Deep Eval</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {isEngineEvaluating ? 'Calculating...' : 'Depth ~18'}
                  </span>
                </div>
                {engineEval ? (
                  <div className="flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-neutral-400">Score: </span>
                      <span className="font-bold text-emerald-400">
                        {engineEval.mate !== undefined
                          ? engineEval.mate > 0
                            ? `+M${engineEval.mate}`
                            : `-M${Math.abs(engineEval.mate)}`
                          : engineEval.cp !== undefined
                          ? `${engineEval.cp > 0 ? '+' : ''}${(engineEval.cp / 100).toFixed(2)}`
                          : '0.00'}
                      </span>
                    </div>
                    {engineEval.bestMove && (
                      <div>
                        <span className="text-neutral-400">Top Line: </span>
                        <span className="font-bold theme-text-primary">
                          {engineEval.bestMove}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-400">
                    Evaluating position...
                  </span>
                )}
              </div>
            )}

            {/* Bottom Stepper / Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setSelectedIdx(Math.max(0, selectedIdx - 1))}
                disabled={selectedIdx === 0}
                className="text-xs font-mono font-bold px-3 py-2 rounded-xl theme-surface-subtle theme-text-secondary hover:theme-text-primary disabled:opacity-30 border border-[var(--border-subtle)] flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous Puzzle</span>
              </button>

              <span className="text-xs font-mono font-bold theme-text-muted">
                {selectedIdx + 1} / {items.length}
              </span>

              <button
                type="button"
                onClick={() => setSelectedIdx(Math.min(items.length - 1, selectedIdx + 1))}
                disabled={selectedIdx === items.length - 1}
                className="text-xs font-mono font-bold px-3 py-2 rounded-xl theme-surface-subtle theme-text-secondary hover:theme-text-primary disabled:opacity-30 border border-[var(--border-subtle)] flex items-center gap-1 cursor-pointer"
              >
                <span>Next Puzzle</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
