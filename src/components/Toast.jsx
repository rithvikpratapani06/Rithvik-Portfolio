import { Icon } from "../lib/icons";

export default function Toast({ message }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 flex justify-center px-4 md:bottom-8" style={{ zIndex: 70 }}>
      {message && (
        <div className="pop-in card-strong inline-flex items-center gap-2.5 rounded-full px-4 py-3 text-sm shadow-2xl">
          <span className="bg-accent flex h-5 w-5 items-center justify-center rounded-full">
            <Icon name="Check" size={13} />
          </span>
          {message}
        </div>
      )}
    </div>
  );
}