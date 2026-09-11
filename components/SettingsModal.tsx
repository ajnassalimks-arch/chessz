"use client";

import React, { useState, useEffect } from "react";
import { Settings, Sun, Moon, Volume2, VolumeX, Sparkles, X, Check } from "lucide-react";
import { ThemePalette, ThemeMode, THEME_BOARD_COLORS, THEME_NAMES } from "./ThemeSwitcher";
import { sounds } from "@/lib/sounds";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChange?: (theme: ThemePalette, mode: ThemeMode) => void;
}

export function SettingsModal({ isOpen, onClose, onThemeChange }: SettingsModalProps) {
  const [theme, setTheme] = useState<ThemePalette>("periwinkle");
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem("chessz_theme") as ThemePalette) || "periwinkle";
      const savedMode = (localStorage.getItem("chessz_mode") as ThemeMode) || "light";
      const savedMute = localStorage.getItem("chessz_muted");
      setTheme(savedTheme);
      setMode(savedMode);
      if (savedMute !== null) {
        setIsMuted(JSON.parse(savedMute));
      }
    } catch {}
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const applyTheme = (newTheme: ThemePalette, newMode: ThemeMode) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.setAttribute("data-mode", newMode);
      if (newMode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("chessz_theme", newTheme);
      localStorage.setItem("chessz_mode", newMode);

      const event = new CustomEvent("chessz-theme-changed", {
        detail: { theme: newTheme, mode: newMode },
      });
      window.dispatchEvent(event);
      if (onThemeChange) {
        onThemeChange(newTheme, newMode);
      }
    }
  };

  const handleSelectTheme = (newTheme: ThemePalette) => {
    setTheme(newTheme);
    applyTheme(newTheme, mode);
  };

  const handleToggleMode = (newMode: ThemeMode) => {
    setMode(newMode);
    applyTheme(theme, newMode);
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sounds.setMuted(nextMute);
    try {
      localStorage.setItem("chessz_muted", JSON.stringify(nextMute));
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md theme-surface rounded-3xl p-5 sm:p-6 shadow-2xl border relative overflow-hidden animate-card-entrance"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-subtle)] flex items-center justify-center text-[var(--accent-primary)] border border-[var(--border-focus)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-base font-bold theme-text-primary">
                Settings & Theme Studio
              </h2>
              <p className="text-[11px] theme-text-muted">
                Customize your chessboard aesthetics & display
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl theme-surface hover:theme-surface-subtle border flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-2 block">
            Board & Interface Palette
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {THEME_NAMES.map((t) => {
              const isSelected = theme === t.id;
              const boardColors = THEME_BOARD_COLORS[t.id][mode];
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  className={`relative p-3 rounded-2xl border transition-all text-left flex flex-col items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-2 ring-[var(--accent-primary)]/30 shadow-md"
                      : "theme-surface hover:theme-surface-subtle border-[var(--border-subtle)] opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-black/20 shadow-xs grid grid-cols-2 grid-rows-2">
                    <div style={{ backgroundColor: boardColors.light }} />
                    <div style={{ backgroundColor: boardColors.dark }} />
                    <div style={{ backgroundColor: boardColors.dark }} />
                    <div style={{ backgroundColor: boardColors.light }} />
                  </div>

                  <div className="text-center">
                    <span className="text-xs font-bold theme-text-primary block">
                      {t.label}
                    </span>
                    <span className="text-[10px] theme-text-muted block mt-0.5">
                      {t.desc.split(" ")[0]}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-[10px]">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-2 block">
            Appearance Mode
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl theme-surface-subtle border">
            <button
              onClick={() => handleToggleMode("light")}
              className={`py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                mode === "light"
                  ? "theme-surface theme-text-primary shadow-xs font-bold border border-[var(--border-focus)]"
                  : "theme-text-muted hover:theme-text-primary"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => handleToggleMode("dark")}
              className={`py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                mode === "dark"
                  ? "theme-surface theme-text-primary shadow-xs font-bold border border-[var(--border-focus)]"
                  : "theme-text-muted hover:theme-text-primary"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-sky-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-2xl theme-surface-subtle border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            )}
            <div>
              <div className="text-xs font-bold theme-text-primary">Master Audio Effects</div>
              <div className="text-[10px] theme-text-muted">Piece moves, solves, and tactical refutations</div>
            </div>
          </div>
          <button
            onClick={handleToggleMute}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
              isMuted
                ? "bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            }`}
          >
            {isMuted ? "Muted" : "Enabled"}
          </button>
        </div>

        <div className="mb-5 p-3 rounded-2xl theme-surface-subtle border text-[11px] space-y-1 font-mono">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span>Coordinate Bezel:</span>
            <span className="font-bold theme-text-primary">ChessBase 17 Exterior</span>
          </div>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span>Annotation Arrows:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Pro Broadcast HDR</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="group relative w-full py-2.5 px-4 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md"
        >
          <span className="relative z-10">Done & Save Preferences</span>
          <Check className="w-4 h-4 relative z-10" />
        </button>
      </div>
    </div>
  );
}
