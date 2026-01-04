import { Outlet, Navigate, useLocation, NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

function Item({ to, children }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"} // para que /admin no se active con /admin/experience
      className={({ isActive }) =>
        [
          "rounded-md px-3 py-2 border transition-colors",
          isActive
            ? "border-accent/40 bg-slate-900/60 text-white"
            : "border-transparent text-slate-300 hover:bg-slate-900/40 hover:text-white",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { isAuthenticated, loading, logout, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        Verificando sesión...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 border-r border-slate-800 p-4">
        <h1 className="font-semibold mb-1">Panel admin</h1>
        <p className="text-xs text-slate-400 mb-4">{user?.email}</p>

        <nav className="grid gap-2 text-sm">
          <Item to="/admin">Dashboard</Item>
          <Item to="/admin/projects">Proyectos</Item>
          <Item to="/admin/experience">Experience</Item>
          <Item to="/admin/messages">Mensajes</Item>

          {/* luego: Skills, Messages, Home */}
        </nav>

        <button
          onClick={logout}
          className="mt-6 w-full rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300 hover:bg-red-500/15"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
