import { motion } from 'framer-motion'
import { Briefcase, FileSignature, AlertTriangle, BookOpen, ChevronRight, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CASOS } from '../../data/appData'

const CONTRATOS_MERCANTILES = [
  { tipo: 'Compraventa Mercantil', art: 'Art. 130 CCo', desc: 'Transferencia dominio de cosa mueble o servicio. Perfecto por consentimiento.', riesgo: 'bajo' },
  { tipo: 'Sociedad Anónima', art: 'Art. 1 Ley 18.046', desc: 'SA abierta: > 500 acc. o inscrita en CMF. SA cerrada: escritura pública + estatutos.', riesgo: 'medio' },
  { tipo: 'SpA (SPA)', art: 'Art. 424 CCo', desc: 'Sociedad por acciones. Creación por escritura pública o instrumento privado.', riesgo: 'bajo' },
  { tipo: 'Contrato de Agencia', art: 'Arts. 234–243 CCo', desc: 'Representación estable y remunerada. Irrevocabilidad protegida.', riesgo: 'medio' },
  { tipo: 'Franquicia', art: 'Art. 160 CCo (supletorios)', desc: 'Licencia marca + know-how. Regulado por contrato. Revisar cláusulas penales.', riesgo: 'alto' },
  { tipo: 'Factoring', art: 'Ley 19.983', desc: 'Cesión de facturas. Cedente responde solo de existencia del crédito.', riesgo: 'medio' },
]

const RIESGO_COLOR: Record<string, string> = { bajo: '#22c55e', medio: '#eab308', alto: '#ef4444' }

const CLAUSULAS_ABUSIVAS = [
  { clausula: 'Prórroga tácita indefinida', riesgo: 'alto', norma: 'Art. 16 b) Ley 19.496', remedio: 'Establecer plazo máximo y notificación previa de término.' },
  { clausula: 'Limitación de responsabilidad total', riesgo: 'alto', norma: 'Art. 1547 CC + Art. 16 Ley 19.496', remedio: 'Mantener responsabilidad por dolo y culpa grave. Fijar tope razonable.' },
  { clausula: 'Cláusula penal desproporcionada', riesgo: 'alto', norma: 'Art. 1544 CC', remedio: 'Tribunal puede reducirla. Limitar al daño efectivo previsible.' },
  { clausula: 'Arbitraje forzoso clausulado', riesgo: 'medio', norma: 'Art. 317 COT', remedio: 'Solo válido en materias arbitrables. Cláusula compromisoria debe ser específica.' },
  { clausula: 'Modificación unilateral del contrato', riesgo: 'alto', norma: 'Art. 1545 CC', remedio: 'Toda modificación requiere acuerdo de ambas partes. Prever procedimiento escrito.' },
  { clausula: 'Renuncia anticipada a derechos', riesgo: 'alto', norma: 'Art. 16 a) Ley 19.496', remedio: 'Derechos irrenunciables no pueden limitarse contractualmente.' },
]

const ARBITRAJE = [
  { reglamento: 'CAM Santiago', org: 'Cámara de Comercio de Santiago', monto: 'Sin mínimo', tiempo: '6–18 meses', idioma: 'Español / Inglés' },
  { reglamento: 'CIAR (PULSO)', org: 'Pontificia U. Católica', monto: 'Sin mínimo', tiempo: '6–12 meses', idioma: 'Español' },
  { reglamento: 'ICC', org: 'International Chamber of Commerce', monto: 'USD 100.000+', tiempo: '18–36 meses', idioma: 'Multilingüe' },
  { reglamento: 'UNCITRAL', org: 'CNUDMI (Ad hoc)', monto: 'Flexible', tiempo: 'Variable', idioma: 'Multilingüe' },
]

export default function Comercial() {
  const casosComerciales = CASOS.filter(c => c.especialidad === 'comercial')

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
            <Briefcase size={14} className="text-violet-400" />
          </div>
          <h1 className="text-xl font-black text-white">Derecho Comercial</h1>
        </div>
        <p className="text-xs text-slate-500">Código de Comercio · Ley 18.046 · Arbitraje · Contratos Mercantiles</p>
      </motion.div>

      {casosComerciales.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Causas Comerciales Activas</span>
            <Link to="/casos" className="text-[10px] text-violet-400">Ver todas</Link>
          </div>
          {casosComerciales.map((c, i) => (
            <Link to={`/casos/${c.id}`} key={c.id}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < casosComerciales.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.titulo}</p>
                <p className="text-[10px] text-slate-500">{c.rol} · {c.etapa}</p>
              </div>
              <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {/* Contratos mercantiles */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><BookOpen size={13} className="text-violet-400" />Contratos Mercantiles Frecuentes</p>
        <div className="space-y-2">
          {CONTRATOS_MERCANTILES.map(c => (
            <div key={c.tipo} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-200">{c.tipo}</span>
                <span className="text-[9px] font-bold text-violet-400 px-1.5 py-0.5 rounded-full bg-violet-500/10">{c.art}</span>
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${RIESGO_COLOR[c.riesgo]}15`, color: RIESGO_COLOR[c.riesgo] }}>Riesgo {c.riesgo}</span>
              </div>
              <p className="text-[10px] text-slate-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Cláusulas abusivas */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><Shield size={13} className="text-violet-400" />Cláusulas Abusivas en Contratos</p>
        <div className="space-y-2">
          {CLAUSULAS_ABUSIVAS.map(cl => (
            <div key={cl.clausula} className="p-3 rounded-xl"
              style={{ background: cl.riesgo === 'alto' ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${cl.riesgo === 'alto' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)'}` }}>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold text-slate-200">{cl.clausula}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${RIESGO_COLOR[cl.riesgo]}15`, color: RIESGO_COLOR[cl.riesgo] }}>Riesgo {cl.riesgo}</span>
              </div>
              <p className="text-[10px] text-orange-400 font-semibold">{cl.norma}</p>
              <p className="text-[10px] text-slate-500 mt-1"><span className="text-green-400 font-semibold">Remedio: </span>{cl.remedio}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Arbitraje */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><FileSignature size={13} className="text-violet-400" />Reglamentos de Arbitraje Aplicables</p>
        <div className="space-y-2">
          {ARBITRAJE.map(a => (
            <div key={a.reglamento} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-violet-400">{a.reglamento}</span>
                <span className="text-[10px] text-slate-500">{a.tiempo}</span>
              </div>
              <p className="text-[10px] text-slate-400">{a.org}</p>
              <div className="flex gap-3 mt-1.5">
                <span className="text-[9px] text-slate-600">Monto mín: <span className="text-slate-400">{a.monto}</span></span>
                <span className="text-[9px] text-slate-600">Idioma: <span className="text-slate-400">{a.idioma}</span></span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
          <p className="text-[10px] text-slate-400"><AlertTriangle size={10} className="inline text-violet-400 mr-1" />La cláusula arbitral debe ser específica e indicar el reglamento aplicable. El árbitro arbitrador falla en conciencia; el árbitro arbitratro, conforme a derecho. Art. 223 COT.</p>
        </div>
      </motion.div>
    </div>
  )
}
