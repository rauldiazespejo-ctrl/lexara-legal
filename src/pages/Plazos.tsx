import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, AlertTriangle, CheckCircle, Calculator, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { PLAZOS, PLAZOS_LEGALES } from '../data/appData'
import type { Specialty, TipoPlazo } from '../types'

const RISK_COLORS = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e', ok: '#3b82f6' }
const TIPO_LABELS: Record<TipoPlazo, string> = {
  fatal_civil: 'Fatal Civil (CPC)', fatal_penal: 'Fatal Penal (CPP)',
  fatal_laboral: 'Fatal Laboral', fatal_familia: 'Fatal Familia',
  no_fatal: 'No Fatal', prescripcion: 'Prescripción',
  caducidad: 'Caducidad', abandono: 'Abandono Art.152',
}
const SPEC_COLORS: Partial<Record<Specialty, string>> = {
  civil: '#3b82f6', laboral: '#22c55e', penal: '#ef4444',
  familia: '#ec4899', tributario: '#f97316', comercial: '#8b5cf6',
}

function PlazoCard({ p, idx }: { p: typeof PLAZOS[0]; idx: number }) {
  const [open, setOpen] = useState(false)
  const urgency = p.diasRestantes <= 1 ? 'critical' : p.diasRestantes <= 5 ? 'high' : p.diasRestantes <= 14 ? 'medium' : 'low'
  const color = RISK_COLORS[urgency]

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(15,23,42,0.75)', border: `1px solid ${color}30` }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors text-left">
        {/* Days gauge */}
        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
          style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
          <span className="text-lg font-black leading-none" style={{ color }}>{p.diasRestantes}</span>
          <span className="text-[8px] text-slate-500 font-semibold">días</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {p.fatal && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-red-400"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>FATAL</span>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
              style={{ background: `${SPEC_COLORS[p.especialidad] || '#3b82f6'}12`, color: SPEC_COLORS[p.especialidad] || '#3b82f6' }}>
              {p.especialidad}
            </span>
          </div>
          <p className="text-xs font-bold text-white mt-0.5 leading-tight">{p.descripcion}</p>
          <p className="text-[10px] text-slate-500 truncate">{p.casoTitulo}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-[10px] text-slate-600">Vence</p>
          <p className="text-[11px] font-semibold text-slate-400">{p.fechaVencimiento}</p>
          {open ? <ChevronUp size={13} className="text-slate-600 ml-auto mt-1" /> : <ChevronDown size={13} className="text-slate-600 ml-auto mt-1" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/[0.05]">
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                <AlertTriangle size={13} style={{ color }} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold" style={{ color }}>Acción Requerida</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.accionRequerida}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-[10px] text-slate-600">Tipo de plazo</p>
                  <p className="font-semibold text-slate-300 mt-0.5">{TIPO_LABELS[p.tipo]}</p>
                </div>
                <div className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-[10px] text-slate-600">Fundamento legal</p>
                  <p className="font-semibold text-slate-300 mt-0.5">{p.articulo || '—'}</p>
                </div>
                <div className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-[10px] text-slate-600">Responsable</p>
                  <p className="font-semibold text-slate-300 mt-0.5">{p.responsable}</p>
                </div>
                <div className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-[10px] text-slate-600">Inicio cómputo</p>
                  <p className="font-semibold text-slate-300 mt-0.5">{p.fechaInicio}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Calculadora de plazos ────────────────────────────────────────────────────
function CalculadoraPlazos() {
  const [esp, setEsp] = useState<keyof typeof PLAZOS_LEGALES>('civil')
  const [fecha, setFecha] = useState('')
  const [selected, setSelected] = useState(0)
  const [resultado, setResultado] = useState<string | null>(null)

  const calcular = () => {
    if (!fecha) return
    const acto = PLAZOS_LEGALES[esp][selected]
    const start = new Date(fecha)
    let dias = acto.dias
    if (acto.tipo === 'hábiles') {
      // sumar días hábiles (lun-sáb)
      let count = 0; const d = new Date(start)
      while (count < dias) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) count++ }
      setResultado(d.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    } else {
      start.setDate(start.getDate() + dias)
      setResultado(start.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }
  }

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(29,78,216,0.2)' }}>
      <div className="flex items-center gap-2">
        <Calculator size={14} className="text-blue-400" />
        <span className="text-xs font-bold text-blue-300">Calculadora de Plazos Legales</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] text-slate-500 mb-1">Especialidad</p>
          <select value={esp} onChange={e => { setEsp(e.target.value as keyof typeof PLAZOS_LEGALES); setSelected(0); setResultado(null) }}
            className="w-full px-2 py-1.5 rounded-xl text-xs text-slate-300 outline-none"
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="civil">Civil (CPC)</option>
            <option value="laboral">Laboral</option>
            <option value="penal">Penal (CPP)</option>
            <option value="familia">Familia</option>
            <option value="tributario">Tributario</option>
          </select>
        </div>
        <div>
          <p className="text-[10px] text-slate-500 mb-1">Fecha inicio cómputo</p>
          <input type="date" value={fecha} onChange={e => { setFecha(e.target.value); setResultado(null) }}
            className="w-full px-2 py-1.5 rounded-xl text-xs text-slate-300 outline-none"
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
        </div>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 mb-1">Acto procesal</p>
        <select value={selected} onChange={e => { setSelected(+e.target.value); setResultado(null) }}
          className="w-full px-2 py-1.5 rounded-xl text-xs text-slate-300 outline-none"
          style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {PLAZOS_LEGALES[esp].map((a, i) => (
            <option key={i} value={i}>{a.acto} ({a.dias} {a.tipo}){a.fatal ? ' ★FATAL' : ''}</option>
          ))}
        </select>
      </div>
      <button onClick={calcular}
        className="w-full py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
        Calcular Fecha de Vencimiento
      </button>
      <AnimatePresence>
        {resultado && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <CheckCircle size={13} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500">Vencimiento calculado</p>
              <p className="text-xs font-bold text-green-400 capitalize">{resultado}</p>
              {PLAZOS_LEGALES[esp][selected].fatal && (
                <p className="text-[9px] text-red-400 mt-0.5">⚠ Plazo fatal — improrrogable por ley</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Plazos() {
  const [showCalc, setShowCalc] = useState(false)
  const [filterEsp, setFilterEsp] = useState<'todos' | Specialty>('todos')

  const urgentes = PLAZOS.filter(p => p.diasRestantes <= 7)
  const filtered = PLAZOS.filter(p => filterEsp === 'todos' || p.especialidad === filterEsp)
    .sort((a, b) => a.diasRestantes - b.diasRestantes)

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Control de Plazos</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            <span className="text-red-400 font-bold">{urgentes.length} urgentes</span> · {PLAZOS.filter(p => p.fatal).length} plazos fatales activos
          </p>
        </div>
        <button onClick={() => setShowCalc(!showCalc)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0"
          style={showCalc ? { background: 'rgba(29,78,216,0.3)', border: '1px solid rgba(99,102,241,0.4)', color: '#93c5fd' } : { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}>
          <Calculator size={13} />
          <span className="hidden sm:inline">Calculadora</span>
        </button>
      </motion.div>

      <AnimatePresence>{showCalc && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><CalculadoraPlazos /></motion.div>}</AnimatePresence>

      {/* Filter bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(['todos', 'civil', 'laboral', 'penal', 'familia', 'tributario'] as const).map(f => (
          <button key={f} onClick={() => setFilterEsp(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${filterEsp === f ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={filterEsp === f ? { background: `${SPEC_COLORS[f as Specialty] || '#3b82f6'}20`, border: `1px solid ${SPEC_COLORS[f as Specialty] || '#3b82f6'}40`, color: SPEC_COLORS[f as Specialty] || '#3b82f6' } : { background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {f === 'todos' ? 'Todos' : f}
          </button>
        ))}
        <div className="flex items-center gap-1 ml-auto flex-shrink-0 text-[10px] text-slate-600">
          <Filter size={10} />ordenado por urgencia
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((p, i) => <PlazoCard key={p.id} p={p} idx={i} />)}
      </div>
    </div>
  )
}
