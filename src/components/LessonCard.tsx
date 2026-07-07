import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Lesson } from '../lib/types';
import { getAccent } from '../lib/accents';
import { Metric, Stamp } from './Primitives';

/**
 * A large premium lesson card:
 *  - vivid accent gradient with a background photo (graceful fallback)
 *  - a colored top glow + soft glowing border for a cinematic feel
 *  - subtle 3D tilt + spotlight that follows the cursor
 *  - shows analyzed exam / question counts, or a "coming soon" state
 */
export default function LessonCard({ lesson, index }: { lesson: Lesson; index: number }) {
  const accent = getAccent(lesson.accent);
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const [imgOk, setImgOk] = useState(true);
  const comingSoon = lesson.analyzedExams === 0;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    // Small, tasteful tilt — never gimmicky.
    setTilt({ ry: (px - 0.5) * 10, rx: (0.5 - py) * 10, gx: px * 100, gy: py * 100 });
  };

  const reset = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });

  return (
    <div
      className="animate-fade-up"
      style={{ perspective: 1000, animationDelay: `${index * 70}ms` }}
    >
      <Link
        ref={ref}
        to={`/lesson/${lesson.id}`}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className="glass group relative block h-64 overflow-hidden rounded-3xl sm:h-72"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
          boxShadow: `0 30px 80px -40px ${accent.glow}`,
        }}
      >
        {/* Vivid accent gradient base */}
        <div className="absolute inset-0" style={{ background: accent.gradient }} />

        {/* Background image (multiply-blended so it tints with the accent) */}
        {imgOk && (
          <img
            src={lesson.image}
            alt=""
            loading="lazy"
            onError={() => setImgOk(false)}
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay transition-all duration-700 group-hover:scale-110 group-hover:opacity-45"
          />
        )}

        {/* Cursor spotlight */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(320px circle at ${tilt.gx}% ${tilt.gy}%, ${accent.soft}, transparent 60%)`,
          }}
        />

        {/* Top colored glow bar */}
        <div
          className="absolute inset-x-0 top-0 h-24 opacity-70"
          style={{ background: `linear-gradient(to bottom, ${accent.soft}, transparent)` }}
        />
        {/* Bottom scrim for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/55 to-transparent" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl text-3xl backdrop-blur-md transition-transform duration-500 group-hover:scale-110"
              style={{
                background: accent.soft,
                boxShadow: `inset 0 0 0 1px ${accent.ring}, 0 8px 24px -8px ${accent.glow}`,
              }}
            >
              {lesson.icon}
            </span>
            <Stamp color={accent.bright}>
              {comingSoon ? 'به‌زودی' : `FILE · ${lesson.id.toUpperCase()}`}
            </Stamp>
          </div>

          <div>
            <h3 className="mb-1 text-2xl font-extrabold text-white drop-shadow">{lesson.name}</h3>
            <p className="mb-4 line-clamp-2 max-w-[92%] text-sm leading-relaxed text-slate-200/90">
              {lesson.tagline}
            </p>
            <div className="flex items-center gap-6 border-t border-white/10 pt-3">
              {comingSoon ? (
                <span className="text-sm font-semibold text-slate-300">
                  🔒 در حال آماده‌سازی
                </span>
              ) : (
                <>
                  <Metric value={lesson.analyzedExams} label="امتحان تحلیل‌شده" />
                  <Metric value={lesson.analyzedQuestions} label="سؤال بررسی‌شده" />
                </>
              )}
              <span
                className="ms-auto inline-flex items-center gap-1 text-sm font-bold transition-transform duration-300 group-hover:-translate-x-1"
                style={{ color: accent.bright }}
              >
                {comingSoon ? 'مشاهده' : 'ورود'}
                <span>←</span>
              </span>
            </div>
          </div>
        </div>

        {/* Soft glowing border on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1.5px ${accent.ring}` }}
        />
      </Link>
    </div>
  );
}
