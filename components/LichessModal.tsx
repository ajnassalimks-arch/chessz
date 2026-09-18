'use client';

import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  RefreshCw,
  LogOut,
  Zap,
  Timer,
  Flame,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  Target,
} from 'lucide-react';
import { LichessUser } from '@/lib/lichess';
import { ChessPuzzle } from '@/lib/puzzles';
import { TransparentProgressBar } from '@/components/TransparentProgressBar';

// Iconic Lichess Knight SVG Emblem (Official Lichess vector)
export function LichessIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <title>Lichess</title>
      <path d="M10.457 6.161a.237.237 0 0 0-.296.165c-.8 2.785 2.819 5.579 5.214 7.428.653.504 1.216.939 1.591 1.292 1.745 1.642 2.564 2.851 2.733 3.178a.24.24 0 0 0 .275.122c.047-.013 4.726-1.3 3.934-4.574a.257.257 0 0 0-.023-.06L18.204 3.407 18.93.295a.24.24 0 0 0-.262-.293c-1.7.201-3.115.435-4.5 1.425-4.844-.323-8.718.9-11.213 3.539C.334 7.737-.246 11.515.085 14.128c.763 5.655 5.191 8.631 9.081 9.532.993.229 1.974.34 2.923.34 3.344 0 6.297-1.381 7.946-3.85a.24.24 0 0 0-.372-.3c-3.411 3.527-9.002 4.134-13.296 1.444-4.485-2.81-6.202-8.41-3.91-12.749C4.741 4.221 8.801 2.362 13.888 3.31c.056.01.115 0 .165-.029l.335-.197c.926-.546 1.961-1.157 2.873-1.279l-.694 1.993a.243.243 0 0 0 .02.202l6.082 10.192c-.193 2.028-1.706 2.506-2.226 2.611-.287-.645-.814-1.364-2.306-2.803-.422-.407-1.21-.941-2.124-1.56-2.364-1.601-5.937-4.02-5.391-5.984a.239.239 0 0 0-.165-.295z" />
    </svg>
  );
}

interface LichessModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: LichessUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  onConnectUsername: (username: string) => Promise<boolean>;
  diagnosedElo?: number | null;
  onStartBlunderTraining?: (puzzle: ChessPuzzle) => void;
  onOpenWeaknessDashboard?: () => void;
}

