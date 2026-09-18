'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemePalette, ThemeMode } from '@/components/themeTokens';

/**
 * Theme used to live in four places at once: each page held its own palette,
 * mode and wallpaper state, SettingsModal held a fourth copy, and they stayed in
 * sync by dispatching 'chessz-theme-changed' and 'chessz-settings-changed' on
 * window and listening for each other. Every new surface had to remember to
 * subscribe, and a surface that forgot simply drifted.
 *
 * One provider now owns it. The DOM attributes it writes are the same ones the
 * inline script in app/layout.tsx sets before paint, so there is no flash.
 */
interface ThemeState {
  theme: ThemePalette;
  mode: ThemeMode;
  wallpaperEnabled: boolean;
  setTheme: (theme: ThemePalette) => void;
  setMode: (mode: ThemeMode) => void;
  setWallpaperEnabled: (enabled: boolean) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

const STORAGE = {
  theme: 'chessz_theme',
  mode: 'chessz_mode',
  wallpaper: 'chessz_wallpaper',
} as const;

function applyToDocument(theme: ThemePalette, mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-mode', mode);
  root.classList.toggle('dark', mode === 'dark');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePalette>('periwinkle');
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [wallpaperEnabled, setWallpaperState] = useState<boolean>(true);

  // Hydrate from storage after mount. The layout script has already applied the
  // same values to the document, so this only syncs React's copy.
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE.theme) as ThemePalette | null;
      const savedMode = localStorage.getItem(STORAGE.mode) as ThemeMode | null;
      const savedWallpaper = localStorage.getItem(STORAGE.wallpaper);
      if (savedTheme) setThemeState(savedTheme);
      if (savedMode) setModeState(savedMode);
      if (savedWallpaper !== null) setWallpaperState(JSON.parse(savedWallpaper));
    } catch {}
  }, []);

  const setTheme = useCallback((next: ThemePalette) => {
    setThemeState(next);
    applyToDocument(next, (localStorage.getItem(STORAGE.mode) as ThemeMode) || 'light');
    try {
      localStorage.setItem(STORAGE.theme, next);
    } catch {}
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    applyToDocument((localStorage.getItem(STORAGE.theme) as ThemePalette) || 'periwinkle', next);
    try {
      localStorage.setItem(STORAGE.mode, next);
    } catch {}
  }, []);

  const setWallpaperEnabled = useCallback((enabled: boolean) => {
    setWallpaperState(enabled);
    try {
      localStorage.setItem(STORAGE.wallpaper, JSON.stringify(enabled));
    } catch {}
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider
      value={{ theme, mode, wallpaperEnabled, setTheme, setMode, setWallpaperEnabled, toggleMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}
