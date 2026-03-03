import { motion } from 'framer-motion'
import { Gavel, Calculator, AlertTriangle, CheckCircle, BookOpen, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { CASOS, PLAZOS_LEGALES } from '../../data/appData'

const PROCEDIMIENTOS = [
  { titulo: 'Procedimiento de Aplicación General (NLPT)', art: 'Art. 446 CT', desc: 'Para causas > 10 UF. Audiencia preparatoria + juicio oral.', dias: 60, fatal: true },
  { titulo: 'Procedimiento Monitorio', art: 'Art. 496 CT', desc: 'Causas ≤ 10 UF o no remuneratorias.', dias: 10, fatal: true },
  { titulo: 'Tutela Laboral', art: 'Art. 485 CT', desc: 'Vulneración derechos fundamentales. 60 días desde el acto.', dias: 60, fatal: true },
  { titulo: 'Práctica Antisindical', art: 'Art. 291 CT', desc: '60 días desde conocimiento del hecho.', dias: 60, fatal: true },
]

const INDEMNIZACIONES = [
  { concepto: 'Aviso previo (1 mes)', base: 'Última remuneración' },
  { concepto: 'Años de servicio (1 mes/año, máx 11)', base: 'Última remuneración' },
  { concepto: 'Recargo Art. 168: sin causal', base: '+80% indemnización años servicio' },
  { concepto: 'Recargo Art. 168: causal improcedente', base: '+30% a +50%' },
  { concepto: 'Tutela: hasta 11 meses remuneración', base: 'Monto total de remuneraciones' },
  { concepto: 'Daño moral (responsabilidad excontractual)', base: 'Criterio judicial' },
]

// Calculadora de finiquito
function CalculadoraFiniquito() {
  const [sueldo, setSueldo] = useState('')
  const [anios, setAnios] = useState('')
  const [tipo, setTipo] = useState('sin_causal')
  const [resultado, setResultado] = useState<{ aviso: number; anios: number; recargo: number; total: number } | null>(null)

  const calcular = () => {
    const s = parseFloat(sueldo) || 0
    const a = Math.min(parseFloat(anios) || 0, 11)
    const aviso = s
    const indAnios = s * a
    const recargoPct = tipo === 'sin_causal' ? 0.8 : tipo === 'causal_improcedente' ? 0.5 : 0.3
    const recargo = indAnios * recargoPct
    setResultado({ aviso, anios: indAnios, recargo, total: aviso + indAnios + recargo })
  }

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
      <div className="flex items-center gap-2">
        <Calculator size={13} className="text-green-400" />
        <span className="text-xs font-bold text-green-300">Calculadora de Finiquito (Art. 168 CT)</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] text-slate-500 mb-1">Última remuneración ($)</p>
          <input type="number" value={sueldo} onChange={e => setSueldo(e.target.value)} placeholder="Ej: 1500000"
            className="w-full px-2.5 py-1.5 rounded-xl text-xs text-slate-300 outline-none"
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 mb-1">Años de servicio</p>
          <input type="number" value={anios} onChange={e => setAnios(e.target.value)} placeholder="Máx. 11"
            className="w-full px-2.5 py-1.5 rounded-xl text-xs text-slate-300 outline-none"
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
      </div>
      <div>
        <p className="text-[10px] text-slate-500 mb-1">Causal del despido</p>
        <select value={tipo} onChange={e => setTipo(e.target.value)}
          className="w-full px-2.5 py-1.5 rounded-xl text-xs text-slate-300 outline-none"
          style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <option value="sin_causal">Sin expresión de causa (+80%)</option>
          <option value="causal_improcedente">Causal improcedente (+50%)</option>
          <option value="necesidades">Necesidades empresa (+30%)</option>
        </select>
      </div>
      <button onClick={calcular} className="w-full py-2 rounded-xl text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#059669,#0284c7)' }}>
        Calcular Finiquito
      </button>
      {resultado && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="space-y-1.5 p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)' }}>
          {[
            { label: 'Aviso previo', val: resultado.aviso },
            { label: 'Años de servicio', val: resultado.anios },
            { label: 'Recargo legal', val: resultado.recargo },
          ].map(r => (
            <div key={r.label} className="flex justify-between text-xs">
              <span className="text-slate-400">{r.label}</span>
              <span className="font-semibold text-slate-300">${r.val.toLocaleString('es-CL')}</span>
            </div>
          ))}
          <div className="flex justify-between text-xs font-black pt-1.5 border-t border-white/10">
            <span className="text-green-400">TOTAL ESTIMADO</span>
            <span className="text-green-400">${resultado.total.toLocaleString('es-CL')}</span>
          </div>
          <p className="text-[9px] text-slate-600">* No incluye feriados proporcionales ni otros beneficios contractuales</p>
        </motion.div>
      )}
    </div>
  )
}

export default function Laboral() {
  const casosLaborales = CASOS.filter(c => c.especialidad === 'laboral')

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <Gavel size={14} className="text-green-400" />
          </div>
          <h1 className="text-xl font-black text-white">Derecho Laboral</h1>
        </div>
        <p className="text-xs text-slate-500">Código del Trabajo · NLPT · Tutela Laboral · Negociación Colectiva</p>
      </motion.div>

      {casosLaborales.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Causas Laborales Activas</span>
            <Link to="/casos" className="text-[10px] text-green-400">Ver todas</Link>
          </div>
          {casosLaborales.map((c, i) => (
            <Link to={`/casos/${c.id}`} key={c.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < casosLaborales.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.titulo}</p>
                <p className="text-[10px] text-slate-500">{c.rol} · {c.etapa}</p>
              </div>
              <span className="text-xs font-black text-green-400 flex-shrink-0">{c.probabilidadExito}%</span>
              <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      <CalculadoraFiniquito />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><BookOpen size={13} className="text-green-400" />Procedimientos NLPT</p>
        <div className="space-y-2">
          {PROCEDIMIENTOS.map(p => (
            <div key={p.titulo} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-200">{p.titulo}</span>
                <span className="text-[9px] font-bold text-green-400 px-1.5 py-0.5 rounded-full bg-green-500/10">{p.art}</span>
                {p.fatal && <AlertTriangle size={10} className="text-red-400 ml-auto" />}
              </div>
              <p className="text-[10px] text-slate-500">{p.desc}</p>
              <p className="text-[10px] text-green-400 mt-1 font-semibold">Plazo: {p.dias} días hábiles{p.fatal ? ' (FATAL)' : ''}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><CheckCircle size={13} className="text-green-400" />Componentes del Finiquito</p>
        <div className="space-y-1.5">
          {INDEMNIZACIONES.map((ind, i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 border-b border-white/[0.04] last:border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
              <div className="flex-1">
                <span className="text-xs text-slate-300">{ind.concepto}</span>
                <p className="text-[10px] text-slate-600">{ind.base}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
