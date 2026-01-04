import { Link } from "react-router-dom";

export default function QuickAction({ title, description, to }) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 hover:border-accent/70 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
        <span className="text-xs text-slate-500 group-hover:text-accent transition">
          Abrir →
        </span>
      </div>
    </Link>
  );
}
