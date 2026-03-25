import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Briefcase, Clock, CalendarDays,
  FileText, DollarSign, BookOpen, Scale, Settings,
  ChevronRight, Gavel, Heart, Building2, ShieldAlert, Receipt, ScanSearch,
  UserCheck, Hammer, Timer, Calculator, MapPin, Library, BarChart2, PenLine,
  Zap, ChevronDown, Brain, Menu, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAppData } from '../context/AppDataContext'
import { useState } from 'react'

function NexusForgeLogoSidebar() {
  return (
    <div className="rounded-xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0"
      style={{ width: 36, height: 36, minWidth: 36, boxShadow: '0 2px 10px rgba(29,78,216,0.35)', padding: 3 }}>
      <img src="/nexusforge-logo.jpg" alt="LEXARA PRO" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
    </div>
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
      { to: '/plazos', icon: Clock, label: 'Plazos Fatales' },
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
      { to: '/teoria-caso', icon: Brain, label: 'Teoría del Caso IA' },
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
  const { plazos } = useAppData()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const location = useLocation()

  const plazosUrgentes = plazos.filter(p => p.alerta === 'critical' || p.alerta === 'high').length

  const initials = user?.avatar ?? 'NF'
  const displayName = user?.nombre ?? 'NexusForge'
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
            <p className="text-xs font-bold text-white truncate">{displayName.split(' ').slice(0, 2).join(' ')}</p>
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
                      <NavItem key={item.to} {...item}
                        badge={item.to === '/plazos' && plazosUrgentes > 0 ? plazosUrgentes : undefined}
                        badgeColor={item.to === '/plazos' ? '#ef4444' : undefined}
                      />
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
        <div className="mt-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(29,78,216,0.05)', border: '1px solid rgba(29,78,216,0.12)' }}>
          <p className="text-[9px] text-slate-700 font-semibold leading-relaxed">
            LEXARA PRO · <span className="text-blue-600">Derecho Chileno</span><br />
            <span className="text-slate-800">Desarrollado por NexusForge</span>
          </p>
        </div>
      </div>
    </aside>
  )
}

const BOTTOM_NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio', exact: true },
  { to: '/casos', icon: Briefcase, label: 'Casos' },
  { to: '/plazos', icon: Clock, label: 'Plazos' },
  { to: '/teoria-caso', icon: Brain, label: 'T.Caso IA' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
]

const MAS_ITEMS = [
  { section: 'Principal', items: [
    { to: '/abogados', icon: UserCheck, label: 'Abogados' },
    { to: '/agenda', icon: CalendarDays, label: 'Agenda Legal' },
  ]},
  { section: 'Especialidades', items: [
    { to: '/civil', icon: Scale, label: 'Civil' },
    { to: '/laboral', icon: Gavel, label: 'Laboral' },
    { to: '/penal', icon: ShieldAlert, label: 'Penal' },
    { to: '/familia', icon: Heart, label: 'Familia' },
    { to: '/tributario', icon: Receipt, label: 'Tributario' },
    { to: '/comercial', icon: Building2, label: 'Comercial' },
    { to: '/ejecutivo', icon: Hammer, label: 'Ejecutivo' },
  ]},
  { section: 'Gestión', items: [
    { to: '/honorarios', icon: DollarSign, label: 'Honorarios' },
    { to: '/time-tracking', icon: Timer, label: 'Time Track' },
    { to: '/documentos', icon: FileText, label: 'Documentos' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  ]},
  { section: 'Herramientas', items: [
    { to: '/normativa', icon: BookOpen, label: 'Normativa' },
    { to: '/biblioteca', icon: Library, label: 'Biblioteca' },
    { to: '/analisis', icon: ScanSearch, label: 'Contratos' },
    { to: '/redactor-contratos', icon: PenLine, label: 'Redactor' },
    { to: '/calculadoras', icon: Calculator, label: 'Calculadoras' },
    { to: '/tribunales', icon: MapPin, label: 'Tribunales' },
    { to: '/configuracion', icon: Settings, label: 'Configuración' },
  ]},
]

export function BottomNav() {
  const { plazos } = useAppData()
  const plazosUrgentes = plazos.filter(p => p.alerta === 'critical' || p.alerta === 'high').length
  const [masOpen, setMasOpen] = useState(false)

  return (
    <>
      <AnimatePresence>
        {masOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMasOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden rounded-t-3xl overflow-hidden"
              style={{ background: 'rgba(5,10,25,0.98)', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '80vh' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div>
                  <p className="text-sm font-black text-white">Todos los módulos</p>
                  <p className="text-[9px] text-slate-600">LEXARA PRO · NexusForge</p>
                </div>
                <button onClick={() => setMasOpen(false)} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
              <div className="overflow-y-auto pb-6" style={{ maxHeight: 'calc(80vh - 60px)' }}>
                {MAS_ITEMS.map(section => (
                  <div key={section.section} className="px-4 pt-4">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-wider mb-2">{section.section}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {section.items.map(item => {
                        const Icon = item.icon
                        return (
                          <NavLink key={item.to} to={item.to}
                            onClick={() => setMasOpen(false)}
                            className={({ isActive }) =>
                              `flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all text-center ${isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`
                            }
                            style={({ isActive }) => ({
                              background: isActive ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isActive ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'}`,
                            })}>
                            <Icon size={18} />
                            <span className="text-[9px] font-semibold leading-tight">{item.label}</span>
                          </NavLink>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-1 lg:hidden"
        style={{
          background: 'rgba(5,8,20,0.97)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: '8px',
          paddingBottom: 'max(8px,env(safe-area-inset-bottom))',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
        }}>
        {BOTTOM_NAV.map(({ to, icon: Icon, label, exact }) => (
          <NavLink key={to} to={to} end={exact}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative ${isActive ? 'text-blue-400' : 'text-slate-600'}`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-blue-500/15' : ''}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[9px] font-semibold">{label}</span>
                {to === '/plazos' && plazosUrgentes > 0 && (
                  <span className="absolute top-0 right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center bg-red-500 text-white">{plazosUrgentes}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
        <button onClick={() => setMasOpen(v => !v)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all text-slate-600 hover:text-slate-300">
          <div className={`p-1.5 rounded-xl transition-all ${masOpen ? 'bg-indigo-500/15 text-indigo-400' : ''}`}>
            <Menu size={18} />
          </div>
          <span className="text-[9px] font-semibold">Más</span>
        </button>
      </nav>
    </>
  )
}

export default Sidebar
