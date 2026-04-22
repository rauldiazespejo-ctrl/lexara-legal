import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { PulsoBackgroundLayer } from '../components/PulsoBackgroundLayer'

function FloatingParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{ left: `${x}%`, top: `${y}%`, background: 'rgba(99,102,241,0.5)' }}
      animate={{ y: [-10, 10, -10], opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 4 + delay, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  )
}

const PARTICLES = [
  { x: 10, y: 20, delay: 0 }, { x: 85, y: 15, delay: 0.8 },
  { x: 25, y: 70, delay: 1.5 }, { x: 75, y: 60, delay: 0.4 },
  { x: 50, y: 85, delay: 2 }, { x: 92, y: 45, delay: 1.2 },
  { x: 5, y: 50, delay: 0.6 }, { x: 60, y: 25, delay: 1.8 },
]

function LexaraLogoFull() {
  return (
    <svg width="72" height="72" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lbg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a"/>
          <stop offset="50%" stopColor="#3730a3"/>
          <stop offset="100%" stopColor="#5b21b6"/>
        </linearGradient>
        <linearGradient id="lsg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93c5fd"/>
          <stop offset="100%" stopColor="#c4b5fd"/>
        </linearGradient>
        <filter id="lglow">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="200" height="200" rx="48" fill="url(#lbg)"/>
      <rect x="1" y="1" width="198" height="198" rx="47" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2"/>
      <rect x="98" y="52" width="4" height="90" rx="2" fill="url(#lsg)" opacity="0.9" filter="url(#lglow)"/>
      <rect x="58" y="52" width="84" height="5" rx="2.5" fill="url(#lsg)"/>
      <line x1="72" y1="57" x2="68" y2="90" stroke="url(#lsg)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="128" y1="57" x2="132" y2="85" stroke="url(#lsg)" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="68" cy="97" rx="20" ry="5.5" fill="url(#lsg)" opacity="0.85"/>
      <path d="M48 97 Q68 110 88 97" stroke="url(#lsg)" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <ellipse cx="132" cy="91" rx="20" ry="5.5" fill="url(#lsg)" opacity="0.85"/>
      <path d="M112 91 Q132 104 152 91" stroke="url(#lsg)" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <rect x="88" y="139" width="24" height="5" rx="2.5" fill="url(#lsg)" opacity="0.7"/>
      <rect x="76" y="144" width="48" height="5" rx="2.5" fill="url(#lsg)" opacity="0.5"/>
      <circle cx="157" cy="43" r="7" fill="#fbbf24" opacity="0.95"/>
      <circle cx="157" cy="43" r="3.5" fill="#ffffff"/>
      <circle cx="157" cy="43" r="13" fill="#fbbf24" opacity="0.1"/>
    </svg>
  )
}

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = await login(email, password)
    setLoading(false)
    if (!result.ok) setError(result.error ?? 'Credenciales incorrectas')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{ background: 'radial-gradient(ellipse at 30% 20%,#0b1228 0%,#050810 60%)' }}
    >
      <PulsoBackgroundLayer intensity={1.1} />

      {/* Animated background (partículas + malla base) */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 20% 50%,rgba(29,78,216,0.08) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(124,58,237,0.06) 0%,transparent 50%)' }} />
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99,102,241,1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>
        {PARTICLES.map((p, i) => <FloatingParticle key={i} {...p} />)}
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#4f46e5,transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent)' }} />
        <motion.div
          className="absolute left-1/2 top-1/2 w-[min(100vmin,480px)] h-[min(100vmin,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/5"
          animate={{ scale: [1, 1.03, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 w-[min(80vmin,380px)] h-[min(80vmin,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.04), transparent 70%)' }}
          animate={{ scale: [0.95, 1, 0.95] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10">

        {/* Logo section */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', transform: 'scale(1.3)' }} />
            <LexaraLogoFull />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h1 className="text-4xl font-black tracking-tight mb-1"
              style={{ background: 'linear-gradient(95deg,#93c5fd 0%,#a78bfa 60%,#93c5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LEXARA
            </h1>
            <p className="text-xs text-slate-500 tracking-widest uppercase font-semibold">Legal Intelligence Platform</p>
            <p className="text-[10px] text-slate-500 mt-1.5 tracking-wide">IA desarrollada por <span className="text-cyan-400/90 font-bold">PulsoAI</span> · Derecho chileno</p>
          </motion.div>
        </div>

        {/* Form card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(10,15,35,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>

          {/* Card header stripe */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#1d4ed8,#4f46e5,#7c3aed)' }} />

          <form onSubmit={handleSubmit} className="p-7 space-y-5">
            <div>
              <h2 className="text-sm font-black text-white mb-0.5">Bienvenido</h2>
              <p className="text-xs text-slate-500">Ingresa tus credenciales para acceder</p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Correo electrónico</label>
              <div className="relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-indigo-400' : 'text-slate-600'}`}>
                  <Mail size={13} />
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="correo@ejemplo.com" autoComplete="email"
                  onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-xs text-slate-200 placeholder-slate-700 outline-none transition-all"
                  style={{
                    background: focused === 'email' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${focused === 'email' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  }} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${focused === 'pass' ? 'text-indigo-400' : 'text-slate-600'}`}>
                  <Lock size={13} />
                </div>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" autoComplete="current-password"
                  onFocus={() => setFocused('pass')} onBlur={() => setFocused(null)}
                  className="w-full pl-9 pr-10 py-3 rounded-xl text-xs text-slate-200 outline-none transition-all"
                  style={{
                    background: focused === 'pass' ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${focused === 'pass' ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl text-xs text-red-400 overflow-hidden"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={12} className="flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-3.5 rounded-2xl text-sm font-black text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 relative overflow-hidden"
              style={{
                background: loading ? 'rgba(79,70,229,0.5)' : 'linear-gradient(135deg,#1e40af,#4f46e5,#7c3aed)',
                boxShadow: loading ? 'none' : '0 8px 30px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}>
              {!loading && (
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)', backgroundSize: '200% 100%', animation: 'shimmerBtn 3s linear infinite' }} />
              )}
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                  Verificando...
                </>
              ) : (
                <>Ingresar <ArrowRight size={14} /></>
              )}
            </motion.button>
          </form>
        </motion.div>

        <p className="text-center text-[9px] text-slate-600 mt-6 tracking-wider max-w-sm mx-auto leading-relaxed">
          LEXARA PRO v2.0 · Plataforma de productividad legal · Cumplimiento y datos conforme a la legislación chilena (Ley 19.628 y normas
          conexas)
        </p>
        <p className="text-center text-[8px] text-slate-700/90 mt-2">Motor IA y desarrollo: PulsoAI</p>
      </motion.div>

      <style>{`
        @keyframes shimmerBtn {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
      `}</style>
    </div>
  )
}
