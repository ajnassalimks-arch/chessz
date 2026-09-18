
export type ThemePalette = "sage" | "periwinkle" | "terracotta" | "emerald";
export type ThemeMode = "light" | "dark";

export const THEME_BOARD_COLORS: Record<ThemePalette, Record<ThemeMode, { light: string; dark: string }>> = {
  periwinkle: {
    light: { light: "#eff3f9", dark: "#748cb4" },
    dark: { light: "#dbe3ee", dark: "#475d82" },
  },
  sage: {
    light: { light: "#f2f5ed", dark: "#7d9985" },
    dark: { light: "#dce4dc", dark: "#476654" },
  },
  terracotta: {
    light: { light: "#f7f0e7", dark: "#a97061" },
    dark: { light: "#ebdcd4", dark: "#6e4338" },
  },
  // Emerald's dark square was near-black (#123824, luminance 0.03). A black
  // piece on it measured 1.34:1 -- piece and square were effectively the same
  // colour. Every other palette sits between 2.1 and 5.6; these values give
  // 3.37:1, in line with the other dark-mode boards.
  //
  // Emerald is deliberately always-dark: app/globals.css applies one block to
  // both modes, so the board keeps a single pair too. Those --board-light /
  // --board-dark custom properties must be kept in step with this entry; the
  // CSS drives the bezel and coordinate rail, this drives the squares.
  emerald: {
    light: { light: "#cbe9d6", dark: "#357a55" },
    dark: { light: "#cbe9d6", dark: "#357a55" },
  },
};

export const THEME_NAMES: { id: ThemePalette; label: string; icon: string; desc: string }[] = [
  { id: "periwinkle", label: "Periwinkle", icon: "🪨", desc: "Mist Slate (Default)" },
  { id: "emerald", label: "Emerald Glow", icon: "✨", desc: "Gen Z Glitter Arena" },
  { id: "sage", label: "Sage", icon: "🌿", desc: "Nordic Atelier" },
  { id: "terracotta", label: "Terracotta", icon: "🏺", desc: "Kyoto Sand" },
];
