import { Link } from 'react-router-dom';
import type { ExamRef } from '../lib/types';
import type { AccentTheme } from '../lib/accents';
import { Stamp } from './Primitives';

/** Persian labels + stamp text per exam period. */
const PERIOD_META: Record<ExamRef['period'], { hint: string; stamp: string }> = {
  khordad: { hint: 'نوبت پایانی — خرداد', stamp: 'CLASSIFIED' },
  shahrivar: { hint: 'نوبت جبرانی — شهریور', stamp: 'CLASSIFIED' },
  dey: { hint: 'نوبت اول — دی', stamp: 'CLASSIFIED' },
  future: { hint: 'به‌زودی رمزگشایی می‌شود', stamp: 'SEALED' },
};

/**
 * A single exam presented as a classified manila folder. Available folders link
 * into the question list; sealed (future) folders are shown locked.
 */
export default function ExamFolder({
  lessonId,
  exam,
  accent,
  index,
}: {
  lessonId: string;
  exam: ExamRef;
  accent: AccentTheme;
  index: number;
}) {
  const meta = PERIOD_META[exam.period];
  const locked = !exam.available;

  const inner = (
    <>
      {/* folder tab */}
      <span
        className="absolute -top-3 right-6 h-6 w-24 rounded-t-lg"
        style={{ background: locked ? 'rgba(255,255,255,0.06)' : accent.soft }}
      />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="text-3xl">{locked ? '🔒' : '🗂️'}</span>
          <Stamp color={locked ? '#8a94a6' : accent.base}>{meta.stamp}</Stamp>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{exam.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{meta.hint}</p>
          {!locked && (
            <span
              className="mt-4 inline-flex items-center gap-1 text-sm font-bold transition-transform duration-300 group-hover:-translate-x-1"
              style={{ color: accent.base }}
            >
              بازکردن پرونده <span>←</span>
            </span>
          )}
          {locked && (
            <span className="mt-4 inline-block font-mono text-xs uppercase tracking-widest text-slate-500">
              دسترسی محدود
            </span>
          )}
        </div>
      </div>
    </>
  );

  const shell =
    'group relative block h-48 overflow-hidden rounded-2xl glass';

  return (
    <div className="animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
      {locked ? (
        <div className={`${shell} cursor-not-allowed opacity-70`}>{inner}</div>
      ) : (
        <Link
          to={`/lesson/${lessonId}/${exam.id}`}
          className={`${shell} glass-hover`}
          style={{ boxShadow: `0 24px 60px -40px ${accent.glow}` }}
        >
          <div className="scanline opacity-40" />
          {inner}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ boxShadow: `inset 0 0 0 1px ${accent.ring}` }}
          />
        </Link>
      )}
    </div>
  );
}
