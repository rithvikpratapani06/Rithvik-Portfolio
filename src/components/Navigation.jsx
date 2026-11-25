/* Scroll progress bar, desktop floating menu, and phone top/bottom bars. */
import { useEffect, useRef } from "react";
import { CONFIG } from "../config";
import { PROFILE, SECTIONS } from "../data/portfolio";
import { Icon } from "../lib/icons";

export default function Navigation({ active, onNavigate, onOpenPalette, onOpenResume, isMac }) {
  const progressRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const mobileItems = CONFIG.mobileNav.map((id) => SECTIONS.find((s) => s.id === id)).filter(Boolean);
  const half = Math.ceil(mobileItems.length / 2);
  const mobileSlots = [...mobileItems.slice(0, half), { id: "__search" }, ...mobileItems.slice(half)];

  return (
    <>
      {/* Scroll progress */}
      <div aria-hidden className="fixed inset-x-0 top-0 h-0.5" style={{ zIndex: 45 }}>
        <div ref={progressRef} className="progress h-full w-full" style={{ transform: "scaleX(0)" }} />
      </div>

      {/* Desktop floating menu */}
      <nav aria-label="Primary" className="nav-glass fixed left-1/2 top-4 hidden -translate-x-1/2 transform items-center gap-1 rounded-full p-1.5 shadow-2xl md:flex" style={{ zIndex: 40 }}>
        <button onClick={() => onNavigate(SECTIONS[0].id)} aria-label="Back to top" className="tap bg-accent font-display flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold">
          {PROFILE.initials}
        </button>
        {SECTIONS.slice(1).map((s) => (
          <button
            key={s.id}
            onClick={() => onNavigate(s.id)}
            aria-current={active === s.id ? "true" : undefined}
            className={`tap h-11 rounded-full px-3 text-sm transition-colors lg:px-4 ${active === s.id ? "tint font-medium" : "text-muted hover:text-white"}`}
          >
            {s.label}
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-white/10" />
        <button onClick={onOpenPalette} aria-label="Open quick actions" className="tap inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm text-muted hover:text-white">
          <Icon name="Search" size={16} />
          <kbd className="chip font-mono-ui rounded-md px-1.5 py-0.5 text-xs">{isMac ? "⌘" : "Ctrl"} K</kbd>
        </button>
        <button onClick={onOpenResume} className="btn-shine tap inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-black">
          <Icon name="FileText" size={16} /> Resume
        </button>
      </nav>

      {/* Phone top bar */}
      <header className="nav-glass fixed inset-x-0 top-0 flex items-center justify-between px-4 md:hidden" style={{ zIndex: 40, borderWidth: "0 0 1px 0", paddingTop: "env(safe-area-inset-top)" }}>
        <button onClick={() => onNavigate(SECTIONS[0].id)} className="tap flex h-14 items-center gap-2.5">
          <span className="bg-accent font-display flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold">{PROFILE.initials}</span>
          <span className="font-display font-semibold">{PROFILE.shortName}</span>
        </button>
        <button onClick={onOpenResume} className="tap chip inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm">
          <Icon name="FileText" size={16} /> Resume
        </button>
      </header>

      {/* Phone bottom bar */}
      <nav aria-label="Mobile" className="fixed inset-x-3 bottom-3 md:hidden" style={{ zIndex: 40, marginBottom: "env(safe-area-inset-bottom)" }}>
        <div className="nav-glass grid rounded-2xl p-1 shadow-2xl" style={{ gridTemplateColumns: `repeat(${mobileSlots.length}, minmax(0, 1fr))` }}>
          {mobileSlots.map((s) =>
            s.id === "__search" ? (
              <button key={s.id} onClick={onOpenPalette} aria-label="Open quick actions" className="tap flex h-14 items-center justify-center">
                <span className="bg-accent flex h-11 w-11 items-center justify-center rounded-xl">
                  <Icon name="Search" size={19} />
                </span>
              </button>
            ) : (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                aria-current={active === s.id ? "true" : undefined}
                className={`tap flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs transition-colors ${active === s.id ? "tint" : "text-muted"}`}
              >
                <Icon name={s.icon} size={19} />
                {s.label}
              </button>
            )
          )}
        </div>
      </nav>
    </>
  );
}