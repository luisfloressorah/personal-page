// src/pages/admin/AdminLayout.jsx
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

export default function AdminLayout() {
  const { isAuthenticated, loading, logout, user } = useAuth()
  const location = useLocation()

  // Mientras verifica la sesión (llamada a /auth/csrf y /auth/me)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
        Verificando sesión...
      </div>
    )
  }

  // Si no está autenticado -> lo manda al login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  // Si sí está autenticado, renderiza el panel
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-64 border-r border-slate-800 p-4">
        <h1 className="font-semibold mb-4">Panel admin</h1>
        <p className="text-xs text-slate-400 mb-4">
          {user?.email}
        </p>
        <nav className="grid gap-2 text-sm">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/projects">Proyectos</Link>
        </nav>
        <button
          onClick={logout}
          className="mt-6 text-xs text-red-400 hover:text-red-300"
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
