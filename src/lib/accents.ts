import type { Difficulty } from './types';

/**
 * Accent theming lives here so lessons stay fully data-driven:
 * the manifest only stores an accent *key*, and the UI resolves it to colors.
 * (Tailwind can't compile fully-dynamic class names, so we expose raw values.)
 *
 * Each accent ships a two-tone gradient + glow so cards feel vivid and premium
 * rather than flat/muddy.
 */
export interface AccentTheme {
  base: string; // solid accent color
  bright: string; // lighter tint used for text/icons on dark glass
  soft: string; // translucent fill
  glow: string; // box-shadow glow color
  gradient: string; // decorative gradient for card backdrops
  ring: string; // border/ring color
}

function make(base: string, bright: string, second: string): AccentTheme {
  return {
    base,
    bright,
    soft: hexA(base, 0.16),
    glow: hexA(base, 0.55),
    // Vivid two-tone diagonal wash that reads clearly over the dark ink bg.
    gradient: `radial-gradient(120% 120% at 0% 0%, ${hexA(base, 0.55)}, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${hexA(second, 0.4)}, transparent 60%)`,
    ring: hexA(bright, 0.6),
  };
}

/** Convert a #rrggbb hex + alpha (0-1) into an rgba() string. */
function hexA(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export const ACCENTS: Record<string, AccentTheme> = {
  red: make('#ff2d55', '#ff7a94', '#7a1030'),
  gold: make('#ffb020', '#ffd479', '#7a4d00'),
  blue: make('#3d7bff', '#8fb4ff', '#0b2a7a'),
  green: make('#20d17a', '#7ff0b6', '#0a5a34'),
  violet: make('#9d5cff', '#c9a6ff', '#3d1585'),
  cyan: make('#1fd6d6', '#88f2f2', '#0a6a6a'),
  orange: make('#ff7a2d', '#ffb587', '#7a3010'),
  teal: make('#18c0a8', '#7ff0e0', '#0a5a50'),
};

export function getAccent(key: string): AccentTheme {
  return ACCENTS[key] ?? ACCENTS.blue;
}

/** Color coding for difficulty badges (also used by the exam filters). */
export const DIFFICULTY_STYLE: Record<Difficulty, { color: string; bg: string }> = {
  آسان: { color: '#38e08a', bg: 'rgba(56,224,138,0.16)' },
  متوسط: { color: '#ffc94d', bg: 'rgba(255,201,77,0.16)' },
  سخت: { color: '#ff934d', bg: 'rgba(255,147,77,0.18)' },
  کشنده: { color: '#ff4d6a', bg: 'rgba(255,77,106,0.18)' },
};
