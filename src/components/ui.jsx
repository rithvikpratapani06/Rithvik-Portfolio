/* Small shared building blocks used by every section. */
import { useEffect, useState } from "react";
import { PROFILE } from "../data/portfolio";
import { useInView } from "../hooks/useInView";
import { Icon } from "../lib/icons";
import { pad2, prefersReducedMotion, tiltProps } from "../lib/utils";

/* Fades + lifts its content in when it scrolls into view. */
export function Reveal({ as: Tag = "div", delay = 0, className = "", style, children, ...rest }) {
  const [ref, inView] = useInView(0.12);
  return (
    <Tag ref={ref} className={`reveal ${inView ? "is-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

export function IconBox({ name, size = 20, className = "h-11 w-11 rounded-xl" }) {
  return (
    <span className={`tint flex shrink-0 items-center justify-center ${className}`}>
      <Icon name={name} size={size} />
    </span>
  );
}

export function CountUp({ to, prefix = "", suffix = "", start, duration = 1400 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setN(to);
      return;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to, duration]);
  return (
    <span className="tabular-nums">
      {prefix}
      {n}
      {suffix && <span style={{ fontSize: suffix.length > 1 ? "0.45em" : "0.7em", marginLeft: "0.04em" }}>{suffix}</span>}
    </span>
  );
}

export function ProfilePhoto() {
  const [failed, setFailed] = useState(false);
  const { src, zoom, position, focus } = PROFILE.photo;
  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`Portrait of ${PROFILE.name}`}
        onError={() => setFailed(true)}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position, transform: `scale(${zoom})`, transformOrigin: focus }}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 30%, transparent), #0A0D1A 70%)" }}>
      <span className="font-display font-extrabold text-accent" style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)" }}>
        {PROFILE.initials}
      </span>
    </div>
  );
}

export function Avatar() {
  return (
    <div {...tiltProps(10)} className="tilt relative shrink-0 rounded-full">
      <div aria-hidden className="glow-accent pointer-events-none absolute -inset-5 rounded-full" />
      <div className="avatar-ring">
        <div className="avatar-inner avatar-size">
          <ProfilePhoto />
        </div>
      </div>
    </div>
  );
}

/* Section title block — text comes from SECTIONS in data/portfolio.js */
export function SectionHeader({ section, index }) {
  return (
    <div className="relative mb-8 md:mb-12">
      <span aria-hidden className="section-num font-display pointer-events-none absolute -top-6 right-0 select-none font-extrabold sm:-top-12">
        {pad2(index)}
      </span>
      <Reveal className="relative max-w-2xl">
        <p className="font-mono-ui m-0 inline-flex items-center gap-3 text-xs uppercase tracking-widest text-accent">
          <span className="h-px w-8" style={{ background: "var(--accent)" }} />
          {pad2(index)} — {section.eyebrow || section.label}
        </p>
        <h2 className="font-display h-section mt-3 font-bold">
          {section.title} {section.accent && <span className="text-gradient">{section.accent}</span>}
        </h2>
        {section.sub && <p className="lead mt-3 text-muted">{section.sub}</p>}
      </Reveal>
    </div>
  );
}