import { toFa } from '../lib/format';

export interface FilterGroup {
  key: string;
  label: string;
  options: string[];
}

export type FilterState = Record<string, string>; // key -> selected value ('' = all)

/**
 * A row of pill-style filter groups (chapter / difficulty / question type…).
 * Fully generic: it renders whatever groups the exam page hands it, so adding a
 * new filter dimension later needs zero changes here.
 */
export default function FilterBar({
  groups,
  state,
  onChange,
  accent = '#4c8dff',
  resultCount,
}: {
  groups: FilterGroup[];
  state: FilterState;
  onChange: (key: string, value: string) => void;
  accent?: string;
  resultCount?: number;
}) {
  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.key} className="flex flex-wrap items-center gap-2">
          <span className="me-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {g.label}
          </span>
          <Pill
            active={!state[g.key]}
            onClick={() => onChange(g.key, '')}
            accent={accent}
          >
            همه
          </Pill>
          {g.options.map((opt) => (
            <Pill
              key={opt}
              active={state[g.key] === opt}
              onClick={() => onChange(g.key, opt)}
              accent={accent}
            >
              {opt}
            </Pill>
          ))}
        </div>
      ))}
      {typeof resultCount === 'number' && (
        <p className="font-mono text-xs text-slate-500">
          {toFa(resultCount)} پرونده مطابق فیلترها یافت شد
        </p>
      )}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300"
      style={
        active
          ? { color: '#fff', background: accent, borderColor: accent, boxShadow: `0 6px 18px -8px ${accent}` }
          : { color: '#cbd5e1', background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }
      }
    >
      {children}
    </button>
  );
}
