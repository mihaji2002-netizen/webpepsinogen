import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Breadcrumb segment. `to` omitted means the current (non-clickable) page. */
export interface Crumb {
  label: string;
  to?: string;
}

/**
 * Sticky glass top bar: brand title, a back button, and a breadcrumb trail so
 * users always know where they are inside the dossier.
 */
export default function TopBar({
  crumbs = [],
  right,
}: {
  crumbs?: Crumb[];
  right?: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-900/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="glass glass-hover grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-300"
          aria-label="بازگشت"
        >
          {/* RTL back arrow points right */}
          <span className="text-lg leading-none">→</span>
        </button>

        <Link to="/" className="group flex shrink-0 items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent-red/90 text-sm font-black text-white shadow-glow-red transition-transform group-hover:scale-105">
            ▲
          </span>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-bold tracking-wide text-white">پرونده محرمانه نهایی</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Top Secret Dossier
            </p>
          </div>
        </Link>

        {crumbs.length > 0 && (
          <nav className="ms-1 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto text-sm">
            {crumbs.map((c, i) => (
              <div key={i} className="flex shrink-0 items-center gap-1.5">
                <span className="text-slate-600">/</span>
                {c.to ? (
                  <Link
                    to={c.to}
                    className="whitespace-nowrap text-slate-400 transition-colors hover:text-white"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="whitespace-nowrap font-semibold text-white">{c.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        <motion.div
          className="ms-auto flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {right}
        </motion.div>
      </div>
    </header>
  );
}
