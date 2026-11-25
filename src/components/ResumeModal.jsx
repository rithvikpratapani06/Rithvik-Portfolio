/* Printable resume — built from PROFILE, RESUME and WORK in data/portfolio.js */
import { PROFILE, RESUME, WORK_BY_ID } from "../data/portfolio";
import { Icon } from "../lib/icons";

function H({ children }) {
  return <h2 className="mb-2 mt-6 border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-widest text-neutral-700">{children}</h2>;
}

function Bullets({ items }) {
  return (
    <ul className="m-0 mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed">
      {items.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

export default function ResumeModal({ onClose, onCopyEmail }) {
  const closeIfSelf = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  return (
    <div className="resume-shell fade-in fixed inset-0 overflow-y-auto" style={{ zIndex: 60, background: "rgba(2,3,8,.85)" }} role="dialog" aria-modal="true" aria-label="Resume" onClick={closeIfSelf}>
      <div className="mx-auto max-w-3xl px-3 py-4 sm:px-6 sm:py-10" onClick={closeIfSelf}>
        <div className="resume-chrome card-strong sticky top-2 flex items-center gap-2 rounded-2xl p-1.5 pl-4" style={{ zIndex: 1 }}>
          <p className="font-display m-0 flex-1 font-semibold">Resume</p>
          <button onClick={() => window.print()} className="tap bg-accent inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold">
            <Icon name="Printer" size={16} /> <span className="hidden sm:inline">Print / Save PDF</span>
          </button>
          <button onClick={onCopyEmail} aria-label="Copy email" className="tap chip flex h-11 w-11 items-center justify-center rounded-xl hover:bg-white/10">
            <Icon name="Copy" size={16} />
          </button>
          <button onClick={onClose} aria-label="Close resume" className="tap chip flex h-11 w-11 items-center justify-center rounded-xl hover:bg-white/10">
            <Icon name="X" size={18} />
          </button>
        </div>

        <article id="resume-print" className="pop-in mt-3 rounded-2xl bg-white p-6 text-neutral-900 shadow-2xl sm:p-10">
          <h1 className="font-display m-0 text-3xl font-extrabold tracking-tight sm:text-4xl">{PROFILE.name.toUpperCase()}</h1>
          <p className="m-0 mt-2 text-sm text-neutral-600">
            <a href={PROFILE.phoneHref} className="text-neutral-700">{PROFILE.phone}</a> • <a href={`mailto:${PROFILE.email}`} className="text-neutral-700">{PROFILE.email}</a> •{" "}
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-700">{PROFILE.linkedinLabel}</a>
          </p>

          <H>Professional Summary</H>
          <p className="m-0 text-sm leading-relaxed">{PROFILE.summary}</p>

          <H>Skills</H>
          <ul className="m-0 list-none space-y-1 p-0 text-sm">
            {RESUME.skills.map(([k, v]) => (
              <li key={k}>
                <span className="font-semibold">{k}:</span> {v}
              </li>
            ))}
          </ul>

          <H>Experience</H>
          {RESUME.experience.map((exp) => (
            <div key={exp.role + exp.period} className="mb-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="m-0 font-bold">{exp.role}</p>
                <p className="m-0 text-sm text-neutral-600">{exp.period}</p>
              </div>
              <p className="m-0 text-sm text-neutral-600">{exp.company}</p>
              {exp.projects.map((id) => {
                const w = WORK_BY_ID[id];
                if (!w) return null;
                return (
                  <div key={id} className="mt-3">
                    <p className="m-0 text-sm font-semibold">
                      {w.title} <span className="font-normal text-neutral-600">({w.resumeStack})</span>
                    </p>
                    <Bullets items={w.bullets} />
                  </div>
                );
              })}
            </div>
          ))}

          <H>Projects</H>
          {RESUME.projects.map((id) => {
            const w = WORK_BY_ID[id];
            if (!w) return null;
            return (
              <div key={id} className="mb-3">
                <p className="m-0 text-sm font-semibold">
                  {w.title} <span className="font-normal text-neutral-600">| {w.resumeStack}</span>
                </p>
                <Bullets items={w.bullets} />
              </div>
            );
          })}

          <H>Education</H>
          {RESUME.education.map((ed) => (
            <div key={ed.degree}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <p className="m-0 text-sm font-semibold">{ed.degree}</p>
                <p className="m-0 text-sm text-neutral-600">{ed.period}</p>
              </div>
              <p className="m-0 text-sm text-neutral-600">{ed.school}</p>
            </div>
          ))}
        </article>
      </div>
    </div>
  );
}