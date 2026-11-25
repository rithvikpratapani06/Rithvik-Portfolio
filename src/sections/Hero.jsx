import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { ALL_SKILLS, HERO, PROFILE, WORK_BY_ID } from "../data/portfolio";
import { Icon } from "../lib/icons";
import { tiltProps } from "../lib/utils";
import { Avatar, IconBox, Reveal } from "../components/ui";

function TelemetryCard({ onOpen }) {
  const [tanks, setTanks] = useState([
    { id: "T-01", v: 78 },
    { id: "T-02", v: 54 },
    { id: "T-03", v: 31 },
    { id: "T-04", v: 66 },
  ]);
  const [last, setLast] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      if (document.hidden) return;
      const i = Math.floor(Math.random() * 4);
      const delta = Math.round((Math.random() - 0.5) * 22);
      setTanks((prev) => prev.map((tk, j) => (j === i ? { ...tk, v: Math.max(8, Math.min(97, tk.v + delta)) } : tk)));
      setLast(i);
    }, 1800);
    return () => clearInterval(t);
  }, []);
  const lt = tanks[last];
  return (
    <Reveal delay={140} className="md:col-span-3 lg:col-span-4">
      <div {...tiltProps(6)} className="tilt card h-full overflow-hidden rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="m-0 inline-flex items-center gap-2 text-sm font-medium">
            <Icon name="Activity" size={16} className="text-accent" /> Tank telemetry
          </p>
          <span className="chip font-mono-ui rounded-full px-2.5 py-1 text-xs text-muted">simulated</span>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2.5">
          {tanks.map((tk) => {
            const low = tk.v < 20;
            return (
              <div key={tk.id} className="flex flex-col items-center gap-2">
                <div className="relative h-24 w-full overflow-hidden rounded-xl border hairline" style={{ background: "rgba(255,255,255,.02)" }}>
                  <div className="water absolute inset-x-0 bottom-0" style={{ height: `${tk.v}%`, ...(low ? { background: "linear-gradient(180deg,#FFB86B,#FF6B6B)" } : {}) }} />
                  <span className="font-mono-ui absolute inset-x-0 top-1.5 text-center text-xs">{tk.v}%</span>
                </div>
                <span className="font-mono-ui text-xs text-muted">{tk.id}</span>
              </div>
            );
          })}
        </div>
        <p className="font-mono-ui mt-4 truncate rounded-lg border hairline px-3 py-2 text-xs text-muted">
          <span className="text-accent">mqtt›</span> tanks/{lt.id}/level → {lt.v}%{lt.v < 20 ? "  ⚠ low-level alert" : ""}
        </p>
        <button onClick={() => onOpen(HERO.telemetryLink)} className="tap mt-2 inline-flex h-11 items-center gap-1.5 text-sm text-muted hover:text-white">
          Illustrative feed — see the real pipeline <Icon name="ArrowUpRight" size={15} />
        </button>
      </div>
    </Reveal>
  );
}

