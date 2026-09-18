'use client';

import React from 'react';
import { Chessboard } from 'react-chessboard';

interface MiniBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  size?: number;
  id: string;
  className?: string;
}

/**
 * A static, non-interactive board thumbnail: no drag, no animation, no
 * notation. For rows in a list (the mistake queue) where the position is
 * context for a decision, not something to play on.
 *
 * id must be unique per instance -- react-chessboard's context is keyed on it,
 * and a list renders many of these boards side by side.
 */
export function MiniBoard({ fen, orientation = 'white', size = 56, id, className = '' }: MiniBoardProps) {
  return (
    <div
      className={`shrink-0 rounded-lg overflow-hidden border theme-surface-subtle ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Chessboard
        options={{
          id,
          position: fen,
          boardOrientation: orientation,
          allowDragging: false,
          showAnimations: false,
          showNotation: false,
          boardStyle: { width: size, height: size },
        }}
      />
    </div>
  );
}
