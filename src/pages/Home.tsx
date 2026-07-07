import { motion } from 'framer-motion';
import { loadManifest } from '../lib/dataLoader';
import { useAsync } from '../hooks/useAsync';
import { toFa } from '../lib/format';
import Page from '../components/Page';
import Loader from '../components/Loader';
import LessonCard from '../components/LessonCard';
import { Stamp } from '../components/Primitives';

/**
 * Home / briefing screen. Renders the six lesson dossiers from the manifest.
 * Only the (tiny) manifest is fetched here — lesson question data stays lazy.
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
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent-red/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-accent-blue/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Stamp color="#ff3b47">TOP SECRET</Stamp>
            <Stamp color="#e7b64b">GRADE&nbsp;11 · FINAL</Stamp>
            <Stamp color="#4c8dff">PEPSINO&nbsp;LAB</Stamp>
          </div>

          <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">
            پرونده‌ی محرمانه‌ی <span className="text-gradient">امتحان نهایی</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            ببین، اینجا قرار نیست بهت انگیزه‌ی الکی بدیم. قراره سؤالای نهایی رو
            دونه‌دونه باز کنیم، ببینیم طراح دقیقاً دنبال چیه و کجا می‌خواد گیرت
            بندازه. هر درس یه پرونده‌ست؛ انتخاب کن و برو داخل.
          </p>

          {totals && (
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">{toFa(data!.lessons.length)}</span>
                <span className="text-xs text-slate-400">درس</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">{toFa(totals.exams)}</span>
                <span className="text-xs text-slate-400">امتحان تحلیل‌شده</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">{toFa(totals.questions)}</span>
                <span className="text-xs text-slate-400">سؤال بررسی‌شده</span>
              </div>
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

      {data && (
        <>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
              Select&nbsp;File
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.lessons.map((lesson, i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} />
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
