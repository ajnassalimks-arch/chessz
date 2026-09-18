'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Clock,
  Activity,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export interface TransparentProgressBarProps {
  /** Title of the operation (e.g. "Lichess Game Analysis") */
  title: string;
  /** Current phase name (e.g. "Connecting", "Streaming Games", "Evaluating Blunders") */
  phase: string;
  /** Step detail in plain English (e.g. "Parsing Game 14 of 50 for centipawn swings...") */
  stepDetail: string;
  /** Progress percentage from 0 to 100 */
  progressPercent: number;
  /** Current items processed (e.g. 14) */
  currentCount?: number;
  /** Total items to process (e.g. 50) */
  totalCount?: number;
  /** Unit label (e.g. "games", "positions", "plies") */
  unitLabel?: string;
  /** Whether the process is currently paused */
  isPaused?: boolean;
  /** Callback when user clicks Pause/Resume */
  onTogglePause?: () => void;
  /** Whether pause/resume is supported for this operation */
  allowPause?: boolean;
  /** Estimated time remaining in seconds (if externally provided, otherwise calculated dynamically) */
  estimatedSecondsRemaining?: number | null;
  /** Status badge override (e.g. "Active", "Paused", "Complete") */
  statusBadge?: string;
  /** Optional cancellation callback */
  onCancel?: () => void;
  /** Tab title prefix when running in background */
  tabTitlePrefix?: string;
}

