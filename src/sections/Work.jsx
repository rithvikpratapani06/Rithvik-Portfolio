import { useState } from "react";
import { WORK, WORK_FILTERS } from "../data/portfolio";
import { Icon } from "../lib/icons";
import { pad2, tiltProps } from "../lib/utils";
import { IconBox, Reveal, SectionHeader } from "../components/ui";

function WorkCard({ w, number, big, activeSkill, onOpen }) {
  const match = activeSkill ? w.tags.includes(activeSkill) : null;
  return (
    <button
      {...tiltProps(big ? 4 : 6)}
      onClick={() => onOpen(w.id)}
      className={`tilt card tap group flex h-full w-full flex-col overflow-hidden rounded-3xl p-6 text-left sm:p-7 ${match === false ? "opacity-40" : ""} ${match ? "ring-accent" : ""}`}
    >
      {big && <div aria-hidden className="glow-accent pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 opacity-50" />}
      <div className="relative flex flex-wrap items-center justify-between gap-2">
        <span className="chip rounded-full px-3 py-1 text-xs text-muted">{w.type}</span>
        <span className="font-mono-ui text-xs text-muted">
          {pad2(number)} / {pad2(WORK.length)} · {w.period}
        </span>
      </div>
      {match && (
        <span className="bg-accent relative mt-3 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold">
          <Icon name="Check" size={12} /> Uses {activeSkill}
        </span>
      )}
      <IconBox name={w.icon} size={22} className="relative mt-5 h-12 w-12 rounded-2xl" />
      <h3 className="font-display h-card relative mt-5 font-bold">{w.title}</h3>
      <p className="relative mt-1 text-sm text-muted">{w.org}</p>
      <p className="relative mt-3 leading-relaxed text-muted">{w.summary}</p>
      {big && w.roles && (
        <div className="relative mt-5">
          <p className="font-mono-ui text-xs uppercase tracking-widest text-muted">Serves</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {w.roles.map((r) => (
              <span key={r} className="chip rounded-full px-2.5 py-1 text-xs">
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="relative mt-6 flex flex-wrap gap-x-6 gap-y-3">
        {w.impact.map((m) => (
          <div key={m.label}>
            <p className="font-display text-gradient m-0 text-2xl font-bold">{m.value}</p>
            <p className="m-0 text-xs text-muted">{m.label}</p>
          </div>
        ))}
      </div>
      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-6">
        {w.stack.map((s) => (
          <span key={s} className="chip font-mono-ui rounded-md px-2 py-1 text-xs text-muted">
            {s}
          </span>
        ))}
      </div>
      <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Open breakdown <Icon name="ArrowUpRight" size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}

/* Grid size for each card: the first is big, the next two sit beside it, the rest pair up. */
function spanFor(i, isAll) {
  if (!isAll) return "lg:col-span-6";
  if (i === 0) return "md:col-span-2 lg:col-span-7 lg:row-span-2";
  if (i < 3) return "lg:col-span-5";
  return "lg:col-span-6";
}

export default function Work({ section, index, actions }) {
  const [filter, setFilter] = useState("All");
  const { activeSkill, setActiveSkill, openWork } = actions;
  const isAll = filter === "All";
  const list = WORK.filter((w) => isAll || w.categories.includes(filter));

  return (
    <section id={section.id} className="scroll-mt-28 pt-20 sm:pt-28">
      <SectionHeader section={section} index={index} />

      <Reveal className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {WORK_FILTERS.map((f) => {
          const n = f === "All" ? WORK.length : WORK.filter((w) => w.categories.includes(f)).length;
          const on = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} aria-pressed={on} className={`tap inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors ${on ? "bg-accent border-transparent font-semibold" : "chip text-muted hover:text-white"}`}>
              {f} <span className="font-mono-ui text-xs opacity-70">{n}</span>
            </button>
          );
        })}
      </Reveal>

      {activeSkill && (
        <div className="pop-in tint-soft mb-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-2">
          <p className="m-0 text-sm">
            <Icon name="Filter" size={14} className="mr-2 inline text-accent" />
            Highlighting work that uses <span className="font-semibold text-accent">{activeSkill}</span>
          </p>
          <button onClick={() => setActiveSkill(null)} aria-label="Clear highlight" className="tap flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-white">
            <Icon name="X" size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-12">
        {list.map((w, i) => (
          <Reveal key={`${filter}-${w.id}`} delay={i * 80} className={spanFor(i, isAll)}>
            <WorkCard w={w} number={WORK.indexOf(w) + 1} big={isAll && i === 0} activeSkill={activeSkill} onOpen={openWork} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}