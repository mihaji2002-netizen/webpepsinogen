import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '../lib/types';
import type { AccentTheme } from '../lib/accents';
import { DifficultyBadge, GlowButton, Stamp } from './Primitives';
import { toFa } from '../lib/format';

/** Labeled classified section block used for each analysis part. */
function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: string;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
      style={{ borderInlineStartWidth: 3, borderInlineStartColor: color }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h4 className="text-sm font-bold tracking-wide" style={{ color }}>
          {title}
        </h4>
      </div>
      <p className="whitespace-pre-line text-[15px] leading-loose text-slate-200">{children}</p>
    </div>
  );
}

/** A compact metadata chip (chapter / book page / score …). */
function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] px-3 py-2 text-center">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

/**
 * The full "top secret dossier" for a single question, presented as a cinematic
 * modal. The answer & analysis stay sealed behind a "Reveal Answer" action so
 * students think first; their notes persist locally per question.
 */
export default function QuestionModal({
  question,
  accent,
  onClose,
}: {
  question: Question | null;
  accent: AccentTheme;
  onClose: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [notes, setNotes] = useState('');

  const storageKey = question ? `dossier:notes:${question.id}` : '';

  // Reset reveal state + load saved notes whenever a new question opens.
  useEffect(() => {
    if (!question) return;
    setRevealed(false);
    setNotes(localStorage.getItem(`dossier:notes:${question.id}`) ?? '');
  }, [question]);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!question) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [question, onClose]);

  const saveNotes = (v: string) => {
    setNotes(v);
    if (storageKey) localStorage.setItem(storageKey, v);
  };

  return (
    <AnimatePresence>
      {question && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="fixed inset-0 bg-ink-900/80 backdrop-blur-md" />

          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="glass relative my-4 w-full max-w-3xl rounded-3xl p-5 sm:p-7"
            initial={{ opacity: 0, scale: 0.94, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: 16, filter: 'blur(8px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ boxShadow: `0 40px 120px -40px ${accent.glow}` }}
          >
            <div className="scanline opacity-30" />

            {/* Header */}
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Stamp color={accent.base}>TOP SECRET</Stamp>
                <Stamp color="#8a94a6">{question.chapter}</Stamp>
                <DifficultyBadge level={question.difficulty} />
              </div>
              <button
                onClick={onClose}
                className="glass glass-hover grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-300"
                aria-label="بستن"
              >
                ✕
              </button>
            </div>

            {/* Metadata grid */}
            <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
              <MetaChip label="فصل" value={question.chapter.replace(/^فصل\s*/, 'فصل ')} />
              <MetaChip label="صفحه‌ی کتاب" value={question.book_page} />
              <MetaChip label="بارم" value={toFa(question.score)} />
              <MetaChip label="نوع سؤال" value={question.type} />
              <MetaChip label="احتمال تکرار" value={`${toFa(question.repeat_probability)}٪`} />
            </div>

            {/* FULL official question — never summarized */}
            <Section icon="📄" title="متن کامل و رسمی سؤال" color="#e2e8f0">
              {question.question}
            </Section>

            {/* Student thinking area */}
            <div className="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">✏️</span>
                <h4 className="text-sm font-bold text-slate-300">
                  اول خودت فکر کن — اینجا بنویس
                </h4>
              </div>
              <textarea
                value={notes}
                onChange={(e) => saveNotes(e.target.value)}
                placeholder="قبل از دیدن جواب، برداشت و راه‌حل خودتو اینجا بنویس. یادداشتت ذخیره می‌مونه."
                rows={3}
                className="w-full resize-y rounded-xl bg-black/30 p-3 text-sm leading-relaxed text-slate-100 outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Reveal / sealed analysis */}
            <div className="mt-5">
              {!revealed ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-black/20 py-8 text-center">
                  <p className="max-w-sm text-sm text-slate-400">
                    جواب و تحلیل کامل مُهر «محرمانه» خورده. اول خودت درگیرش شو،
                    بعد رمزگشایی کن.
                  </p>
                  <GlowButton onClick={() => setRevealed(true)} color={accent.base}>
                    🔓 رمزگشایی جواب و تحلیل
                  </GlowButton>
                </div>
              ) : (
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Section icon="✅" title="پاسخ رسمی" color={accent.base}>
                    {question.answer}
                  </Section>
                  <Section icon="🔎" title="تحلیل و توضیح کامل" color="#4c8dff">
                    {question.analysis}
                  </Section>
                  <Section icon="🎯" title="نیّت و تله‌ی طراح" color="#e7b64b">
                    {question.designer_trap}
                  </Section>
                  <Section icon="⚠️" title="اشتباه رایج بچه‌ها" color="#ff8a3b">
                    {question.common_mistake}
                  </Section>
                  <Section icon="🌙" title="نکته‌ی شب امتحان" color="#a875ff">
                    {question.night_tip}
                  </Section>

                  {question.keywords && question.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {question.keywords.map((k) => (
                        <span
                          key={k}
                          className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400"
                        >
                          #{k}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
