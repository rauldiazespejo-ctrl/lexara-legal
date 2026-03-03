import { motion } from 'framer-motion'
import { ShieldAlert, Clock, AlertTriangle, BookOpen, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CASOS, PLAZOS_LEGALES } from '../../data/appData'

const ETAPAS_PENAL = [
  { n: 1, label: 'Denuncia / Querella', desc: 'Inicio del procedimiento penal' },
  { n: 2, label: 'Investigación', desc: 'Fiscal dirige la investigación (max. 2 años Art. 247 CPP)', alert: true },
  { n: 3, label: 'Formalización', desc: 'Audiencia de formalización de cargos Art. 230 CPP' },
  { n: 4, label: 'Investigación Formalizada', desc: 'Con medidas cautelares. Plazo judicial.' },
  { n: 5, label: 'Audiencia Preparatoria', desc: 'Art. 259 CPP — Acusación fiscal' },
  { n: 6, label: 'Juicio Oral', desc: 'Art. 281 CPP — Tribunal de Garantía o TOP' },
  { n: 7, label: 'Sentencia', desc: 'Art. 340 CPP — Veredicto y pronunciamiento' },
]

const MEDIDAS_CAUTELARES = [
  { medida: 'Citación', art: 'Art. 123 CPP', intensidad: 'Mínima' },
  { medida: 'Detención', art: 'Art. 125 CPP', intensidad: 'Baja' },
  { medida: 'Prisión preventiva', art: 'Art. 139 CPP', intensidad: 'Máxima' },
  { medida: 'Arresto domiciliario nocturno', art: 'Art. 155 CPP', intensidad: 'Media' },
  { medida: 'Firma periódica', art: 'Art. 155 e) CPP', intensidad: 'Baja' },
  { medida: 'Arraigo nacional', art: 'Art. 155 f) CPP', intensidad: 'Baja' },
]

const INTENSIDAD_COLOR: Record<string, string> = { Mínima: '#22c55e', Baja: '#3b82f6', Media: '#eab308', Máxima: '#ef4444' }

export default function Penal() {
  const casosPenales = CASOS.filter(c => c.especialidad === 'penal')

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <ShieldAlert size={14} className="text-red-400" />
          </div>
          <h1 className="text-xl font-black text-white">Derecho Penal</h1>
        </div>
        <p className="text-xs text-slate-500">Código Procesal Penal · Código Penal · Garantías · Medidas Cautelares</p>
      </motion.div>

      {/* Alerta: días son corridos en penal */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        className="flex items-start gap-2.5 p-3 rounded-2xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-red-400">Cómputo de plazos en materia penal</p>
          <p className="text-[10px] text-slate-400 mt-0.5">En materia penal los plazos se cuentan en <strong className="text-white">días corridos</strong> (incluyendo domingos y festivos), salvo norma expresa en contrario. Art. 14 CPP.</p>
        </div>
      </motion.div>

      {casosPenales.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Causas Penales Activas</span>
            <Link to="/casos" className="text-[10px] text-red-400">Ver todas</Link>
          </div>
          {casosPenales.map((c, i) => (
            <Link to={`/casos/${c.id}`} key={c.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < casosPenales.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.titulo}</p>
                <p className="text-[10px] text-slate-500">{c.rol} · {c.etapa}</p>
              </div>
              <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Flujo proceso penal */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><BookOpen size={13} className="text-red-400" />Etapas del Proceso Penal (CPP)</p>
        <div className="space-y-2">
          {ETAPAS_PENAL.map(e => (
            <div key={e.n} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${e.alert ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-500'}`}>
                {e.n}
              </div>
              <div>
                <span className={`text-xs font-semibold ${e.alert ? 'text-red-400' : 'text-slate-300'}`}>{e.label}</span>
                <p className="text-[10px] text-slate-600">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Medidas cautelares */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><ShieldAlert size={13} className="text-red-400" />Medidas Cautelares Personales</p>
        <div className="space-y-1.5">
          {MEDIDAS_CAUTELARES.map(m => (
            <div key={m.medida} className="flex items-center gap-3 py-1.5 border-b border-white/[0.04] last:border-0">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: INTENSIDAD_COLOR[m.intensidad] }} />
              <span className="text-xs text-slate-300 flex-1">{m.medida}</span>
              <span className="text-[9px] text-slate-600">{m.art}</span>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: `${INTENSIDAD_COLOR[m.intensidad]}15`, color: INTENSIDAD_COLOR[m.intensidad] }}>{m.intensidad}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plazos penales */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><Clock size={13} className="text-red-400" />Plazos Procesales Penales</p>
        <div className="space-y-1.5">
          {PLAZOS_LEGALES.penal.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex-1 pr-3 min-w-0">
                <p className="text-xs text-slate-300 truncate">{p.acto}</p>
                <p className="text-[10px] text-slate-600">{p.articulo}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-white">{p.dias > 0 ? `${p.dias}d` : 'Variable'}</span>
                <span className="text-[9px] text-slate-500">{p.tipo}</span>
                {p.fatal && <AlertTriangle size={10} className="text-red-400" />}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
