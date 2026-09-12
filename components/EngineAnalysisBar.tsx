'use client';

import React from 'react';
import { Cpu, Zap, ArrowRight, Power, Activity, Sparkles } from 'lucide-react';
import { EngineEvaluation, EngineMove } from '@/lib/useStockfish';

interface EngineAnalysisBarProps {
  isReady: boolean;
  isAnalyzing: boolean;
  engineEnabled: boolean;
  evaluation: EngineEvaluation | null;
  bestMove: EngineMove | null;
  bestLine: string[];
  onToggleEngine: () => void;
  className?: string;
}

export function EngineAnalysisBar({
  isReady,
  isAnalyzing,
  engineEnabled,
  evaluation,
  bestMove,
  bestLine,
  onToggleEngine,
  className = '',
}: EngineAnalysisBarProps) {
  // Compute visual evaluation percentage (0 to 100% for White)
  const getWhiteAdvantagePercent = () => {
    if (!evaluation) return 50;
    if (evaluation.isMate) {
      return (evaluation.mateIn || 0) > 0 ? 100 : 0;
    }
    const cp = evaluation.score ?? 0;
    // Standard logistic function for chess centipawns
    const winChance = 50 + 50 * (2 / (1 + Math.exp(-0.0035 * cp)) - 1);
    return Math.max(3, Math.min(97, Math.round(winChance)));
  };

  const whitePercent = getWhiteAdvantagePercent();

  if (!engineEnabled) {
    return (
      <div className={`w-full flex items-center justify-between p-2.5 rounded-2xl theme-surface border shadow-xs ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold theme-text-primary block font-display">
              Stockfish Engine Analysis
            </span>
            <span className="text-[10px] theme-text-muted font-mono">
              In-browser WASM • Zero server lag
            </span>
          </div>
        </div>

        <button
          onClick={onToggleEngine}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition cursor-pointer active:scale-95 shadow-xs"
        >
          <Power className="w-3.5 h-3.5" />
          <span>Analyze with Engine</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-2xl theme-surface border border-emerald-500/30 shadow-md p-3 transition-all duration-200 animate-in fade-in slide-in-from-top-1 ${className}`}>
      {/* Top Header Row: Engine status & Toggle */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[var(--border-subtle)] text-xs">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <Cpu className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-pulse text-emerald-400' : ''}`} />
            {isAnalyzing && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold theme-text-primary font-display text-[11px] sm:text-xs">
                Stockfish 10 WASM
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                {isAnalyzing ? 'Calculating...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {evaluation && (
            <span className="text-[10px] font-mono theme-text-muted hidden sm:inline">
              Depth: {evaluation.depth}/15
            </span>
          )}
          <button
            onClick={onToggleEngine}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg theme-surface-subtle hover:theme-surface border text-[11px] font-bold theme-text-muted hover:theme-text-primary transition cursor-pointer"
            title="Turn off engine"
          >
            <Power className="w-3 h-3 text-rose-400" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Evaluation Score & Visual Ratio Bar */}
      <div className="flex items-center gap-3 mb-2.5">
        {/* Dynamic Score Badge */}
        <div className="px-3 py-1.5 rounded-xl bg-[#0b0f17] border border-emerald-500/40 shadow-xs flex items-center justify-center shrink-0 min-w-[70px]">
          <span className="font-mono font-black text-base text-emerald-400 tracking-tight">
            {evaluation?.displayScore || '0.0'}
          </span>
        </div>

        {/* Dual-Tone Horizontal Evaluation Bar */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden border border-[var(--border-subtle)] relative flex">
            {/* White side */}
            <div
              className="h-full bg-neutral-100 transition-all duration-300 ease-out flex items-center justify-end pr-1"
              style={{ width: `${whitePercent}%` }}
            />
            {/* Black side */}
            <div
              className="h-full bg-neutral-800 transition-all duration-300 ease-out flex-1"
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-neutral-400 mt-1 px-1">
            <span>White ({whitePercent}%)</span>
            <span>Black ({100 - whitePercent}%)</span>
          </div>
        </div>
      </div>

      {/* Best Move & Engine Arrow Recommendation */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl theme-surface-subtle border text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[var(--accent-primary)] font-bold text-[11px]">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Best Line:</span>
          </div>
          {bestMove ? (
            <div className="flex items-center gap-1 font-mono font-bold theme-text-primary bg-[var(--surface-primary)] px-2 py-0.5 rounded-md border text-xs shadow-2xs">
              <span>{bestMove.san}</span>
              <span className="text-[10px] theme-text-muted font-normal">({bestMove.uci})</span>
            </div>
          ) : (
            <span className="text-[11px] font-mono theme-text-muted">Analyzing position...</span>
          )}
        </div>

        {bestLine.length > 1 && (
          <div className="flex items-center gap-1 text-[10px] font-mono theme-text-muted overflow-hidden max-w-[240px] truncate">
            {bestLine.slice(1, 4).map((m, idx) => (
              <span key={idx} className="bg-neutral-500/10 px-1 rounded">
                {m}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
