/* Ctrl/⌘+K quick-actions search. Commands are built in App.jsx. */
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../lib/icons";

export default function CommandPalette({ open, onClose, commands, isMac }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setSel(0);
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 40);
    return () => clearTimeout(t);
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords || ""} ${c.group}`.toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    const el = listRef.current && listRef.current.querySelector(`[data-idx="${sel}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [sel]);

  if (!open) return null;

  const run = (c) => {
    onClose();
    setTimeout(() => c.action(), 60);
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[sel]) run(results[sel]);
    }
  };
  let lastGroup = null;

  return (
    <div className="fade-in fixed inset-0" style={{ zIndex: 60 }} role="dialog" aria-modal="true" aria-label="Quick actions">
      <div className="absolute inset-0" style={{ background: "rgba(2,3,8,.7)" }} onClick={onClose} />
      <div className="pop-in relative mx-auto mt-16 max-w-xl px-3 sm:mt-24">
        <div className="card-strong overflow-hidden rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3 border-b hairline pl-4 pr-1">
            <Icon name="Search" size={18} className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Jump to a section, project, or skill…"
              aria-label="Search commands"
              className="h-14 w-full bg-transparent text-base placeholder-gray-500"
              style={{ outline: "none", color: "var(--text)" }}
            />
            <button onClick={onClose} aria-label="Close" className="tap flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted hover:text-white">
              <Icon name="X" size={18} />
            </button>
          </div>
          <ul ref={listRef} className="m-0 max-h-80 list-none overflow-y-auto overscroll-contain p-2" role="listbox">
            {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No matches for “{q}”.</li>}
            {results.map((c, i) => {
              const header = c.group !== lastGroup;
              lastGroup = c.group;
              const on = i === sel;
              return (
                <Fragment key={c.id}>
                  {header && (
                    <li role="presentation" className="font-mono-ui px-3 pb-1 pt-3 text-xs uppercase tracking-widest text-muted">
                      {c.group}
                    </li>
                  )}
                  <li role="option" aria-selected={on}>
                    <button data-idx={i} onMouseEnter={() => setSel(i)} onClick={() => run(c)} className={`tap flex h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm ${on ? "bg-white/10" : ""}`}>
                      <Icon name={c.icon} size={17} className={`shrink-0 ${on ? "text-accent" : "text-muted"}`} />
                      <span className="flex-1 truncate">{c.label}</span>
                      {c.hint && <span className="shrink-0 text-xs text-muted">{c.hint}</span>}
                      {on && <Icon name="CornerDownLeft" size={14} className="hidden shrink-0 text-muted sm:block" />}
                    </button>
                  </li>
                </Fragment>
              );
            })}
          </ul>
          <div className="hidden items-center justify-between border-t hairline px-4 py-2.5 text-xs text-muted sm:flex">
            <span>↑↓ navigate · ↵ select · esc close</span>
            <span className="font-mono-ui">{isMac ? "⌘" : "Ctrl"} K</span>
          </div>
        </div>
      </div>
    </div>
  );
}