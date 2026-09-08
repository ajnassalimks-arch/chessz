"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

export type ThemePalette = "sage" | "periwinkle" | "terracotta";
export type ThemeMode = "light" | "dark";

export const THEME_BOARD_COLORS: Record<ThemePalette, Record<ThemeMode, { light: string; dark: string }>> = {
  sage: {
    light: { light: "#f2f5ed", dark: "#7d9985" },
    dark: { light: "#dce4dc", dark: "#476654" },
  },
  periwinkle: {
    light: { light: "#eff3f9", dark: "#748cb4" },
    dark: { light: "#dbe3ee", dark: "#475d82" },
  },
  terracotta: {
    light: { light: "#f7f0e7", dark: "#a97061" },
    dark: { light: "#ebdcd4", dark: "#6e4338" },
  },
};

export const THEME_NAMES: { id: ThemePalette; label: string; icon: string; desc: string }[] = [
  { id: "sage", label: "Sage", icon: "🌿", desc: "Nordic Atelier" },
  { id: "periwinkle", label: "Periwinkle", icon: "🪨", desc: "Mist Slate" },
  { id: "terracotta", label: "Terracotta", icon: "🏺", desc: "Kyoto Sand" },
];

interface ThemeSwitcherProps {
  onThemeChange?: (theme: ThemePalette, mode: ThemeMode) => void;
}

export function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<ThemePalette>("sage");
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = (localStorage.getItem("chessz_theme") as ThemePalette) || "sage";
    const savedMode = (localStorage.getItem("chessz_mode") as ThemeMode) || "light";

    setTheme(savedTheme);
    setMode(savedMode);
    applyTheme(savedTheme, savedMode);
  }, []);

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

  const handleToggleMode = () => {
    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
    applyTheme(theme, nextMode);
  };

  if (!mounted) return null;

  return (
    <aside
      aria-label="Dev Theme Switcher Studio"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1.5"
    >
      {/* Floating Segmented Pill */}
      <div
        className={`flex items-center gap-1.5 p-1.5 rounded-full border transition-all duration-300 shadow-2xl backdrop-blur-xl ${
          mode === "dark"
            ? "bg-[#161a18]/90 border-white/10 text-white"
            : "bg-white/90 border-black/10 text-neutral-900"
        } ${isMinimized ? "p-1.5" : "px-2"}`}
      >
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            title="Expand Theme Studio"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-neutral-200/50 dark:bg-neutral-800/60 hover:opacity-80 transition-opacity"
          >
            <span>🎨</span>
            <span className="capitalize">{theme}</span>
            <span>{mode === "dark" ? "🌙" : "☀️"}</span>
          </button>
        ) : (
          <>
            {/* Studio Badge */}
            <div className="hidden sm:flex items-center gap-1 px-2 text-[11px] font-semibold opacity-60 tracking-wider uppercase">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Theme Studio</span>
            </div>

            <div className="hidden sm:block h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-700" />

            {/* 3 Pastel Theme Buttons */}
            <div className="flex items-center gap-1 p-0.5 rounded-full bg-neutral-200/40 dark:bg-neutral-900/60 border border-neutral-300/30 dark:border-neutral-800/40">
              {THEME_NAMES.map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? mode === "dark"
                          ? "bg-white/15 text-white shadow-sm font-semibold"
                          : "bg-white text-neutral-900 shadow-sm font-semibold"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-3.5 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-0.5" />

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={handleToggleMode}
              title={`Switch to ${mode === "light" ? "Dark" : "Light"} mode`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-200/40 dark:bg-neutral-900/60 border border-neutral-300/30 dark:border-neutral-800/40 hover:opacity-80 transition-all"
            >
              {mode === "light" ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold">Dark</span>
                </>
              )}
            </button>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize theme switcher"
              className="p-1 rounded-full opacity-40 hover:opacity-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-all ml-0.5"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
