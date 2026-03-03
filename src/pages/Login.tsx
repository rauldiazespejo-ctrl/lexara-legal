import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = login(email, password)
    setLoading(false)
    if (!result.ok) setError(result.error ?? 'Error al iniciar sesión')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at top left,#0d1b3e 0%,#06090e 55%)' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto"
            style={{ background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', boxShadow: '0 0 40px rgba(59,130,246,0.3)' }}>
            <Scale size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">LEXARA</h1>
            <p className="text-xs text-slate-500 mt-1">Plataforma Legal Integral · Chile</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-3xl p-6 space-y-4"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
          <div>
            <p className="text-sm font-bold text-white mb-4">Iniciar sesión</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500">Correo electrónico</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="correo@ejemplo.com" autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs text-slate-200 outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500">Contraseña</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" autoComplete="current-password"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-xs text-slate-200 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-2.5 rounded-xl text-xs text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={12} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-black text-white transition-all disabled:opacity-60"
            style={{ background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg,#1e40af,#3b82f6)', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        {/* Super admin badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex items-center gap-2 p-3 rounded-2xl mx-2"
          style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <Shield size={12} className="text-indigo-400 flex-shrink-0" />
          <p className="text-[10px] text-slate-500">
            Acceso SuperAdmin: <span className="text-indigo-400">rauldiazespejo@gmail.com</span>
          </p>
        </motion.div>

        <p className="text-center text-[10px] text-slate-700">LEXARA Legal Suite v1.0 · Datos protegidos localmente</p>
      </motion.div>
    </div>
  )
}
