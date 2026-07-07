import { useEffect } from 'react';

/**
 * A single fixed radial glow that follows the cursor across the whole app,
 * plus it publishes --mouse-x / --mouse-y so individual cards can react too.
 * Disabled on touch devices (no hover) to save battery.
 */
export default function MouseGlow() {
  useEffect(() => {
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;

    const root = document.documentElement;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty('--mouse-x', `${e.clientX}px`);
        root.style.setProperty('--mouse-y', `${e.clientY}px`);
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden md:block"
      style={{
        background:
          'radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), rgba(76,141,255,0.08), transparent 60%)',
        transition: 'background 0.2s ease-out',
      }}
    />
  );
}
