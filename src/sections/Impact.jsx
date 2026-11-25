import { METRICS } from "../data/portfolio";
import { useInView } from "../hooks/useInView";
import { Icon } from "../lib/icons";
import { tiltProps } from "../lib/utils";
import { CountUp, IconBox, Reveal, SectionHeader } from "../components/ui";

const SMALL_SPANS = ["lg:col-span-4", "lg:col-span-3", "lg:col-span-3", "lg:col-span-4"];

export default function Impact({ section, index, actions }) {
  const [ref, inView] = useInView(0.2);
  const [big, ...rest] = METRICS;

  return (
    <section id={section.id} className="scroll-mt-28 pt-20 sm:pt-28">
      <SectionHeader section={section} index={index} />
      <div ref={ref} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
        {big && (
          <Reveal className="col-span-2 lg:col-span-5 lg:row-span-2">
            <button {...tiltProps(5)} onClick={() => actions.openWork(big.work)} className="tilt card tap flex h-full w-full flex-col overflow-hidden rounded-3xl p-6 text-left sm:p-8">
              <div aria-hidden className="glow-accent pointer-events-none absolute -right-24 -top-24 h-72 w-72 opacity-70" />
              {big.tag && (
                <span className="chip relative inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs text-muted">
                  <Icon name={big.icon} size={14} className="text-accent" /> {big.tag}
                </span>
              )}
              <p className="font-display h-metric text-gradient relative mt-6 font-extrabold">
                <CountUp start={inView} to={big.to} prefix={big.prefix} suffix={big.suffix} />
              </p>
              <p className="relative mt-3 text-lg font-medium">{big.label}</p>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">{big.detail}</p>
              {big.compare && (
                <div className="relative mt-8 space-y-4 lg:mt-auto lg:pt-8">
                  {big.compare.map((b, i) => (
                    <div key={b.label}>
                      <div className="mb-1.5 flex justify-between text-xs text-muted">
                        <span>{b.label}</span>
                        <span className="font-mono-ui">{b.value}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.06)" }}>
                        <div className="bar-fill h-full rounded-full" style={{ width: inView ? `${b.value}%` : "0%", background: i === 0 ? "rgba(255,255,255,.22)" : "linear-gradient(90deg,var(--accent-2),var(--accent))" }} />
                      </div>
                    </div>
                  ))}
                  {big.compareNote && <p className="font-mono-ui m-0 text-xs text-muted">{big.compareNote}</p>}
                </div>
              )}
            </button>
          </Reveal>
        )}

        {rest.map((m, i) => (
          <Reveal key={m.label} delay={(i + 1) * 80} className={SMALL_SPANS[i % SMALL_SPANS.length]}>
            <button {...tiltProps(8)} onClick={() => actions.openWork(m.work)} className="tilt card tap flex h-full w-full flex-col rounded-3xl p-4 text-left sm:p-6">
              <IconBox name={m.icon} size={17} className="h-9 w-9 rounded-xl" />
              <p className="font-display h-metric-sm mt-5 font-bold">
                <CountUp start={inView} to={m.to} prefix={m.prefix} suffix={m.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium">{m.label}</p>
              <p className="mt-1 hidden text-sm leading-relaxed text-muted sm:block">{m.detail}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs text-muted">
                View source <Icon name="ArrowUpRight" size={13} />
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </section>
  );
}