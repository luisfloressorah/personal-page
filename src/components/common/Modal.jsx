import { useEffect } from "react";

export default function Modal({ open, title, children, onClose, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onMouseDown={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-slate-600"
            >
              Esc
            </button>
          </div>

          <div className="px-5 py-4">{children}</div>

          {footer ? (
            <div className="border-t border-slate-800 px-5 py-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