export default function Hero({ section, actions }) {
  const { openWork, openResume, openPalette, copyEmail, scrollTo, isMac } = actions;
  const [idx, setIdx] = useState(0);
  const manualAt = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      if (Date.now() - manualAt.current > 9000 && !document.hidden) setIdx((i) => (i + 1) % HERO.rotator.length);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  const pick = (i) => {
    manualAt.current = Date.now();
    setIdx(i);
  };
  const cur = HERO.rotator[idx];
  const lastLen = Math.max(1, PROFILE.last.length - 1);

  return (
    <section id={section.id} className="scroll-mt-28">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-6 lg:grid-cols-12">
        {/* Intro card */}
        <Reveal className="card relative flex flex-col overflow-hidden rounded-3xl p-6 sm:p-8 md:col-span-6 lg:col-span-8 lg:row-span-2 lg:p-10">
          <div aria-hidden className="glow-accent pointer-events-none absolute -left-32 -top-32 h-96 w-96 opacity-50" />
          <div className="relative flex flex-wrap items-center gap-2">
            <span className="chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted">
              <span className="pulse-dot h-2 w-2 rounded-full" /> Building at {PROFILE.company}
            </span>
            <span className="chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted">
              <Icon name="MapPin" size={13} /> {PROFILE.location}
            </span>
            {HERO.badge && <span className="chip font-mono-ui inline-flex items-center rounded-full px-3 py-1.5 text-xs text-accent">{HERO.badge}</span>}
          </div>

          <div className="relative mt-7 flex flex-col-reverse items-start gap-5 sm:mt-9 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <h1 aria-label={PROFILE.name} className="font-display h-display m-0 min-w-0 font-extrabold">
              <span aria-hidden className="block whitespace-nowrap">
                {PROFILE.first.split("").map((c, i) => (
                  <span key={i} className="char" style={{ animationDelay: `${120 + i * 40}ms` }}>
                    {c}
                  </span>
                ))}
              </span>
              <span aria-hidden className="glow-text block whitespace-nowrap pb-1">
                {PROFILE.last.split("").map((c, i) => (
                  <span key={i} className="char" style={{ animationDelay: `${400 + i * 40}ms`, color: `color-mix(in srgb, var(--accent) ${Math.round(100 - (i / lastLen) * 100)}%, var(--accent-2))` }}>
                    {c}
                  </span>
                ))}
              </span>
            </h1>
            <Avatar />
          </div>

          <p className="font-display h-card rotator-box relative mt-5 font-semibold" aria-live="polite">
            <span className="text-muted">{HERO.tagline} </span>
            <span key={idx} className="rot-enter text-gradient inline-block">
              {cur.line}
            </span>
          </p>

          <div role="tablist" aria-label="What I build" className="relative mt-4 flex flex-wrap gap-2">
            {HERO.rotator.map((r, i) => {
              const on = i === idx;
              return (
                <button
                  key={r.label}
                  role="tab"
                  aria-selected={on}
                  onClick={() => pick(i)}
                  className={`tap inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${on ? "bg-accent border-transparent font-semibold" : "chip text-muted hover:text-white"}`}
                >
                  <Icon name={r.icon} size={15} /> {r.label}
                </button>
              );
            })}
          </div>

          <div key={`proof-${idx}`} className="rot-enter tint-soft relative mt-4 flex items-center gap-3 rounded-2xl border p-3 pl-4">
            <Icon name="Zap" size={16} className="shrink-0 text-accent" />
            <p className="m-0 flex-1 text-sm leading-relaxed text-muted">{cur.proof}</p>
            <button onClick={() => openWork(cur.work)} className="tap inline-flex h-11 shrink-0 items-center gap-1 rounded-xl px-3 text-sm text-accent hover:bg-white/5">
              Details <Icon name="ArrowUpRight" size={15} />
            </button>
          </div>

          <p className="lead relative mt-6 max-w-2xl text-muted">{PROFILE.summary}</p>

          <div className="relative mt-8 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-8">
            <button onClick={() => scrollTo("work")} className="btn-shine tap bg-accent inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold">
              Explore my work <Icon name="ArrowRight" size={16} />
            </button>
            <button onClick={openResume} className="tap chip inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm hover:bg-white/10">
              <Icon name="FileText" size={16} /> Resume
            </button>
            <button onClick={copyEmail} aria-label="Copy email address" className="tap chip inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm hover:bg-white/10">
              <Icon name="Copy" size={16} /> <span className="hidden sm:inline">Copy email</span>
            </button>
            <button onClick={openPalette} className="tap inline-flex h-12 items-center gap-2 rounded-full px-3 text-sm text-muted hover:text-white">
              <Icon name="Search" size={16} /> Quick actions
              <kbd className="chip font-mono-ui hidden rounded-md px-1.5 py-0.5 text-xs md:inline">{isMac ? "⌘" : "Ctrl"} K</kbd>
            </button>
          </div>
        </Reveal>

        {CONFIG.telemetryDemo && <TelemetryCard onOpen={openWork} />}

        {/* Highlights */}
        <Reveal delay={200} className={CONFIG.telemetryDemo ? "md:col-span-3 lg:col-span-4" : "md:col-span-6 lg:col-span-4 lg:row-span-2"}>
          <div {...tiltProps(6)} className="tilt card h-full rounded-3xl p-5 sm:p-6">
            <p className="font-mono-ui m-0 text-xs uppercase tracking-widest text-muted">Highlights</p>
            <div className="mt-2 flex flex-col">
              {HERO.highlights.map((h, i) => (
                <button key={h.value + h.label} onClick={() => openWork(h.work)} className={`tap flex h-16 items-center gap-3 text-left ${i ? "border-t hairline" : ""}`}>
                  <span className="font-display text-gradient w-24 shrink-0 text-2xl font-bold">{h.value}</span>
                  <span className="flex-1 text-sm text-muted">{h.label}</span>
                  <Icon name="ArrowUpRight" size={15} className="shrink-0 text-muted" />
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Now */}
        <Reveal delay={180} className="card relative overflow-hidden rounded-3xl md:col-span-6 lg:col-span-12">
          <div className="p-5 sm:p-6 lg:p-8">
            <p className="font-mono-ui m-0 text-xs uppercase tracking-widest text-muted">Now</p>
            <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-display h-card m-0 font-bold">
                {PROFILE.role} <span className="text-muted">at</span> {PROFILE.company}
              </h3>
              <p className="font-mono-ui m-0 text-xs text-muted">{HERO.nowPeriod}</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {HERO.nowCards.map((id) => {
                const w = WORK_BY_ID[id];
                if (!w) return null;
                return (
                  <button key={id} {...tiltProps(5)} onClick={() => openWork(id)} className="tilt tap flex items-center gap-4 rounded-2xl border hairline p-4 text-left" style={{ background: "rgba(255,255,255,.025)" }}>
                    <IconBox name={w.icon} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{w.short}</span>
                      <span className="block truncate text-xs text-muted">{w.stack.slice(0, 3).join(" · ")}</span>
                    </span>
                    <Icon name="ArrowUpRight" size={18} className="shrink-0 text-muted" />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="marquee-wrap overflow-hidden border-t hairline py-3" aria-hidden="true">
            <div className="marquee">
              {[...ALL_SKILLS, ...ALL_SKILLS].map((s, i) => (
                <span key={i} className="chip mx-1 whitespace-nowrap rounded-full px-3 py-1 text-xs text-muted">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}