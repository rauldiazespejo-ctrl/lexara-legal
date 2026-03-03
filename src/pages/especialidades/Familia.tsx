import { motion } from 'framer-motion'
import { Heart, AlertTriangle, Clock, BookOpen, ChevronRight, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CASOS, PLAZOS_LEGALES } from '../../data/appData'

const TIPOS_FAMILIA = [
  { tipo: 'Divorcio Unilateral', art: 'Art. 55 inc.3 LMC', desc: 'Cese convivencia ≥ 3 años. Se acredita con escritura pública o acta.', requisito: '3 años separación' },
  { tipo: 'Divorcio de Mutuo Acuerdo', art: 'Art. 55 inc.1 LMC', desc: 'Acuerdo completo y suficiente sobre sus relaciones mutuas.', requisito: '1 año separación' },
  { tipo: 'Divorcio por Culpa', art: 'Art. 54 LMC', desc: 'Violencia, infidelidad, abandono o conducta deshonrosa.', requisito: 'Sin plazo mínimo' },
  { tipo: 'Alimentos Menores', art: 'Art. 1 Ley 14.908', desc: 'Mínimo 40% sueldo mínimo 1 hijo / 30% adicionales.', requisito: 'Filiación acreditada' },
  { tipo: 'Tuición / Cuidado personal', art: 'Art. 225 CC', desc: 'Preferencia madre en menores. Bienestar superior del niño.', requisito: 'Interés superior NNA' },
  { tipo: 'Régimen Comunicación', art: 'Art. 229 CC', desc: 'Derecho del padre/madre no custodio a mantener vínculos.', requisito: 'No obstaculización' },
]

const ETAPAS_FAMILIA = [
  { n: 1, label: 'Mediación previa (obligatoria)', desc: 'Art. 106 Ley 19.968 — Alimentos, relación directa y tuición. 60 días.', obligatorio: true },
  { n: 2, label: 'Presentación demanda', desc: 'Con acta de mediación frustrada o exención' },
  { n: 3, label: 'Audiencia preparatoria', desc: 'Art. 61 Ley 19.968 — Dentro de 35 días hábiles' },
  { n: 4, label: 'Audiencia de juicio', desc: 'Art. 64 Ley 19.968 — Prueba y alegatos. Inmediación.' },
  { n: 5, label: 'Sentencia', desc: 'En la audiencia o dentro de 15 días hábiles (Art. 65)' },
]

const TABLA_ALIMENTOS = [
  { hijos: '1 hijo', porcentaje: '40%', minimo: '40% Sueldo Mínimo' },
  { hijos: '2 hijos', porcentaje: '30% c/u', minimo: '30% cada uno' },
  { hijos: '3+ hijos', porcentaje: '30% c/u', minimo: 'Límite 50% total' },
  { hijos: 'Alimentos mayores', porcentaje: 'Proporcional', minimo: 'Según capacidad' },
]

export default function Familia() {
  const casosFamilia = CASOS.filter(c => c.especialidad === 'familia')

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.15)' }}>
            <Heart size={14} className="text-pink-400" />
          </div>
          <h1 className="text-xl font-black text-white">Derecho de Familia</h1>
        </div>
        <p className="text-xs text-slate-500">Ley 19.968 · LMC · Código Civil · Alimentos · NNA</p>
      </motion.div>

      {/* Aviso mediación obligatoria */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        className="flex items-start gap-2.5 p-3 rounded-2xl" style={{ background: 'rgba(236,72,153,0.07)', border: '1px solid rgba(236,72,153,0.2)' }}>
        <AlertTriangle size={13} className="text-pink-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-pink-400">Mediación previa obligatoria</p>
          <p className="text-[10px] text-slate-400 mt-0.5">En causas de alimentos, tuición y régimen de relación directa y regular, la mediación es requisito de procesabilidad. Sin acta de mediación la demanda no es admisible. Art. 106 Ley 19.968.</p>
        </div>
      </motion.div>

      {casosFamilia.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(236,72,153,0.15)' }}>
          <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Causas de Familia Activas</span>
            <Link to="/casos" className="text-[10px] text-pink-400">Ver todas</Link>
          </div>
          {casosFamilia.map((c, i) => (
            <Link to={`/casos/${c.id}`} key={c.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < casosFamilia.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.titulo}</p>
                <p className="text-[10px] text-slate-500">{c.rol} · {c.etapa}</p>
              </div>
              <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Tipos de causas */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><BookOpen size={13} className="text-pink-400" />Materias de Familia</p>
        <div className="space-y-2">
          {TIPOS_FAMILIA.map(t => (
            <div key={t.tipo} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-200">{t.tipo}</span>
                <span className="text-[9px] font-bold text-pink-400 px-1.5 py-0.5 rounded-full bg-pink-500/10">{t.art}</span>
              </div>
              <p className="text-[10px] text-slate-500">{t.desc}</p>
              <p className="text-[10px] text-pink-400 font-semibold mt-1">{t.requisito}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Etapas proceso familia */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><Users size={13} className="text-pink-400" />Flujo Proceso de Familia</p>
        <div className="space-y-2">
          {ETAPAS_FAMILIA.map(e => (
            <div key={e.n} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${e.obligatorio ? 'bg-pink-500/20 text-pink-400' : 'bg-white/5 text-slate-500'}`}
                style={e.obligatorio ? { border: '1px solid rgba(236,72,153,0.3)' } : {}}>
                {e.n}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${e.obligatorio ? 'text-pink-400' : 'text-slate-300'}`}>{e.label}</span>
                  {e.obligatorio && <span className="text-[9px] font-black text-pink-400 px-1.5 py-0.5 rounded-full bg-pink-500/10">OBLIGATORIO</span>}
                </div>
                <p className="text-[10px] text-slate-600">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabla alimentos */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><Heart size={13} className="text-pink-400" />Tabla Referencial Alimentos (Ley 14.908)</p>
        <div className="space-y-1.5">
          {TABLA_ALIMENTOS.map((t, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
              <span className="text-xs text-slate-300 flex-1">{t.hijos}</span>
              <span className="text-xs font-bold text-pink-400">{t.porcentaje}</span>
              <span className="text-[10px] text-slate-600">{t.minimo}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plazos familia */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><Clock size={13} className="text-pink-400" />Plazos en Materia de Familia</p>
        <div className="space-y-1.5">
          {PLAZOS_LEGALES.familia.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex-1 pr-3 min-w-0">
                <p className="text-xs text-slate-300 truncate">{p.acto}</p>
                <p className="text-[10px] text-slate-600">{p.articulo}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-white">{p.dias > 0 ? `${p.dias}d` : 'Previo'}</span>
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
