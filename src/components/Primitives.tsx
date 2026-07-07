import type { ReactNode } from 'react';
import type { Difficulty } from '../lib/types';
import { DIFFICULTY_STYLE } from '../lib/accents';
import { toFa } from '../lib/format';

/**
 * Small, reusable presentational primitives used throughout the dossier.
 * Keeping them here avoids repeating the "classified stamp" markup everywhere.
 */

/** A monospace classified stamp (e.g. TOP SECRET / CONFIDENTIAL). */
export function Stamp({
  children,
  color = '#ff3b47',
  className = '',
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`stamp ${className}`}
      style={{ color, borderColor: `${color}66`, background: `${color}1a` }}
    >
      {children}
    </span>
  );
}

/** Colored difficulty badge driven by the shared difficulty style map. */
export function DifficultyBadge({ level }: { level: Difficulty }) {
  const s = DIFFICULTY_STYLE[level];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
      {level}
    </span>
  );
}

/** A tiny labelled metric (value + caption) used on cards. */
export function Metric({
  value,
  label,
  fa = true,
}: {
  value: number | string;
  label: string;
  fa?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-lg font-bold text-white tabular-nums sm:text-xl">
        {fa ? toFa(value) : value}
      </span>
      <span className="text-[11px] text-slate-400">{label}</span>
    </div>
  );
}

/** Primary glowing action button. */
export function GlowButton({
  children,
  onClick,
  color = '#ff3b47',
  className = '',
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  color?: string;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-bold text-white transition-all duration-300 active:scale-[0.98] ${className}`}
      style={{
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: `0 10px 30px -10px ${color}`,
      }}
    >
      <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}
