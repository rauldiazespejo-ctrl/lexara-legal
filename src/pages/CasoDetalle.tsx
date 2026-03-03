import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Scale, Clock, Gavel, FileText, Target, TrendingUp, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Circle } from 'lucide-react'
import { CASOS } from '../data/appData'

const TABS = [
  { id: 'teoria', label: 'Teoría del Caso', icon: Target },
  { id: 'historial', label: 'Historial', icon: Clock },
  { id: 'audiencias', label: 'Audiencias', icon: Gavel },
  { id: 'documentos', label: 'Documentos', icon: FileText },
]

const ESTADO_COLORS = { fuerte: '#22c55e', debil: '#f97316', pendiente: '#64748b' }
const ESTADO_LABELS = { fuerte: 'Sólido', debil: 'Débil', pendiente: 'Pendiente' }

export default function CasoDetalle() {
  const { id } = useParams()
  const caso = CASOS.find(c => c.id === id) || CASOS[0]
  const [activeTab, setActiveTab] = useState('teoria')
  const [expandedPillar, setExpandedPillar] = useState<string | null>('hechos')

  const t = caso.teoriaDelCaso

  return (
    <div className="space-y-4">
      {/* Back + header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/casos" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-3 transition-colors">
          <ArrowLeft size={13} /><span>Causas</span>
        </Link>
        <div className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-blue-400" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>{caso.rol}</span>
                <span className="text-[10px] text-slate-500 capitalize">{caso.especialidad}</span>
              </div>
              <h1 className="text-base font-black text-white mt-1 leading-snug">{caso.titulo}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{caso.tribunal}</p>
              <div className="flex gap-4 mt-3">
                <div><p className="text-[10px] text-slate-600">Etapa</p><p className="text-xs font-semibold text-slate-300">{caso.etapa}</p></div>
                <div><p className="text-[10px] text-slate-600">Abogado</p><p className="text-xs font-semibold text-slate-300">{caso.abogado}</p></div>
                <div><p className="text-[10px] text-slate-600">Valor</p><p className="text-xs font-semibold text-yellow-400">{caso.valorCausa} UF</p></div>
              </div>
            </div>
            {/* Probability circle */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative w-16 h-16">
                <svg className="-rotate-90 absolute inset-0" width="64" height="64">
                  <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="none" />
                  <circle cx="32" cy="32" r="26"
                    stroke={caso.probabilidadExito > 70 ? '#22c55e' : caso.probabilidadExito > 50 ? '#eab308' : '#ef4444'}
                    strokeWidth="5" fill="none"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - caso.probabilidadExito / 100)}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 4px ${caso.probabilidadExito > 70 ? '#22c55e' : '#eab308'})` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-black" style={{ color: caso.probabilidadExito > 70 ? '#22c55e' : '#eab308' }}>{caso.probabilidadExito}%</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-600 mt-1">Prob. Éxito</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-0.5">
        {TABS.map(({ id: tid, label, icon: Icon }) => (
          <button key={tid} onClick={() => setActiveTab(tid)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${activeTab === tid ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={activeTab === tid ? { background: 'rgba(29,78,216,0.25)', border: '1px solid rgba(99,102,241,0.35)' } : { background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Icon size={12} />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

          {/* ── TEORÍA DEL CASO ── */}
          {activeTab === 'teoria' && (
            <div className="space-y-3">
              {/* Completitud */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-blue-400" />
                    <span className="text-xs font-bold text-slate-300">Completitud de la Teoría</span>
                  </div>
                  <span className="text-sm font-black text-blue-400">{t.completitud}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${t.completitud}%`, background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)' }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 italic leading-relaxed">{t.estrategia}</p>
              </div>

              {/* Los 3 pilares */}
              {([
                { key: 'hechos', label: '⚖️ Hechos', data: t.hechos },
                { key: 'derecho', label: '📚 Derecho', data: t.derecho },
                { key: 'prueba', label: '🔎 Prueba', data: t.prueba },
              ] as const).map(({ key, label, data }) => (
                <div key={key} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <button onClick={() => setExpandedPillar(expandedPillar === key ? null : key)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{label}</span>
                      <span className="text-[10px] text-slate-500">({data.length} elementos)</span>
                    </div>
                    {expandedPillar === key ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedPillar === key && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-2 border-t border-white/[0.04] pt-3">
                          {data.map(item => (
                            <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${ESTADO_COLORS[item.estado]}20` }}>
                              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: `${ESTADO_COLORS[item.estado]}15` }}>
                                {item.estado === 'fuerte' ? <CheckCircle size={11} style={{ color: ESTADO_COLORS[item.estado] }} /> :
                                 item.estado === 'debil' ? <AlertTriangle size={11} style={{ color: ESTADO_COLORS[item.estado] }} /> :
                                 <Circle size={11} style={{ color: ESTADO_COLORS[item.estado] }} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-300 leading-relaxed">{item.descripcion}</p>
                                {item.evidencia && <p className="text-[10px] text-slate-500 mt-1 italic">{item.evidencia}</p>}
                              </div>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{ background: `${ESTADO_COLORS[item.estado]}15`, color: ESTADO_COLORS[item.estado] }}>
                                {ESTADO_LABELS[item.estado]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Fortalezas / Debilidades */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <p className="text-xs font-bold text-green-400 mb-2">✓ Fortalezas</p>
                  {t.fortalezas.map((f, i) => <p key={i} className="text-[11px] text-slate-400 mb-1">• {f}</p>)}
                </div>
                <div className="rounded-2xl p-4" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <p className="text-xs font-bold text-red-400 mb-2">⚠ Debilidades</p>
                  {t.debilidades.map((d, i) => <p key={i} className="text-[11px] text-slate-400 mb-1">• {d}</p>)}
                </div>
              </div>
            </div>
          )}

          {/* ── HISTORIAL ── */}
          {activeTab === 'historial' && (
            <div className="space-y-2">
              {caso.historial.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-8">Sin movimientos registrados</p>
              ) : caso.historial.map((mv, i) => (
                <div key={mv.id} className="flex gap-3 p-4 rounded-2xl" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                    {i < caso.historial.length - 1 && <div className="w-0.5 flex-1 bg-slate-800" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white capitalize">{mv.tipo.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-600">{mv.fecha}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{mv.descripcion}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{mv.autor}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── AUDIENCIAS ── */}
          {activeTab === 'audiencias' && (
            <div className="space-y-2">
              {caso.audiencias.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-8">Sin audiencias registradas</p>
              ) : caso.audiencias.map(a => (
                <div key={a.id} className="p-4 rounded-2xl" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">{a.tipo}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.estado === 'programada' ? 'text-blue-400 bg-blue-500/10' : a.estado === 'realizada' ? 'text-green-400 bg-green-500/10' : 'text-orange-400 bg-orange-500/10'}`}>
                      {a.estado}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{a.fecha} · {a.hora} · {a.sala}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── DOCUMENTOS ── */}
          {activeTab === 'documentos' && (
            <div className="space-y-2">
              {caso.documentos.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-white/[0.02] transition-colors"
                  style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <FileText size={15} className="text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{doc.nombre}</p>
                    <p className="text-[10px] text-slate-500">{doc.tipo} · {doc.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  )
}
