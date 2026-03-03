import { motion } from 'framer-motion'
import { Scale, Zap, Bell, Search, LogOut, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, isSuperAdmin, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3"
      style={{ background: 'rgba(6,10,22,0.98)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="relative w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
          <Scale size={15} className="text-white" />
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-[#06090e] flex items-center justify-center">
            <Zap size={5} className="text-slate-900" />
          </div>
        </motion.div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-black tracking-tight"
            style={{ background: 'linear-gradient(90deg,#60a5fa,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LEXARA
          </span>
          <span className="text-[9px] text-slate-600 font-semibold tracking-widest uppercase hidden sm:inline">Platform</span>
        </div>
      </Link>

      <div className="hidden md:flex flex-1 max-w-sm relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input placeholder="Buscar causa, cliente, RUT..."
          className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
      </div>

      <div className="flex-1" />

      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs"
        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
        <span className="text-yellow-500 font-bold">UF</span>
        <span className="text-slate-300 font-semibold">$38.012</span>
      </div>

      <button className="relative p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
        <Bell size={16} className="text-slate-400" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
      </button>

      {/* User info */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
            style={{ background: isSuperAdmin ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
            {user?.avatar}
          </div>
          {isSuperAdmin && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{ background: '#4f46e5', border: '1.5px solid #06090e' }}>
              <Shield size={7} className="text-white" />
            </div>
          )}
        </div>
        <div className="hidden lg:block">
          <p className="text-[10px] font-bold text-slate-300 leading-tight">{user?.nombre.split(' ')[0]}</p>
          <p className="text-[9px] text-slate-600 leading-tight capitalize">{isSuperAdmin ? 'Super Admin' : user?.rol}</p>
        </div>
        <button onClick={logout} title="Cerrar sesión"
          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors group">
          <LogOut size={13} className="text-slate-600 group-hover:text-red-400 transition-colors" />
        </button>
      </div>
    </header>
  )
}