export function TransparentProgressBar({
  title,
  phase,
  stepDetail,
  progressPercent,
  currentCount,
  totalCount,
  unitLabel = 'games',
  isPaused = false,
  onTogglePause,
  allowPause = true,
  estimatedSecondsRemaining,
  statusBadge,
  onCancel,
  tabTitlePrefix = 'ChessZ',
}: TransparentProgressBarProps) {
  const startTimeRef = useRef<number | null>(null);
  const [internalEta, setInternalEta] = useState<string>('Calculating...');
  const originalTitleRef = useRef<string>(typeof document !== 'undefined' ? document.title : 'ChessZ');

  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progressPercent)));

  // Dynamic ETA calculation if not provided explicitly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!startTimeRef.current || clampedProgress <= 1) {
        startTimeRef.current = Date.now();
        setInternalEta('Calculating ETA...');
        return;
      }

      if (clampedProgress >= 100) {
        setInternalEta('Almost done...');
        return;
      }

      if (isPaused) {
        setInternalEta('Paused');
        return;
      }

      if (typeof estimatedSecondsRemaining === 'number') {
        if (estimatedSecondsRemaining <= 2) {
          setInternalEta('a few seconds left');
        } else if (estimatedSecondsRemaining < 60) {
          setInternalEta(`~${Math.round(estimatedSecondsRemaining)}s remaining`);
        } else {
          const mins = Math.floor(estimatedSecondsRemaining / 60);
          const secs = Math.round(estimatedSecondsRemaining % 60);
          setInternalEta(`~${mins}m ${secs}s remaining`);
        }
        return;
      }

      // Moving-window elapsed calculation
      const elapsedMs = Date.now() - (startTimeRef.current || Date.now());
      if (elapsedMs < 1200) {
        setInternalEta('Calculating ETA...');
        return;
      }

      const rate = clampedProgress / elapsedMs; // percent per ms
      const remainingPercent = 100 - clampedProgress;
      const remainingMs = remainingPercent / rate;
      const remainingSecs = Math.round(remainingMs / 1000);

      if (remainingSecs <= 2) {
        setInternalEta('a few seconds left');
      } else if (remainingSecs < 60) {
        setInternalEta(`~${remainingSecs}s remaining`);
      } else {
        const mins = Math.floor(remainingSecs / 60);
        const secs = remainingSecs % 60;
        setInternalEta(`~${mins}m ${secs}s remaining`);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [clampedProgress, isPaused, estimatedSecondsRemaining]);

  // Background tab visibility listener: updates document.title in real-time!
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Store original document title on mount
    const original = originalTitleRef.current || document.title || 'ChessZ';

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden in background
        const pauseTag = isPaused ? ' [PAUSED]' : '';
        document.title = `(${clampedProgress}% • ${internalEta})${pauseTag} ${tabTitlePrefix}`;
      } else {
        // Tab is active: keep informative title
        if (clampedProgress < 100) {
          document.title = `(${clampedProgress}%) ${tabTitlePrefix}`;
        } else {
          document.title = original;
        }
      }
    };

    // Update immediately if in background
    if (document.hidden && clampedProgress < 100) {
      const pauseTag = isPaused ? ' [PAUSED]' : '';
      document.title = `(${clampedProgress}% • ${internalEta})${pauseTag} ${tabTitlePrefix}`;
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (typeof document !== 'undefined') {
        document.title = original;
      }
    };
  }, [clampedProgress, internalEta, isPaused, tabTitlePrefix]);

  return (
    <div className="w-full rounded-2xl theme-surface border border-[var(--border-focus)]/50 shadow-md p-3.5 sm:p-4.5 space-y-3 animate-in fade-in duration-200">
      {/* Top Header: Phase + Status Badge + ETA */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] flex items-center justify-center shrink-0">
            {isPaused ? (
              <Pause className="w-3.5 h-3.5" />
            ) : clampedProgress >= 100 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Activity className="w-3.5 h-3.5 animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold theme-text-primary truncate">
                {title}
              </span>
              <span
                className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                  isPaused
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : clampedProgress >= 100
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border-[var(--accent-primary)]/30'
                }`}
              >
                {statusBadge || (isPaused ? 'Paused' : clampedProgress >= 100 ? 'Complete' : phase)}
              </span>
            </div>
            <p className="text-[11px] theme-text-secondary truncate mt-0.5">
              {stepDetail}
            </p>
          </div>
        </div>

        {/* Live ETA Countdown */}
        <div className="flex items-center gap-1.5 text-xs font-mono shrink-0 px-2.5 py-1 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
          <Clock className="w-3.5 h-3.5 theme-text-muted" />
          <span className="font-semibold theme-text-primary">{internalEta}</span>
        </div>
      </div>

      {/* Progress Bar Track (0 to 100% Filling) */}
      <div className="space-y-1.5">
        <div className="w-full h-3 rounded-full bg-black/30 border border-[var(--border-subtle)] overflow-hidden relative p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 relative ${
              isPaused
                ? 'bg-linear-to-r from-amber-500 to-amber-400'
                : clampedProgress >= 100
                ? 'bg-linear-to-r from-emerald-500 to-teal-400'
                : 'bg-linear-to-r from-[var(--accent-primary)] via-indigo-500 to-emerald-400'
            }`}
            style={{ width: `${clampedProgress}%` }}
          >
            {/* Shimmer pulse effect */}
            {!isPaused && clampedProgress < 100 && (
              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
            )}
          </div>
        </div>

        {/* Readout Numbers */}
        <div className="flex items-center justify-between text-[11px] font-mono theme-text-muted px-0.5">
          <span>
            {currentCount !== undefined && totalCount !== undefined ? (
              <strong className="theme-text-primary">
                {currentCount} / {totalCount} {unitLabel}
              </strong>
            ) : (
              <span>Working in background</span>
            )}
          </span>
          <span className="font-bold text-xs theme-text-primary">
            {clampedProgress}%
          </span>
        </div>
      </div>

      {/* Transparent Action Controls (Pause / Resume / Cancel) */}
      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
        <div className="text-[10px] font-mono theme-text-muted flex items-center gap-1.5 truncate">
          <Sparkles className="w-3 h-3 text-[var(--accent-primary)] shrink-0" />
          <span className="truncate">
            {isPaused
              ? 'Operation paused • Click Continue to resume without losing progress'
              : 'Safe in background tab • Tab title updates automatically'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {allowPause && onTogglePause && clampedProgress < 100 && (
            <button
              type="button"
              onClick={onTogglePause}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                isPaused
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400 shadow-xs'
                  : 'theme-surface theme-text-primary hover:bg-neutral-800 border-[var(--border-subtle)]'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Continue</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </>
              )}
            </button>
          )}

          {onCancel && clampedProgress < 100 && (
            <button
              type="button"
              onClick={onCancel}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono theme-text-muted hover:theme-text-primary hover:bg-rose-500/10 hover:text-rose-400 transition cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
