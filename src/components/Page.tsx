import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/** Consistent cinematic enter/exit transition for every routed page. */
export default function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6"
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
