import { motion } from 'framer-motion';

/**
 * "Decrypting file" loader — replaces any ugly spinner with an on-brand,
 * classified-terminal vibe. Used as a Suspense/async fallback.
 */
export default function Loader({ label = 'در حال رمزگشایی پرونده…' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
      <div className="relative h-16 w-16">
        <motion.span
          className="absolute inset-0 rounded-2xl border border-accent-blue/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.span
          className="absolute inset-2 rounded-xl border border-accent-red/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <span className="absolute inset-0 grid place-items-center text-xl">🗂️</span>
      </div>
      <div className="space-y-1">
        <p className="font-mono text-sm tracking-[0.2em] text-accent-blue">DECRYPTING…</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </div>
  );
}
