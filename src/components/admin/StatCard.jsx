export default function StatCard({ title, value, subtitle, icon, loading }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-5 hover:border-accent/70 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <div className="mt-2">
            {loading ? (
              <div className="h-8 w-24 rounded-md bg-slate-800/60 animate-pulse" />
            ) : (
              <p className="text-3xl font-semibold text-accent">{value}</p>
            )}
          </div>

          {subtitle ? (
            <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </div>

        {icon ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-2 text-slate-200">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}
