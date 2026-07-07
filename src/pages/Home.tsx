import { motion } from 'framer-motion';
import { loadManifest } from '../lib/dataLoader';
import { useAsync } from '../hooks/useAsync';
import { toFa } from '../lib/format';
import type { Lesson, Track } from '../lib/types';
import Page from '../components/Page';
import Loader from '../components/Loader';
import LessonCard from '../components/LessonCard';
import { Stamp } from '../components/Primitives';

/** Track sections rendered on the home page, in display order. */
const TRACK_SECTIONS: { track: Track; label: string; code: string; color: string }[] = [
  { track: 'عمومی', label: 'دروس عمومی', code: 'GENERAL', color: '#3d7bff' },
  { track: 'ریاضی', label: 'رشته ریاضی و فیزیک', code: 'MATH-PHYSICS', color: '#ff7a2d' },
  { track: 'تجربی', label: 'رشته علوم تجربی', code: 'SCIENCES', color: '#20d17a' },
];

/**
 * Home / briefing screen. Renders the lesson dossiers from the manifest,
 * grouped by academic track. Only the (tiny) manifest is fetched here —
 * lesson question data stays lazy.
 */
export default function Home() {
  const { data, loading, error } = useAsync(loadManifest, []);

  const totals = data?.lessons.reduce(
    (acc, l) => {
      acc.exams += l.analyzedExams;
      acc.questions += l.analyzedQuestions;
      return acc;
    },
    { exams: 0, questions: 0 },
  );

  return (
    <Page>
      {/* Hero briefing */}
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
        <div className="scanline opacity-40" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent-red/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-accent-blue/25 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-accent-gold/15 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Stamp color="#ff2d55">TOP SECRET</Stamp>
            <Stamp color="#ffb020">GRADE&nbsp;11 · FINAL</Stamp>
            <Stamp color="#3d7bff">PEPSINO&nbsp;LAB</Stamp>
          </div>

          <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">
            پرونده‌ی محرمانه‌ی <span className="text-gradient">امتحان نهایی</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            ببین، اینجا قرار نیست بهت انگیزه‌ی الکی بدیم. قراره سؤالای نهایی رو
            دونه‌دونه باز کنیم، ببینیم طراح دقیقاً دنبال چیه و کجا می‌خواد گیرت
            بندازه. هر درس یه پرونده‌ست؛ رشته‌تو پیدا کن و برو داخل.
          </p>

          {totals && (
            <div className="mt-6 flex flex-wrap gap-8">
              <HeroStat value={data!.lessons.length} label="درس" />
              <HeroStat value={totals.exams} label="امتحان تحلیل‌شده" />
              <HeroStat value={totals.questions} label="سؤال بررسی‌شده" />
            </div>
          )}
        </motion.div>
      </section>

      {loading && <Loader label="در حال بازکردن بایگانی درس‌ها…" />}
      {error && (
        <p className="rounded-2xl border border-accent-red/30 bg-accent-red/10 p-4 text-sm text-accent-red">
          {error}
        </p>
      )}

      {data &&
        TRACK_SECTIONS.map((section) => {
          const lessons = data.lessons.filter((l) => l.tracks.includes(section.track));
          if (lessons.length === 0) return null;
          return <TrackSection key={section.track} section={section} lessons={lessons} />;
        })}
    </Page>
  );
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-black text-white sm:text-3xl">{toFa(value)}</span>
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

function TrackSection({
  section,
  lessons,
}: {
  section: { label: string; code: string; color: string };
  lessons: Lesson[];
}) {
  return (
    <section className="mb-10">
      <div className="mb-5 flex items-center gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold text-white"
          style={{ background: `${section.color}22`, boxShadow: `inset 0 0 0 1px ${section.color}66` }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: section.color }} />
          {section.label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">
          {section.code}
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, i) => (
          <LessonCard key={lesson.id} lesson={lesson} index={i} />
        ))}
      </div>
    </section>
  );
}
