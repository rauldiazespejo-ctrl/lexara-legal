import { motion } from 'framer-motion'
import { useState } from 'react'
import { Zap, AlertTriangle, Clock, BookOpen, Calculator, MapPin, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CASOS } from '../../data/appData'

// Tabla de emplazamiento Art. 258 CPC — plazos según asiento corte
const TABLA_EMPLAZAMIENTO = [
  { territorio: 'Mismo territorio jurisdiccional del tribunal', plazo: 15, tipo: 'hábiles', fatal: true, art: 'Art. 258 inc.1 CPC' },
  { territorio: 'Dentro del territorio de la República, fuera del asiento del tribunal', plazo: 15, adicional: 3, tipo: 'hábiles + 3 días tabla', fatal: true, art: 'Art. 258 inc.2 CPC' },
  { territorio: 'Fuera del territorio de la República', plazo: 15, adicional: null, tipo: 'hábiles + tabla especial', fatal: true, art: 'Art. 259 CPC' },
]

// Tabla de emplazamiento fuera de asiento de corte (Art. 259 CPC)
// Aumentos según distancia desde Santiago
const TABLA_DISTANCIA = [
  { region: 'Región Metropolitana (fuera del tribunal)', dias: 3 },
  { region: "Región de O'Higgins / Valparaíso", dias: 5 },
  { region: 'Región del Maule / Coquimbo', dias: 7 },
  { region: 'Región del Biobío / La Araucanía', dias: 10 },
  { region: 'Región de Los Lagos / Los Ríos', dias: 12 },
  { region: 'Región de Aysén', dias: 18 },
  { region: 'Región de Magallanes', dias: 20 },
  { region: 'Región de Arica / Tarapacá', dias: 10 },
  { region: 'Región de Antofagasta / Atacama', dias: 8 },
  { region: 'América del Sur', dias: 40 },
  { region: 'América del Norte / Europa', dias: 60 },
  { region: 'Asia / África / Oceanía', dias: 90 },
]

const ETAPAS_EJECUTIVO = [
  { n: 1, label: 'Demanda Ejecutiva', desc: 'Art. 434 CPC — Título ejecutivo perfecto. Prescripción 3 años.', fatal: false },
  { n: 2, label: 'Despacho de Ejecución', desc: 'Art. 441 CPC — El tribunal examina título sin audiencia del deudor', fatal: false },
  { n: 3, label: 'Requerimiento de Pago', desc: 'Art. 443 N°1 CPC — Notificación personal al ejecutado. Plazo 4 días.', fatal: true },
  { n: 4, label: 'Embargo', desc: 'Art. 443 N°2 CPC — Si no paga en el acto o en 4 días.', fatal: true },
  { n: 5, label: 'Oposición del Ejecutado', desc: 'Art. 464 CPC — 4 días hábiles desde requerimiento (FATAL)', fatal: true },
  { n: 6, label: 'Traslado Excepciones', desc: 'Art. 466 CPC — 4 días para contestar excepciones', fatal: true },
  { n: 7, label: 'Término Probatorio', desc: 'Art. 468 CPC — 10 días hábiles', fatal: false },
  { n: 8, label: 'Sentencia de Pago/Remate', desc: 'Art. 473 CPC — Sentencia definitiva', fatal: false },
  { n: 9, label: 'Tasación y Remate', desc: 'Art. 486 CPC — Avalúo + publicaciones + subasta', fatal: false },
]

const TITULOS_EJECUTIVOS = [
  { titulo: 'Sentencia firme o ejecutoriada', art: 'Art. 434 N°1 CPC', prescripcion: '3 años' },
  { titulo: 'Copia autorizada de escritura pública', art: 'Art. 434 N°2 CPC', prescripcion: '3 años (5 años acción ordinaria)' },
  { titulo: 'Acta de avenimiento', art: 'Art. 434 N°3 CPC', prescripcion: '3 años' },
  { titulo: 'Instrumento privado reconocido judicialmente', art: 'Art. 434 N°4 CPC', prescripcion: '3 años' },
  { titulo: 'Letra de cambio / pagaré / cheque', art: 'Art. 434 N°4 CPC + Ley 18.092', prescripcion: '1 año (letra/pagaré) · 1 año (cheque)' },
  { titulo: 'Confesión judicial', art: 'Art. 434 N°5 CPC', prescripcion: '3 años' },
  { titulo: 'Cualquier título ejecutivo de origen legal', art: 'Art. 434 N°7 CPC', prescripcion: 'Según ley especial' },
]

