import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthProvider'

export default function Login() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const from = useLocation().state?.from?.pathname || '/admin'

  const onSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold text-white text-center">Acceso al panel</h1>
        <p className="mt-1 text-center text-slate-400 text-sm">Ingresa tus credenciales</p>
        {error && <div className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Correo</label>
            <input type="email" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary"
                   placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Contraseña</label>
            <input type="password" className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-primary"
                   placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-secondary disabled:opacity-60">
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
