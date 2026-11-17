import type { Theme } from "@/lib/theme";

export interface ScenePalette {
  /** Left-side frames and traces. */
  accent: string;
  /** Group tile edges and pins, hovered or related teal tiles. */
  accentStrong: string;
  /** Right-side frames and traces (a subtle amber). */
  warm: string;
  /** Hovered or related amber tiles. */
  warmStrong: string;
  /** Selected technology and an open group's glyph. */
  highlight: string;
  /** Default text and icon color. */
  text: string;
  /** Tile body and backing. */
  body: string;
}

export const PALETTES: Record<Theme, ScenePalette> = {
  dark: {
    accent: "#6faeaa",
    accentStrong: "#83c9cc",
    warm: "#c9a24a",
    warmStrong: "#f0c76a",
    highlight: "#ffffff",
    text: "#e8eeee",
    body: "#171e20",
  },
  light: {
    accent: "#598e8b",
    accentStrong: "#3f7478",
    warm: "#a8761f",
    warmStrong: "#8a5c10",
    highlight: "#101416",
    text: "#1b2526",
    body: "#ffffff",
  },
};