import { JOURNEY, WORK_BY_ID } from "../data/portfolio";
import { useInView } from "../hooks/useInView";
import { Icon } from "../lib/icons";
import { tiltProps } from "../lib/utils";
import { Reveal, SectionHeader } from "../components/ui";

export default function Journey({ section, index, actions }) {
  const [ref, inView] = useInView(0.2);

  return (
    <section id={section.id} className="scroll-mt-28 pt-20 sm:pt-28">
      <SectionHeader section={section} index={index} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <ol ref={ref} className="relative m-0 list-none p-0 lg:col-span-8">
          <span aria-hidden className="absolute bottom-6 left-5 top-6 w-px" style={{ background: "var(--line)" }} />
          <span aria-hidden className="line-fill absolute bottom-6 left-5 top-6 w-px" style={{ transform: `scaleY(${inView ? 1 : 0})` }} />
          {JOURNEY.timeline.map((it, i) => (
            <Reveal as="li" key={it.title} delay={i * 140} className="relative pb-4 pl-14 last:pb-0">
              <span
                className="card-strong absolute left-0 top-5 flex h-10 w-10 items-center justify-center rounded-full"
                style={it.current ? { borderColor: "var(--accent)", color: "var(--accent)", boxShadow: "0 0 24px color-mix(in srgb, var(--accent) 45%, transparent)" } : undefined}
              >
                <Icon name={it.icon} size={17} />
              </span>
              <div {...tiltProps(4)} className="tilt card rounded-3xl p-5 sm:p-6">
                <p className="font-mono-ui m-0 text-xs text-accent">{it.when}</p>
                <h3 className="font-display m-0 mt-2 text-xl font-bold sm:text-2xl">{it.title}</h3>
                <p className="m-0 mt-1 text-sm text-muted">{it.place}</p>
                {it.links && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {it.links.map((id) =>
                      WORK_BY_ID[id] ? (
                        <button key={id} onClick={() => actions.openWork(id)} className="tap chip inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm hover:bg-white/10">
                          {WORK_BY_ID[id].short} <Icon name="ArrowUpRight" size={14} className="text-accent" />
                        </button>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120} className="lg:col-span-4">
          <div className="card sticky top-28 rounded-3xl p-6">
            <p className="font-mono-ui m-0 text-xs uppercase tracking-widest text-muted">At a glance</p>
            <dl className="m-0 mt-4">
              {JOURNEY.glance.map(([k, v], i) => (
                <div key={k} className={`flex items-center justify-between gap-4 py-3 ${i ? "border-t hairline" : ""}`}>
                  <dt className="text-sm text-muted">{k}</dt>
                  <dd className="font-display m-0 text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}