export function LichessModal({
  isOpen,
  onClose,
  user,
  isAuthenticated,
  loading,
  onLogin,
  onLogout,
  onRefresh,
  onConnectUsername,
  diagnosedElo,
  onStartBlunderTraining,
  onOpenWeaknessDashboard,
}: LichessModalProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lichess Game Blunders State
  const [blunders, setBlunders] = useState<ChessPuzzle[]>([]);
  const [isLoadingBlunders, setIsLoadingBlunders] = useState(false);
  const [blunderError, setBlunderError] = useState<string | null>(null);
  const [scanStep, setScanStep] = useState<{
    percent: number;
    phase: string;
    detail: string;
  }>({
    percent: 0,
    phase: 'Connecting',
    detail: 'Connecting to Lichess game database...',
  });

  const fetchMyBlunders = async () => {
    if (!user) return;
    setIsLoadingBlunders(true);
    setBlunderError(null);
    setScanStep({
      percent: 15,
      phase: 'Connecting',
      detail: `Contacting Lichess game archive for @${user.username}...`,
    });

    const stepTimer = setInterval(() => {
      setScanStep((prev) => {
        if (prev.percent < 45) {
          return {
            percent: prev.percent + 10,
            phase: 'Fetching Games',
            detail: 'Downloading recent games with Stockfish computer analysis...',
          };
        } else if (prev.percent < 75) {
          return {
            percent: prev.percent + 10,
            phase: 'Evaluating Blunders',
            detail: 'Scanning moves for decisive centipawn swings and errors...',
          };
        } else if (prev.percent < 90) {
          return {
            percent: prev.percent + 4,
            phase: 'Creating Puzzles',
            detail: 'Synthesizing interactive challenge positions...',
          };
        }
        return prev;
      });
    }, 400);

    try {
      const res = await fetch(`/api/lichess/blunders?username=${encodeURIComponent(user.username)}`);
      const data = await res.json();
      clearInterval(stepTimer);
      setScanStep({
        percent: 100,
        phase: 'Complete',
        detail: 'Finalizing personal blunder training playlist...',
      });

      if (data.blunders && data.blunders.length > 0) {
        setBlunders(data.blunders);
      } else {
        setBlunderError(
          'No evaluated mistakes found in your last 10 games. Request computer analysis on your recent Lichess games, then click scan again!'
        );
      }
    } catch (e: unknown) {
      clearInterval(stepTimer);
      const msg = e instanceof Error ? e.message : '';
      setBlunderError(msg || 'Failed to extract blunders from Lichess.');
    } finally {
      clearInterval(stepTimer);
      setIsLoadingBlunders(false);
    }
  };

  if (!isOpen) return null;

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setIsSubmitting(true);
    setUsernameError(null);
    const success = await onConnectUsername(usernameInput.trim());
    setIsSubmitting(false);
    if (!success) {
      setUsernameError('Lichess user not found. Please verify spelling.');
    }
  };

  const rapid = user?.perfs?.rapid;
  const blitz = user?.perfs?.blitz;
  const bullet = user?.perfs?.bullet;
  const puzzle = user?.perfs?.puzzle;

  // Calibration comparison if user has diagnostic rating
  const activeRating = rapid?.rating || blitz?.rating;
  const ratingDelta = diagnosedElo && activeRating ? diagnosedElo - activeRating : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lichess-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl theme-surface border shadow-2xl p-5 sm:p-6 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-800 dark:text-amber-400">
              <LichessIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 id="lichess-modal-title" className="text-base font-bold theme-text-primary flex items-center gap-2">
                Lichess Integration
                {isAuthenticated && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified OAuth
                  </span>
                )}
              </h3>
              <p className="text-xs theme-text-secondary">
                Sync live ratings, puzzle stats, and benchmark accuracy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl theme-surface theme-surface-hover border flex items-center justify-center cursor-pointer transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4">
          {user ? (
            /* Connected Profile State */
            <div className="space-y-4">
              {/* User Identity Card */}
              <div className="p-4 rounded-xl theme-surface-hover border border-[var(--border-subtle)] flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {user.title && (
                      <span className="px-1.5 py-0.5 text-[11px] font-bold font-mono rounded bg-amber-500 text-black">
                        {user.title}
                      </span>
                    )}
                    <span className="font-extrabold text-lg theme-text-primary tracking-tight">
                      {user.username}
                    </span>
                    {isAuthenticated ? (
                      <span title="Verified OAuth Account">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-muted)] theme-text-secondary">
                        Public Profile
                      </span>
                    )}
                  </div>
                  {user.profile?.bio && (
                    <p className="text-xs theme-text-secondary line-clamp-2 italic">
                      &ldquo;{user.profile.bio}&rdquo;
                    </p>
                  )}
                  {user.profile?.realName && (
                    <p className="text-xs theme-text-secondary">
                      {user.profile.realName} {user.profile.country ? `• ${user.profile.country}` : ''}
                    </p>
                  )}
                </div>

                <a
                  href={`https://lichess.org/@/${user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-mono text-[var(--accent-primary)] hover:underline cursor-pointer shrink-0"
                >
                  <span>lichess.org</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Rating Showcase Grid */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider font-mono theme-text-secondary mb-2">
                  Official Live Ratings
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Rapid */}
                  <div className="p-3 rounded-xl theme-surface border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 mb-1">
                      <Timer className="w-3.5 h-3.5" />
                      <span>Rapid</span>
                    </div>
                    <span className="text-xl font-mono font-extrabold theme-text-primary">
                      {rapid?.rating || '—'}
                    </span>
                    <span className="text-[10px] theme-text-secondary font-mono mt-0.5">
                      {rapid?.games ? `${rapid.games.toLocaleString()} games` : 'Unrated'}
                    </span>
                  </div>

                  {/* Blitz */}
                  <div className="p-3 rounded-xl theme-surface border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Blitz</span>
                    </div>
                    <span className="text-xl font-mono font-extrabold theme-text-primary">
                      {blitz?.rating || '—'}
                    </span>
                    <span className="text-[10px] theme-text-secondary font-mono mt-0.5">
                      {blitz?.games ? `${blitz.games.toLocaleString()} games` : 'Unrated'}
                    </span>
                  </div>

                  {/* Bullet */}
                  <div className="p-3 rounded-xl theme-surface border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-xs font-medium text-purple-400 mb-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Bullet</span>
                    </div>
                    <span className="text-xl font-mono font-extrabold theme-text-primary">
                      {bullet?.rating || '—'}
                    </span>
                    <span className="text-[10px] theme-text-secondary font-mono mt-0.5">
                      {bullet?.games ? `${bullet.games.toLocaleString()} games` : 'Unrated'}
                    </span>
                  </div>

                  {/* Puzzles */}
                  <div className="p-3 rounded-xl theme-surface border border-[var(--border-subtle)] flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1 text-xs font-medium text-blue-400 mb-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Puzzles</span>
                    </div>
                    <span className="text-xl font-mono font-extrabold theme-text-primary">
                      {puzzle?.rating || '—'}
                    </span>
                    <span className="text-[10px] theme-text-secondary font-mono mt-0.5">
                      {puzzle?.games ? `${puzzle.games.toLocaleString()} solved` : 'Unrated'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benchmark Calibration Card (If user has ChessZ Diagnosis Elo) */}
              {diagnosedElo && activeRating && (
                <div className="p-4 rounded-xl bg-linear-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-mono text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      Cross-Platform Calibration Benchmark
                    </span>
                    <span className="text-xs font-mono font-semibold theme-text-secondary">
                      {Math.abs(ratingDelta!) <= 50 ? '🎯 Exceptional Alignment' : '📊 Calibrated Range'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                    <div className="p-2 rounded-lg theme-surface border border-[var(--border-subtle)]">
                      <div className="text-[10px] font-mono theme-text-secondary">ChessZ Diagnosis</div>
                      <div className="text-base font-bold font-mono theme-text-primary">~{diagnosedElo}</div>
                    </div>
                    <div className="p-2 rounded-lg theme-surface border border-[var(--border-subtle)]">
                      <div className="text-[10px] font-mono theme-text-secondary">Lichess {rapid?.rating ? 'Rapid' : 'Blitz'}</div>
                      <div className="text-base font-bold font-mono theme-text-primary">{activeRating}</div>
                    </div>
                    <div className="p-2 rounded-lg theme-surface border border-[var(--border-subtle)]">
                      <div className="text-[10px] font-mono theme-text-secondary">Variance Delta</div>
                      <div className={`text-base font-bold font-mono ${Math.abs(ratingDelta!) <= 60 ? 'text-emerald-400' : 'text-amber-800 dark:text-amber-400'}`}>
                        {ratingDelta! > 0 ? `+${ratingDelta}` : ratingDelta} Elo
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Lichess Game Blunders & Stockfish Training */}
              <div className="p-4 rounded-xl theme-surface border border-[var(--border-subtle)] shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center border border-rose-500/30 shrink-0">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold font-display theme-text-primary flex items-center gap-1.5">
                        <span>Fix Your Real Game Blunders</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-400 font-bold">
                          Stockfish WASM
                        </span>
                      </h4>
                      <p className="text-[11px] theme-text-secondary">
                        Extract positions where you made a mistake in recent games and master the winning move.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                    {onOpenWeaknessDashboard && (
                      <button
                        onClick={() => {
                          onOpenWeaknessDashboard();
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>Weakness Studio</span>
                      </button>
                    )}
                    <button
                      onClick={fetchMyBlunders}
                      disabled={isLoadingBlunders}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white text-xs font-bold transition cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBlunders ? 'animate-spin' : ''}`} />
                      <span>{isLoadingBlunders ? 'Extracting...' : 'Scan Games'}</span>
                    </button>
                  </div>
                </div>

                {isLoadingBlunders && (
                  <div className="mt-3">
                    <TransparentProgressBar
                      title={`Scanning Games for @${user.username}`}
                      phase={scanStep.phase}
                      stepDetail={scanStep.detail}
                      progressPercent={scanStep.percent}
                      unitLabel="games"
                      allowPause={false}
                      tabTitlePrefix="ChessZ Scan"
                    />
                  </div>
                )}

                {blunderError && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{blunderError}</span>
                  </div>
                )}

                {blunders.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[10px] font-mono theme-text-secondary uppercase tracking-wider font-semibold">
                      <span>Found {blunders.length} Personal Blunders to Fix:</span>
                      <span className="text-emerald-400 font-bold">Click to Train</span>
                    </div>

                    <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                      {blunders.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="p-2.5 rounded-xl theme-surface-subtle border border-[var(--border-subtle)] flex items-center justify-between gap-2 hover:border-[var(--border-focus)] transition"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold theme-text-primary truncate">
                                {p.title}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold shrink-0">
                                {p.ratingBadge}
                              </span>
                            </div>
                            <p className="text-[11px] theme-text-secondary mt-0.5 truncate">
                              {p.ruleTitle}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              if (onStartBlunderTraining) {
                                onStartBlunderTraining(p);
                                onClose();
                              }
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer shrink-0"
                          >
                            <span>Fix It</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Re-authenticate with OAuth prompt if only public preview */}
              {!isAuthenticated && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/35 flex items-center justify-between">
                  <div className="text-xs theme-text-secondary">
                    <span className="font-bold text-amber-950 dark:text-amber-300 block mb-0.5">Upgrade to Official OAuth</span>
                    Connect via 1-Click Lichess authorization to verify ownership.
                  </div>
                  <button
                    onClick={onLogin}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black transition cursor-pointer shrink-0 ml-2"
                  >
                    Authorize
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Disconnected / Connect State */
            <div className="space-y-4">
              {/* Primary 1-Click OAuth Button */}
              <div className="p-5 rounded-xl bg-linear-to-b from-[var(--surface-elevated)] to-[var(--surface-base)] border border-[var(--border-subtle)] text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 text-black mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <LichessIcon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base theme-text-primary">
                    1-Click Lichess OAuth Sign-In
                  </h4>
                  <p className="text-xs theme-text-secondary max-w-sm mx-auto mt-1">
                    Connect securely using official Lichess PKCE authorization. Zero passwords shared, free forever.
                  </p>
                </div>
                <button
                  onClick={onLogin}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer font-sans"
                >
                  <LichessIcon className="w-4 h-4" />
                  <span>Connect with Lichess</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                <span className="text-[11px] font-mono uppercase tracking-wider theme-text-secondary">
                  Or Quick Preview by Username
                </span>
                <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              </div>

              {/* Direct Username Form */}
              <form onSubmit={handleUsernameSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter any Lichess username (e.g. thibault, magnuscarlsen)"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl theme-surface border border-[var(--border-subtle)] theme-text-primary focus:outline-hidden focus:border-[var(--accent-primary)] font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !usernameInput.trim()}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-[var(--surface-muted)] hover:bg-[var(--surface-elevated)] border border-[var(--border-subtle)] theme-text-primary transition cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Syncing...' : 'Sync'}
                  </button>
                </div>
                {usernameError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{usernameError}</span>
                  </p>
                )}
              </form>

              {/* Features Guarantee */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] theme-text-secondary">
                <div className="p-2.5 rounded-xl theme-surface border border-[var(--border-subtle)] text-center">
                  <div className="font-semibold theme-text-primary mb-0.5">⚡ Live Sync</div>
                  <span>Pull real Rapid, Blitz & Puzzle Elo</span>
                </div>
                <div className="p-2.5 rounded-xl theme-surface border border-[var(--border-subtle)] text-center">
                  <div className="font-semibold theme-text-primary mb-0.5">🔒 Safe PKCE</div>
                  <span>Standard RFC 7636 OAuth protocol</span>
                </div>
                <div className="p-2.5 rounded-xl theme-surface border border-[var(--border-subtle)] text-center">
                  <div className="font-semibold theme-text-primary mb-0.5">🎯 Calibration</div>
                  <span>Compare ChessZ vs Lichess stats</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {user && (
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between shrink-0">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-mono theme-surface theme-surface-hover px-3 py-1.5 rounded-xl border cursor-pointer transition disabled:opacity-50"
              title="Refresh live ratings from Lichess"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync Stats</span>
            </button>

            <button
              onClick={onLogout}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs font-mono text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/10 cursor-pointer transition"
              title="Disconnect Lichess account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
