/* App.jsx — assembles the page. Content lives in data/portfolio.js,
   switches in config.js. To add a section: create it in /sections,
   add it to SECTIONS (data) and to SECTION_VIEWS below. */
import {Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONFIG } from "./config";
import { ALL_SKILLS, KEYWORD_BANDS, PROFILE, SECTIONS, SKILL_USAGE, WORK } from "./data/portfolio";
import KeywordBand from "./components/KeywordBand";
import { copyText } from "./lib/utils";
import { useActiveSection } from "./hooks/useActiveSection";
import Background3D from "./components/Background3D";
import Navigation from "./components/Navigation";
import CommandPalette from "./components/CommandPalette";
import WorkDrawer from "./components/WorkDrawer";
import ResumeModal from "./components/ResumeModal";
import Toast from "./components/Toast";
import Hero from "./sections/Hero";
import Impact from "./sections/Impact";
import Work from "./sections/Work";
import Skills from "./sections/Skills";
import Journey from "./sections/Journey";
import Contact from "./sections/Contact";

const SECTION_VIEWS = { home: Hero, impact: Impact, work: Work, skills: Skills, journey: Journey, contact: Contact };

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [drawerId, setDrawerId] = useState(null);
  const [drawerShown, setDrawerShown] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const closeTimer = useRef(null);

  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useActiveSection(ids);
  const activeIndex = Math.max(0, ids.indexOf(active));
  const isMac = useMemo(() => typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent), []);

  // Accent colours follow the section on screen
  useEffect(() => {
    const s = CONFIG.sectionColors ? SECTIONS[activeIndex] : SECTIONS[0];
    const root = document.documentElement;
    root.style.setProperty("--accent", s.colors[0]);
    root.style.setProperty("--accent-2", s.colors[1]);
  }, [activeIndex]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const copyEmail = useCallback(async () => {
    const ok = await copyText(PROFILE.email);
    showToast(ok ? "Email copied to clipboard" : `Couldn't copy — ${PROFILE.email}`);
  }, [showToast]);

  const scrollTo = useCallback(
    (id) => {
      if (id === ids[0]) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [ids]
  );

  const openWork = useCallback((id) => {
    clearTimeout(closeTimer.current);
    setDrawerId(id);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerShown(true)));
  }, []);

  const closeWork = useCallback(() => {
    setDrawerShown(false);
    closeTimer.current = setTimeout(() => setDrawerId(null), 320);
  }, []);

  const traceSkill = useCallback(
    (s) => {
      setActiveSkill(s);
      closeWork();
      setTimeout(() => scrollTo("skills"), 380);
    },
    [closeWork, scrollTo]
  );

  // Ctrl/⌘ + K and Escape
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      } else if (e.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (drawerId) closeWork();
        else if (resumeOpen) setResumeOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, drawerId, resumeOpen, closeWork]);

  // Stop page scrolling behind pop-ups
  useEffect(() => {
    document.body.style.overflow = paletteOpen || resumeOpen || drawerId ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen, resumeOpen, drawerId]);

  const commands = useMemo(
    () => [
      ...SECTIONS.map((s) => ({ id: `nav-${s.id}`, group: "Navigate", label: `Go to ${s.label}`, icon: s.icon, action: () => scrollTo(s.id) })),
      ...WORK.map((w) => ({ id: `work-${w.id}`, group: "Work", label: w.title, hint: w.type, icon: w.icon, keywords: w.tags.join(" "), action: () => openWork(w.id) })),
      { id: "copy", group: "Actions", label: "Copy email address", icon: "Copy", keywords: "mail contact", action: copyEmail },
      { id: "mail", group: "Actions", label: "Write an email", icon: "Mail", keywords: "contact", action: () => { window.location.href = `mailto:${PROFILE.email}`; } },
      { id: "resume", group: "Actions", label: "View resume", icon: "FileText", keywords: "cv print pdf", action: () => setResumeOpen(true) },
      { id: "linkedin", group: "Actions", label: "Open LinkedIn", icon: "Linkedin", keywords: "social profile", action: () => window.open(PROFILE.linkedin, "_blank", "noopener,noreferrer") },
      { id: "call", group: "Actions", label: `Call ${PROFILE.phone}`, icon: "Phone", keywords: "phone", action: () => { window.location.href = PROFILE.phoneHref; } },
      ...ALL_SKILLS.map((s) => ({
        id: `skill-${s}`,
        group: "Skills",
        label: `Trace skill: ${s}`,
        icon: "Layers",
        hint: SKILL_USAGE[s] ? `${SKILL_USAGE[s]} build${SKILL_USAGE[s] > 1 ? "s" : ""}` : undefined,
        action: () => {
          setActiveSkill(s);
          scrollTo("skills");
        },
      })),
    ],
    [scrollTo, openWork, copyEmail]
  );

  const actions = useMemo(
    () => ({
      openWork,
      openResume: () => setResumeOpen(true),
      openPalette: () => setPaletteOpen(true),
      copyEmail,
      scrollTo,
      activeSkill,
      setActiveSkill,
      isMac,
    }),
    [openWork, copyEmail, scrollTo, activeSkill, isMac]
  );

  return (
    <div className="app-root min-h-screen">
      <div className="screen-only">
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
          <div className="bg-grid absolute inset-x-0 top-0 h-screen" />
          <div className="absolute" style={{ width: "70rem", height: "70rem", left: "50%", top: "-38rem", transform: "translateX(-50%)", background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 12%, transparent), transparent)" }} />
        </div>
        <Background3D activeIndex={activeIndex} />

        <Navigation active={active} onNavigate={scrollTo} onOpenPalette={() => setPaletteOpen(true)} onOpenResume={() => setResumeOpen(true)} isMac={isMac} />

        <main className="relative mx-auto max-w-7xl px-4 pb-32 pt-20 sm:px-6 md:pb-16 md:pt-28 lg:px-8" style={{ zIndex: 1 }}>
          {SECTIONS.map((s, i) => {
  const View = SECTION_VIEWS[s.id];
  if (!View) return null;
  return (
    <Fragment key={s.id}>
      <View section={s} index={i} actions={actions} />
      {CONFIG.keywordBands &&
        KEYWORD_BANDS.filter((b) => b.after === s.id).map((b, j) => <KeywordBand key={j} words={b.words} reverse={b.reverse} />)}
    </Fragment>
  );
})}

          <footer className="mt-16 flex flex-col items-start justify-between gap-3 border-t hairline pt-6 text-sm text-muted sm:flex-row sm:items-center">
            <p className="m-0">
              © {new Date().getFullYear()} {PROFILE.name} · Built with React, Tailwind & Three.js
            </p>
            <button onClick={() => scrollTo(ids[0])} className="tap inline-flex h-11 items-center gap-1.5 hover:text-white">
              Back to top ↑
            </button>
          </footer>
        </main>

        <WorkDrawer id={drawerId} shown={drawerShown} onClose={closeWork} onNavigate={setDrawerId} onTraceSkill={traceSkill} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} isMac={isMac} />
        <Toast message={toast} />
      </div>

      {resumeOpen && <ResumeModal onClose={() => setResumeOpen(false)} onCopyEmail={copyEmail} />}
    </div>
  );
}