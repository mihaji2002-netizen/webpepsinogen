/**
 * Central type definitions for the entire dossier.
 * The whole app is data-driven: nothing about lessons/exams is hardcoded in UI.
 */

/** Difficulty is used both for filtering and for the colored risk badge. */
export type Difficulty = 'آسان' | 'متوسط' | 'سخت' | 'کشنده';

/** Kind of question — used by the "question type" filter. */
export type QuestionType = 'تشریحی' | 'تستی' | 'جای‌خالی' | 'صحیح-غلط' | 'ترکیبی';

/**
 * One line of the "بارم‌شکن" (grading rubric). Each line is a scorable part of
 * the answer; the sum of `score` across items should equal the question's total
 * `score`. Students tick the parts they got right to self-grade.
 */
export interface RubricItem {
  point: string; // بخشی از پاسخ که نمره دارد
  score: number; // بارمِ همان بخش
}

/** A single classified question record (matches the JSON schema on disk). */
export interface Question {
  id: string;
  chapter: string; // فصل
  type: QuestionType;
  question: string; // متن کامل و رسمی سؤال — NEVER summarized
  answer: string; // پاسخ رسمی
  analysis: string; // تحلیل و توضیح کامل
  designer_trap: string; // نیت و تله‌ی طراح
  common_mistake: string; // اشتباه رایج بچه‌ها
  night_tip: string; // نکته‌ی شب امتحان
  book_page: string; // صفحه‌ی کتاب
  score: number; // بارم
  difficulty: Difficulty;
  repeat_probability: number; // احتمال تکرار (0-100)
  keywords?: string[]; // کلیدواژه‌ها برای جست‌وجو
  rubric?: RubricItem[]; // بارم‌شکن — تفکیک نمره برای خودارزیابی
}

/** A single exam file (e.g. biology/khordad1404.json). */
export interface ExamFile {
  examId: string;
  lessonId: string;
  title: string;
  questions: Question[];
}

/** One exam entry inside a lesson (points to a data file, or "coming soon"). */
export interface ExamRef {
  id: string;
  title: string; // مثلاً «خرداد ۱۴۰۴»
  period: 'khordad' | 'shahrivar' | 'dey' | 'future';
  file?: string; // relative path under /data — absent means "coming soon"
  questionCount?: number;
  available: boolean;
}

/** Academic tracks a lesson can belong to (drives the home grouping). */
export type Track = 'عمومی' | 'ریاضی' | 'تجربی';

/** Lesson metadata used to render the home grid and lesson pages. */
export interface Lesson {
  id: string;
  name: string; // نام درس
  icon: string; // emoji/glyph rendered in the card
  accent: 'red' | 'gold' | 'blue' | 'green' | 'violet' | 'cyan' | 'orange' | 'teal';
  tracks: Track[]; // رشته‌هایی که این درس در آن‌ها ارائه می‌شود
  tagline: string; // یک جمله‌ی کوتاه به لحن مهدی حاجی
  image: string; // background image url (unsplash / gradient fallback)
  analyzedExams: number;
  analyzedQuestions: number;
  exams: ExamRef[];
}

/** The top-level manifest that drives everything. */
export interface Manifest {
  lessons: Lesson[];
}
