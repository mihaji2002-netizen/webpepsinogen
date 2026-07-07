import type { Difficulty } from './types';

/**
 * Accent theming lives here so lessons stay fully data-driven:
 * the manifest only stores an accent *key*, and the UI resolves it to colors.
 * (Tailwind can't compile fully-dynamic class names, so we expose raw values.)
 */
export interface AccentTheme {
  base: string; // solid accent color
  soft: string; // translucent fill
  glow: string; // box-shadow glow color
  gradient: string; // decorative gradient for card backdrops
  ring: string; // border/ring color
}

export const ACCENTS: Record<string, AccentTheme> = {
  red: {
    base: '#ff3b47',
    soft: 'rgba(255,59,71,0.14)',
    glow: 'rgba(255,59,71,0.45)',
    gradient: 'linear-gradient(135deg, rgba(255,59,71,0.35), rgba(120,10,20,0.05))',
    ring: 'rgba(255,59,71,0.55)',
  },
  gold: {
    base: '#e7b64b',
    soft: 'rgba(231,182,75,0.14)',
    glow: 'rgba(231,182,75,0.45)',
    gradient: 'linear-gradient(135deg, rgba(231,182,75,0.32), rgba(90,60,10,0.05))',
    ring: 'rgba(231,182,75,0.55)',
  },
  blue: {
    base: '#4c8dff',
    soft: 'rgba(76,141,255,0.14)',
    glow: 'rgba(76,141,255,0.45)',
    gradient: 'linear-gradient(135deg, rgba(76,141,255,0.32), rgba(10,40,110,0.05))',
    ring: 'rgba(76,141,255,0.55)',
  },
  green: {
    base: '#37d67a',
    soft: 'rgba(55,214,122,0.14)',
    glow: 'rgba(55,214,122,0.42)',
    gradient: 'linear-gradient(135deg, rgba(55,214,122,0.3), rgba(10,80,45,0.05))',
    ring: 'rgba(55,214,122,0.5)',
  },
  violet: {
    base: '#a875ff',
    soft: 'rgba(168,117,255,0.14)',
    glow: 'rgba(168,117,255,0.42)',
    gradient: 'linear-gradient(135deg, rgba(168,117,255,0.32), rgba(60,20,110,0.05))',
    ring: 'rgba(168,117,255,0.5)',
  },
  cyan: {
    base: '#3fd8d8',
    soft: 'rgba(63,216,216,0.14)',
    glow: 'rgba(63,216,216,0.42)',
    gradient: 'linear-gradient(135deg, rgba(63,216,216,0.3), rgba(10,80,80,0.05))',
    ring: 'rgba(63,216,216,0.5)',
  },
};

export function getAccent(key: string): AccentTheme {
  return ACCENTS[key] ?? ACCENTS.blue;
}

/** Color coding for difficulty badges (also used by the exam filters). */
export const DIFFICULTY_STYLE: Record<Difficulty, { color: string; bg: string }> = {
  آسان: { color: '#37d67a', bg: 'rgba(55,214,122,0.14)' },
  متوسط: { color: '#e7b64b', bg: 'rgba(231,182,75,0.14)' },
  سخت: { color: '#ff8a3b', bg: 'rgba(255,138,59,0.16)' },
  کشنده: { color: '#ff3b47', bg: 'rgba(255,59,71,0.16)' },
};
