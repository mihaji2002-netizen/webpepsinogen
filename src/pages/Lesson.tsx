import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLesson } from '../lib/dataLoader';
import { useAsync } from '../hooks/useAsync';
import { getAccent } from '../lib/accents';
import { toFa } from '../lib/format';
import Page from '../components/Page';
import Loader from '../components/Loader';
import TopBar from '../components/TopBar';
import ExamFolder from '../components/ExamFolder';
import { Metric, Stamp } from '../components/Primitives';

/** Lesson dossier: lists this lesson's exams as classified folders. */
export default function Lesson() {
  const { lessonId = '' } = useParams();
  const { data: lesson, loading, error } = useAsync(() => getLesson(lessonId), [lessonId]);
  const accent = getAccent(lesson?.accent ?? 'blue');

  return (
    <>
      <TopBar crumbs={[{ label: lesson?.name ?? '...' }]} />
      <Page>
        {loading && <Loader />}
        {(error || (!loading && !lesson)) && (
          <p className="rounded-2xl border border-accent-red/30 bg-accent-red/10 p-4 text-sm text-accent-red">
            این درس در بایگانی پیدا نشد.
          </p>
        )}

        {lesson && (
          <>
            {/* Lesson header */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center"
            >
              <span
                className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl text-4xl"
                style={{ background: accent.soft, boxShadow: `inset 0 0 0 1px ${accent.ring}` }}
              >
                {lesson.icon}
              </span>
              <div className="flex-1">
                <div className="mb-2">
                  <Stamp color={accent.base}>DOSSIER · {lesson.id.toUpperCase()}</Stamp>
                </div>
                <h1 className="text-3xl font-black text-white sm:text-4xl">{lesson.name}</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                  {lesson.tagline}
                </p>
              </div>
              <div className="flex gap-6 border-t border-white/10 pt-4 sm:border-s sm:border-t-0 sm:ps-6 sm:pt-0">
                <Metric value={lesson.analyzedExams} label="امتحان" />
                <Metric value={lesson.analyzedQuestions} label="سؤال" />
              </div>
            </motion.section>

            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
                Exam&nbsp;Archive
              </span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-500">{toFa(lesson.exams.length)} پرونده</span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {lesson.exams.map((exam, i) => (
                <ExamFolder
                  key={exam.id}
                  lessonId={lesson.id}
                  exam={exam}
                  accent={accent}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </Page>
    </>
  );
}
