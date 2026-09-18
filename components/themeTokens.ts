
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
  emerald: {
    light: { light: "#dcfce7", dark: "#123824" },
    dark: { light: "#dcfce7", dark: "#123824" },
  },
};

export const THEME_NAMES: { id: ThemePalette; label: string; icon: string; desc: string }[] = [
  { id: "periwinkle", label: "Periwinkle", icon: "🪨", desc: "Mist Slate (Default)" },
  { id: "emerald", label: "Emerald Glow", icon: "✨", desc: "Gen Z Glitter Arena" },
  { id: "sage", label: "Sage", icon: "🌿", desc: "Nordic Atelier" },
  { id: "terracotta", label: "Terracotta", icon: "🏺", desc: "Kyoto Sand" },
];
