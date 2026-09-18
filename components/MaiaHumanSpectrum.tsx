'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard, defaultArrowOptions } from 'react-chessboard';
import type { Arrow, PieceDropHandlerArgs } from 'react-chessboard';
import { ChessboardFrame } from '@/components/ChessboardFrame';
import { sounds } from '@/lib/sounds';
import {
  Brain,
  Cpu,
  Sparkles,
  AlertTriangle,
  Swords,
  ExternalLink,
  Target,
  RotateCcw,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  fetchMaiaAnalysis,
  MaiaRatingTier,
  MaiaAnalysisResult,
  MaiaCandidateMove,
} from '@/lib/engine/maiaClient';

interface MaiaHumanSpectrumProps {
  fen: string;
  playedMoveSan?: string;
  stockfishBestMoveSan?: string;
  stockfishEval?: string;
  clockRemaining?: number;
  playerColor?: 'white' | 'black';
  className?: string;
}

const RATING_TIERS: { tier: MaiaRatingTier; label: string; desc: string }[] = [
  { tier: 1100, label: '1100', desc: 'Casual / Tactical Myopia' },
  { tier: 1300, label: '1300', desc: 'Developing Club Player' },
  { tier: 1500, label: '1500', desc: 'Intermediate Heuristic' },
  { tier: 1700, label: '1700', desc: 'Solid Tournament Competitor' },
  { tier: 1900, label: '1900', desc: 'Expert / Tactical Depth' },
];

function moveSanToSquares(fen: string, san: string): { from: string; to: string } | null {
  try {
    const chess = new Chess(fen);
    const m = chess.move(san);
    if (m) {
      return { from: m.from, to: m.to };
    }
  } catch {
    // Ignore invalid SAN
  }
  return null;
}

