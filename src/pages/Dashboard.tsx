import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Briefcase, Users, Clock, CalendarDays, TrendingUp, AlertTriangle, ChevronRight, DollarSign, Gavel, Scale, CheckCircle, Timer, Calculator, MapPin, Library, BarChart2, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { UF_VALOR_CLP } from '../data/appData'
import { RISK_COLORS } from '../data/legalDatabase'
import { useAppData } from '../context/AppDataContext'

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

function CountdownTimer({ diasRestantes, alerta }: { diasRestantes: number; alerta: string }) {
  const [timeStr, setTimeStr] = useState('')
  useEffect(() => {
    if (diasRestantes > 3) { setTimeStr(`${diasRestantes}d`); return }
    const totalSecs = diasRestantes * 86400
    const tick = () => {
      const now = new Date()
      const msToday = (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000
      const remaining = Math.max(0, totalSecs * 1000 - msToday)
      const h = Math.floor(remaining / 3600000)
      const m = Math.floor((remaining % 3600000) / 60000)
      const s = Math.floor((remaining % 60000) / 1000)
      setTimeStr(`${diasRestantes > 0 ? `${diasRestantes}d ` : ''}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [diasRestantes])
  const color = RISK_COLORS[alerta as keyof typeof RISK_COLORS] ?? '#94a3b8'
  return (
    <span className="text-xs font-black font-mono tabular-nums" style={{ color }}>
      {timeStr}
    </span>
  )
}

const QUICK_MODULES = [
  { to: '/time-tracking', icon: Timer, label: 'Time Tracking', color: '#6366f1' },
  { to: '/calculadoras', icon: Calculator, label: 'Calculadoras', color: '#10b981' },
  { to: '/biblioteca', icon: Library, label: 'Biblioteca', color: '#8b5cf6' },
  { to: '/tribunales', icon: MapPin, label: 'Tribunales', color: '#3b82f6' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics', color: '#f97316' },
  { to: '/analisis', icon: Zap, label: 'Analizador IA', color: '#eab308' },
]

export default function Dashboard() {
  const { casos, clientes, honorarios, plazos, eventos } = useAppData()
  const today = new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const kpis = useMemo(() => {
    const now = new Date()
    const mesActual = now.getMonth()
    const anioActual = now.getFullYear()
    const casosActivos = casos.filter(c => c.estado === 'active').length
    const casosNuevosMes = casos.filter(c => {
      const f = new Date(c.fechaIngreso)
      return f.getMonth() === mesActual && f.getFullYear() === anioActual
    }).length
    const clientesActivos = clientes.filter(c => c.estado === 'activo').length
    const plazosUrgentes = plazos.filter(p => p.alerta === 'critical' || p.alerta === 'high')
    const plazosVencidos = plazos.filter(p => p.diasRestantes < 0).length
    const honorariosPendientes = honorarios.filter(h => h.estado === 'pendiente' || h.estado === 'vencido')
    const honorariosPendientesUF = honorariosPendientes.reduce((sum, h) => sum + (h.montoUF || 0), 0)
    const audienciasHoy = eventos.filter(e => e.tipo === 'audiencia' && e.fecha === now.toISOString().split('T')[0])
    const probExito = casos.length > 0
      ? Math.round(casos.reduce((s, c) => s + (c.probabilidadExito || 0), 0) / casos.length)
      : 0
    const distribucion: Record<string, number> = {}
    casos.forEach(c => { distribucion[c.especialidad] = (distribucion[c.especialidad] || 0) + 1 })
    const SPEC_COLORS: Record<string, string> = { civil: '#3b82f6', laboral: '#22c55e', comercial: '#8b5cf6', familia: '#ec4899', penal: '#ef4444', tributario: '#f97316', administrativo: '#06b6d4', arbitraje: '#eab308' }
    const distribucionEspecialidades = Object.entries(distribucion).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, color: SPEC_COLORS[name] || '#6366f1' }))
    return { casosActivos, casosNuevosMes, clientesActivos, plazosUrgentes, plazosVencidos, honorariosPendientesUF: Math.round(honorariosPendientesUF * 10) / 10, audienciasHoy, probExito, distribucionEspecialidades }
  }, [casos, clientes, honorarios, plazos, eventos])

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-black text-white">Panel de Control</h1>
        <p className="text-xs text-slate-500 mt-0.5 capitalize">{today}</p>
      </motion.div>

      {/* KPIs 2x4 grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard title="Casos Activos"      value={kpis.casosActivos}     sub={`+${kpis.casosNuevosMes} este mes`} icon={Briefcase}    color="#3b82f6" />
        <KpiCard title="Clientes"           value={kpis.clientesActivos}  sub="activos en despacho"                  icon={Users}        color="#8b5cf6" />
        <KpiCard title="Plazos Urgentes"    value={kpis.plazosUrgentes.length}   sub={`${kpis.plazosVencidos} vencido`}   icon={Clock}        color="#ef4444" urgent />
        <KpiCard title="Honorarios Pend."   value={`${kpis.honorariosPendientesUF} UF`} sub={`$${(kpis.honorariosPendientesUF * UF_VALOR_CLP / 1000000).toFixed(1)}M CLP`} icon={DollarSign} color="#eab308" />
      </div>

      {/* Accesos rápidos módulos */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Acceso rápido</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {QUICK_MODULES.map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/[0.04] transition-all group"
              style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-slate-300 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Alertas críticas con countdown */}
      {kpis.plazosUrgentes.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <div className="px-4 py-2.5 flex items-center gap-2 border-b border-red-500/10">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Alertas Críticas de Plazos</span>
          </div>
          {kpis.plazosUrgentes.slice(0, 3).map((p, i) => (
            <Link to="/plazos" key={p.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < Math.min(kpis.plazosUrgentes.length, 3) - 1 ? 'border-b border-red-500/[0.08]' : ''}`}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RISK_COLORS[p.alerta as keyof typeof RISK_COLORS] }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{p.descripcion}</p>
                <p className="text-[10px] text-slate-500 truncate">{p.casoTitulo} · {p.articulo}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <CountdownTimer diasRestantes={p.diasRestantes} alerta={p.alerta} />
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
        {kpis.audienciasHoy.length === 0 ? (
          <div className="px-4 py-4 text-xs text-slate-600 flex items-center gap-2">
            <CheckCircle size={13} className="text-green-500" />
            Sin audiencias programadas para hoy
          </div>
        ) : kpis.audienciasHoy.map((ev, i) => (
          <div key={ev.id} className={`px-4 py-3 flex items-center gap-3 ${i < kpis.audienciasHoy.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
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
            <AreaChart data={honorarios.filter(h=>h.estado==='pagado').reduce((acc:{mes:string;uf:number}[],h)=>{const mes=new Date(h.fechaPago||h.fechaEmision).toLocaleDateString('es-CL',{month:'short'});const ex=acc.find(a=>a.mes===mes);if(ex)ex.uf+=h.montoUF||0;else acc.push({mes,uf:Math.round(h.montoUF||0)});return acc},[])} margin={{ top: 0, right: 5, left: -28, bottom: 0 }}>
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
                <Pie data={kpis.distribucionEspecialidades} cx="50%" cy="50%" innerRadius={32} outerRadius={50} dataKey="value" paddingAngle={3}>
                  {kpis.distribucionEspecialidades.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {kpis.distribucionEspecialidades.map(item => (
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
        {casos.length === 0 ? (
          <div className="px-4 py-6 text-xs text-slate-600 text-center">No hay casos registrados aún. <Link to="/casos" className="text-blue-400">Crear primer caso →</Link></div>
        ) : casos.slice(0, 5).map((caso, i) => (
          <Link to={`/casos/${caso.id}`} key={caso.id}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < Math.min(casos.length, 5) - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: `${RISK_COLORS[caso.alerta as keyof typeof RISK_COLORS]}60` }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{caso.titulo}</p>
              <p className="text-[10px] text-slate-500 truncate">{caso.rol} · {caso.tribunal}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs font-black" style={{ color: (caso.probabilidadExito||0) > 70 ? '#22c55e' : (caso.probabilidadExito||0) > 50 ? '#eab308' : '#ef4444' }}>
                {caso.probabilidadExito || 0}%
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
