/** Instant search input with a classified "query terminal" look. */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'جست‌وجو در متن سؤال، تحلیل، فصل و کلیدواژه…',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3 focus-within:border-accent-blue/40">
      <span className="text-slate-400">🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        type="search"
        autoComplete="off"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="shrink-0 rounded-lg px-2 py-1 text-xs text-slate-400 transition-colors hover:text-white"
          aria-label="پاک‌کردن جست‌وجو"
        >
          ✕
        </button>
      )}
    </div>
  );
}
