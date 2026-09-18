'use client';

import React from 'react';
import { X } from 'lucide-react';

export type AnnotationColor = 'green' | 'red' | 'cyan' | 'yellow';

export const ANNOTATION_COLORS: Record<
  AnnotationColor,
  { bg: string; border: string; label: string; modifier: string }
> = {
  green: {
    bg: 'rgba(16, 185, 129, 0.40)',
    border: '#10b981',
    label: 'Target',
    modifier: 'right-click',
  },
  red: {
    bg: 'rgba(239, 68, 68, 0.40)',
    border: '#ef4444',
    label: 'Threat',
    modifier: 'ctrl + right-click',
  },
  cyan: {
    bg: 'rgba(2, 132, 199, 0.40)',
    border: '#0284c7',
    label: 'Plan',
    modifier: 'shift + right-click',
  },
  yellow: {
    bg: 'rgba(245, 158, 11, 0.42)',
    border: '#f59e0b',
    label: 'Watch',
    modifier: 'alt + right-click',
  },
};

interface AnnotationPaletteProps {
  active: AnnotationColor | null;
  onSelect: (color: AnnotationColor | null) => void;
  onClear: () => void;
  hasMarks: boolean;
  className?: string;
}

/**
 * Marking squares was desktop-only and undiscoverable: the modifier combos were
 * never named in the UI, and the touch path in handleSquareClick could not be
 * reached because nothing ever set the active colour.
 *
 * These chips set it. Tap one, then tap squares. On desktop the same colours
 * stay available through their modifiers, which the tooltips now teach.
 */
export function AnnotationPalette({
  active,
  onSelect,
  onClear,
  hasMarks,
  className = '',
}: AnnotationPaletteProps) {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      <span className="text-[10px] font-mono uppercase tracking-wider theme-text-muted mr-0.5">
        Mark
      </span>

      {(Object.keys(ANNOTATION_COLORS) as AnnotationColor[]).map((color) => {
        const spec = ANNOTATION_COLORS[color];
        const isActive = active === color;
        return (
          <button
            key={color}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(isActive ? null : color)}
            title={`${spec.label} — tap squares, or ${spec.modifier}`}
            className={`flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg border text-[10px] font-mono font-bold transition cursor-pointer ${
              isActive
                ? 'theme-surface shadow-xs'
                : 'theme-surface-subtle theme-text-muted hover:theme-text-primary'
            }`}
            style={isActive ? { borderColor: spec.border, color: spec.border } : undefined}
          >
            <span
              className="w-3 h-3 rounded-sm shrink-0 border"
              style={{ backgroundColor: spec.bg, borderColor: spec.border }}
            />
            <span>{spec.label}</span>
          </button>
        );
      })}

      {hasMarks && (
        <button
          type="button"
          onClick={onClear}
          title="Clear all marks"
          className="flex items-center gap-1 px-2 py-1 rounded-lg theme-surface-subtle theme-text-muted hover:theme-text-primary border text-[10px] font-mono font-bold transition cursor-pointer"
        >
          <X className="w-3 h-3" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
