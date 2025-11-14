//Es un guardian de las rutas de las paginas para que usuarios no autorizados
//no vean contenido de las paginas

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export default function RequireAuth() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return null //aqui va el spinner
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: location }} />
}
