'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled ChessZ Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen theme-canvas theme-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="p-5 rounded-2xl theme-surface border border-rose-500/30 max-w-md w-full space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Engine or Client Exception</h2>
          <p className="text-xs theme-text-secondary">
            {error.message || 'An unexpected error occurred during tactical board or engine evaluation.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl theme-surface-subtle theme-surface-hover border text-xs font-mono font-bold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Board</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
