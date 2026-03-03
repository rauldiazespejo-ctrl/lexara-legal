import { motion } from 'framer-motion'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Briefcase, Users, Clock, CalendarDays, TrendingUp, AlertTriangle, ChevronRight, DollarSign, Gavel, Scale, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DASHBOARD_DATA, UF_VALOR_CLP } from '../data/appData'
import { RISK_COLORS } from '../data/legalDatabase'

function KpiCard({ title, value, sub, icon: Icon, color, urgent }: { title: string; value: string | number; sub?: string; icon: React.ElementType; color: string; urgent?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-3.5 relative overflow-hidden"
      style={{ background: urgent ? `rgba(239,68,68,0.08)` : 'rgba(15,23,42,0.7)', border: `1px solid ${urgent ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}` }}>
      <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-10 blur-xl" style={{ background: color, transform: 'translate(30%,-30%)' }} />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate">{title}</p>
          <p className="text-2xl font-black text-white leading-none">{value}</p>
          {sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={15} style={{ color }} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const d = DASHBOARD_DATA

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-black text-white">Panel de Control</h1>
        <p className="text-xs text-slate-500 mt-0.5">Lun 2 Mar 2026 · González & Asociados</p>
      </motion.div>

      {/* KPIs 2x4 grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard title="Casos Activos"      value={d.kpis.casosActivos}     sub={`+${d.kpis.casosNuevosMes} este mes`} icon={Briefcase}    color="#3b82f6" />
        <KpiCard title="Clientes"           value={d.kpis.clientesActivos}  sub="activos en despacho"                  icon={Users}        color="#8b5cf6" />
        <KpiCard title="Plazos Urgentes"    value={d.kpis.plazosProximos}   sub={`${d.kpis.plazosVencidos} vencido`}   icon={Clock}        color="#ef4444" urgent />
        <KpiCard title="Honorarios Pend."   value={`${d.kpis.honorariosPendientesUF} UF`} sub={`$${(d.kpis.honorariosPendientesUF * UF_VALOR_CLP / 1000000).toFixed(1)}M CLP`} icon={DollarSign} color="#eab308" />
      </div>

      {/* Alertas críticas */}
      {d.plazosUrgentes.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <div className="px-4 py-2.5 flex items-center gap-2 border-b border-red-500/10">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Alertas Críticas de Plazos</span>
          </div>
          {d.plazosUrgentes.slice(0, 3).map((p, i) => (
            <Link to="/plazos" key={p.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < d.plazosUrgentes.slice(0,3).length - 1 ? 'border-b border-red-500/[0.08]' : ''}`}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RISK_COLORS[p.alerta] }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{p.descripcion}</p>
                <p className="text-[10px] text-slate-500 truncate">{p.casoTitulo} · {p.articulo}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-black" style={{ color: RISK_COLORS[p.alerta] }}>{p.diasRestantes}d</p>
                <p className="text-[10px] text-slate-600">{p.fatal ? 'FATAL' : 'no fatal'}</p>
              </div>
              <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
            </Link>
          ))}
        </motion.div>
      )}

      {/* Hoy */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-slate-300">Hoy — Agenda</span>
          </div>
          <Link to="/agenda" className="text-[10px] text-blue-400 hover:text-blue-300">Ver todo</Link>
        </div>
        {d.audienciasHoy.length === 0 ? (
          <div className="px-4 py-4 text-xs text-slate-600 flex items-center gap-2">
            <CheckCircle size={13} className="text-green-500" />
            Sin audiencias programadas para hoy
          </div>
        ) : d.audienciasHoy.map((ev, i) => (
          <div key={ev.id} className={`px-4 py-3 flex items-center gap-3 ${i < d.audienciasHoy.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Gavel size={14} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{ev.titulo}</p>
              <p className="text-[10px] text-slate-500 truncate">{ev.hora} · {ev.tribunal}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Ingresos (UF)</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={d.tendenciaIngresos} margin={{ top: 0, right: 5, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="ufGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', fontSize: 11 }} formatter={(v) => [`${v} UF`, 'Ingresos']} />
              <Area type="monotone" dataKey="uf" stroke="#3b82f6" fill="url(#ufGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Distribución por Especialidad</p>
          <div className="flex items-center gap-3">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={d.distribucionEspecialidades} cx="50%" cy="50%" innerRadius={32} outerRadius={50} dataKey="value" paddingAngle={3}>
                  {d.distribucionEspecialidades.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {d.distribucionEspecialidades.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-slate-400 text-[11px]">{item.name}</span>
                  </div>
                  <span className="text-slate-300 font-semibold text-[11px]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Casos recientes */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <Scale size={14} className="text-purple-400" />
            <span className="text-xs font-bold text-slate-300">Casos Recientes</span>
          </div>
          <Link to="/casos" className="text-[10px] text-blue-400">Ver todos</Link>
        </div>
        {DASHBOARD_DATA.casosRecientes.map((caso, i) => (
          <Link to={`/casos/${caso.id}`} key={caso.id}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < DASHBOARD_DATA.casosRecientes.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: `${RISK_COLORS[caso.alerta]}60` }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{caso.titulo}</p>
              <p className="text-[10px] text-slate-500 truncate">{caso.rol} · {caso.tribunal}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-black" style={{ color: caso.probabilidadExito > 70 ? '#22c55e' : caso.probabilidadExito > 50 ? '#eab308' : '#ef4444' }}>
                {caso.probabilidadExito}%
              </div>
              <p className="text-[10px] text-slate-600">éxito</p>
            </div>
            <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
