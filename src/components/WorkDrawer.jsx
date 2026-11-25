/* Detail panel for a WORK item: side panel on desktop, swipe-down sheet on phones. */
import { Fragment, useEffect, useRef, useState } from "react";
import { WORK, WORK_BY_ID } from "../data/portfolio";
import { Icon } from "../lib/icons";
import { IconBox } from "./ui";

function Block({ label, children }) {
  return (
    <div className="mb-8 last:mb-2">
      <p className="font-mono-ui mb-3 text-xs uppercase tracking-widest text-accent">{label}</p>
      {children}
    </div>
  );
}

export default function WorkDrawer({ id, shown, onClose, onNavigate, onTraceSkill }) {
  const w = id ? WORK_BY_ID[id] : null;
  const [dragY, setDragY] = useState(0);
  const startY = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    setDragY(0);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [id]);

  if (!w) return null;

  const idx = WORK.findIndex((x) => x.id === w.id);
  const prev = WORK[(idx - 1 + WORK.length) % WORK.length];
  const next = WORK[(idx + 1) % WORK.length];

  const onTouchStart = (e) => {
    if (window.innerWidth < 768) startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (startY.current == null) return;
    setDragY(Math.max(0, e.touches[0].clientY - startY.current));
  };
  const onTouchEnd = () => {
    if (dragY > 90) onClose();
    setDragY(0);
    startY.current = null;
  };

  return (
    <div className="fixed inset-0" style={{ zIndex: 55 }} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className={`absolute inset-0 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`} style={{ background: "rgba(2,3,8,.7)" }} onClick={onClose} />
      <aside
        className={`card-strong sheet-h absolute inset-x-0 bottom-0 flex transform flex-col overflow-hidden rounded-t-3xl transition-transform duration-300 ease-out md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-full md:max-w-xl md:rounded-none md:rounded-l-3xl ${
          shown ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-0"
        }`}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
      >
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} className="shrink-0 border-b hairline px-5 pb-4 pt-3 sm:px-7 md:pt-6">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20 md:hidden" />
          <div className="flex items-start gap-3">
            <IconBox name={w.icon} size={22} className="mt-1 hidden h-12 w-12 rounded-2xl sm:flex" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="chip rounded-full px-2.5 py-1 text-muted">{w.type}</span>
                <span className="font-mono-ui text-muted">{w.period}</span>
              </div>
              <h3 id="drawer-title" className="font-display m-0 mt-2 text-2xl font-bold leading-tight sm:text-3xl">{w.title}</h3>
              <p className="m-0 mt-1 text-sm text-muted">{w.org}</p>
            </div>
            <button onClick={onClose} aria-label="Close details" className="tap chip flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10">
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
          <Block label="The challenge">
            <p className="lead m-0">{w.problem}</p>
          </Block>
          <Block label={w.flowLabel}>
            <div className="flex flex-wrap items-center gap-1.5">
              {w.flow.map((f, i) => (
                <Fragment key={f}>
                  <span className="chip font-mono-ui rounded-lg px-2.5 py-1.5 text-xs">{f}</span>
                  {i < w.flow.length - 1 && <Icon name="ChevronRight" size={14} className="text-accent" />}
                </Fragment>
              ))}
            </div>
          </Block>
          <Block label="What I did">
            <ol className="m-0 list-none space-y-4 p-0">
              {w.bullets.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono-ui mt-0.5 shrink-0 text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <p className="m-0 text-sm leading-relaxed text-muted">{b}</p>
                </li>
              ))}
            </ol>
          </Block>
          <Block label="Impact">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {w.impact.map((m) => (
                <div key={m.label} className="tint-soft rounded-2xl border p-4">
                  <p className="font-display text-gradient m-0 text-2xl font-bold">{m.value}</p>
                  <p className="m-0 mt-1 text-xs text-muted">{m.label}</p>
                </div>
              ))}
            </div>
          </Block>
          <Block label="Stack — tap to explore">
            <div className="flex flex-wrap gap-2">
              {w.tags.map((t) => (
                <button key={t} onClick={() => onTraceSkill(t)} className="tap chip inline-flex h-11 items-center rounded-full px-4 text-sm hover:bg-white/10">
                  {t}
                </button>
              ))}
            </div>
          </Block>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t hairline px-3 pt-2 sm:px-5" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
          <button onClick={() => onNavigate(prev.id)} className="tap inline-flex h-11 min-w-0 items-center gap-1 rounded-xl px-3 text-sm text-muted hover:text-white">
            <Icon name="ChevronLeft" size={16} className="shrink-0" /> <span className="truncate">{prev.short}</span>
          </button>
          <button onClick={() => onNavigate(next.id)} className="tap inline-flex h-11 min-w-0 items-center gap-1 rounded-xl px-3 text-sm text-muted hover:text-white">
            <span className="truncate">{next.short}</span> <Icon name="ChevronRight" size={16} className="shrink-0" />
          </button>
        </div>
      </aside>
    </div>
  );
}