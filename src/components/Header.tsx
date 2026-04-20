import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, LogOut, ChevronDown, Zap, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUf } from '../context/UfContext'
import { useState, useEffect, useRef, useCallback } from 'react'

function NexusForgeLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="rounded-xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, minWidth: size, boxShadow: '0 2px 12px rgba(29,78,216,0.4)', padding: 3 }}>
      <img src="/nexusforge-logo.jpg" alt="LEXARA PRO" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    </div>
  )
}

function UFIndicator() {
  const { ufClp, loading, error, fecha, fuente } = useUf()
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
      title={fecha ? `UF ${fecha} · ${fuente}` : fuente}
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-default select-none"
      style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.18)' }}>
      <div className={`w-1.5 h-1.5 rounded-full bg-yellow-400 ${loading ? 'animate-pulse' : ''}`} />
      <span className="text-[10px] font-black text-yellow-500 tracking-wider">UF</span>
      <span className="text-xs font-bold text-slate-200">${ufClp.toLocaleString('es-CL')}</span>
      {error && <span className="text-[8px] text-slate-600 max-w-[72px] truncate">{error}</span>}
    </motion.div>
  )
}

export default function Header() {
  const { user, isSuperAdmin, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifCount] = useState(3)
  const searchRef = useRef<HTMLInputElement>(null)

  const focusSearch = useCallback(() => {
    searchRef.current?.focus()
    searchRef.current?.select()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        focusSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusSearch])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3"
        style={{
          background: 'rgba(5,8,20,0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 1px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="relative">
            <NexusForgeLogo size={34} />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight"
              style={{ background: 'linear-gradient(95deg,#60a5fa 0%,#1d4ed8 50%,#60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200%', animation: 'shimmer 4s linear infinite' }}>
              LEXARA PRO
            </span>
            <span className="text-[8px] text-slate-600 font-semibold tracking-[0.15em] uppercase hidden sm:block">by NexusForge</span>
          </div>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md relative ml-4">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input ref={searchRef} data-global-search placeholder="Buscar causa, cliente, RUT..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.4)'; e.target.style.background = 'rgba(99,102,241,0.05)' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-slate-700 hidden md:block">⌘K</kbd>
        </div>

        <div className="flex-1" />

        {/* UF live */}
        <UFIndicator />

        {/* Notifications */}
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Bell size={15} className="text-slate-400" />
          {notifCount > 0 && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-black text-white flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
              {notifCount}
            </motion.span>
          )}
        </motion.button>

        {/* User menu */}
        <div className="relative">
          <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowUserMenu(v => !v)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl transition-all"
            style={{ background: showUserMenu ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${showUserMenu ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
            <div className="relative">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
                style={{ background: isSuperAdmin ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                {user?.avatar}
              </div>
              {isSuperAdmin && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ background: '#fbbf24', border: '1.5px solid #05081a' }}>
                  <Zap size={6} className="text-slate-900" />
                </div>
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-[10px] font-bold text-slate-200 leading-tight">{user?.nombre?.split(' ').slice(0,2).join(' ')}</p>
              <p className="text-[8px] text-slate-600 leading-tight capitalize">{isSuperAdmin ? 'Super Admin' : user?.rol}</p>
            </div>
            <ChevronDown size={11} className={`text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                style={{ background: 'rgba(10,15,35,0.98)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)' }}>
                <div className="p-3 border-b border-white/[0.05]">
                  <p className="text-xs font-bold text-white">{user?.nombre}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  {isSuperAdmin && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-black text-yellow-400 px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                      <Zap size={8} />Super Admin
                    </span>
                  )}
                </div>
                <div className="p-1.5 space-y-0.5">
                  <Link to="/configuracion" onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all">
                    <Settings size={13} />Configuración
                  </Link>
                  <button onClick={() => { logout(); setShowUserMenu(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut size={13} />Cerrar sesión
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50% }
          100% { background-position: 200% 50% }
        }
      `}</style>
    </>
  )
}
