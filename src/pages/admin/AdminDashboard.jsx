export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold text-white">Dashboard</h2>
      <p className="text-sm text-slate-400">
        Resumen general del sitio: proyectos, servicios y mensajes.
        Más adelante se conectará con el backend (NestJS).
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Proyectos', value: 0 },
          { title: 'Servicios', value: 0 },
          { title: 'Mensajes', value: 0 },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-center hover:border-accent transition-colors"
          >
            <p className="text-slate-400">{item.title}</p>
            <p className="mt-1 text-3xl font-semibold text-accent">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
