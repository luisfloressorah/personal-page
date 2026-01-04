export function statusBadge(status) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-1 text-[11px] leading-none";

  if (status === "new") {
    return `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-300`;
  }
  if (status === "read") {
    return `${base} border-slate-700 bg-slate-900/40 text-slate-300`;
  }
  if (status === "archived") {
    return `${base} border-purple-500/20 bg-purple-500/10 text-purple-300`;
  }
  return `${base} border-slate-700 bg-slate-900/40 text-slate-300`;
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.toISOString().slice(0, 10)} ${d.toISOString().slice(11, 16)}`;
}
