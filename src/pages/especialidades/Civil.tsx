import { motion } from 'framer-motion'
import { Scale, FileText, Clock, AlertTriangle, BookOpen, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CASOS, PLAZOS_LEGALES } from '../../data/appData'

const ETAPAS_ORDINARIO = [
  { n: 1, label: 'Demanda', desc: 'Art. 254 CPC — Requisitos de la demanda', done: true },
  { n: 2, label: 'Notificación', desc: 'Art. 40 CPC — Notificación personal', done: true },
  { n: 3, label: 'Contestación', desc: 'Art. 258 CPC — 15 días hábiles (FATAL)', done: false, urgent: true },
  { n: 4, label: 'Réplica', desc: 'Art. 311 CPC — 6 días', done: false },
  { n: 5, label: 'Dúplica', desc: 'Art. 311 CPC — 6 días', done: false },
  { n: 6, label: 'Prueba', desc: 'Art. 328 CPC — 20 días', done: false },
  { n: 7, label: 'Sentencia', desc: 'Art. 162 CPC — 60 días', done: false },
]

const ACCIONES_CIVILES = [
  { titulo: 'Acción Reivindicatoria', art: 'Art. 889 CC', desc: 'Recuperación dominio de bien raíz o mueble' },
  { titulo: 'Acción de Cobro', art: 'Art. 2514 CC', desc: 'Prescripción extintiva: 5 años acción ordinaria' },
  { titulo: 'Indemnización de Perjuicios', art: 'Art. 2314 CC', desc: 'Responsabilidad extracontractual · 4 años' },
  { titulo: 'Resolución de Contrato', art: 'Art. 1489 CC', desc: 'Condición resolutoria tácita en contratos bilaterales' },
  { titulo: 'Nulidad Absoluta', art: 'Art. 1682 CC', desc: 'Imprescriptible si está pendiente el contrato' },
  { titulo: 'Medida Precautoria', art: 'Art. 290 CPC', desc: 'Retención, secuestro, prohibición de contratar' },
]

export default function Civil() {
  const casosCiviles = CASOS.filter(c => c.especialidad === 'civil')

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
            <Scale size={14} className="text-blue-400" />
          </div>
          <h1 className="text-xl font-black text-white">Derecho Civil</h1>
        </div>
        <p className="text-xs text-slate-500">Código Civil · Código de Procedimiento Civil · Contratos · Bienes · Responsabilidad</p>
      </motion.div>

      {/* Causas civiles activas */}
      {casosCiviles.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Causas Civiles Activas</span>
            <Link to="/casos" className="text-[10px] text-blue-400">Ver todas</Link>
          </div>
          {casosCiviles.map((c, i) => (
            <Link to={`/casos/${c.id}`} key={c.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < casosCiviles.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.titulo}</p>
                <p className="text-[10px] text-slate-500">{c.rol} · {c.etapa}</p>
              </div>
              <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Flujo Juicio Ordinario */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><FileText size={13} className="text-blue-400" />Flujo: Juicio Ordinario Civil</p>
        <div className="space-y-2">
          {ETAPAS_ORDINARIO.map(e => (
            <div key={e.n} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${e.done ? 'bg-green-500/20 text-green-400' : e.urgent ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-600'}`}
                style={e.urgent ? { border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 8px rgba(239,68,68,0.2)' } : {}}>
                {e.done ? '✓' : e.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${e.done ? 'text-slate-500 line-through' : e.urgent ? 'text-red-400' : 'text-slate-300'}`}>{e.label}</span>
                  {e.urgent && <span className="text-[9px] font-black text-red-400 px-1.5 py-0.5 rounded-full bg-red-500/10">PRÓXIMO</span>}
                </div>
                <p className="text-[10px] text-slate-600">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Acciones civiles comunes */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><BookOpen size={13} className="text-blue-400" />Acciones Civiles Frecuentes</p>
        <div className="space-y-2">
          {ACCIONES_CIVILES.map(a => (
            <div key={a.titulo} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <Scale size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">{a.titulo}</span>
                  <span className="text-[9px] font-bold text-blue-400 px-1.5 py-0.5 rounded-full bg-blue-500/10">{a.art}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plazos civiles rápidos */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><Clock size={13} className="text-blue-400" />Plazos Procesales Civiles Clave</p>
        <div className="space-y-1.5">
          {PLAZOS_LEGALES.civil.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex-1 min-w-0 pr-3">
                <p className="text-xs text-slate-300">{p.acto}</p>
                <p className="text-[10px] text-slate-600">{p.articulo}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-white">{p.dias}d</span>
                <span className="text-[9px] text-slate-500">{p.tipo}</span>
                {p.fatal && <AlertTriangle size={11} className="text-red-400" />}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
