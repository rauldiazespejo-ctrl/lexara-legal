import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, TrendingUp, Clock, CheckCircle, AlertTriangle, Download, Trash2, Edit2, X, Save, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { HONORARIOS, UF_VALOR_CLP, DASHBOARD_DATA, CLIENTES } from '../data/appData'
import type { Honorario } from '../types'
import { useAuth } from '../context/AuthContext'

const ESTADO_CONFIG = {
  pagado:   { color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   label: 'Pagado' },
  pendiente:{ color: '#eab308', bg: 'rgba(234,179,8,0.12)',   label: 'Pendiente' },
  vencido:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Vencido' },
  anulado:  { color: '#64748b', bg: 'rgba(100,116,139,0.12)', label: 'Anulado' },
}

export default function Honorarios() {
  const { canDelete, canCreate } = useAuth()
  const [honorarios, setHonorarios] = useState<Honorario[]>(HONORARIOS)
  const [filter, setFilter] = useState<'todos' | keyof typeof ESTADO_CONFIG>('todos')
  const [editTarget, setEditTarget] = useState<Honorario | null>(null)
  const [showNuevo, setShowNuevo] = useState(false)

  const filtered = honorarios.filter(h => filter === 'todos' || h.estado === filter)
  const totalPagadoUF = honorarios.filter(h => h.estado === 'pagado').reduce((s, h) => s + h.montoUF, 0)
  const totalPendienteUF = honorarios.filter(h => h.estado === 'pendiente' || h.estado === 'vencido').reduce((s, h) => s + h.montoUF, 0)
  const totalVencidoUF = honorarios.filter(h => h.estado === 'vencido').reduce((s, h) => s + h.montoUF, 0)

  const saveEdit = (updated: Honorario) => {
    setHonorarios(prev => prev.map(h => h.id === updated.id ? updated : h))
    setEditTarget(null)
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Honorarios</h1>
          <p className="text-xs text-slate-500 mt-0.5">Facturación en UF · Valor UF hoy: <span className="text-yellow-400 font-bold">${UF_VALOR_CLP.toLocaleString('es-CL')}</span></p>
        </div>
        <div className="flex gap-2">
          {canCreate && (
            <button onClick={() => setShowNuevo(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
              <Plus size={13} />Nuevo
            </button>
          )}
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Download size={13} /><span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </motion.div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Cobrado', uf: totalPagadoUF, icon: CheckCircle, color: '#22c55e' },
          { label: 'Por cobrar', uf: totalPendienteUF, icon: Clock, color: '#eab308' },
          { label: 'Vencido', uf: totalVencidoUF, icon: AlertTriangle, color: '#ef4444' },
        ].map(k => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-3 text-center relative overflow-hidden"
            style={{ background: `${k.color}08`, border: `1px solid ${k.color}20` }}>
            <k.icon size={14} style={{ color: k.color }} className="mx-auto mb-1" />
            <p className="text-base font-black" style={{ color: k.color }}>{k.uf.toFixed(1)}</p>
            <p className="text-[9px] text-slate-500 font-semibold">UF {k.label}</p>
            <p className="text-[9px] text-slate-600">${(k.uf * UF_VALOR_CLP / 1_000_000).toFixed(1)}M</p>
          </motion.div>
        ))}
      </div>

      {/* Trend chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Ingresos Mensuales (UF)</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={DASHBOARD_DATA.tendenciaIngresos} margin={{ top: 0, right: 5, left: -28, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', fontSize: 11 }}
              formatter={(v) => [`${v} UF`, '']} />
            <Bar dataKey="uf" radius={[5, 5, 0, 0]}>
              {DASHBOARD_DATA.tendenciaIngresos.map((_, i) => (
                <Cell key={i} fill={i === DASHBOARD_DATA.tendenciaIngresos.length - 1 ? '#6366f1' : '#3b82f650'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Filter + list */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(['todos', 'pagado', 'pendiente', 'vencido'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${filter === f ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={filter === f ? { background: f === 'todos' ? 'rgba(29,78,216,0.25)' : `${ESTADO_CONFIG[f as keyof typeof ESTADO_CONFIG]?.color}20`, border: `1px solid ${f === 'todos' ? 'rgba(99,102,241,0.35)' : `${ESTADO_CONFIG[f as keyof typeof ESTADO_CONFIG]?.color}40`}`, color: f === 'todos' ? '#93c5fd' : ESTADO_CONFIG[f as keyof typeof ESTADO_CONFIG]?.color } : { background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {f === 'todos' ? 'Todos' : ESTADO_CONFIG[f as keyof typeof ESTADO_CONFIG]?.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((h, i) => {
          const cfg = ESTADO_CONFIG[h.estado]
          return (
            <motion.div key={h.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-2xl p-4 group"
              style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${cfg.color}20` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white truncate">{h.concepto}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{h.clienteNombre} · {h.casoTitulo}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Emisión: {h.fechaEmision} · Vence: {h.fechaVencimiento}
                    {h.fechaPago && ` · Pagado: ${h.fechaPago}`}
                  </p>
                </div>
                <div className="flex items-start gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-base font-black" style={{ color: cfg.color }}>{h.montoUF} UF</p>
                    <p className="text-[10px] text-slate-600">${(h.montoCLP / 1_000_000).toFixed(2)}M</p>
                  </div>
                  {canDelete && (
                    <button onClick={() => setHonorarios(prev => prev.filter(x => x.id !== h.id))}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 mt-0.5">
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  )}
                  <button onClick={() => setEditTarget(h)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500/20 mt-0.5">
                    <Edit2 size={12} className="text-indigo-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* UF info box */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={13} className="text-yellow-400" />
          <p className="text-xs font-bold text-yellow-400">¿Por qué cobrar en UF?</p>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          La UF se reajusta diariamente según el IPC, protegiendo los honorarios de la inflación. Los honorarios pactados en UF mantienen su valor real durante toda la duración del caso, independiente del tiempo que tome su resolución.
        </p>
        <p className="text-[10px] text-slate-600 mt-1">Valor UF hoy (CMF): ${UF_VALOR_CLP.toLocaleString('es-CL')} · Fuente: Comisión para el Mercado Financiero</p>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && setEditTarget(null)}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <span className="text-sm font-black text-white">Editar Honorario</span>
                <button onClick={() => setEditTarget(null)}><X size={14} className="text-slate-500" /></button>
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Concepto</p>
                  <input value={editTarget.concepto} onChange={e => setEditTarget(t => t ? { ...t, concepto: e.target.value } : t)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-slate-200 outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">Monto (UF)</p>
                    <input type="number" value={editTarget.montoUF} onChange={e => setEditTarget(t => t ? { ...t, montoUF: parseFloat(e.target.value) || 0, montoCLP: (parseFloat(e.target.value) || 0) * UF_VALOR_CLP } : t)}
                      className="w-full px-3 py-2 rounded-xl text-xs text-slate-200 outline-none"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1">Estado</p>
                    <select value={editTarget.estado} onChange={e => setEditTarget(t => t ? { ...t, estado: e.target.value as Honorario['estado'] } : t)}
                      className="w-full px-3 py-2 rounded-xl text-xs text-slate-200 outline-none"
                      style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                      <option value="vencido">Vencido</option>
                      <option value="parcial">Parcial</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Fecha vencimiento</p>
                  <input type="date" value={editTarget.fechaVencimiento} onChange={e => setEditTarget(t => t ? { ...t, fechaVencimiento: e.target.value } : t)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-slate-200 outline-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <p className="text-[10px] text-slate-600 text-right">= ${(editTarget.montoUF * UF_VALOR_CLP).toLocaleString('es-CL')} CLP</p>
              </div>
              <div className="px-5 pb-5 flex gap-2">
                <button onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400" style={{ background: 'rgba(255,255,255,0.04)' }}>Cancelar</button>
                <button onClick={() => saveEdit(editTarget)} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
                  <Save size={13} />Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
