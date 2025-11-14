import React, {createContext, useContext, useEffect, useMemo, useState} from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Al cargar la app: obtener CSRF y usuario (si hay sesión)
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await api.get('/auth/csrf')      // Setea cookie XSRF-TOKEN legible por JS
        const me = await api.get('/auth/me') // Si el access token es válido, retorna user
        setUser(me.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  const login = async (email, password) => {
    setError(null)
    try {
      await api.post('/auth/login', {email, password}) // Backend setea cookies httpOnly
      const me = await api.get('/auth/me')
      setUser(me.data)
      return true
    } catch (err) {
      setError(err?.response?.data?.message || 'Credenciales inválidas')
      return false
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      console.log('bye')
    }
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
  }), [user, loading, error])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
