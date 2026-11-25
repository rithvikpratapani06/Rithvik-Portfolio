import { useEffect, useMemo, useRef } from "react";
import { ALL_SKILLS, SKILL_GROUPS, SKILL_USAGE, WORK } from "../data/portfolio";
import { Icon } from "../lib/icons";
import { prefersReducedMotion, tiltProps } from "../lib/utils";
import { IconBox, Reveal, SectionHeader } from "../components/ui";

const GROUP_SPANS = ["lg:col-span-3", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-5", "lg:col-span-3"];

/* Draggable 3D globe of every skill. Only animates while visible. */
function SkillGlobe({ activeSkill, onPick }) {
  const wrapRef = useRef(null);
  const itemRefs = useRef([]);
  const st = useRef({ rx: -0.35, ry: 0, vx: 0, vy: 0.004, dragging: false, lastX: 0, lastY: 0, R: 120, target: null, visible: false });

  const points = useMemo(() => {
    const n = ALL_SKILLS.length;
    const g = Math.PI * (3 - Math.sqrt(5));
    return ALL_SKILLS.map((_, i) => {
      const y = 1 - (i / Math.max(1, n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(g * i) * r, y, Math.sin(g * i) * r];
    });
  }, []);

  useEffect(() => {
    const s = st.current;
    const i = activeSkill ? ALL_SKILLS.indexOf(activeSkill) : -1;
    if (i < 0) {
      s.target = null;
      return;
    }
    const [x, y, z] = points[i];
    const TAU = Math.PI * 2;
    let ry = Math.atan2(-x, z);
    let rx = Math.atan2(y, Math.sqrt(x * x + z * z));
    ry += Math.round((s.ry - ry) / TAU) * TAU;
    rx += Math.round((s.rx - rx) / TAU) * TAU;
    s.target = { rx, ry };
  }, [activeSkill, points]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const s = st.current;
    const reduce = prefersReducedMotion();
    const measure = () => {
      const r = wrap.getBoundingClientRect();
      s.R = Math.min(r.width, r.height) * 0.38;
    };
    measure();
    window.addEventListener("resize", measure);
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
    });
    io.observe(wrap);
    const up = () => {
      s.dragging = false;
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    let raf;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!s.visible || document.hidden) return;
      if (s.target && !s.dragging) {
        s.rx += (s.target.rx - s.rx) * 0.08;
        s.ry += (s.target.ry - s.ry) * 0.08;
      } else if (!s.dragging) {
        s.ry += reduce ? 0 : s.vy;
        s.rx += s.vx;
        s.vx *= 0.95;
        s.vy += ((reduce ? 0 : 0.004) - s.vy) * 0.02;
      }
      const cx = Math.cos(s.rx);
      const sx = Math.sin(s.rx);
      const cy = Math.cos(s.ry);
      const sy = Math.sin(s.ry);
      for (let i = 0; i < points.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        const [x, y, z] = points[i];
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        el.style.transform = `translate(-50%,-50%) translate3d(${(x1 * s.R).toFixed(1)}px, ${(-y2 * s.R).toFixed(1)}px, 0) scale(${(0.6 + (z2 + 1) * 0.3).toFixed(3)})`;
        el.style.opacity = (0.22 + (z2 + 1) * 0.39).toFixed(3);
        el.style.zIndex = String(Math.round((z2 + 1) * 100));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [points]);

  const onDown = (e) => {
    const s = st.current;
    s.dragging = true;
    s.target = null;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
  };
  const onMove = (e) => {
    const s = st.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.ry += dx * 0.008;
    s.rx += dy * 0.008;
    s.vy = dx * 0.0008;
    s.vx = dy * 0.0008;
  };

  return (
    <div ref={wrapRef} onPointerDown={onDown} onPointerMove={onMove} className="globe relative select-none" style={{ touchAction: "pan-y" }}>
      <div aria-hidden className="globe-core" />
      {ALL_SKILLS.map((s, i) => {
        const on = activeSkill === s;
        return (
          <button key={s} ref={(el) => (itemRefs.current[i] = el)} onClick={() => onPick(s)} aria-pressed={on} className="globe-item tap absolute left-1/2 top-1/2 flex h-11 items-center px-1">
            <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${on ? "bg-accent border-transparent" : "chip"}`} style={on ? undefined : { background: "rgba(8,10,20,.85)" }}>
              {s}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MatchList({ skill, onOpen, onShowInWork, onClear }) {
  const matches = WORK.filter((w) => w.tags.includes(skill));
  return (
    <div className="pop-in tint-soft mt-4 rounded-2xl border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="m-0 text-sm">
          <span className="font-semibold text-accent">{skill}</span>
          <span className="text-muted"> · {matches.length ? `used in ${matches.length} ${matches.length === 1 ? "build" : "builds"}` : "toolkit"}</span>
        </p>
        <button onClick={onClear} aria-label="Clear skill" className="tap -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-white">
          <Icon name="X" size={16} />
        </button>
      </div>
      {matches.length ? (
        <div className="mt-1 flex flex-col gap-1">
          {matches.map((w) => (
            <button key={w.id} onClick={() => onOpen(w.id)} className="tap flex h-14 items-center gap-3 rounded-xl px-2 text-left hover:bg-white/5">
              <Icon name={w.icon} size={18} className="shrink-0 text-accent" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{w.title}</span>
                <span className="block truncate text-xs text-muted">
                  {w.type} · {w.period}
                </span>
              </span>
              <Icon name="ArrowUpRight" size={16} className="shrink-0 text-muted" />
            </button>
          ))}
          <button onClick={onShowInWork} className="tap inline-flex h-11 items-center gap-1.5 self-start px-2 text-sm text-accent">
            Highlight in Work <Icon name="ArrowRight" size={15} />
          </button>
        </div>
      ) : (
        <p className="m-0 mt-1 text-sm leading-relaxed text-muted">Listed in my toolkit; not tied to a specific project on my resume.</p>
      )}
    </div>
  );
}

function GlobeHead() {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="font-mono-ui m-0 text-xs uppercase tracking-widest text-muted">Skill globe</p>
      <span className="text-xs text-muted">Drag to spin · tap to trace</span>
    </div>
  );
}

export default function Skills({ section, index, actions }) {
  const { activeSkill, setActiveSkill, openWork, scrollTo } = actions;
  const toggle = (s) => setActiveSkill((cur) => (cur === s ? null : s));
  const clear = () => setActiveSkill(null);
  const showInWork = () => scrollTo("work");
  const rows = Math.ceil(SKILL_GROUPS.length / 2);
  const matchProps = { skill: activeSkill, onOpen: openWork, onShowInWork: showInWork, onClear: clear };

  return (
    <section id={section.id} className="scroll-mt-28 pt-20 sm:pt-28">
      <SectionHeader section={section} index={index} />
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-12">
        {/* Globe — phones & tablets */}
        <Reveal className="card rounded-3xl p-5 sm:p-6 md:col-span-2 lg:hidden">
          <GlobeHead />
          <SkillGlobe activeSkill={activeSkill} onPick={toggle} />
          {activeSkill && <MatchList {...matchProps} />}
        </Reveal>

        {SKILL_GROUPS.map((g, i) => (
          <Reveal key={g.title} delay={i * 60} className={GROUP_SPANS[i % GROUP_SPANS.length]}>
            <div {...tiltProps(3)} className="tilt card h-full rounded-3xl p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <IconBox name={g.icon} size={18} className="h-10 w-10 rounded-xl" />
                <h3 className="font-display m-0 text-lg font-semibold">{g.title}</h3>
                <span className="font-mono-ui ml-auto text-xs text-muted">{String(g.skills.length).padStart(2, "0")}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.skills.map((s) => {
                  const on = activeSkill === s;
                  const n = SKILL_USAGE[s];
                  return (
                    <button key={s} onClick={() => toggle(s)} aria-pressed={on} className={`tap inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${on ? "bg-accent border-transparent font-semibold" : "chip hover:bg-white/10"}`}>
                      {s}
                      {n > 0 && (
                        <span className={`font-mono-ui flex h-5 w-5 items-center justify-center rounded-full text-xs ${on ? "" : "tint"}`} style={on ? { background: "rgba(5,6,13,.18)" } : undefined}>
                          {n}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {g.skills.includes(activeSkill) && (
                <div className="lg:hidden">
                  <MatchList {...matchProps} />
                </div>
              )}
            </div>
          </Reveal>
        ))}

        {/* Globe panel — desktop (sticks while you scroll the groups) */}
        <div className="hidden lg:block" style={{ gridColumn: "9 / span 4", gridRow: `1 / span ${rows}` }}>
          <div className="card sticky top-28 rounded-3xl p-6">
            <GlobeHead />
            <SkillGlobe activeSkill={activeSkill} onPick={toggle} />
            {activeSkill ? <MatchList {...matchProps} /> : <p className="m-0 mt-2 text-sm leading-relaxed text-muted">Pick any skill — it spins to the front, and matching cards in Work light up.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}