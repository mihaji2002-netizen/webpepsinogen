import type { Question } from '../lib/types';
import type { AccentTheme } from '../lib/accents';
import { DifficultyBadge, Stamp } from './Primitives';
import { toFa } from '../lib/format';

/**
 * A question row in the exam list.
 *
 * IMPORTANT: we intentionally render the FULL official question text here (never
 * truncated, never replaced with "سؤال ۲"). Clicking opens the full dossier with
 * the answer + analysis sections.
 */
export default function QuestionCard({
  question,
  index,
  accent,
  onOpen,
}: {
  question: Question;
  index: number;
  accent: AccentTheme;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="glass glass-hover group block w-full rounded-2xl p-5 text-right animate-fade-up"
      style={{
        boxShadow: `0 20px 50px -40px ${accent.glow}`,
        animationDelay: `${Math.min(index * 40, 300)}ms`,
      }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="grid h-8 w-8 place-items-center rounded-lg font-mono text-sm font-bold"
          style={{ background: accent.soft, color: accent.base }}
        >
          {toFa(index + 1)}
        </span>
        <Stamp color={accent.base}>{question.chapter}</Stamp>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300">
          {question.type}
        </span>
        <DifficultyBadge level={question.difficulty} />
        <span className="ms-auto flex items-center gap-3 text-xs text-slate-400">
          <span title="بارم">بارم {toFa(question.score)}</span>
          <span title="احتمال تکرار" style={{ color: accent.base }}>
            ↻ {toFa(question.repeat_probability)}٪
          </span>
        </span>
      </div>

      {/* FULL question text — never summarized */}
      <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-100">
        {question.question}
      </p>

      <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: accent.base }}>
        بازکردن پرونده‌ی کامل
        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
      </div>
    </button>
  );
}
