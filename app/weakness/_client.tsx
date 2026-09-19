'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Play,
  Clock,
  Cpu,
  History,
  Check,
} from 'lucide-react';
import { useLichess } from '@/lib/useLichess';
import { LichessIcon } from '@/components/LichessModal';
import { ChessZMark } from '@/components/ChessZLogo';
import { CriticalMoment } from '@/lib/chessMetrics/types';
import {
  useWeaknessScan,
  RECENT_WINDOW_GAMES,
  BACKFILL_PAGE_GAMES,
} from '@/lib/useWeaknessScan';
import { isMobileOrLowEndDevice, MOBILE_GAME_BATCH_CAP } from '@/lib/engine/browserStockfish';
import { TransparentProgressBar } from '@/components/TransparentProgressBar';
import { MiniBoard } from '@/components/MiniBoard';

/** Positions drawn per page of the queue. Each row renders a board. */
const MOMENTS_PAGE = 30;

/**
 * Clocks parsed from PGN can carry tenths (e.g. [%clk 0:02:45.3] -> 165.3),
 * so the seconds part must be rounded before display.
 */
function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(safe / 60)}m ${safe % 60}s`;
}

/** "Saved 3m ago" / "Saved just now" -- how long since this library was last synced. */
function formatSyncAge(timestamp: number): string {
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 60) return 'Saved just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Saved ${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Saved ${hours}h ago`;
  const days = Math.round(hours / 24);
  return `Saved ${days}d ago`;
}

function WeaknessStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUser = searchParams.get('u') || '';

  const { user: connectedLichessUser } = useLichess();
  const [username, setUsername] = useState<string>(initialUser);
  const hasSyncedInputRef = useRef<boolean>(false);

  const {
    activeUsername,
    games,
    aggregate,
    moments,
    unanalyzedCount,
    isLoading,
    streamProgress,
    error,
    lastSyncedAt,
    isEngineRunning,
    isEnginePaused,
    engineProgress,
    historyComplete,
    isBackfilling,
    backfillFetched,
    scan,
    runEngine,
    pauseEngine,
    backfillHistory,
  } = useWeaknessScan({ autoUsername: initialUser || connectedLichessUser?.username });

  /** playedAt of the oldest game held, which is how far back the library goes. */
  const oldestGameAt = games.length > 0 ? games[games.length - 1].playedAt : 0;

  /**
   * The page cap for whichever request is in flight. "of up to" rather than
   * "of": an incremental sync usually returns a handful, and the true total is
   * not knowable until the stream ends.
   */
  const streamPageSize = isBackfilling ? BACKFILL_PAGE_GAMES : RECENT_WINDOW_GAMES;

  /**
   * How many positions are rendered. Each row draws a board, so this is a
   * render budget and nothing else -- the heading reports the true total.
   */
  const [visibleMoments, setVisibleMoments] = useState<number>(MOMENTS_PAGE);

  // Mirror whichever account the scan settled on into the input box
  useEffect(() => {
    if (activeUsername && !hasSyncedInputRef.current) {
      hasSyncedInputRef.current = true;
      setUsername(activeUsername);
    }
  }, [activeUsername]);

  const isMobile = isMobileOrLowEndDevice();

  /**
   * The one sentence that replaced the phase-metrics tab: where the bleeding is
   * worst, stated once, above the queue it explains.
   */
  const phaseHeadline = useMemo(() => {
    if (!aggregate) return null;
    const phases = [
      { name: 'opening', metric: aggregate.phaseMetrics.opening },
      { name: 'middlegame', metric: aggregate.phaseMetrics.middlegame },
      { name: 'endgame', metric: aggregate.phaseMetrics.endgame },
    ].filter((p) => p.metric.movesCount > 0);
    if (phases.length === 0) return null;

    const worst = phases.reduce((a, b) =>
      b.metric.avgWinPctLostPerMove > a.metric.avgWinPctLostPerMove ? b : a
    );
    const rest = phases.filter((p) => p.name !== worst.name);
    const restAvg =
      rest.length > 0
        ? rest.reduce((s, p) => s + p.metric.avgWinPctLostPerMove, 0) / rest.length
        : 0;
    const ratio = restAvg > 0 ? worst.metric.avgWinPctLostPerMove / restAvg : 0;

    return {
      phase: worst.name,
      perMove: worst.metric.avgWinPctLostPerMove,
      blunders: worst.metric.blunders,
      ratio: ratio >= 1.5 ? ratio : null,
    };
  }, [aggregate]);

  // Moments cached before FEN retention may not carry the position; recover it
  // from the parent game's move list when that happens. Shared by the row
  // thumbnails and by the "Fix it" handoff below.
  const resolveFen = (moment: CriticalMoment): string | undefined =>
    moment.fen || games.find((g) => g.gameId === moment.gameId)?.moves?.find((pm) => pm.ply === moment.ply)?.fen;

  const handleTrainInArena = (moment: CriticalMoment) => {
    const parentGame = games.find((g) => g.gameId === moment.gameId);
    const startingFen = resolveFen(moment);

    let setupMoves = moment.setupMoves || [];
    if (setupMoves.length === 0 && parentGame?.moves) {
      const moveIdx = parentGame.moves.findIndex((pm) => pm.ply === moment.ply);
      if (moveIdx !== -1) {
        const pliesBack = Math.min(moveIdx, 6);
        setupMoves = [];
        for (let step = moveIdx - pliesBack; step < moveIdx; step++) {
          const pm = parentGame.moves[step];
          if (!pm.fen) continue;
          const moveNum = Math.ceil(pm.ply / 2);
          setupMoves.push({
            ply: pm.ply,
            moveNumber: moveNum,
            turnPrefix: pm.ply % 2 === 1 ? `${moveNum}.` : `${moveNum}...`,
            san: pm.san,
            fen: pm.fen,
          });
        }
      }
    }

    try {
      sessionStorage.setItem(
        'chessz_active_blunder',
        JSON.stringify({
          id: `lichess_${moment.gameId}_p${moment.ply}`,
          gameId: moment.gameId,
          ply: moment.ply,
          moveNumber: moment.moveNumber,
          initialFen: startingFen,
          playerColor: moment.color,
          playedSan: moment.san,
          evalBefore: moment.evalBefore,
          evalAfter: moment.evalAfter,
          winPctLost: moment.winPctLost,
          judgment: moment.judgment,
          phase: moment.phase,
          deepLink: moment.deepLink,
          setupMoves,
        })
      );
    } catch (err) {
      console.warn('Failed to store blunder in sessionStorage', err);
    }

    const query = new URLSearchParams({
      mode: 'blunder',
      gameId: moment.gameId,
      ply: moment.ply.toString(),
      color: moment.color,
      blunder: moment.san,
      fen: startingFen || '',
    });
    router.push(`/?${query.toString()}`);
  };

  return (
    <main className="min-h-screen theme-canvas flex flex-col items-center p-3 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl theme-surface theme-surface-hover border flex items-center justify-center cursor-pointer transition"
            title="Back to the board"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="w-7 h-7 rounded-xl overflow-hidden shrink-0 flex items-center justify-center hover:opacity-90 transition-opacity"
            title="ChessZ"
          >
            <ChessZMark size={28} treatment="tight" className="w-full h-full" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-black theme-text-primary flex items-center gap-2">
              Your Mistakes
              {games.length > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {games.length} games
                </span>
              )}
            </h1>
            <p className="text-xs theme-text-secondary flex items-center gap-1.5">
              <span>The exact positions where you lost the most, worst first</span>
              {lastSyncedAt && (
                <>
                  <span className="theme-text-muted">&middot;</span>
                  <span
                    className="theme-text-muted font-mono text-[11px]"
                    title={new Date(lastSyncedAt).toLocaleString()}
                  >
                    {formatSyncAge(lastSyncedAt)}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (username.trim()) scan(username.trim(), true);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Lichess username..."
              className="w-32 sm:w-44 pl-8 pr-3 py-1.5 rounded-xl theme-surface border text-xs font-mono theme-text-primary focus:outline-none focus:border-[var(--accent-primary)] transition"
            />
            <LichessIcon className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white text-xs font-bold font-mono transition cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Syncing...' : 'Scan'}</span>
          </button>
        </form>
      </header>

      <div className="w-full max-w-4xl mt-5 space-y-5 flex-1">
        {/* Cold start */}
        {games.length === 0 && !isLoading && !error && (
          <div className="p-8 rounded-3xl theme-surface border text-center space-y-4 max-w-xl mx-auto my-12 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-400 flex items-center justify-center mx-auto">
              <LichessIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black theme-text-primary">Find where you drop points</h2>
              <p className="text-xs theme-text-secondary max-w-md mx-auto">
                Enter your Lichess username to scan your recent games &mdash; then load as
                far back through your history as you like. Every evaluation runs in your
                browser.
              </p>
            </div>
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
              <span className="text-[11px] font-mono theme-text-muted">Or try a sample account:</span>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {['thibault', 'DrNykterstein', 'nihalsarin2004'].map((demo) => (
                  <button
                    key={demo}
                    onClick={() => {
                      setUsername(demo);
                      scan(demo);
                    }}
                    className="px-3 py-1.5 rounded-xl theme-surface-subtle theme-surface-hover border text-xs font-mono font-bold theme-text-primary transition cursor-pointer"
                  >
                    @{demo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isLoading && streamProgress && (
          <TransparentProgressBar
            title={`Scanning @${activeUsername}`}
            phase={streamProgress.currentPhase === 'connecting' ? 'Connecting' : 'Reading games'}
            stepDetail={
              streamProgress.currentPhase === 'connecting'
                ? 'Opening the Lichess game stream...'
                : `Game ${streamProgress.gamesFetched} of up to ${streamPageSize}`
            }
            progressPercent={Math.min(
              100,
              Math.max(5, (streamProgress.gamesFetched / streamPageSize) * 100)
            )}
            currentCount={streamProgress.gamesFetched}
            totalCount={streamPageSize}
            unitLabel="games"
            allowPause={false}
            tabTitlePrefix="ChessZ Scan"
          />
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {aggregate && (
          <>
            {/* How far back the library goes. The scan pulls a recent window so
                the page is useful in seconds; everything older is reachable
                here, a page at a time, resuming from a cursor on disk. */}
            <div className="p-4 rounded-3xl theme-surface border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 flex items-center justify-center shrink-0">
                  {historyComplete ? <Check className="w-5 h-5" /> : <History className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-xs font-bold theme-text-primary">
                    {games.length} games in your library
                    {isBackfilling && backfillFetched > 0 && (
                      <span className="ml-2 text-[11px] font-mono font-normal text-emerald-600 dark:text-emerald-400">
                        +{backfillFetched} older
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] theme-text-secondary">
                    {historyComplete
                      ? 'Your full Lichess history is here. Nothing older to load.'
                      : oldestGameAt > 0
                      ? `Back to ${new Date(oldestGameAt).toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric',
                        })}. Load older games to find mistakes you have forgotten making.`
                      : 'Load older games to reach further back through your history.'}
                  </p>
                </div>
              </div>
              {!historyComplete && (
                <button
                  onClick={backfillHistory}
                  disabled={isLoading}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBackfilling
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'theme-surface-subtle hover:theme-surface border'
                  }`}
                >
                  <History className={`w-4 h-4 ${isBackfilling ? 'animate-spin' : ''}`} />
                  <span>{isBackfilling ? 'Pause' : 'Load older games'}</span>
                </button>
              )}
            </div>

            {/* Engine sweep */}
            {unanalyzedCount > 0 && (
              <div className="p-4 rounded-3xl bg-linear-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold theme-text-primary flex items-center gap-2">
                      <span>{unanalyzedCount} games not evaluated yet</span>
                      {isMobile && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200/90 dark:bg-amber-500/30 text-amber-950 dark:text-amber-100 font-extrabold border border-amber-300 dark:border-amber-500/40">
                          Mobile: {MOBILE_GAME_BATCH_CAP} per run
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] theme-text-secondary">
                      Sweep them with Stockfish here to find the mistakes inside them
                    </p>
                  </div>
                </div>
                <button
                  onClick={runEngine}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    isEngineRunning
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-black font-extrabold'
                  }`}
                >
                  <Cpu className={`w-4 h-4 ${isEngineRunning ? 'animate-spin' : ''}`} />
                  <span>{isEngineRunning ? 'Pause' : 'Find more mistakes'}</span>
                </button>
              </div>
            )}

            {(isEngineRunning || isEnginePaused) && engineProgress && (
              <TransparentProgressBar
                title="Stockfish sweep"
                phase={isEnginePaused ? 'Paused' : `Pass ${engineProgress.pass}`}
                stepDetail={
                  isEnginePaused
                    ? `Paused at game ${engineProgress.currentGame} of ${engineProgress.totalGames} - click Continue to resume without loss`
                    : `Game ${engineProgress.currentGame} of ${engineProgress.totalGames} (ply ${engineProgress.currentPly}/${engineProgress.totalPliesInGame}) - ${(engineProgress.totalNodesEvaluated / 1000).toFixed(0)}k nodes`
                }
                progressPercent={Math.min(
                  100,
                  Math.max(
                    2,
                    ((engineProgress.currentGame - 1 +
                      engineProgress.currentPly / Math.max(1, engineProgress.totalPliesInGame)) /
                      Math.max(1, engineProgress.totalGames)) *
                      100
                  )
                )}
                currentCount={engineProgress.currentGame}
                totalCount={engineProgress.totalGames}
                unitLabel="games"
                isPaused={isEnginePaused}
                onTogglePause={() => (isEngineRunning ? pauseEngine() : runEngine())}
                allowPause={true}
                tabTitlePrefix="ChessZ Engine"
              />
            )}

            {/* The one sentence that used to be a tab */}
            {phaseHeadline && (
              <p className="text-sm theme-text-primary px-1">
                You bleed most in the{' '}
                <strong className="text-rose-500 dark:text-rose-400">{phaseHeadline.phase}</strong>
                {' '}&mdash; {phaseHeadline.perMove}% win probability per move
                {phaseHeadline.ratio && (
                  <>
                    , about <strong>{phaseHeadline.ratio.toFixed(1)}&times;</strong> the rest of your game
                  </>
                )}
                {phaseHeadline.blunders > 0 && <> ({phaseHeadline.blunders} blunders there)</>}.
              </p>
            )}

            {/* The queue */}
            {moments.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between px-1">
                  <h2 className="text-sm font-bold theme-text-primary">
                    {moments.length} positions to fix
                  </h2>
                  <span className="text-[11px] font-mono theme-text-muted">worst first</span>
                </div>

                {moments.slice(0, visibleMoments).map((m, idx) => (
                  <div
                    key={`${m.gameId}_${m.ply}`}
                    className="p-3.5 rounded-2xl theme-surface border flex flex-col sm:flex-row sm:items-center gap-3 hover:border-[var(--border-focus)] transition"
                  >
                    <span className="text-lg font-black theme-text-muted font-mono w-7 shrink-0 tabular-nums">
                      {idx + 1}
                    </span>

                    {(() => {
                      const fen = resolveFen(m);
                      return fen ? (
                        <MiniBoard
                          id={`queue_${m.gameId}_${m.ply}`}
                          fen={fen}
                          orientation={m.color}
                          size={56}
                        />
                      ) : null;
                    })()}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold theme-text-primary font-mono">{m.san}</span>
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-extrabold ${
                            m.judgment === 'blunder'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {m.judgment}
                        </span>
                        <span className="text-[11px] font-mono text-rose-400">
                          &minus;{m.winPctLost.toFixed(0)}% win prob
                        </span>
                      </div>
                      <div className="text-[11px] theme-text-muted font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>
                          move {m.moveNumber} as {m.color}
                        </span>
                        <span>&middot;</span>
                        <span>{m.phase}</span>
                        {m.clockRemaining !== undefined && (
                          <>
                            <span>&middot;</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatClock(m.clockRemaining)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={m.deepLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-mono theme-text-muted hover:theme-text-primary px-2 py-1.5 rounded-lg border theme-surface-subtle transition"
                        title="Open this game on Lichess"
                      >
                        <LichessIcon className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleTrainInArena(m)}
                        className="flex items-center gap-1.5 text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Fix it</span>
                      </button>
                    </div>
                  </div>
                ))}

                {visibleMoments < moments.length && (
                  <button
                    type="button"
                    onClick={() => setVisibleMoments((n) => n + MOMENTS_PAGE)}
                    className="w-full p-3 rounded-2xl theme-surface-subtle hover:theme-surface border text-xs font-bold theme-text-secondary hover:theme-text-primary transition cursor-pointer"
                  >
                    Show {Math.min(MOMENTS_PAGE, moments.length - visibleMoments)} more
                    <span className="theme-text-muted font-mono font-normal">
                      {' '}
                      ({visibleMoments} of {moments.length})
                    </span>
                  </button>
                )}
              </div>
            ) : (
              unanalyzedCount === 0 && (
                <div className="p-8 rounded-2xl theme-surface-subtle border text-center space-y-2">
                  <p className="text-sm font-bold theme-text-primary">Nothing to fix right now</p>
                  <p className="text-xs theme-text-secondary max-w-sm mx-auto">
                    No blunders or mistakes in the games we scanned. Play some more and scan again.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function WeaknessStudioPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen theme-canvas flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono font-bold theme-text-secondary">Loading...</span>
        </div>
      }
    >
      <WeaknessStudioContent />
    </React.Suspense>
  );
}
