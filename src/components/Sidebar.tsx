import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Briefcase, Clock, CalendarDays,
  FileText, DollarSign, BookOpen, Scale, Settings,
  ChevronRight, Gavel, Heart, Building2, ShieldAlert, Receipt, ScanSearch,
  UserCheck, Hammer, Timer, Calculator, MapPin, Library, BarChart2, PenLine,
  Zap, ChevronDown
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

function LexaraLogoSidebar() {
  return (
    <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sbg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a"/>
          <stop offset="50%" stopColor="#3730a3"/>
          <stop offset="100%" stopColor="#5b21b6"/>
        </linearGradient>
        <linearGradient id="ssg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93c5fd"/>
          <stop offset="100%" stopColor="#c4b5fd"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="42" fill="url(#sbg)"/>
      <rect x="1" y="1" width="198" height="198" rx="41" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <rect x="98" y="52" width="4" height="90" rx="2" fill="url(#ssg)" opacity="0.9"/>
      <rect x="58" y="52" width="84" height="5" rx="2.5" fill="url(#ssg)"/>
      <line x1="72" y1="57" x2="68" y2="90" stroke="url(#ssg)" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="128" y1="57" x2="132" y2="85" stroke="url(#ssg)" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="68" cy="97" rx="20" ry="5.5" fill="url(#ssg)" opacity="0.85"/>
      <ellipse cx="132" cy="91" rx="20" ry="5.5" fill="url(#ssg)" opacity="0.85"/>
      <rect x="88" y="139" width="24" height="5" rx="2.5" fill="url(#ssg)" opacity="0.7"/>
      <rect x="76" y="144" width="48" height="5" rx="2.5" fill="url(#ssg)" opacity="0.5"/>
      <circle cx="157" cy="43" r="6" fill="#fbbf24" opacity="0.9"/>
      <circle cx="157" cy="43" r="3" fill="#ffffff" opacity="0.8"/>
    </svg>
  )
}

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { to: '/clientes', icon: Users, label: 'Clientes' },
      { to: '/abogados', icon: UserCheck, label: 'Abogados' },
      { to: '/casos', icon: Briefcase, label: 'Casos' },
      { to: '/plazos', icon: Clock, label: 'Plazos Fatales', badge: 2, badgeColor: '#ef4444' },
      { to: '/agenda', icon: CalendarDays, label: 'Agenda Legal' },
    ],
  },
  {
    label: 'Especialidades',
    items: [
      { to: '/civil', icon: Scale, label: 'Derecho Civil' },
      { to: '/laboral', icon: Gavel, label: 'Derecho Laboral' },
      { to: '/penal', icon: ShieldAlert, label: 'Derecho Penal' },
      { to: '/familia', icon: Heart, label: 'Derecho de Familia' },
      { to: '/tributario', icon: Receipt, label: 'Derecho Tributario' },
      { to: '/comercial', icon: Building2, label: 'Derecho Comercial' },
      { to: '/ejecutivo', icon: Hammer, label: 'Juicio Ejecutivo' },
    ],
  },
  {
    label: 'Gestión',
    items: [
      { to: '/honorarios', icon: DollarSign, label: 'Honorarios UF' },
      { to: '/time-tracking', icon: Timer, label: 'Time Tracking' },
      { to: '/documentos', icon: FileText, label: 'Documentos' },
      { to: '/analytics', icon: BarChart2, label: 'Analytics & BI' },
    ],
  },
  {
    label: 'Herramientas',
    items: [
      { to: '/normativa', icon: BookOpen, label: 'Normativa' },
      { to: '/biblioteca', icon: Library, label: 'Biblioteca Jurídica' },
      { to: '/analisis', icon: ScanSearch, label: 'Análisis Contratos' },
      { to: '/redactor-contratos', icon: PenLine, label: 'Redactor Contratos' },
      { to: '/calculadoras', icon: Calculator, label: 'Calculadoras Legales' },
      { to: '/tribunales', icon: MapPin, label: 'Directorio Tribunales' },
    ],
  },
]

interface NavItemProps {
  to: string; icon: React.ElementType; label: string
  exact?: boolean; badge?: number; badgeColor?: string
}