export function MaiaHumanSpectrum({
  fen,
  playedMoveSan,
  stockfishBestMoveSan,
  stockfishEval,
  clockRemaining,
  playerColor,
  className = '',
}: MaiaHumanSpectrumProps) {
  const [selectedTier, setSelectedTier] = useState<MaiaRatingTier>(1500);
  const [analysis, setAnalysis] = useState<MaiaAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Visual arrow states
  const [showOracleArrow, setShowOracleArrow] = useState<boolean>(true);
  const [showHumanArrow, setShowHumanArrow] = useState<boolean>(true);
  const [activeHighlightedMove, setActiveHighlightedMove] = useState<MaiaCandidateMove | null>(null);

  // Refutation Mini-Trainer State
  const [isRefuting, setIsRefuting] = useState<boolean>(false);
  const [refutationGame, setRefutationGame] = useState<InstanceType<typeof Chess> | null>(null);
  const [refutationStatus, setRefutationStatus] = useState<'prompt' | 'success' | 'fail'>('prompt');
  const [refutationFeedback, setRefutationFeedback] = useState<string | null>(null);
  const [expectedRefutationSan, setExpectedRefutationSan] = useState<string | null>(null);

  // Load Maia Analysis
  useEffect(() => {
    let isCancelled = false;
    async function loadData() {
      if (!fen) return;
      setLoading(true);
      // Reset refutation state on FEN change
      setIsRefuting(false);
      setRefutationGame(null);
      setRefutationStatus('prompt');
      setRefutationFeedback(null);
      setActiveHighlightedMove(null);

      try {
        const res = await fetchMaiaAnalysis(fen, selectedTier, stockfishBestMoveSan);
        if (!isCancelled) {
          setAnalysis(res);
        }
      } catch (err) {
        console.error('Failed to fetch Maia analysis:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isCancelled = true;
    };
  }, [fen, selectedTier, stockfishBestMoveSan]);

  // Determine board orientation
  const orientation = useMemo(() => {
    if (playerColor) return playerColor;
    try {
      const c = new Chess(fen);
      return c.turn() === 'w' ? 'white' : 'black';
    } catch {
      return 'white';
    }
  }, [fen, playerColor]);

  // Compute live arrows
  const arrows: Arrow[] = useMemo(() => {
    if (isRefuting) return []; // Hide answer arrows while player is solving

    const list: Arrow[] = [];

    // 1. Stockfish Oracle Arrow (Green)
    if (showOracleArrow && stockfishBestMoveSan) {
      const sq = moveSanToSquares(fen, stockfishBestMoveSan);
      if (sq) {
        list.push({
          startSquare: sq.from,
          endSquare: sq.to,
          color: '#10b981', // emerald-500
        });
      }
    }

    // 2. Maia Human Candidate Arrow (Purple)
    if (showHumanArrow) {
      const targetMove = activeHighlightedMove || analysis?.topHumanMove;
      if (targetMove?.san) {
        const sq = moveSanToSquares(fen, targetMove.san);
        if (sq) {
          list.push({
            startSquare: sq.from,
            endSquare: sq.to,
            color: '#a855f7', // purple-500
          });
        }
      }
    }

    // 3. User's Blunder Move (Red Ghost Arrow)
    if (playedMoveSan && playedMoveSan !== stockfishBestMoveSan) {
      const sq = moveSanToSquares(fen, playedMoveSan);
      if (sq) {
        list.push({
          startSquare: sq.from,
          endSquare: sq.to,
          color: '#ef4444', // rose-500
        });
      }
    }

    return list;
  }, [
    fen,
    stockfishBestMoveSan,
    showOracleArrow,
    showHumanArrow,
    activeHighlightedMove,
    analysis?.topHumanMove,
    playedMoveSan,
    isRefuting,
  ]);

  // Start "Refute This Human Move" Challenge
  const handleStartRefutation = () => {
    try {
      const chess = new Chess(fen);
      // The trap move is Maia's top human blunder or the user's blunder
      const trapMoveSan = analysis?.topHumanMove?.san || playedMoveSan;
      if (!trapMoveSan) return;

      chess.move(trapMoveSan);
      sounds.playMove();

      // Find the refutation: Stockfish's response to the blunder
      const nextTurnChess = new Chess(chess.fen());
      const legalMoves = nextTurnChess.moves();
      // Use stockfish best response or fallback to first tactical capture/check
      const refutation = stockfishBestMoveSan || legalMoves[0] || '';

      setRefutationGame(chess);
      setExpectedRefutationSan(refutation);
      setIsRefuting(true);
      setRefutationStatus('prompt');
      setRefutationFeedback(
        `Maia played ${trapMoveSan} (${analysis?.cognitiveDiagnosis.blunderCategory || 'Human Trap'}). Play the refutation!`
      );
    } catch {
      // Fallback
    }
  };

  // Reset Refutation
  const handleResetRefutation = () => {
    setIsRefuting(false);
    setRefutationGame(null);
    setRefutationStatus('prompt');
    setRefutationFeedback(null);
  };

  // Handle Piece Drop in Refutation Mode
  const handleRefutationDrop = ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
    if (!refutationGame || !isRefuting || !targetSquare) return false;

    try {
      const testChess = new Chess(refutationGame.fen());
      const move = testChess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (!move) return false;

      // Check if move matches refutation or wins
      const isCorrect =
        !expectedRefutationSan ||
        move.san === expectedRefutationSan ||
        testChess.inCheck() ||
        Boolean(move.captured);

      if (isCorrect) {
        refutationGame.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
        sounds.playSuccess();
        setRefutationStatus('success');
        setRefutationFeedback(
          `🎉 Trap Punished! You found the refutation: ${move.san} (+15 Tactical Conviction).`
        );
        return true;
      } else {
        sounds.playMove();
        setRefutationStatus('fail');
        setRefutationFeedback(
          `❌ ${move.san} is too slow! Try again to find the crushing refutation.`
        );
        return false;
      }
    } catch {
      return false;
    }
  };

  const lichessBotMap: Record<MaiaRatingTier, string> = {
    1100: 'maia1',
    1300: 'maia1',
    1500: 'maia5',
    1700: 'maia5',
    1900: 'maia9',
  };

  const currentBot = lichessBotMap[selectedTier];
  const displayFen = refutationGame ? refutationGame.fen() : fen;

  return (
    <div
      className={`p-4 md:p-6 rounded-3xl theme-surface border border-[var(--border-subtle)] space-y-5 shadow-sm ${className}`}
    >
      {/* 1. Header & Rating Tier Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold theme-text-primary font-display">
                Maia Human Lens & Visual Radar
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase font-semibold">
                Dual-Engine
              </span>
            </div>
            <span className="text-[10px] theme-text-muted font-mono block">
              Spatial move geometry and human blunder probabilities
            </span>
          </div>
        </div>

        {/* Rating Tiers Pill Selector */}
        <div className="flex items-center gap-1 bg-[var(--surface-muted)] p-1 rounded-xl border border-[var(--border-subtle)] self-start sm:self-auto">
          {RATING_TIERS.map((item) => {
            const isSelected = selectedTier === item.tier;
            return (
              <button
                key={item.tier}
                onClick={() => setSelectedTier(item.tier)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'theme-text-muted hover:theme-text-primary hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                title={item.desc}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Clock Pressure Alert (if played in time trouble) */}
      {clockRemaining !== undefined && clockRemaining < 30 && (
        <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-pink-400 block font-display">
                Time Trouble Degradation ({clockRemaining}s left)
              </span>
              <span className="text-[11px] theme-text-secondary leading-tight block">
                Calculations under 30 seconds drop 400 Elo into Greed and Tunnel Vision traps.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-extrabold uppercase shrink-0">
            Rapid Decay
          </span>
        </div>
      )}

      {/* 3. Interactive Split Layout: Chessboard with Arrows (Left) & Maia Predictions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Chessboard with Visual Arrows & Refutation Sandbox */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-3">
          <ChessboardFrame
            boardOrientation={orientation}
            boardSize={320}
            bezelSize={18}
          >
            <Chessboard
              options={{
                position: displayFen,
                boardOrientation: orientation,
                showNotation: true,
                allowDrawingArrows: true,
                clearArrowsOnClick: true,
                arrows: arrows,
                arrowOptions: {
                  ...defaultArrowOptions,
                  opacity: 0.9,
                  arrowStartOffset: 0.15,
                  arrowWidthDenominator: 5.5,
                },
                onPieceDrop: isRefuting ? handleRefutationDrop : undefined,
              }}
            />
          </ChessboardFrame>

          {/* Arrow Legend & Toggle Controls */}
          <div className="w-full max-w-[340px] flex items-center justify-between text-[11px] font-mono theme-text-muted px-1">
            <button
              onClick={() => setShowOracleArrow(!showOracleArrow)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition cursor-pointer ${
                showOracleArrow
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : 'theme-surface-subtle text-neutral-500 opacity-60'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Oracle Line</span>
              {showOracleArrow ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setShowHumanArrow(!showHumanArrow)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition cursor-pointer ${
                showHumanArrow
                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/30'
                  : 'theme-surface-subtle text-neutral-500 opacity-60'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span>Human Trap</span>
              {showHumanArrow ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>

          {/* Refutation Mini-Trainer Box */}
          <div className="w-full max-w-[340px] p-3 rounded-2xl theme-surface border space-y-2">
            {!isRefuting ? (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold theme-text-primary block font-display">
                    Interactive Refutation Mode
                  </span>
                  <span className="text-[10px] theme-text-muted block">
                    Play the move that punishes Maia’s trap
                  </span>
                </div>
                <button
                  onClick={handleStartRefutation}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-purple-600 hover:bg-purple-700 text-white transition cursor-pointer shadow-xs shrink-0"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Refute Trap</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {refutationStatus === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : refutationStatus === 'fail' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Target className="w-4 h-4 text-purple-400" />
                    )}
                    <span className="text-xs font-bold font-mono">
                      {refutationStatus === 'success'
                        ? 'SOLVED!'
                        : refutationStatus === 'fail'
                        ? 'TRY AGAIN'
                        : 'YOUR TURN'}
                    </span>
                  </div>
                  <button
                    onClick={handleResetRefutation}
                    className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 hover:text-white transition cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Board</span>
                  </button>
                </div>
                <p className="text-xs theme-text-secondary leading-relaxed">
                  {refutationFeedback}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Dual Engine Cards & Probability Bars */}
        <div className="lg:col-span-6 space-y-4">
          {/* Dual Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Stockfish Oracle Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Stockfish Oracle (Truth)</span>
                </div>
                {stockfishEval && (
                  <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {stockfishEval}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-emerald-300">
                  {stockfishBestMoveSan || 'Calculating...'}
                </span>
                <span className="text-[10px] theme-text-muted">optimal engine move</span>
              </div>
            </div>

            {/* Maia Human Choice Card */}
            <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Maia {selectedTier} Choice</span>
                </div>
                {analysis?.topHumanMove && (
                  <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {analysis.topHumanMove.probability}% pick
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-purple-300">
                  {loading
                    ? 'Predicting...'
                    : analysis?.topHumanMove?.san || 'N/A'}
                </span>
                <span className="text-[10px] theme-text-muted">
                  {analysis?.isHumanTrap ? '⚠️ Common Human Trap' : 'dominant human move'}
                </span>
              </div>
            </div>
          </div>

          {/* Candidate Moves Probability Spectrum */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono theme-text-muted">
              <span>Human Move Probabilities ({selectedTier} Elo)</span>
              <span>Click move to preview arrow</span>
            </div>

            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-mono theme-text-muted">
                  Sampling Maia policy distribution...
                </span>
              </div>
            ) : analysis?.candidateMoves && analysis.candidateMoves.length > 0 ? (
              <div className="space-y-2">
                {analysis.candidateMoves.slice(0, 5).map((m) => {
                  const isPlayed = playedMoveSan && m.san === playedMoveSan;
                  const isBest = m.isStockfishBest;
                  const isHighlighted = activeHighlightedMove?.san === m.san;

                  let barColor = 'bg-purple-500';
                  if (isBest) barColor = 'bg-emerald-500';
                  else if (isPlayed) barColor = 'bg-rose-500';

                  return (
                    <div
                      key={m.san}
                      onClick={() => setActiveHighlightedMove(m)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isHighlighted
                          ? 'border-purple-500 ring-1 ring-purple-500/40 bg-purple-500/10'
                          : isPlayed
                          ? 'bg-rose-500/10 border-rose-500/30'
                          : 'theme-surface-subtle border-[var(--border-subtle)] hover:border-purple-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold theme-text-primary">{m.san}</span>
                          {isBest && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                              Oracle Best
                            </span>
                          )}
                          {isPlayed && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30">
                              Your Move
                            </span>
                          )}
                          {m.winRate !== undefined && (
                            <span className="text-[10px] theme-text-muted">
                              ({m.winRate}% win rate)
                            </span>
                          )}
                        </div>
                        <span className="font-extrabold text-purple-400">
                          {m.probability}%
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                        <div
                          className={`h-full ${barColor} transition-all duration-500`}
                          style={{ width: `${Math.min(100, Math.max(4, m.probability))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl theme-surface-subtle border text-center text-xs theme-text-muted">
                No alternative human move data available for this position.
              </div>
            )}
          </div>

          {/* Cognitive Blunder Diagnosis Box */}
          {analysis?.cognitiveDiagnosis && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Cognitive Trap: {analysis.cognitiveDiagnosis.blunderCategory}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-extrabold">
                  {analysis.cognitiveDiagnosis.humanTrapRate}% of {selectedTier}s fall for this
                </span>
              </div>
              <p className="text-xs theme-text-secondary leading-relaxed">
                {analysis.cognitiveDiagnosis.explanation}
              </p>
            </div>
          )}

          {/* Miai Dual-Threat Alert (if detected) */}
          {analysis?.miaiDilemma?.hasDualThreat && (
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Miai Principle (Dual Threat Geometry)</span>
              </div>
              <p className="text-xs theme-text-secondary leading-relaxed">
                {analysis.miaiDilemma.explanation}
              </p>
              <ul className="text-[11px] font-mono text-cyan-300 list-disc list-inside space-y-0.5 pt-0.5">
                {analysis.miaiDilemma.threats.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Spar Link */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[11px] font-mono theme-text-muted">
              Test your radar against Maia bots
            </span>
            <a
              href={`https://lichess.org/@/${currentBot}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>Spar @{currentBot} ({selectedTier})</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
