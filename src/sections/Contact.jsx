import { useEffect, useState } from "react";
import { CONTACT, PROFILE } from "../data/portfolio";
import { Icon } from "../lib/icons";
import { pad2, tiltProps } from "../lib/utils";
import { IconBox, Reveal } from "../components/ui";

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  let s = "";
  try {
    s = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: PROFILE.timezone }).format(now);
  } catch {
    s = "";
  }
  return (
    <span className="tabular-nums">
      {s} {PROFILE.timezoneLabel}
    </span>
  );
}

export default function Contact({ section, index, actions }) {
  const links = [
    { href: PROFILE.linkedin, external: true, icon: "Linkedin", label: "LinkedIn", value: PROFILE.linkedinLabel },
    { href: PROFILE.phoneHref, icon: "Phone", label: "Phone", value: PROFILE.phone },
  ];

  return (
    <section id={section.id} className="scroll-mt-28 pt-20 sm:pt-28">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
        <Reveal className="card relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:col-span-8 lg:row-span-3">
          <div aria-hidden className="glow-accent pointer-events-none absolute -left-24 -top-24 h-96 w-96 opacity-60" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono-ui m-0 inline-flex items-center gap-3 text-xs uppercase tracking-widest text-accent">
              <span className="h-px w-8" style={{ background: "var(--accent)" }} />
              {pad2(index)} — {section.label}
            </p>
            <span className="chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted">
              <Icon name="Clock" size={13} className="text-accent" /> {PROFILE.location.split(",")[0]} · <LocalTime />
            </span>
          </div>
          <h2 className="font-display h-section relative mt-4 max-w-2xl font-bold">
            {CONTACT.title} <span className="text-gradient">{CONTACT.accent}</span>
          </h2>
          <p className="lead relative mt-4 max-w-lg text-muted">{CONTACT.text}</p>
          <p className="font-display relative mt-8 break-all font-semibold" style={{ fontSize: "clamp(1.15rem, 2.2vw + .6rem, 2.1rem)" }}>
            {PROFILE.email}
          </p>
          <div className="relative mt-6 flex flex-wrap gap-3">
            <button onClick={actions.copyEmail} className="btn-shine tap bg-accent inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold">
              <Icon name="Copy" size={16} /> Copy email
            </button>
            <a href={`mailto:${PROFILE.email}`} className="tap chip inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm no-underline hover:bg-white/10" style={{ color: "var(--text)" }}>
              <Icon name="Mail" size={16} /> Write an email
            </a>
          </div>
        </Reveal>

        {links.map((l, i) => (
          <Reveal key={l.label} delay={(i + 1) * 90} className="lg:col-span-4">
            <a {...tiltProps(7)} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="tilt card tap flex h-full items-center gap-4 rounded-3xl p-5 no-underline" style={{ color: "var(--text)" }}>
              <IconBox name={l.icon} size={19} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted">{l.label}</span>
                <span className="block truncate font-medium">{l.value}</span>
              </span>
              <Icon name="ArrowUpRight" size={18} className="shrink-0 text-muted" />
            </a>
          </Reveal>
        ))}

        <Reveal delay={270} className="lg:col-span-4">
          <button {...tiltProps(7)} onClick={actions.openResume} className="tilt card tap flex h-full w-full items-center gap-4 rounded-3xl p-5 text-left">
            <IconBox name="FileText" size={19} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted">Resume</span>
              <span className="block font-medium">View & print</span>
            </span>
            <Icon name="Printer" size={18} className="shrink-0 text-muted" />
          </button>
        </Reveal>
      </div>
    </section>
  );
}