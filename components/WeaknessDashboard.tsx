'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ChessPuzzle } from '@/lib/puzzles';
import {
  SkillTier,
  MistakeCategoryInfo,
  getCategoryDefinitionsForTier,
  classifyMistake,
} from '@/lib/mistakeClassifier';
import { LichessUser } from '@/lib/lichess';

interface WeaknessDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: LichessUser | null;
  onStartTraining: (puzzle: ChessPuzzle) => void;
}

interface BlunderCardItemProps {
  puzzle: any;
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
  const setupMoves =
    puzzle.setupMoves && puzzle.setupMoves.length > 0
      ? puzzle.setupMoves
      : [
          {
            ply: 0,
            moveNumber: puzzle.moveNumber,
            turnPrefix: '',
            san: puzzle.playedSan,
            fen: puzzle.initialFen,
          },
        ];

  // Step index within setup moves (default to the last move, the blunder)
  const [stepIdx, setStepIdx] = useState<number>(setupMoves.length - 1);
  const phaseName =
    puzzle.moveNumber <= 10
      ? 'Opening'
      : puzzle.moveNumber <= 30
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
              Move {puzzle.moveNumber} • {phaseName}
            </span>
          </div>
          <div className="text-[11px] font-mono text-rose-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>
              Played: <strong>{puzzle.playedSan}</strong>
            </span>
            {puzzle.evalSwingPawns && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1 rounded">
                -~{puzzle.evalSwingPawns} pts
              </span>
            )}
            <span className="text-emerald-400">
              Best: <strong>{puzzle.bestSan}</strong>
            </span>
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
              {setupMoves.map((sm: any, idx: number) => {
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

      <div className="text-[11px] theme-text-secondary line-clamp-1 italic">
        "{puzzle.ruleTitle}"
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
  const [blunders, setBlunders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{
    totalGamesScanned: number;
    analyzedGamesCount: number;
    unanalyzedGamesCount: number;
  } | null>(null);

  // Active filter tab for mistake feed: 'all' or categoryId
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Mastered mistake IDs from localStorage
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  // Load mastered mistakes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chessz_mastered_blunders');
      if (saved) {
        setMasteredIds(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Auto-detect tier from Lichess rating on initial user connection
  useEffect(() => {
    if (user?.perfs) {
      const rating = user.perfs.rapid?.rating || user.perfs.blitz?.rating || 1000;
      if (rating < 900) {
        setSelectedTier('beginner');
      } else if (rating < 1300) {
        setSelectedTier('adv_beginner');
      } else {
        setSelectedTier('intermediate');
      }
    }
  }, [user]);

  // Custom username input state
  const [inputUsername, setInputUsername] = useState<string>('');

  // Fetch 50 games and blunders
  const fetchBlunders = async (targetUser?: string) => {
    const username = (targetUser || inputUsername || user?.username || (typeof window !== 'undefined' ? localStorage.getItem('chessz_last_username') : '') || '').trim();
    if (!username) {
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('chessz_last_username', username);
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/lichess/blunders?username=${encodeURIComponent(username)}&max=50&tier=${selectedTier}`
      );
      if (!res.ok) {
        throw new Error(`Failed to load games: ${res.statusText}`);
      }
      const data = await res.json();
      if (data.blunders) {
        setBlunders(data.blunders);
        setSummaryData({
          totalGamesScanned: data.summary?.totalGamesScanned || 0,
          analyzedGamesCount: data.summary?.analyzedGamesCount || 0,
          unanalyzedGamesCount: data.summary?.unanalyzedGamesCount || 0,
        });
      } else {
        setBlunders([]);
      }
    } catch (e: any) {
      setError(e.message || 'Error extracting Lichess blunders');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blunders when modal opens if empty
  useEffect(() => {
    if (isOpen && blunders.length === 0 && !isLoading) {
      const username = user?.username || (typeof window !== 'undefined' ? localStorage.getItem('chessz_last_username') : '') || '';
      if (username) {
        fetchBlunders(username);
      }
    }
  }, [isOpen]);

  // Dynamically classify blunders into the 5 categories of the active tier (0ms latency!)
  const { categoryBreakdown, classifiedBlunders, primaryLeak } = useMemo(() => {
    const tierDefs = getCategoryDefinitionsForTier(selectedTier);
    const counts: Record<string, number> = {};
    tierDefs.forEach((def) => {
      counts[def.id] = 0;
    });

    const enriched = blunders.map((b) => {
      const c = classifyMistake(
        b.initialFen,
        b.playedSan,
        b.solutionMoves[0]?.from + b.solutionMoves[0]?.to,
        b.moveNumber * 2,
        b.evalSwingPawns,
        selectedTier
      );
      if (counts[c.categoryId] !== undefined) {
        counts[c.categoryId]++;
      }
      return {
        ...b,
        category: c.categoryId,
        categoryTitle: c.categoryTitle,
        categoryBadge: c.badge,
        categoryIcon: c.icon,
        ruleTitle: `${c.ruleTitle}: ${b.playedSan}`,
        ruleBody: c.ruleBody,
        coachTip: c.coachTip,
        parentTip: c.parentTip,
      };
    });

    const total = enriched.length;
    let maxCount = -1;
    let maxId = tierDefs[0]?.id || 'beg_hanging_piece';

    const breakdown = tierDefs.map((def) => {
      const cnt = counts[def.id] || 0;
      if (cnt > maxCount) {
        maxCount = cnt;
        maxId = def.id;
      }
      return {
        ...def,
        count: cnt,
        percentage: total > 0 ? Math.round((cnt / total) * 100) : 0,
      };
    });

    const leakDef = tierDefs.find((d) => d.id === maxId) || tierDefs[0];
    const leakInfo = {
      ...leakDef,
      count: Math.max(0, maxCount),
      percentage: total > 0 ? Math.round((Math.max(0, maxCount) / total) * 100) : 0,
    };

    return {
      categoryBreakdown: breakdown,
      classifiedBlunders: enriched,
      primaryLeak: leakInfo,
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
                  {summaryData && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {summaryData.totalGamesScanned} Games Scanned
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
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold theme-text-primary">What's your Lichess ID?</h3>
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
            <div className="p-8 rounded-2xl theme-surface-subtle border text-center space-y-2">
              <Award className="w-10 h-10 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold theme-text-primary">No Unfixed Mistakes Found!</div>
              <p className="text-xs theme-text-secondary max-w-sm mx-auto">
                Play some games on Lichess or request computer analysis on your recent games, then click Rescan.
              </p>
            </div>
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
                        "{primaryLeak.ruleBody}"
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
                            <div className="text-[10px] theme-text-muted mt-0.5 truncate">
                              {cat.ruleTitle}
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
