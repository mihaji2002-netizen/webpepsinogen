import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLesson, loadExam } from '../lib/dataLoader';
import { useAsync } from '../hooks/useAsync';
import { getAccent } from '../lib/accents';
import { normalize, toFa } from '../lib/format';
import type { Question } from '../lib/types';
import Page from '../components/Page';
import Loader from '../components/Loader';
import TopBar from '../components/TopBar';
import SearchBar from '../components/SearchBar';
import FilterBar, { type FilterGroup, type FilterState } from '../components/FilterBar';
import QuestionCard from '../components/QuestionCard';
import QuestionModal from '../components/QuestionModal';
import { Stamp } from '../components/Primitives';

/**
 * Exam page: lazily loads a single exam file, then offers instant search and
 * chapter/difficulty/type filters over its questions. Opening a question shows
 * the full dossier modal (deep-linkable via /q/:questionId).
 */
export default function Exam() {
  const { lessonId = '', examId = '', questionId } = useParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});

  // Resolve which data file this exam maps to (from the manifest).
  const lessonState = useAsync(() => getLesson(lessonId), [lessonId]);
  const lesson = lessonState.data;
  const examRef = lesson?.exams.find((e) => e.id === examId);
  const accent = getAccent(lesson?.accent ?? 'blue');

  // Lazily fetch the exam's questions only once we know the file path.
  const examState = useAsync(
    () => (examRef?.file ? loadExam(examRef.file) : Promise.reject(new Error('پرونده در دسترس نیست.'))),
    [examRef?.file],
  );
  const exam = examState.data;

  // Build filter groups dynamically from the loaded questions.
  const groups: FilterGroup[] = useMemo(() => {
    if (!exam) return [];
    const uniq = (arr: string[]) => Array.from(new Set(arr));
    return [
      { key: 'chapter', label: 'فصل', options: uniq(exam.questions.map((q) => q.chapter)) },
      { key: 'difficulty', label: 'سختی', options: uniq(exam.questions.map((q) => q.difficulty)) },
      { key: 'type', label: 'نوع سؤال', options: uniq(exam.questions.map((q) => q.type)) },
    ];
  }, [exam]);

  // Apply instant search + active filters.
  const results: Question[] = useMemo(() => {
    if (!exam) return [];
    const nq = normalize(query);
    return exam.questions.filter((q) => {
      if (filters.chapter && q.chapter !== filters.chapter) return false;
      if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
      if (filters.type && q.type !== filters.type) return false;
      if (!nq) return true;
      const haystack = normalize(
        [q.question, q.analysis, q.chapter, q.answer, ...(q.keywords ?? [])].join(' '),
      );
      return haystack.includes(nq);
    });
  }, [exam, query, filters]);

  const activeQuestion = exam?.questions.find((q) => q.id === questionId) ?? null;
  const openQuestion = (q: Question) => navigate(`/lesson/${lessonId}/${examId}/q/${q.id}`);
  const closeQuestion = () => navigate(`/lesson/${lessonId}/${examId}`);

  const loading = lessonState.loading || examState.loading;
  const err = lessonState.error || examState.error;

  return (
    <>
      <TopBar
        crumbs={[
          { label: lesson?.name ?? '...', to: `/lesson/${lessonId}` },
          { label: examRef?.title ?? '...' },
        ]}
      />
      <Page>
        {loading && <Loader />}
        {err && !loading && (
          <p className="rounded-2xl border border-accent-red/30 bg-accent-red/10 p-4 text-sm text-accent-red">
            {err}
          </p>
        )}

        {exam && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Stamp color={accent.base}>CASE FILE</Stamp>
                <Stamp color="#8a94a6">{toFa(exam.questions.length)} سؤال</Stamp>
              </div>
              <h1 className="text-2xl font-black text-white sm:text-3xl">{exam.title}</h1>
            </motion.div>

            {/* Search + filters toolbar */}
            <div className="mb-6 space-y-4">
              <SearchBar value={query} onChange={setQuery} />
              <FilterBar
                groups={groups}
                state={filters}
                onChange={(k, v) => setFilters((s) => ({ ...s, [k]: v }))}
                accent={accent.base}
                resultCount={results.length}
              />
            </div>

            {/* Question list — full text, never summarized */}
            {results.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center text-slate-400">
                <p className="text-lg">🕵️ چیزی با این فیلترها پیدا نشد.</p>
                <p className="mt-1 text-sm">جست‌وجو یا فیلترها رو یه‌کم شل‌تر کن.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {results.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    index={i}
                    accent={accent}
                    onOpen={() => openQuestion(q)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </Page>

      <QuestionModal question={activeQuestion} accent={accent} onClose={closeQuestion} />
    </>
  );
}
