import type { ExamFile, Manifest } from './types';

/**
 * Dynamic, lazy data layer.
 *
 * Nothing is bundled into the first paint: the manifest and each exam file are
 * fetched from /data on demand and cached in-memory so we never re-download.
 * This keeps the home page extremely fast and loads a lesson's questions only
 * when the user actually opens that lesson/exam.
 */

const BASE = `${import.meta.env.BASE_URL}data`;

let manifestCache: Manifest | null = null;
const examCache = new Map<string, ExamFile>();

/** Load (and memoize) the top-level manifest describing all lessons. */
export async function loadManifest(): Promise<Manifest> {
  if (manifestCache) return manifestCache;
  const res = await fetch(`${BASE}/manifest.json`);
  if (!res.ok) throw new Error('پرونده‌ی اصلی (manifest) پیدا نشد.');
  manifestCache = (await res.json()) as Manifest;
  return manifestCache;
}

/** Load a single exam file lazily, e.g. "biology/khordad1404.json". */
export async function loadExam(file: string): Promise<ExamFile> {
  const cached = examCache.get(file);
  if (cached) return cached;
  const res = await fetch(`${BASE}/${file}`);
  if (!res.ok) throw new Error('این پرونده هنوز رمزگشایی نشده است.');
  const data = (await res.json()) as ExamFile;
  examCache.set(file, data);
  return data;
}

/** Convenience: find a lesson from the (cached) manifest. */
export async function getLesson(lessonId: string) {
  const manifest = await loadManifest();
  return manifest.lessons.find((l) => l.id === lessonId) ?? null;
}
