import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Briefcase, Clock, CalendarDays,
  FileText, DollarSign, BookOpen, Scale, Settings,
  ChevronRight, Gavel, Heart, Building2, ShieldAlert, Receipt
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Principal',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { to: '/clientes', icon: Users, label: 'Clientes' },
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
    ],
  },
  {
    label: 'Gestión',
    items: [
      { to: '/honorarios', icon: DollarSign, label: 'Honorarios UF' },
      { to: '/documentos', icon: FileText, label: 'Documentos' },
      { to: '/normativa', icon: BookOpen, label: 'Normativa' },
    ],
  },
]

interface NavItemProps {
  to: string
  icon: React.ElementType
  label: string
  exact?: boolean
  badge?: number
  badgeColor?: string
}

function NavItem({ to, icon: Icon, label, exact, badge, badgeColor }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
          isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div layoutId="sidebarActive" className="absolute inset-0 rounded-xl"
              style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.35),rgba(124,58,237,0.25))', border: '1px solid rgba(99,102,241,0.25)' }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }} />
          )}
          <div className="relative flex items-center gap-2.5 w-full">
            <Icon size={16} className={isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'} />
            <span className="flex-1 text-sm">{label}</span>
            {badge && (
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}40` }}>
                {badge}
              </span>
            )}
          </div>
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-60 flex-col border-r border-white/[0.06] overflow-y-auto scrollbar-thin z-40"
      style={{ background: 'rgba(6,10,22,0.98)', backdropFilter: 'blur(20px)' }}>

      {/* Perfil del despacho */}
      <div className="p-3 m-3 rounded-2xl" style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(29,78,216,0.15)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>G</div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">González & Asociados</p>
            <p className="text-[10px] text-slate-500">Abogados — Santiago</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-2 pb-4 space-y-4">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-[9px] font-bold text-slate-600 uppercase tracking-widest">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavItem key={item.to} {...item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.05]">
        <NavLink to="/configuracion"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all">
          <Settings size={14} />
          <span>Configuración</span>
          <ChevronRight size={12} className="ml-auto" />
        </NavLink>
      </div>
    </aside>
  )
}

// ── Bottom Nav (mobile) ──────────────────────────────────────────────────────
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
      style={{ background: 'rgba(6,10,22,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', paddingBottom: 'max(8px,env(safe-area-inset-bottom))' }}>
      {BOTTOM_NAV.map(({ to, icon: Icon, label, exact, badge }) => (
        <NavLink key={to} to={to} end={exact}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all relative ${isActive ? 'text-blue-400' : 'text-slate-600'}`
          }>
          {({ isActive }) => (
            <>
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-blue-500/15' : ''}`}>
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
