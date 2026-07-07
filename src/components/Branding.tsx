/**
 * Persistent, deliberately-subtle brand furniture:
 *  - bottom-left: PEPSINO LAB logo mark
 *  - bottom-right: "Mehdi Haji" handwritten-style signature + small red heart
 * Kept small and non-intrusive per the brand rules.
 */
export default function Branding() {
  return (
    <>
      {/* Bottom-left — Pepsino Lab logo */}
      <div className="pointer-events-none fixed bottom-3 right-3 z-40 select-none sm:bottom-4 sm:right-4">
        <div className="glass pointer-events-auto flex items-center gap-2 rounded-full px-3 py-1.5">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-red/90 text-[11px] font-black text-white shadow-glow-red">
            P
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-300">
            Pepsino&nbsp;Lab
          </span>
        </div>
      </div>

      {/* Bottom-right — Mehdi Haji signature */}
      <div className="pointer-events-none fixed bottom-3 left-3 z-40 select-none sm:bottom-4 sm:left-4">
        <div className="flex items-end gap-1.5">
          <span className="signature text-lg leading-none text-slate-200/90 sm:text-xl">
            Mehdi Haji
          </span>
          <span className="mb-0.5 text-accent-red" aria-label="love">
            ❤
          </span>
        </div>
      </div>
    </>
  );
}
