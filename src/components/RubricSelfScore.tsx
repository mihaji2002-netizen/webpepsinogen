import { useEffect, useMemo, useState } from 'react';
import type { RubricItem } from '../lib/types';
import { toFa } from '../lib/format';

/**
 * "بارم‌شکن" — interactive self-grading.
 *
 * Shows every scorable part of the answer with its points. The student ticks
 * what they actually wrote, and we live-compute their score out of the total so
 * they know exactly how well they answered. Selections persist per question.
 */
export default function RubricSelfScore({
  rubric,
  total,
  accent,
  storageKey,
}: {
  rubric: RubricItem[];
  total: number;
  accent: string;
  storageKey: string;
}) {
  const [checked, setChecked] = useState<boolean[]>(() => rubric.map(() => false));

  // Restore any previous self-assessment for this question.
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const arr = JSON.parse(raw) as boolean[];
        if (Array.isArray(arr) && arr.length === rubric.length) setChecked(arr);
        else setChecked(rubric.map(() => false));
      } catch {
        setChecked(rubric.map(() => false));
      }
    } else {
      setChecked(rubric.map(() => false));
    }
  }, [storageKey, rubric.length]);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = prev.map((v, idx) => (idx === i ? !v : v));
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  // Prefer the explicit total; fall back to the sum of rubric points.
  const maxScore = total || rubric.reduce((s, r) => s + r.score, 0);
  const earned = useMemo(
    () => rubric.reduce((s, r, i) => (checked[i] ? s + r.score : s), 0),
    [rubric, checked],
  );
  const pct = maxScore > 0 ? Math.round((earned / maxScore) * 100) : 0;

  const verdict =
    pct >= 100
      ? 'کامل گرفتی! این سؤال دیگه مالِ خودته. ✅'
      : pct >= 60
        ? 'خوبه، ولی چند بخش رو جا انداختی — برگرد دقیق همونا رو بگیر.'
        : pct > 0
          ? 'هنوز جا داری. بخش‌های تیک‌نخورده رو دوباره بخون.'
          : 'اشکالی نداره؛ با پاسخ رسمی یه دور دیگه مرورش کن.';

  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
      style={{ borderInlineStartWidth: 3, borderInlineStartColor: accent }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-lg">🧮</span>
        <h4 className="text-sm font-bold tracking-wide" style={{ color: accent }}>
          بارم‌شکن — خودت رو نمره بده
        </h4>
      </div>
      <p className="mb-3 text-xs text-slate-400">
        هر بخشی که تو جوابت آوردی رو تیک بزن تا ببینی از بارمِ کل چند گرفتی.
      </p>

      <ul className="space-y-2">
        {rubric.map((item, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-black/20 p-3 transition-colors hover:bg-black/30">
              <input
                type="checkbox"
                checked={checked[i] ?? false}
                onChange={() => toggle(i)}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-current"
                style={{ accentColor: accent }}
              />
              <span className="flex-1 text-[14px] leading-relaxed text-slate-200">
                {item.point}
              </span>
              <span
                className="shrink-0 rounded-md px-2 py-0.5 text-xs font-bold"
                style={{ color: accent, background: `${accent}1a` }}
              >
                {toFa(item.score)}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {/* Live score */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="text-slate-400">نمره‌ی تو</span>
          <span className="font-bold text-white tabular-nums">
            {toFa(earned)} <span className="text-slate-500">از</span> {toFa(maxScore)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: accent, boxShadow: `0 0 12px ${accent}` }}
          />
        </div>
        <p className="mt-2 text-sm font-medium" style={{ color: accent }}>
          {verdict}
        </p>
      </div>
    </div>
  );
}
