"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, HelpCircle } from "lucide-react";
import { getTermDefinition, ChessStudyTerm } from "@/lib/studyTerms";

interface TermHoverCardProps {
  term: string; // Term ID, term name, or rule title
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export const TermHoverCard: React.FC<TermHoverCardProps> = ({
  term,
  children,
  className = "",
  showIcon = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const containerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const termData: ChessStudyTerm | undefined = getTermDefinition(term);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Check viewport space to flip top vs bottom
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top < 220) {
        setPosition("bottom");
      } else {
        setPosition("top");
      }
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Mobile tap support: toggle open on click if on touch device
    if (!isOpen) {
      e.preventDefault();
      handleMouseEnter();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (!termData) {
    return <span className={className}>{children || term}</span>;
  }

  const categoryColor =
    termData.category === "tactical"
      ? "text-sky-500 bg-sky-500/10 border-sky-500/25"
      : termData.category === "opening_traps"
      ? "text-amber-500 bg-amber-500/10 border-amber-500/25"
      : termData.category === "positional_endgame"
      ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/25"
      : "text-purple-500 bg-purple-500/10 border-purple-500/25";

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative inline-flex items-center gap-1 cursor-help group/term select-none ${className}`}
    >
      <span className="underline decoration-dotted decoration-[var(--accent-primary)]/60 underline-offset-4 group-hover/term:decoration-[var(--accent-primary)] transition-all font-medium">
        {children || termData.ruleTitle || termData.termName}
      </span>
      {showIcon && (
        <HelpCircle className="w-3 h-3 text-[var(--accent-primary)] opacity-70 group-hover/term:opacity-100 transition-opacity shrink-0 inline-block" />
      )}

      {/* Floating Hover Card */}
      {isOpen && (
        <div
          ref={popoverRef}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-72 sm:w-80 p-3.5 rounded-2xl theme-surface border border-[var(--border-focus)] shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 text-left pointer-events-auto ${
            position === "top"
              ? "bottom-full mb-2"
              : "top-full mt-2"
          }`}
          style={{
            boxShadow: "0 12px 32px -4px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header Badge */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColor}`}
            >
              {termData.category.replace("_", " & ")}
            </span>
            <span className="text-[10px] font-mono text-[var(--accent-primary)] font-semibold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Coach Guide</span>
            </span>
          </div>

          {/* Term Title */}
          <h4 className="text-xs sm:text-sm font-extrabold theme-text-primary tracking-tight font-display mb-1 flex items-center gap-1.5">
            <span>{termData.ruleTitle}</span>
          </h4>

          {/* Sticky Golden Rule */}
          <div className="p-2 rounded-xl bg-[var(--surface-muted)]/80 border border-[var(--border-subtle)] text-[11px] theme-text-primary leading-snug mb-2 font-mono">
            <span className="text-amber-500 font-bold mr-1">💡 Rule:</span>
            <span>{termData.ruleBody}</span>
          </div>

          {/* Real Historical Source Badge */}
          <div className="text-[10px] font-mono theme-text-muted mb-2.5 flex items-center gap-1 truncate">
            <span className="text-emerald-500 font-semibold">🏛️ Source:</span>
            <span className="truncate">{termData.historicalSource.white} vs. {termData.historicalSource.black} ({termData.historicalSource.year})</span>
          </div>

          {/* Action Button: Jump to Study Terms Page */}
          <Link
            href={`/terms?term=${termData.id}`}
            onClick={() => setIsOpen(false)}
            className="w-full py-1.5 px-2.5 rounded-xl bg-[var(--accent-primary)]/15 hover:bg-[var(--accent-primary)]/25 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 font-bold text-[11px] font-mono tracking-wide flex items-center justify-between transition-colors group/btn cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              <span>Brainstorm Position with Coach</span>
            </span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>

          {/* Pointer Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 theme-surface border-r border-b border-[var(--border-focus)] pointer-events-none ${
              position === "top"
                ? "top-full -mt-1.5 border-t-0 border-l-0"
                : "bottom-full -mb-1.5 border-b-0 border-r-0 border-t border-l"
            }`}
          />
        </div>
      )}
    </span>
  );
};