// Calculadora de plazo de oposición según ubicación
function CalculadoraEmplazamiento() {
  const [modo, setModo] = useState<'mismo' | 'otra_region' | 'extranjero'>('mismo')
  const [region, setRegion] = useState(TABLA_DISTANCIA[0])

  const plazoBase = 4
  const plazoOposicion = modo === 'mismo' ? plazoBase : modo === 'otra_region' ? plazoBase + region.dias : plazoBase + 90
  const plazoContest = 15 + (modo === 'mismo' ? 0 : region.dias)

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.15)' }}>
      <div className="flex items-center gap-2">
        <Calculator size={13} className="text-yellow-400" />
        <span className="text-xs font-bold text-yellow-300">Calculadora de Emplazamiento (Art. 258–259 CPC)</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {([['mismo', 'Mismo territorio'], ['otra_region', 'Otra región/ciudad'], ['extranjero', 'Extranjero']] as const).map(([val, lbl]) => (
          <button key={val} onClick={() => setModo(val)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${modo === val ? 'text-white' : 'text-slate-500'}`}
            style={modo === val ? { background: 'rgba(234,179,8,0.3)', border: '1px solid rgba(234,179,8,0.5)' } : { background: 'rgba(255,255,255,0.04)' }}>
            {lbl}
          </button>
        ))}
      </div>
      {modo === 'otra_region' && (
        <div>
          <p className="text-[10px] text-slate-500 mb-1">Región del demandado</p>
          <select value={region.region} onChange={e => setRegion(TABLA_DISTANCIA.find(r => r.region === e.target.value) ?? TABLA_DISTANCIA[0])}
            className="w-full px-3 py-2 rounded-xl text-xs text-slate-200 outline-none"
            style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {TABLA_DISTANCIA.slice(0, 9).map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
          </select>
        </div>
      )}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={modo + region.region}
        className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-xl font-black text-red-400">{plazoOposicion}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">días hábiles</p>
          <p className="text-[9px] text-red-400 font-bold mt-1">OPOSICIÓN (FATAL)</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <p className="text-xl font-black text-blue-400">{plazoContest}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">días hábiles</p>
          <p className="text-[9px] text-blue-400 font-bold mt-1">CONTESTACIÓN DEMANDA</p>
        </div>
      </motion.div>
      {modo !== 'mismo' && (
        <p className="text-[9px] text-slate-600">Aumento de {modo === 'otra_region' ? region.dias : 90} días según tabla Art. 259 CPC · {modo === 'otra_region' ? region.region : 'Extranjero'}</p>
      )}
    </div>
  )
}

export default function Ejecutivo() {
  const casosEjecutivos = CASOS.filter(c => c.tipo === 'Juicio Ejecutivo' || c.especialidad === 'civil')

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(234,179,8,0.15)' }}>
            <Zap size={14} className="text-yellow-400" />
          </div>
          <h1 className="text-xl font-black text-white">Juicio Ejecutivo</h1>
        </div>
        <p className="text-xs text-slate-500">Art. 434–544 CPC · Títulos ejecutivos · Embargo · Remate</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
        className="flex items-start gap-2.5 p-3 rounded-2xl" style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.2)' }}>
        <AlertTriangle size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-yellow-400">Plazo de oposición: 4 días hábiles FATALES</p>
          <p className="text-[10px] text-slate-400 mt-0.5">El ejecutado tiene <strong className="text-white">4 días hábiles</strong> desde el requerimiento de pago para oponer excepciones. Vencido el plazo, el tribunal dicta sentencia de pago sin más trámite. Art. 462 CPC.</p>
        </div>
      </motion.div>

      <CalculadoraEmplazamiento />

      {/* Tabla de emplazamiento */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><MapPin size={13} className="text-yellow-400" />Tabla de Emplazamiento — Art. 258-259 CPC</p>
        <div className="space-y-2">
          {TABLA_EMPLAZAMIENTO.map((t, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-bold text-yellow-400 px-1.5 py-0.5 rounded-full bg-yellow-500/10">{t.art}</span>
                {t.fatal && <span className="text-[9px] font-black text-red-400 px-1.5 py-0.5 rounded-full bg-red-500/10">FATAL</span>}
              </div>
              <p className="text-xs text-slate-200 font-semibold">{t.territorio}</p>
              <p className="text-[10px] text-yellow-400 font-bold mt-1">Plazo: {t.plazo} días {t.adicional ? `+ ${t.adicional} días` : ''} {t.tipo}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.12)' }}>
          <p className="text-[10px] text-slate-400"><strong className="text-yellow-400">Nota:</strong> Los plazos de emplazamiento son <strong className="text-white">fatales</strong> para el ejecutado al oponer excepciones. Para el demandante en juicio ordinario, el plazo de contestación de 15 días se aumenta según tabla.</p>
        </div>
      </motion.div>

      {/* Etapas */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><BookOpen size={13} className="text-yellow-400" />Flujo del Juicio Ejecutivo</p>
        <div className="space-y-2">
          {ETAPAS_EJECUTIVO.map(e => (
            <div key={e.n} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5 ${e.fatal ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-500'}`}
                style={e.fatal ? { border: '1px solid rgba(239,68,68,0.3)' } : {}}>
                {e.n}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${e.fatal ? 'text-red-400' : 'text-slate-300'}`}>{e.label}</span>
                  {e.fatal && <span className="text-[9px] font-black text-red-400 px-1.5 py-0.5 rounded-full bg-red-500/10">FATAL</span>}
                </div>
                <p className="text-[10px] text-slate-600">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Títulos ejecutivos */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><Zap size={13} className="text-yellow-400" />Títulos Ejecutivos (Art. 434 CPC)</p>
        <div className="space-y-2">
          {TITULOS_EJECUTIVOS.map(t => (
            <div key={t.titulo} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0 mt-1.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-200">{t.titulo}</span>
                  <span className="text-[9px] font-bold text-yellow-400 px-1.5 py-0.5 rounded-full bg-yellow-500/10">{t.art}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">Prescripción: {t.prescripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
