'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  X,
  Target,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Zap,
  Award,
  Flame,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Crown,
  Clock,
  Castle,
  EyeOff,
  Layers,
  Grid,
  ShieldOff,
  Anchor,
  Cpu,
  BookOpen,
  Filter,
} from 'lucide-react';
import { ChessPuzzle } from '@/lib/puzzles';
import { SkillTier, getCategoryDefinitionsForTier } from '@/lib/mistakeClassifier';
import { useWeaknessScan } from '@/lib/useWeaknessScan';
import { BlunderPuzzle, momentsToBlunderPuzzles } from '@/lib/blunderAdapter';
import { TermHoverCard } from '@/components/TermHoverCard';
import { LichessUser } from '@/lib/lichess';
import { LichessIcon } from '@/components/LichessModal';


interface WeaknessDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: LichessUser | null;
  onStartTraining: (puzzle: ChessPuzzle) => void;
}

interface BlunderCardItemProps {
  puzzle: BlunderPuzzle;
  isMastered: boolean;
  onStartTraining: (puzzle: ChessPuzzle) => void;
  onClose: () => void;
}

function BlunderCardItem({
  puzzle,
  isMastered,
  onStartTraining,
  onClose,
}: BlunderCardItemProps) {
  const moveNum = puzzle.moveNumber ?? 1;
  const playedSan = puzzle.playedSan ?? '';

  const setupMoves =
    puzzle.setupMoves && puzzle.setupMoves.length > 0
      ? puzzle.setupMoves
      : [
          {
            ply: 0,
            moveNumber: moveNum,
            turnPrefix: '',
            san: playedSan,
            fen: puzzle.initialFen,
          },
        ];

  // Step index within setup moves (default to the last move, the blunder)
  const [stepIdx, setStepIdx] = useState<number>(setupMoves.length - 1);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const phaseName =
    moveNum <= 10
      ? 'Opening'
      : moveNum <= 30
      ? 'Middlegame'
      : 'Endgame';

  return (
    <div className="p-3.5 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)] hover:border-[var(--border-focus)] transition flex flex-col justify-between space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold theme-text-primary truncate">
              {puzzle.title}
            </span>
            <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-500/15 text-rose-400 font-bold shrink-0">
              Move {moveNum} • {phaseName}
            </span>
          </div>
          <div className="text-[11px] font-mono mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
              Played: <strong>{playedSan}</strong>
            </span>
            {puzzle.evalSwingPawns && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                -~{puzzle.evalSwingPawns} pts
              </span>
            )}
            {isMastered ? (
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Solution: {puzzle.bestSan}
              </span>
            ) : isRevealed ? (
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1.5 animate-in fade-in duration-150">
                <span>Best: {puzzle.bestSan}</span>
                <button
                  type="button"
                  onClick={() => setIsRevealed(false)}
                  className="text-[9px] text-neutral-400 hover:text-white underline cursor-pointer"
                >
                  Hide
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsRevealed(true)}
                className="text-[10px] text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2 py-0.5 rounded font-mono flex items-center gap-1 transition cursor-pointer"
                title="Click to reveal winning move (or click Fix to calculate and test yourself!)"
              >
                <span>🎯 Spot winning move</span>
                <span className="opacity-60 text-[9px]">(reveal?)</span>
              </button>
            )}
          </div>
        </div>

        {isMastered && (
          <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            Fixed
          </span>
        )}
      </div>

      {/* Preceding Setup Moves Stepper (How the position arose) */}
      {setupMoves.length > 1 && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-black/25 border border-[var(--border-subtle)] text-xs font-mono">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-[10px] theme-text-muted uppercase shrink-0">
              Setup:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
              {setupMoves.map((sm, idx: number) => {
                const isSelected = stepIdx === idx;
                const isFinal = idx === setupMoves.length - 1;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setStepIdx(idx)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer shrink-0 ${
                      isSelected
                        ? isFinal
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-[var(--accent-primary)] text-white shadow-xs'
                        : 'theme-surface theme-text-secondary hover:theme-text-primary'
                    }`}
                    title={`Step ${idx + 1}: ${sm.turnPrefix || ''} ${sm.san}`}
                  >
                    <span>
                      {sm.turnPrefix ? `${sm.turnPrefix} ` : ''}
                      {sm.san}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1.5">
            <button
              type="button"
              onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
              disabled={stepIdx === 0}
              className="w-6 h-6 rounded-lg theme-surface hover:theme-surface-subtle border flex items-center justify-center cursor-pointer disabled:opacity-30 text-[10px] transition"
              title="Step back 1 move"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() =>
                setStepIdx(Math.min(setupMoves.length - 1, stepIdx + 1))
              }
              disabled={stepIdx === setupMoves.length - 1}
              className="w-6 h-6 rounded-lg theme-surface hover:theme-surface-subtle border flex items-center justify-center cursor-pointer disabled:opacity-30 text-[10px] transition"
              title="Step forward 1 move"
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {/* The study for this mistake, on the card that needs it. The lexicon used
          to be a tab people visited once; now it arrives at the only moment it
          is wanted. ruleTitle is "<rule>: <played move>", so resolve the rule. */}
      <div className="text-[11px] theme-text-secondary line-clamp-1 italic">
        <TermHoverCard term={puzzle.ruleTitle.split(':')[0].trim()} showIcon>
          {puzzle.ruleTitle.split(':')[0].trim()}
        </TermHoverCard>
      </div>

      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono theme-text-muted">
          {puzzle.categoryTitle}
        </span>

        <button
          onClick={() => {
            onStartTraining(puzzle);
            onClose();
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer shrink-0"
        >
          <span>{isMastered ? 'Train Again' : 'Fix It'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function WeaknessDashboard({
  isOpen,
  onClose,
  user,
  onStartTraining,
}: WeaknessDashboardProps) {
  // Skill tier state: auto-detects from user rating if available
  const [selectedTier, setSelectedTier] = useState<SkillTier>('beginner');

  // One shared pipeline with /weakness: an unanalyzed game is a game the browser
  // engine has not swept yet, not a game we have to ignore.
  const {
    games,
    moments,
    unanalyzedCount,
    isLoading,
    error,
    isEngineRunning,
    engineProgress,
    scan,
    runEngine,
  } = useWeaknessScan({ autoUsername: user?.username, enabled: isOpen });

  // Active filter tab for mistake feed: 'all' or categoryId
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Mastered mistake IDs from localStorage with lazy initialization
  const [masteredIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chessz_mastered_blunders');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Auto-detect tier from Lichess rating on initial user connection
  useEffect(() => {
    if (user?.perfs) {
      const rating = user.perfs.rapid?.rating || user.perfs.blitz?.rating || 1000;
      const timer = setTimeout(() => {
        if (rating < 900) {
          setSelectedTier('beginner');
        } else if (rating < 1300) {
          setSelectedTier('adv_beginner');
        } else {
          setSelectedTier('intermediate');
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Custom username input state
  const [inputUsername, setInputUsername] = useState<string>('');

  const blunders = useMemo<BlunderPuzzle[]>(
    () => momentsToBlunderPuzzles(moments, games, selectedTier),
    [moments, games, selectedTier]
  );

  const fetchBlunders = useCallback(
    (targetUser?: string) => {
      const username = (
        targetUser ||
        inputUsername ||
        user?.username ||
        (typeof window !== 'undefined' ? localStorage.getItem('chessz_last_username') : '') ||
        ''
      ).trim();
      if (username) scan(username, true);
    },
    [inputUsername, user?.username, scan]
  );

  // Group into the 5 categories of the active tier. The adapter already
  // classified each moment, so this is a count, not a second classification.
  const { categoryBreakdown, classifiedBlunders, primaryLeak } = useMemo(() => {
    const tierDefs = getCategoryDefinitionsForTier(selectedTier);
    const counts: Record<string, number> = {};
    tierDefs.forEach((def) => {
      counts[def.id] = 0;
    });

    for (const b of blunders) {
      if (b.category && counts[b.category] !== undefined) counts[b.category]++;
    }

    const total = blunders.length;
    const breakdown = tierDefs.map((def) => {
      const cnt = counts[def.id] || 0;
      return {
        ...def,
        count: cnt,
        percentage: total > 0 ? Math.round((cnt / total) * 100) : 0,
      };
    });

    const primaryItem = breakdown.reduce(
      (max, curr) => (curr.count > max.count ? curr : max),
      breakdown[0] || { ...tierDefs[0], count: 0, percentage: 0 }
    );

    return {
      categoryBreakdown: breakdown,
      classifiedBlunders: blunders,
      primaryLeak: {
        ...primaryItem,
        count: Math.max(0, primaryItem.count),
        percentage: primaryItem.percentage,
      },
    };
  }, [blunders, selectedTier]);

  // Filtered blunders according to active category pill
  const filteredBlunders = useMemo(() => {
    if (activeCategoryFilter === 'all') return classifiedBlunders;
    return classifiedBlunders.filter((b) => b.category === activeCategoryFilter);
  }, [classifiedBlunders, activeCategoryFilter]);

  if (!isOpen) return null;

  // Icon renderer helper
  const renderCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      case 'EyeOff':
        return <EyeOff className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Castle':
        return <Castle className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Grid':
        return <Grid className={className} />;
      case 'ShieldOff':
        return <ShieldOff className={className} />;
      case 'Anchor':
        return <Anchor className={className} />;
      default:
        return <Target className={className} />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="weakness-dashboard-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl theme-surface border shadow-2xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] shrink-0 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="weakness-dashboard-title"
                  className="text-base sm:text-lg font-extrabold theme-text-primary flex items-center gap-2"
                >
                  Weakness Studio
                  {games.length > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {games.length} Games Scanned
                    </span>
                  )}
                </h2>
              </div>
              <p className="text-xs theme-text-secondary">
                {user?.username ? `@${user.username}'s` : 'Your'} real game mistakes categorized into 5 actionable training pillars
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/weakness"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-bold font-mono transition cursor-pointer"
              title="Open full Deep Analytics Studio"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deep Studio</span>
            </Link>

            <button
              onClick={() => fetchBlunders()}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl theme-surface-subtle theme-surface-hover border text-xs font-bold font-mono theme-text-primary transition cursor-pointer disabled:opacity-50"
              title="Rescan recent Lichess games"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Scanning...' : 'Rescan'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl theme-surface theme-surface-hover border flex items-center justify-center cursor-pointer transition text-zinc-400 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-5">
          {/* 1. Skill Tier Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider theme-text-secondary px-2">
              Viewing Lens:
            </span>
            <div className="grid grid-cols-3 gap-1 flex-1">
              <button
                onClick={() => {
                  setSelectedTier('beginner');
                  setActiveCategoryFilter('all');
                }}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                  selectedTier === 'beginner'
                    ? 'bg-emerald-500 text-black shadow-xs font-extrabold'
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                Beginner (400–900)
              </button>

              <button
                onClick={() => {
                  setSelectedTier('adv_beginner');
                  setActiveCategoryFilter('all');
                }}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                  selectedTier === 'adv_beginner'
                    ? 'bg-amber-500 text-black shadow-xs font-extrabold'
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                Adv. Beginner (900–1300)
              </button>

              <button
                onClick={() => {
                  setSelectedTier('intermediate');
                  setActiveCategoryFilter('all');
                }}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-center ${
                  selectedTier === 'intermediate'
                    ? 'bg-cyan-500 text-black shadow-xs font-extrabold'
                    : 'theme-text-secondary hover:theme-text-primary'
                }`}
              >
                Intermediate+ (1300+)
              </button>
            </div>
          </div>

          {/* Loading or Error Banners */}
          {isLoading && (
            <div className="p-8 rounded-2xl theme-surface-subtle border flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
              <div className="text-sm font-bold theme-text-primary">Scanning 50 Lichess Games...</div>
              <p className="text-xs theme-text-secondary max-w-sm">
                Extracting existing Stockfish evaluations, preserving already-analyzed moves, and computing evaluation swings.
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && blunders.length === 0 && !(user?.username || (typeof window !== 'undefined' && localStorage.getItem('chessz_last_username'))) && (
            <div className="p-6 sm:p-8 rounded-3xl theme-surface-subtle border border-rose-500/30 text-center space-y-4 max-w-md mx-auto my-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                <LichessIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold theme-text-primary flex items-center justify-center gap-2">
                  <LichessIcon className="w-4 h-4 text-amber-400" />
                  <span>What&apos;s your Lichess ID?</span>
                </h3>
                <p className="text-xs theme-text-secondary mt-1 leading-relaxed">
                  Enter your username (or any player&apos;s) to scan your recent games and practice the exact blunders where you threw. No password required!
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputUsername.trim()) fetchBlunders(inputUsername.trim());
                }}
                className="flex gap-2 pt-1"
              >
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="e.g. thibault, magnuscarlsen"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl theme-surface border border-[var(--border-subtle)] theme-text-primary focus:outline-hidden focus:border-[var(--accent-primary)] font-mono"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputUsername.trim()}
                  className="px-4 py-2 text-xs font-bold font-mono rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isLoading ? 'Scanning...' : 'Scan Games'}
                </button>
              </form>
            </div>
          )}

          {!isLoading && blunders.length === 0 && !error && !!(user?.username || (typeof window !== 'undefined' && localStorage.getItem('chessz_last_username'))) && (
            unanalyzedCount > 0 ? (
              <div className="p-8 rounded-2xl theme-surface-subtle border text-center space-y-3">
                <Cpu className="w-10 h-10 text-amber-400 mx-auto" />
                <div className="text-sm font-bold theme-text-primary">
                  {unanalyzedCount} Games Waiting On Evaluation
                </div>
                <p className="text-xs theme-text-secondary max-w-md mx-auto leading-relaxed">
                  These games have no server-side evaluation from Lichess. Run Stockfish
                  here instead &mdash; it sweeps them in your browser, no request to
                  Lichess and nothing to wait for.
                </p>
                <button
                  onClick={() => runEngine()}
                  disabled={isEngineRunning}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-black text-xs font-bold transition cursor-pointer"
                >
                  <Cpu className={`w-3.5 h-3.5 ${isEngineRunning ? 'animate-spin' : ''}`} />
                  <span>
                    {isEngineRunning && engineProgress
                      ? `Evaluating game ${engineProgress.currentGame} of ${engineProgress.totalGames}...`
                      : 'Find My Blunders'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-2xl theme-surface-subtle border text-center space-y-2">
                <Award className="w-10 h-10 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold theme-text-primary">No Unfixed Mistakes Found!</div>
                <p className="text-xs theme-text-secondary max-w-sm mx-auto">
                  All analyzed games were blunder-free or you haven&apos;t played recently. Play more games on Lichess and click Rescan anytime.
                </p>
              </div>
            )
          )}

          {!isLoading && blunders.length > 0 && (
            <>
              {/* 2. Primary Leak Spotlight Hero Card */}
              <div className="p-4 sm:p-5 rounded-3xl bg-linear-to-r from-rose-500/15 via-amber-500/10 to-transparent border border-rose-500/30 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      {renderCategoryIcon(primaryLeak.icon, 'w-6 h-6')}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase font-extrabold px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 border border-rose-500/40">
                          Primary Leak Detected
                        </span>
                        <span className="text-xs font-mono font-bold text-rose-400">
                          {primaryLeak.percentage}% of your blunders
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black theme-text-primary">
                        {primaryLeak.title}
                      </h3>
                      <p className="text-xs theme-text-secondary">
                        <span className="font-semibold text-amber-400">Rule to remember: </span>
                        &ldquo;{primaryLeak.ruleBody}&rdquo;
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const firstInLeak = classifiedBlunders.find((b) => b.category === primaryLeak.id);
                      if (firstInLeak) {
                        onStartTraining(firstInLeak);
                        onClose();
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition cursor-pointer shrink-0"
                  >
                    <span>Train Primary Leak ({primaryLeak.count})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Dual-Perspective Coaching Tips Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-rose-500/20 text-xs">
                  <div className="p-2.5 rounded-xl bg-black/20 border border-[var(--border-subtle)] flex items-start gap-2">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-400">Coach Insight: </span>
                      <span className="theme-text-secondary">{primaryLeak.coachTip}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/20 border border-[var(--border-subtle)] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-400">Parent / Child Reminder: </span>
                      <span className="theme-text-secondary">{primaryLeak.parentTip}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. The 5 Category Progress Cards */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider theme-text-secondary flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>The 5 Pillars for {selectedTier.toUpperCase().replace('_', ' ')}</span>
                  </h4>
                  <span className="text-[11px] font-mono theme-text-muted">
                    Total {classifiedBlunders.length} Blunders Extracted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  {categoryBreakdown.map((cat) => {
                    const isSelected = activeCategoryFilter === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setActiveCategoryFilter(isSelected ? 'all' : cat.id)}
                        className={`p-3 rounded-2xl theme-surface border transition cursor-pointer flex flex-col justify-between hover:border-[var(--border-focus)] ${
                          isSelected ? 'ring-2 ring-[var(--accent-primary)] border-transparent' : ''
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="w-7 h-7 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center text-[var(--accent-primary)]">
                              {renderCategoryIcon(cat.icon, 'w-4 h-4')}
                            </div>
                            <span className="text-xs font-mono font-black theme-text-primary">
                              {cat.count}
                            </span>
                          </div>

                          <div>
                            <div className="text-xs font-bold theme-text-primary leading-tight line-clamp-1">
                              {cat.title}
                            </div>
                            <div className="text-[10px] theme-text-muted mt-0.5 truncate flex items-center gap-1">
                              <TermHoverCard term={cat.ruleTitle} showIcon />
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] space-y-1">
                          <div className="w-full h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-linear-to-r from-rose-500 to-amber-500 transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(cat.count > 0 ? 8 : 0, cat.percentage))}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono theme-text-muted">
                            <span>{cat.percentage}%</span>
                            <span className="text-emerald-400 font-bold hover:underline">
                              {cat.count > 0 ? 'Filter' : '0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Filterable Blunder Feed */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2 px-1">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 theme-text-secondary" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider theme-text-secondary">
                      Mistake Archive:
                    </span>
                    <button
                      onClick={() => setActiveCategoryFilter('all')}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border transition cursor-pointer ${
                        activeCategoryFilter === 'all'
                          ? 'bg-[var(--accent-primary)] text-white border-transparent'
                          : 'theme-surface-subtle theme-text-muted hover:theme-text-primary'
                      }`}
                    >
                      All ({classifiedBlunders.length})
                    </button>
                    {activeCategoryFilter !== 'all' && (
                      <span className="text-[11px] font-mono font-bold text-amber-400">
                        Filtering by {categoryBreakdown.find((c) => c.id === activeCategoryFilter)?.title} ({filteredBlunders.length})
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono theme-text-muted">
                    {masteredIds.length} of {classifiedBlunders.length} Fixed ⭐
                  </span>
                </div>

                {/* Blunder Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                  {filteredBlunders.map((puzzle) => (
                    <BlunderCardItem
                      key={puzzle.id}
                      puzzle={puzzle}
                      isMastered={masteredIds.includes(puzzle.id)}
                      onStartTraining={onStartTraining}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between shrink-0">
          <div className="text-[11px] font-mono theme-text-muted flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Grandmaster Coach & Parent Guidance Included</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold theme-surface theme-surface-hover border cursor-pointer transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