function NavItem({ to, icon: Icon, label, exact, badge, badgeColor }: NavItemProps) {
  return (
    <NavLink to={to} end={exact}
      className={({ isActive }) =>
        `relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
        }`
      }>
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div layoutId="sidebarActive" className="absolute inset-0 rounded-xl"
              style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.3),rgba(124,58,237,0.2))', border: '1px solid rgba(99,102,241,0.25)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)' }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }} />
          )}
          {!isActive && (
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(255,255,255,0.03)' }} />
          )}
          <div className="relative flex items-center gap-2.5 w-full">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isActive ? 'bg-blue-500/15' : 'group-hover:bg-white/[0.06]'}`}>
              <Icon size={14} className={isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400 transition-colors'} />
            </div>
            <span className="flex-1 text-xs">{label}</span>
            {badge && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                style={{ background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}35` }}>
                {badge}
              </motion.span>
            )}
          </div>
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const { user, isSuperAdmin } = useAuth()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const location = useLocation()

  const initials = user?.avatar ?? 'L'
  const displayName = user?.nombre ?? 'LEXARA'
  const roleLabel = isSuperAdmin ? 'Super Admin' : (user?.rol ?? 'Abogado')

  return (
    <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-60 flex-col border-r overflow-y-auto scrollbar-thin z-40"
      style={{
        background: 'rgba(5,8,20,0.97)',
        backdropFilter: 'blur(24px)',
        borderColor: 'rgba(255,255,255,0.06)',
        boxShadow: '1px 0 30px rgba(0,0,0,0.3)',
      }}>

      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% -20%,rgba(99,102,241,0.12),transparent 70%)' }} />

      {/* Profile card */}
      <div className="p-3 m-3 mt-4 rounded-2xl relative overflow-hidden"
        style={{ background: 'rgba(29,78,216,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(circle at 80% 20%,rgba(99,102,241,0.3),transparent 60%)' }} />
        <div className="relative flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
              style={{ background: isSuperAdmin ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'linear-gradient(135deg,#1d4ed8,#7c3aed)', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
              {initials}
            </div>
            {isSuperAdmin && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                style={{ background: '#fbbf24', border: '2px solid #050814' }}>
                <Zap size={7} className="text-slate-900" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{displayName.split(' ')[0]}</p>
            <p className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full inline-block capitalize"
              style={{ background: isSuperAdmin ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.15)', color: isSuperAdmin ? '#fbbf24' : '#a5b4fc' }}>
              {roleLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pb-4 space-y-1 relative">
        {NAV_SECTIONS.map(section => {
          const isCollapsed = collapsed[section.label]
          return (
            <div key={section.label} className="mb-1">
              <button onClick={() => setCollapsed(p => ({ ...p, [section.label]: !p[section.label] }))}
                className="w-full flex items-center px-3 mb-1 py-1 hover:bg-white/[0.02] rounded-lg transition-all group">
                <p className="flex-1 text-[9px] font-black text-slate-600 uppercase tracking-[0.18em] group-hover:text-slate-500 transition-colors text-left">{section.label}</p>
                <ChevronDown size={9} className={`text-slate-700 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden space-y-0.5">
                    {section.items.map(item => (
                      <NavItem key={item.to} {...item} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <NavLink to="/configuracion"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-all group">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center group-hover:bg-white/[0.06] transition-all">
            <Settings size={13} />
          </div>
          <span>Configuración</span>
          <ChevronRight size={11} className="ml-auto opacity-40" />
        </NavLink>
        <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)' }}>
          <p className="text-[9px] text-slate-700 font-semibold leading-relaxed">
            LEXARA v2.0 · <span className="text-indigo-600">Derecho Chileno</span><br />
            <span className="text-slate-800">Legal Intelligence Platform</span>
          </p>
        </div>
      </div>
    </aside>
  )
}

const BOTTOM_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio', exact: true },
  { to: '/casos', icon: Briefcase, label: 'Casos' },
  { to: '/plazos', icon: Clock, label: 'Plazos', badge: 2 },
  { to: '/agenda', icon: CalendarDays, label: 'Agenda' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-1 lg:hidden"
      style={{
        background: 'rgba(5,8,20,0.97)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingTop: '8px',
        paddingBottom: 'max(8px,env(safe-area-inset-bottom))',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
      }}>
      {BOTTOM_NAV.map(({ to, icon: Icon, label, exact, badge }) => (
        <NavLink key={to} to={to} end={exact}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all relative ${isActive ? 'text-blue-400' : 'text-slate-600'}`
          }>
          {({ isActive }) => (
            <>
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-500/15' : ''}`}>
                <Icon size={19} />
              </div>
              <span className="text-[9px] font-semibold">{label}</span>
              {badge && (
                <span className="absolute top-0 right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center bg-red-500 text-white">{badge}</span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default Sidebar
