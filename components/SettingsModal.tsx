"use client";

import React, { useState, useEffect } from "react";
import { Settings, Sun, Moon, Volume2, VolumeX, Sparkles, X, Check, HelpCircle, Hand, Image as ImageIcon } from "lucide-react";
import { ThemePalette, ThemeMode, THEME_BOARD_COLORS, THEME_NAMES } from "./ThemeSwitcher";
import { PieceSetStyle } from "./pieces/PieceSets2D";
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
  const [wallpaperEnabled, setWallpaperEnabled] = useState(true);
  const [captureHandEnabled, setCaptureHandEnabled] = useState(true);
  const [pieceSet, setPieceSet] = useState<PieceSetStyle>("liquid-chrome");

  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem("chessz_theme") as ThemePalette) || "periwinkle";
      const savedMode = (localStorage.getItem("chessz_mode") as ThemeMode) || "light";
      const savedMute = localStorage.getItem("chessz_muted");
      const savedWallpaper = localStorage.getItem("chessz_wallpaper");
      const savedCaptureHand = localStorage.getItem("chessz_capture_hand");
      const savedPieceSet = (localStorage.getItem("chessz_piece_set") as PieceSetStyle) || "liquid-chrome";

      setTheme(savedTheme);
      setMode(savedMode);
      setPieceSet(savedPieceSet);
      if (savedMute !== null) setIsMuted(JSON.parse(savedMute));
      if (savedWallpaper !== null) setWallpaperEnabled(JSON.parse(savedWallpaper));
      if (savedCaptureHand !== null) setCaptureHandEnabled(JSON.parse(savedCaptureHand));
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

  const dispatchSettingsChanged = (
    newTheme: ThemePalette,
    newMode: ThemeMode,
    newPieceSet: PieceSetStyle,
    newWallpaper: boolean,
    newCaptureHand: boolean
  ) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("chessz-settings-changed", {
        detail: {
          theme: newTheme,
          mode: newMode,
          pieceSet: newPieceSet,
          wallpaper: newWallpaper,
          captureHand: newCaptureHand,
        },
      });
      window.dispatchEvent(event);
    }
  };

  const applyTheme = (newTheme: ThemePalette, newMode: ThemeMode) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme);
      document.documentElement.setAttribute("data-mode", newMode);
      document.documentElement.setAttribute("data-wallpaper", String(wallpaperEnabled));
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
      dispatchSettingsChanged(newTheme, newMode, pieceSet, wallpaperEnabled, captureHandEnabled);

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

  const handleToggleWallpaper = () => {
    const nextVal = !wallpaperEnabled;
    setWallpaperEnabled(nextVal);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-wallpaper", String(nextVal));
    }
    try {
      localStorage.setItem("chessz_wallpaper", JSON.stringify(nextVal));
    } catch {}
    dispatchSettingsChanged(theme, mode, pieceSet, nextVal, captureHandEnabled);
  };

  const handleToggleCaptureHand = () => {
    const nextVal = !captureHandEnabled;
    setCaptureHandEnabled(nextVal);
    try {
      localStorage.setItem("chessz_capture_hand", JSON.stringify(nextVal));
    } catch {}
    dispatchSettingsChanged(theme, mode, pieceSet, wallpaperEnabled, nextVal);
  };

  const handleSelectPieceSet = (newPieceSet: PieceSetStyle) => {
    setPieceSet(newPieceSet);
    try {
      localStorage.setItem("chessz_piece_set", newPieceSet);
    } catch {}
    dispatchSettingsChanged(theme, mode, newPieceSet, wallpaperEnabled, captureHandEnabled);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md theme-surface rounded-3xl p-5 sm:p-6 shadow-2xl border relative overflow-hidden max-h-[90vh] overflow-y-auto animate-card-entrance"
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {THEME_NAMES.map((t) => {
              const isSelected = theme === t.id;
              const boardColors = THEME_BOARD_COLORS[t.id][mode];
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  className={`relative p-2.5 rounded-2xl border transition-all text-left flex flex-col items-center justify-between gap-1.5 cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-2 ring-[var(--accent-primary)]/30 shadow-md"
                      : "theme-surface hover:theme-surface-subtle border-[var(--border-subtle)] opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-black/20 shadow-xs grid grid-cols-2 grid-rows-2">
                    <div style={{ backgroundColor: boardColors.light }} />
                    <div style={{ backgroundColor: boardColors.dark }} />
                    <div style={{ backgroundColor: boardColors.dark }} />
                    <div style={{ backgroundColor: boardColors.light }} />
                  </div>

                  <div className="text-center">
                    <span className="text-[11px] font-bold theme-text-primary block leading-tight">
                      {t.label}
                    </span>
                    <span className="text-[9px] theme-text-muted block mt-0.5">
                      {t.desc.split(" ")[0]}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-[9px]">
                      <Check className="w-2 h-2" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2D Chess Piece Set Selector */}
        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-2 block">
            2D Chess Piece Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "liquid-chrome" as PieceSetStyle, label: "Liquid Chrome", badge: "Y2K Neon", desc: "Molten metallic" },
              { id: "lichess-shapes" as PieceSetStyle, label: "Shapes", badge: "Bauhaus", desc: "Pure geometry" },
              { id: "lichess-spatial" as PieceSetStyle, label: "Spatial", badge: "Wireframe", desc: "3D CAD Vector" },
              { id: "lichess-mono" as PieceSetStyle, label: "Mono", badge: "Silhouette", desc: "Zero noise" },
              { id: "neo-arcade" as PieceSetStyle, label: "Neo-Arcade", badge: "Art Toy", desc: "Streetwear bots" },
              { id: "default" as PieceSetStyle, label: "Classic", badge: "FIDE Pro", desc: "Standard 2D" },
            ].map((p) => {
              const isSelected = pieceSet === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPieceSet(p.id)}
                  className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? "border-[var(--accent-primary)] bg-[var(--accent-subtle)] ring-2 ring-[var(--accent-primary)]/30 shadow-md"
                      : "theme-surface hover:theme-surface-subtle border-[var(--border-subtle)] opacity-80 hover:opacity-100"
                  }`}
                >
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold">
                    {p.badge}
                  </span>
                  <span className="text-[11px] font-bold theme-text-primary block mt-0.5 leading-tight">
                    {p.label}
                  </span>
                  <span className="text-[9px] theme-text-muted block">
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wallpaper Atmosphere Toggle (Exclusively on Emerald theme) */}
        {theme === "emerald" && (
          <div className="mb-4 p-3 rounded-2xl theme-surface-subtle border border-emerald-500/30 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-emerald-500/40 shrink-0">
                <img src="/wallpapers/emerald-glitter.jpg" alt="Wallpaper preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Emerald Bokeh Wallpaper</span>
                </div>
                <div className="text-[10px] theme-text-muted">Glitter background with glassmorphism blur</div>
              </div>
            </div>
            <button
              onClick={handleToggleWallpaper}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                wallpaperEnabled
                  ? "bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400"
                  : "theme-surface theme-text-muted border-[var(--border-subtle)] hover:theme-text-primary"
              }`}
            >
              {wallpaperEnabled ? "Active" : "Off"}
            </button>
          </div>
        )}

        {/* Animated Capture Hand Toggle */}
        <div className="mb-4 p-3 rounded-2xl theme-surface-subtle border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-red-500/15 flex items-center justify-center text-red-500 border border-red-500/30">
              <Hand className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold theme-text-primary flex items-center gap-1.5">
                <span>Animated Red Hand</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold">New</span>
              </div>
              <div className="text-[10px] theme-text-muted">Snatches taken pieces off the board on capture</div>
            </div>
          </div>
          <button
            onClick={handleToggleCaptureHand}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
              captureHandEnabled
                ? "bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/40 hover:bg-red-500/25"
                : "theme-surface theme-text-muted border-[var(--border-subtle)] hover:theme-text-primary"
            }`}
          >
            {captureHandEnabled ? "Enabled" : "Disabled"}
          </button>
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

        {/* Tactical Annotations & Shortcuts Help Section */}
        <div className="mb-4 p-3.5 rounded-2xl theme-surface-subtle border">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-2.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Board Annotations & Help</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-2.5">
            <div className="flex items-center gap-2 p-2 rounded-xl theme-surface border">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
              <div>
                <span className="font-bold theme-text-primary block">Target / Safe</span>
                <span className="text-[10px] font-mono theme-text-muted">Right-Click</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl theme-surface border">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 shadow-xs" />
              <div>
                <span className="font-bold theme-text-primary block">Threat / Danger</span>
                <span className="text-[10px] font-mono theme-text-muted">Ctrl + Right-Click</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl theme-surface border">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0 shadow-xs" />
              <div>
                <span className="font-bold theme-text-primary block">Plan / Candidate</span>
                <span className="text-[10px] font-mono theme-text-muted">Shift + Right-Click</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl theme-surface border">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 shadow-xs" />
              <div>
                <span className="font-bold theme-text-primary block">Caution Square</span>
                <span className="text-[10px] font-mono theme-text-muted">Alt + Right-Click</span>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono theme-text-muted">
            <span>Clear: Click empty square</span>
            <span>Arrows: Right-drag</span>
          </div>
        </div>

        <div className="sticky bottom-0 pt-2 pb-1 bg-inherit backdrop-blur-md z-10">
          <button
            onClick={onClose}
            className="group relative w-full py-2.5 px-4 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="relative z-10">Done & Save Preferences</span>
            <Check className="w-4 h-4 relative z-10" />
          </button>
        </div>
      </div>
    </div>
  );
}
