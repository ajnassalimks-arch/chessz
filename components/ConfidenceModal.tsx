"use client";

import React, { useEffect } from "react";
import { ShieldCheck, Sparkles, HelpCircle, X, RotateCcw } from "lucide-react";

export type CommitmentLevel = "sure" | "think_so" | "guessing";

interface ConfidenceModalProps {
  isOpen: boolean;
  moveSan: string;
  onSelect: (commitment: CommitmentLevel) => void;
  onCancel: () => void;
}

export const ConfidenceModal: React.FC<ConfidenceModalProps> = ({
  isOpen,
  moveSan,
  onSelect,
  onCancel,
}) => {
  // Mobile tactile haptic feedback
  const triggerHaptic = (duration = 20) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {}
    }
  };

  // Keyboard navigation on desktop: 1 = Sure, 2 = Think so, 3 = Guessing, Esc = Cancel
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "1" || e.key.toLowerCase() === "s") {
        e.preventDefault();
        triggerHaptic(25);
        onSelect("sure");
      } else if (e.key === "2" || e.key.toLowerCase() === "t") {
        e.preventDefault();
        triggerHaptic(25);
        onSelect("think_so");
      } else if (e.key === "3" || e.key.toLowerCase() === "g") {
        e.preventDefault();
        triggerHaptic(25);
        onSelect("guessing");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onSelect, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confidence-modal-title"
    >
      {/* Dimmed & Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal / Bottom Sheet Card */}
      <div
        className="relative w-full sm:max-w-md theme-surface border-t sm:border border-[var(--border-focus)] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl z-10 animate-in slide-in-from-bottom-8 sm:zoom-in-95 sm:slide-in-from-bottom-0 duration-200 ease-out flex flex-col"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))" }}
      >
        {/* Mobile Swipe / Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-neutral-500/30 mx-auto mb-3 sm:hidden" />

        {/* Top Header Row: Candidate Move & Close / Revert */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-extrabold text-sm sm:text-base bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 px-3 py-1 rounded-xl shadow-xs">
              {moveSan || "Move"}
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--accent-primary)]">
                Calibrating Move
              </span>
              <span className="text-[11px] theme-text-muted">
                Psychological Conviction
              </span>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-xl theme-surface hover:theme-surface-subtle border border-[var(--border-subtle)] flex items-center justify-center text-neutral-400 hover:text-neutral-200 transition cursor-pointer"
            title="Change move (Esc)"
            aria-label="Change move"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Micro-Copy */}
        <div className="mb-4">
          <h3 id="confidence-modal-title" className="text-base sm:text-lg font-bold theme-text-primary tracking-tight mb-1">
            How confident are you in this move?
          </h3>
          <p className="text-xs theme-text-secondary leading-relaxed">
            Your conviction under pressure determines whether your tactical pattern is calculated or intuitive.
          </p>
        </div>

        {/* The 3 Conviction Tiers - Ergonomic Large Touch Targets (min 50px) */}
        <div className="flex flex-col gap-2.5 mb-4">
          {/* Option 1: Sure */}
          <button
            onClick={() => {
              triggerHaptic(30);
              onSelect("sure");
            }}
            className="group relative w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-150 cursor-pointer text-left shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shrink-0 shadow-sm shadow-emerald-500/50 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>Sure</span>
                  <span className="text-[11px] font-normal text-emerald-600/70 dark:text-emerald-400/70">
                    (High Conviction)
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Calculated candidate defenses & counter-tactics
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                1
              </kbd>
              <ShieldCheck className="w-5 h-5 text-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Option 2: Think So */}
          <button
            onClick={() => {
              triggerHaptic(20);
              onSelect("think_so");
            }}
            className="group relative w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-[0.98] border border-amber-500/30 hover:border-amber-500/60 transition-all duration-150 cursor-pointer text-left shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 shadow-sm shadow-amber-500/50 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span>Think so</span>
                  <span className="text-[11px] font-normal text-amber-600/70 dark:text-amber-400/70">
                    (Moderate Conviction)
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Looks sound, but not completely calculated
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                2
              </kbd>
              <Sparkles className="w-5 h-5 text-amber-500 opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Option 3: Guessing */}
          <button
            onClick={() => {
              triggerHaptic(15);
              onSelect("guessing");
            }}
            className="group relative w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-500/10 hover:bg-slate-500/20 active:scale-[0.98] border border-slate-500/30 hover:border-slate-500/60 transition-all duration-150 cursor-pointer text-left shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-400 shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-sm theme-text-primary flex items-center gap-1.5">
                  <span>Guessing</span>
                  <span className="text-[11px] font-normal theme-text-muted">
                    (Intuitive / Speculative)
                  </span>
                </div>
                <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Instinctive reaction under time or position stress
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-500/15 theme-text-muted border border-slate-500/30">
                3
              </kbd>
              <HelpCircle className="w-5 h-5 theme-text-muted opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        </div>

        {/* Bottom Escape Hatch: Revert / Change Move */}
        <button
          onClick={onCancel}
          className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-300 transition cursor-pointer rounded-xl hover:bg-neutral-800/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Accidental move? <strong className="underline underline-offset-2">Change move (Esc)</strong></span>
        </button>
      </div>
    </div>
  );
};
