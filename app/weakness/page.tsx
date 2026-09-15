'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Target,
  ArrowLeft,
  RefreshCw,
  Award,
  AlertTriangle,
  Sparkles,
  Zap,
  ExternalLink,
  Play,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Flame,
  Filter,
  BarChart3,
  Cpu,
  Layers,
  Search,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useLichess } from '@/lib/useLichess';
import { streamUserGames, StreamProgress } from '@/lib/lichessStream';
import { GameDerivedStats, UserAggregateStats, CriticalMoment } from '@/lib/chessMetrics/types';
import { aggregateUserStats } from '@/lib/chessMetrics/gameParser';
import { saveGameStatsBatch, loadCachedGameStats } from '@/lib/supabaseWeakness';
import {
  analyzeUnanalyzedGames,
  isMobileOrLowEndDevice,
} from '@/lib/engine/browserStockfish';
import { EngineProgress } from '@/lib/engine/types';

function WeaknessDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUser = searchParams.get('u') || '';

  const { user: connectedLichessUser } = useLichess();

  const [username, setUsername] = useState<string>(initialUser);
  const [activeUsername, setActiveUsername] = useState<string>('');
  const [games, setGames] = useState<GameDerivedStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streamProgress, setStreamProgress] = useState<StreamProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Engine analysis state
  const [isEngineRunning, setIsEngineRunning] = useState<boolean>(false);
  const [engineProgress, setEngineProgress] = useState<EngineProgress | null>(null);
  const engineAbortControllerRef = useRef<AbortController | null>(null);
  const streamAbortControllerRef = useRef<AbortController | null>(null);
  const hasLoadedInitialRef = useRef<boolean>(false);

  // View tabs: 'all' | 'blunders' | 'phases' | 'openings'
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'openings' | 'moments'>('overview');

  // Filter openings threshold: show all or >= 4 games
  const [minOpeningGames, setMinOpeningGames] = useState<number>(1);

  // Auto-detect username on mount once
  useEffect(() => {
    if (hasLoadedInitialRef.current) return;
    const cached = initialUser || connectedLichessUser?.username || (typeof window !== 'undefined' ? localStorage.getItem('chessz_last_username') : '') || '';
    if (cached) {
      hasLoadedInitialRef.current = true;
      setUsername(cached);
      loadDataForUser(cached);
    }
    return () => {
      streamAbortControllerRef.current?.abort();
    };
  }, [connectedLichessUser, initialUser]);

  // Load cached stats first, then fetch live games
  const loadDataForUser = async (targetUser: string, forceRefresh: boolean = false) => {
    const clean = targetUser.trim();
    if (!clean) return;

    // Abort previous in-flight stream if still downloading
    if (streamAbortControllerRef.current) {
      streamAbortControllerRef.current.abort();
      streamAbortControllerRef.current = null;
    }
    const abortCtrl = new AbortController();
    streamAbortControllerRef.current = abortCtrl;

    setActiveUsername(clean);
    setError(null);

    // 1. Try local cache first for 0ms render
    if (!forceRefresh) {
      const cached = await loadCachedGameStats(clean);
      if (cached.games.length > 0) {
        setGames(cached.games);
      }
    }

    // 2. Validate username
    setIsLoading(true);
    try {
      const valRes = await fetch(`/api/lichess/user/validate?username=${encodeURIComponent(clean)}`, {
        signal: abortCtrl.signal,
      });
      const valData = await valRes.json();
      if (!valRes.ok || !valData.valid) {
        throw new Error(valData.error || 'User not found on Lichess');
      }

      // 3. Stream games incrementally
      const streamed = await streamUserGames(clean, {
        max: 50,
        signal: abortCtrl.signal,
        onProgress: (p) => setStreamProgress(p),
      });

      if (streamed.length === 0) {
        setError(`No recent standard games found for @${clean}.`);
      } else {
        setGames(streamed);
        // Checkpoint to localStorage & Supabase
        await saveGameStatsBatch(clean, streamed);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Error loading games');
      }
    } finally {
      if (streamAbortControllerRef.current === abortCtrl) {
        setIsLoading(false);
        setStreamProgress(null);
      }
    }
  };

  // Run in-browser Stockfish on unanalyzed games
  const handleRunBrowserEngine = async () => {
    if (isEngineRunning) {
      engineAbortControllerRef.current?.abort();
      setIsEngineRunning(false);
      return;
    }

    setIsEngineRunning(true);
    engineAbortControllerRef.current = new AbortController();

    try {
      const enriched = await analyzeUnanalyzedGames(games, activeUsername, {
        signal: engineAbortControllerRef.current.signal,
        onProgress: (p) => setEngineProgress(p),
      });

      setGames(enriched);
      await saveGameStatsBatch(activeUsername, enriched);
    } catch (err: any) {
      console.error('Engine error:', err);
    } finally {
      setIsEngineRunning(false);
      setEngineProgress(null);
    }
  };

  // Aggregated stats computed purely
  const aggregate: UserAggregateStats | null = useMemo(() => {
    if (games.length === 0 || !activeUsername) return null;
    return aggregateUserStats(games, activeUsername);
  }, [games, activeUsername]);

  const unanalyzedCount = useMemo(() => {
    return games.filter((g) => g.evalSource === 'none').length;
  }, [games]);

  const isMobile = isMobileOrLowEndDevice();

  return (
    <main className="min-h-screen theme-canvas flex flex-col items-center p-3 sm:p-6 lg:p-8">
      {/* Top Navbar */}
      <header className="w-full max-w-6xl flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl theme-surface theme-surface-hover border flex items-center justify-center cursor-pointer transition text-zinc-400 hover:text-white"
            title="Return to Training Arena"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black theme-text-primary flex items-center gap-2">
                Weakness Studio
                {aggregate && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {aggregate.totalGames} Games
                  </span>
                )}
              </h1>
              <p className="text-xs theme-text-secondary">
                Recurring tactical leaks, phase loss & critical moment diagnostic
              </p>
            </div>
          </div>

          {/* Harmonized Global Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-3 pl-3 border-l border-[var(--border-subtle)] text-xs font-mono">
            <Link
              href="/"
              className="px-2.5 py-1 rounded-lg font-semibold theme-text-secondary hover:theme-text-primary hover:bg-[var(--surface-muted)] transition"
            >
              Train
            </Link>
            <Link
              href="/diagnose"
              className="px-2.5 py-1 rounded-lg font-semibold theme-text-secondary hover:theme-text-primary hover:bg-[var(--surface-muted)] transition flex items-center gap-1"
            >
              <span>Skill Test</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-bold">5m</span>
            </Link>
            <span className="px-2.5 py-1 rounded-lg font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
              <span>Weakness Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            </span>
          </nav>
        </div>

        {/* Username Search Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (username.trim()) loadDataForUser(username.trim(), true);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Lichess username..."
              className="w-36 sm:w-48 pl-8 pr-3 py-1.5 rounded-xl theme-surface border text-xs font-mono theme-text-primary focus:outline-none focus:border-[var(--accent-primary)] transition"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white text-xs font-bold font-mono transition cursor-pointer disabled:opacity-50 shadow-xs shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Syncing...' : 'Scan'}</span>
          </button>
        </form>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-6xl mt-5 space-y-6 flex-1">
        {/* Quick Demo Accounts Banner if no games */}
        {games.length === 0 && !isLoading && !error && (
          <div className="p-8 rounded-3xl theme-surface border text-center space-y-4 max-w-xl mx-auto my-12 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Target className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black theme-text-primary">Discover Where You Drop Points</h2>
              <p className="text-xs theme-text-secondary max-w-md mx-auto">
                Enter your Lichess username above to analyze your last 50 games. All evaluation math runs 100% in your browser.
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
              <span className="text-[11px] font-mono theme-text-muted">Or try sample grandmaster accounts:</span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {['thibault', 'DrNykterstein', 'nihalsarin2004'].map((userDemo) => (
                  <button
                    key={userDemo}
                    onClick={() => {
                      setUsername(userDemo);
                      loadDataForUser(userDemo);
                    }}
                    className="px-3 py-1.5 rounded-xl theme-surface-subtle theme-surface-hover border text-xs font-mono font-bold theme-text-primary transition cursor-pointer"
                  >
                    @{userDemo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading Progress Card */}
        {isLoading && streamProgress && (
          <div className="p-6 rounded-3xl theme-surface border space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                <span className="text-xs font-bold theme-text-primary font-mono">
                  Streaming games for @{activeUsername}...
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {streamProgress.gamesFetched} games fetched ({streamProgress.analyzedCount} with Lichess evals)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (streamProgress.gamesFetched / 50) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Aggregate Dashboard Content */}
        {aggregate && (
          <>
            {/* Engine Analysis Banner if unanalyzed games exist */}
            {unanalyzedCount > 0 && (
              <div className="p-4 rounded-3xl bg-linear-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold theme-text-primary flex items-center gap-2">
                      <span>{unanalyzedCount} Games Missing Stockfish Evaluation</span>
                      {isMobile && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Mobile: capped at 20
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] theme-text-secondary">
                      Run deterministic in-browser Stockfish WASM (80k nodes sweep → 300k deep refinement)
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRunBrowserEngine}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 shadow-sm ${
                    isEngineRunning
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-black font-extrabold'
                  }`}
                >
                  <Cpu className={`w-4 h-4 ${isEngineRunning ? 'animate-spin' : ''}`} />
                  <span>{isEngineRunning ? 'Pause Engine' : 'Run In-Browser Stockfish'}</span>
                </button>
              </div>
            )}

            {/* Engine Progress Active Bar */}
            {isEngineRunning && engineProgress && (
              <div className="p-4 rounded-2xl theme-surface border space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold">
                    Pass {engineProgress.pass}: Evaluating Game {engineProgress.currentGame}/{engineProgress.totalGames} (Ply {engineProgress.currentPly}/{engineProgress.totalPliesInGame})
                  </span>
                  <span className="theme-text-muted">
                    {(engineProgress.totalNodesEvaluated / 1000).toFixed(0)}k nodes
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-200"
                    style={{
                      width: `${Math.min(100, (engineProgress.currentPly / Math.max(1, engineProgress.totalPliesInGame)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Section Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview & Bleed', icon: BarChart3 },
                { id: 'phases', label: 'Phase Diagnostics', icon: Layers },
                { id: 'openings', label: 'Opening Repertoire', icon: Award },
                { id: 'moments', label: `Critical Moments (${aggregate.criticalMoments.length})`, icon: Target },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0 ${
                      active
                        ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                        : 'theme-surface-subtle theme-text-muted hover:theme-text-primary'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 1. Headline Win% Lost Per Phase Card */}
                <div className="p-5 sm:p-6 rounded-3xl theme-surface border shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-black theme-text-primary flex items-center gap-2">
                        <span>Win% Lost Per Phase</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30">
                          Headline Bleed Metric
                        </span>
                      </h3>
                      <p className="text-xs theme-text-secondary">
                        The exact average win percentage lost per move where you lose the advantage
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        name: 'Opening (Plies 1-16)',
                        metric: aggregate.phaseMetrics.opening,
                        color: 'from-cyan-500/20 to-blue-500/10',
                        border: 'border-cyan-500/30',
                        accent: 'text-cyan-400',
                      },
                      {
                        name: 'Middlegame',
                        metric: aggregate.phaseMetrics.middlegame,
                        color: 'from-amber-500/20 to-orange-500/10',
                        border: 'border-amber-500/30',
                        accent: 'text-amber-400',
                      },
                      {
                        name: 'Endgame (≤ 12 pieces)',
                        metric: aggregate.phaseMetrics.endgame,
                        color: 'from-rose-500/20 to-pink-500/10',
                        border: 'border-rose-500/30',
                        accent: 'text-rose-400',
                      },
                    ].map((phaseItem) => (
                      <div
                        key={phaseItem.name}
                        className={`p-4 rounded-2xl bg-linear-to-br ${phaseItem.color} border ${phaseItem.border} space-y-3 flex flex-col justify-between`}
                      >
                        <div>
                          <span className="text-[11px] font-mono font-bold uppercase theme-text-muted">
                            {phaseItem.name}
                          </span>
                          <div className="text-2xl font-black theme-text-primary mt-1 flex items-baseline gap-1">
                            <span className={phaseItem.accent}>
                              {phaseItem.metric.avgWinPctLostPerMove}%
                            </span>
                            <span className="text-[11px] font-mono font-normal theme-text-muted">/move</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[var(--border-subtle)] grid grid-cols-3 text-center text-[10px] font-mono">
                          <div>
                            <span className="theme-text-muted block">Inacc</span>
                            <span className="font-bold text-amber-400">{phaseItem.metric.inaccuracies}</span>
                          </div>
                          <div>
                            <span className="theme-text-muted block">Mistake</span>
                            <span className="font-bold text-orange-400">{phaseItem.metric.mistakes}</span>
                          </div>
                          <div>
                            <span className="theme-text-muted block">Blunder</span>
                            <span className="font-bold text-rose-400">{phaseItem.metric.blunders}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Tactical Alertness & Composure Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl theme-surface border space-y-1">
                    <span className="text-[10px] font-mono uppercase theme-text-muted font-bold block">
                      Conversion Failures
                    </span>
                    <div className="text-xl font-black text-rose-400">
                      {aggregate.conversionFailuresCount} Games
                    </div>
                    <p className="text-[11px] theme-text-secondary">
                      Reached ≥ +300 cp advantage but failed to win
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl theme-surface border space-y-1">
                    <span className="text-[10px] font-mono uppercase theme-text-muted font-bold block">
                      Rescues & Swindles
                    </span>
                    <div className="text-xl font-black text-emerald-400">
                      {aggregate.rescuesCount} Games
                    </div>
                    <p className="text-[11px] theme-text-secondary">
                      Fell to ≤ -300 cp but salvaged a draw or win
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl theme-surface border space-y-1">
                    <span className="text-[10px] font-mono uppercase theme-text-muted font-bold block">
                      Missed Punishments
                    </span>
                    <div className="text-xl font-black text-amber-400">
                      {aggregate.missedPunishmentsTotal}
                    </div>
                    <p className="text-[11px] theme-text-secondary">
                      Opponent lost ≥20% win% and wasn't punished
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl theme-surface border space-y-1">
                    <span className="text-[10px] font-mono uppercase theme-text-muted font-bold block">
                      Time Pressure Blunders
                    </span>
                    <div className="text-xl font-black text-pink-400">
                      {aggregate.timePressureBlundersCount}
                    </div>
                    <p className="text-[11px] theme-text-secondary">
                      Blunders played &lt; half avg time or under 30s
                    </p>
                  </div>
                </div>

                {/* 3. Record by Color & Speed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Color Split */}
                  <div className="p-4 rounded-2xl theme-surface border space-y-3">
                    <span className="text-xs font-mono uppercase font-bold theme-text-muted block">
                      Performance by Color
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl theme-surface-subtle border space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold theme-text-primary">
                          <span>⚪ White</span>
                          <span className="font-mono text-emerald-400">{aggregate.colorRecord.white.score}%</span>
                        </div>
                        <div className="text-[11px] font-mono theme-text-muted">
                          {aggregate.colorRecord.white.wins}W / {aggregate.colorRecord.white.draws}D / {aggregate.colorRecord.white.losses}L ({aggregate.colorRecord.white.games} games)
                        </div>
                      </div>

                      <div className="p-3 rounded-xl theme-surface-subtle border space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold theme-text-primary">
                          <span>⚫ Black</span>
                          <span className="font-mono text-emerald-400">{aggregate.colorRecord.black.score}%</span>
                        </div>
                        <div className="text-[11px] font-mono theme-text-muted">
                          {aggregate.colorRecord.black.wins}W / {aggregate.colorRecord.black.draws}D / {aggregate.colorRecord.black.losses}L ({aggregate.colorRecord.black.games} games)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Judgments per 100 Moves */}
                  <div className="p-4 rounded-2xl theme-surface border space-y-3">
                    <span className="text-xs font-mono uppercase font-bold theme-text-muted block">
                      Mistakes per 100 Moves
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <span className="text-[10px] font-mono uppercase theme-text-muted block">Inaccuracies</span>
                        <span className="text-lg font-black text-amber-400">
                          {aggregate.judgmentCountsPer100.inaccuracies}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <span className="text-[10px] font-mono uppercase theme-text-muted block">Mistakes</span>
                        <span className="text-lg font-black text-orange-400">
                          {aggregate.judgmentCountsPer100.mistakes}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                        <span className="text-[10px] font-mono uppercase theme-text-muted block">Blunders</span>
                        <span className="text-lg font-black text-rose-400">
                          {aggregate.judgmentCountsPer100.blunders}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PHASES */}
            {activeTab === 'phases' && (
              <div className="p-5 rounded-3xl theme-surface border space-y-5">
                <div className="space-y-1">
                  <h3 className="text-base font-bold theme-text-primary">Phase Loss Detailed Breakdown</h3>
                  <p className="text-xs theme-text-secondary">
                    Comparative tactical errors and win percentage decay across Opening, Middlegame, and Endgame
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Opening Phase', desc: 'Book theory and initial piece mobilization (plies 1-16)', data: aggregate.phaseMetrics.opening, color: 'bg-cyan-500' },
                    { title: 'Middlegame Phase', desc: 'Tactical clash, king safety and piece coordination', data: aggregate.phaseMetrics.middlegame, color: 'bg-amber-500' },
                    { title: 'Endgame Phase', desc: 'Simplified positions (≤ 12 pieces), king activity and pawn promotion', data: aggregate.phaseMetrics.endgame, color: 'bg-rose-500' },
                  ].map((p) => (
                    <div key={p.title} className="p-4 rounded-2xl theme-surface-subtle border space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold theme-text-primary">{p.title}</div>
                          <div className="text-[11px] theme-text-secondary">{p.desc}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black theme-text-primary">
                            {p.data.avgWinPctLostPerMove}% <span className="text-[10px] font-normal theme-text-muted">lost/ply</span>
                          </div>
                          <div className="text-[10px] font-mono theme-text-muted">
                            {p.data.movesCount} total plies evaluated
                          </div>
                        </div>
                      </div>

                      <div className="w-full h-2 rounded-full bg-[var(--surface-muted)] overflow-hidden">
                        <div
                          className={`h-full ${p.color} transition-all duration-500`}
                          style={{ width: `${Math.min(100, p.data.avgWinPctLostPerMove * 10)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono theme-text-muted pt-1">
                        <span>Inaccuracies: <strong className="text-amber-400">{p.data.inaccuracies}</strong></span>
                        <span>Mistakes: <strong className="text-orange-400">{p.data.mistakes}</strong></span>
                        <span>Blunders: <strong className="text-rose-400">{p.data.blunders}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: OPENING REPERTOIRE */}
            {activeTab === 'openings' && (
              <div className="p-5 rounded-3xl theme-surface border space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-base font-bold theme-text-primary">Opening Repertoire & Wilson Intervals</h3>
                    <p className="text-xs theme-text-secondary">
                      Statistically sound performance grouped by ECO family with 95% confidence bounds
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="theme-text-muted">Min games:</span>
                    <button
                      onClick={() => setMinOpeningGames(minOpeningGames === 1 ? 4 : 1)}
                      className="px-2.5 py-1 rounded-lg border theme-surface-subtle theme-text-primary transition cursor-pointer"
                    >
                      {minOpeningGames === 1 ? 'Showing All (≥1)' : 'Strict (≥4 only)'}
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border-subtle)] text-[10px] font-mono uppercase theme-text-muted">
                        <th className="py-2.5 px-3">ECO</th>
                        <th className="py-2.5 px-3">Opening Name</th>
                        <th className="py-2.5 px-3">Color</th>
                        <th className="py-2.5 px-3 text-center">Record</th>
                        <th className="py-2.5 px-3 text-center">Score %</th>
                        <th className="py-2.5 px-3 text-center">Wilson 95% Interval</th>
                        <th className="py-2.5 px-3 text-right">Avg Loss (Plies 1-16)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
                      {aggregate.openings
                        .filter((op) => op.totalGames >= minOpeningGames)
                        .map((op) => (
                          <tr key={`${op.color}_${op.eco}_${op.name}`} className="hover:bg-black/5 transition">
                            <td className="py-2.5 px-3 font-bold text-[var(--accent-primary)]">{op.eco}</td>
                            <td className="py-2.5 px-3 font-sans font-medium theme-text-primary max-w-xs truncate">
                              {op.name}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold border">
                                {op.color === 'white' ? '⚪ White' : '⚫ Black'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center theme-text-muted">
                              {op.wins}W / {op.draws}D / {op.losses}L
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-emerald-400">
                              {op.score}%
                            </td>
                            <td className="py-2.5 px-3 text-center theme-text-secondary">
                              [{op.wilsonLower}% – {op.wilsonUpper}%]
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-rose-400">
                              -{op.avgWinPctLostFirst16}%
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: CRITICAL MOMENTS */}
            {activeTab === 'moments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold theme-text-primary">
                      Top Critical Moments ({aggregate.criticalMoments.length})
                    </h3>
                    <p className="text-xs theme-text-secondary">
                      Your sharpest evaluation drops capped at 10 worst moves per game with deep links
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aggregate.criticalMoments.slice(0, 30).map((m) => (
                    <div
                      key={`${m.gameId}_${m.ply}`}
                      className="p-4 rounded-2xl theme-surface border flex flex-col justify-between space-y-3 hover:border-[var(--border-focus)] transition shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold theme-text-primary">
                              Move {m.moveNumber} ({m.color})
                            </span>
                            <span
                              className={`text-[9px] font-mono uppercase px-2 py-0.2 rounded font-extrabold ${
                                m.judgment === 'blunder'
                                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {m.judgment}
                            </span>
                          </div>
                          <div className="text-xs font-mono text-rose-400 mt-1">
                            Played: <strong>{m.san}</strong> (-{m.winPctLost}% win prob)
                          </div>
                        </div>

                        {m.clockRemaining !== undefined && (
                          <div className="flex items-center gap-1 text-[10px] font-mono theme-text-muted">
                            <Clock className="w-3 h-3" />
                            <span>{Math.floor(m.clockRemaining / 60)}m {m.clockRemaining % 60}s</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase theme-text-muted">
                          {m.phase} phase
                        </span>

                        <div className="flex items-center gap-2">
                          <a
                            href={m.deepLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white px-2 py-1 rounded-lg border theme-surface-subtle transition cursor-pointer"
                          >
                            <span>Lichess</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <Link
                            href="/"
                            className="flex items-center gap-1 text-[11px] font-mono font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg transition cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>Train in Arena</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function WeaknessDashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen theme-canvas flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono font-bold theme-text-secondary">
            Loading Weakness Studio...
          </span>
        </div>
      }
    >
      <WeaknessDashboardContent />
    </React.Suspense>
  );
}
