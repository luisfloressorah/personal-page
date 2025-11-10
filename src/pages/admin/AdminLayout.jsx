import { Outlet, Link, useLocation } from 'react-router-dom'

export default function AdminLayout() {
  const location = useLocation()

  const isActive = (path) =>
    location.pathname === path
      ? 'text-accent font-semibold'
      : 'text-slate-300 hover:text-accent'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/90 px-4 py-6 md:flex">
        <h1 className="text-lg font-semibold text-primary mb-6">Panel de Control</h1>
        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/admin" className={isActive('/admin')}>
            Dashboard
          </Link>
          <Link to="/admin/projects" className={isActive('/admin/projects')}>
            Proyectos
          </Link>
          <Link to="/admin/services" className={isActive('/admin/services')}>
            Servicios
          </Link>
          <Link to="/admin/messages" className={isActive('/admin/messages')}>
            Mensajes
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800 text-xs text-slate-500">
          <Link to="/" className="hover:text-accent transition-colors">
            Ver sitio público
          </Link>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 px-4 py-6 md:px-8">
        <Outlet />
      </main>
    </div>
  )
}
