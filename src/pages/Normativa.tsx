// @ts-nocheck
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search, Scale, ChevronDown, ChevronUp, ExternalLink, Plus, Trash2, X, Save, Shield } from 'lucide-react'
import { CHILEAN_LEGAL_REFERENCES, NORMATIVA_POR_ESPECIALIDAD } from '../data/legalDatabase'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  { id: 'all', label: 'Todos los artículos' },
  { id: 'Código Civil', label: 'Código Civil' },
  { id: 'Ley 19.496', label: 'LPDC' },
  { id: 'Código de Comercio', label: 'Cód. Comercio' },
  { id: 'COT', label: 'COT / Arbitraje' },
  { id: 'Código del Trabajo', label: 'Laboral' },
  { id: 'Código Tributario', label: 'Tributario' },
  { id: 'Código Penal', label: 'Penal' },
  { id: 'Ley 18.101', label: 'Arrendamiento' },
  { id: 'Personalizado', label: 'Mis normas' },
]

const EMPTY_NORMA = { id: '', article: '', law: '', description: '', relevance: '', custom: true }

function NuevaNormaModal({ onClose, onSave }: { onClose: () => void; onSave: (n: any) => void }) {
  const [form, setForm] = useState({ article: '', law: '', description: '', relevance: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.article.trim()) e.article = 'Requerido'
    if (!form.law.trim()) e.law = 'Requerido'
    if (!form.description.trim()) e.description = 'Requerido'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave({ ...form, id: `custom_${Date.now()}`, custom: true })
    onClose()
  }

  const inp = (err?: string) =>
    `w-full px-3 py-2 rounded-xl text-xs text-slate-200 outline-none ${err ? 'border-red-500/50' : ''}`
  const style = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
              <Plus size={14} className="text-white" />
            </div>
            <span className="text-sm font-black text-white">Agregar Norma / Ley</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06]"><X size={14} className="text-slate-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] text-slate-500 mb-1 block">Artículo / Norma *</label>
            <input value={form.article} onChange={e => setForm(f => ({ ...f, article: e.target.value }))} placeholder="Ej: Art. 1546 CC"
              className={inp(errors.article)} style={style} />
            {errors.article && <p className="text-[10px] text-red-400 mt-0.5">{errors.article}</p>}
          </div>
          <div>
            <label className="text-[10px] text-slate-500 mb-1 block">Ley / Cuerpo normativo *</label>
            <input value={form.law} onChange={e => setForm(f => ({ ...f, law: e.target.value }))} placeholder="Ej: Código Civil, Ley 19.496"
              className={inp(errors.law)} style={style} />
            {errors.law && <p className="text-[10px] text-red-400 mt-0.5">{errors.law}</p>}
          </div>
          <div>
            <label className="text-[10px] text-slate-500 mb-1 block">Descripción / Texto *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Texto o resumen del artículo..." className={`${inp(errors.description)} resize-none`} style={style} />
            {errors.description && <p className="text-[10px] text-red-400 mt-0.5">{errors.description}</p>}
          </div>
          <div>
            <label className="text-[10px] text-slate-500 mb-1 block">Relevancia / Contexto de aplicación</label>
            <input value={form.relevance} onChange={e => setForm(f => ({ ...f, relevance: e.target.value }))}
              placeholder="Cuándo y cómo aplica" className={inp()} style={style} />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400"
            style={{ background: 'rgba(255,255,255,0.04)' }}>Cancelar</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
            <Save size={13} />Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Normativa() {
  const { canEditFramework, canDelete } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [customNormas, setCustomNormas] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [viewMode, setViewMode] = useState<'articulos' | 'especialidades'>('especialidades')
  const [expandedEsp, setExpandedEsp] = useState<string | null>(null)

  const allRefs = [...CHILEAN_LEGAL_REFERENCES, ...customNormas]

  const filtered = allRefs.filter(ref => {
    const matchSearch = search === '' ||
      ref.article?.toLowerCase().includes(search.toLowerCase()) ||
      ref.description?.toLowerCase().includes(search.toLowerCase()) ||
      ref.law?.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' ||
      (category === 'Personalizado' ? ref.custom : ref.law?.includes(category))
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Normativa Legal</h1>
          <p className="text-xs text-slate-400 mt-1">CC · Cód. Comercio · LPDC · Laboral · Penal · Tributario · Arbitraje</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {[{ key: 'especialidades', label: 'Por Materia' }, { key: 'articulos', label: 'Artículos' }].map(m => (
              <button key={m.key} onClick={() => setViewMode(m.key as typeof viewMode)}
                className="px-3 py-1.5 text-xs font-medium transition-all"
                style={viewMode === m.key ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' } : { background: 'transparent', color: '#64748b' }}>
                {m.label}
              </button>
            ))}
          </div>
          {canEditFramework && (
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
              <Plus size={13} /><span className="hidden sm:inline">Nueva Norma</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {canEditFramework && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <Shield size={11} className="text-indigo-400" />
          <p className="text-[10px] text-slate-500">SuperAdmin: puedes agregar y eliminar normas del marco teórico</p>
        </div>
      )}

      {/* Vista por especialidad */}
      {viewMode === 'especialidades' && (
        <div className="space-y-3">
          {Object.entries(NORMATIVA_POR_ESPECIALIDAD).map(([key, esp]) => (
            <motion.div key={key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid rgba(255,255,255,0.07)` }}>
              <button onClick={() => setExpandedEsp(expandedEsp === key ? null : key)}
                className="w-full p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-all text-left">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${esp.color}15`, border: `1px solid ${esp.color}30` }}>
                  <Scale size={14} style={{ color: esp.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{esp.label}</p>
                  <p className="text-[10px] text-slate-500">{esp.normas.length} cuerpos normativos</p>
                </div>
                {expandedEsp === key ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
              </button>

              <AnimatePresence>
                {expandedEsp === key && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/[0.05]">
                    <div className="p-4 space-y-3">
                      {esp.normas.map((norma, ni) => (
                        <div key={ni} className="p-4 rounded-xl"
                          style={{ background: `${esp.color}06`, border: `1px solid ${esp.color}20` }}>
                          <p className="text-xs font-bold mb-2" style={{ color: esp.color }}>{norma.titulo}</p>
                          {/* Artículos */}
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {norma.arts.map((a, ai) => (
                              <span key={ai} className="text-[10px] px-2 py-0.5 rounded-full text-slate-400"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                {a}
                              </span>
                            ))}
                          </div>
                          {/* Texto completo */}
                          <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <p className="text-xs text-slate-300 leading-relaxed">{norma.texto}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Vista por artículos */}
      {viewMode === 'articulos' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar artículo, ley o descripción..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none"
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(59,130,246,0.15)' }} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${category === cat.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  style={category === cat.id
                    ? { background: 'linear-gradient(135deg,rgba(29,78,216,0.3),rgba(124,58,237,0.3))', border: '1px solid rgba(99,102,241,0.4)' }
                    : { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {cat.label}
                  {cat.id === 'Personalizado' && customNormas.length > 0 && (
                    <span className="ml-1 text-[9px] font-black text-indigo-400 bg-indigo-500/20 px-1 rounded-full">{customNormas.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-600 text-sm">
                No se encontraron referencias {search ? `para "${search}"` : ''}
                {canEditFramework && <p className="text-[11px] text-indigo-400 mt-2 cursor-pointer hover:underline" onClick={() => setShowModal(true)}>+ Agregar nueva norma</p>}
              </div>
            )}
            {filtered.map((ref, i) => (
              <motion.div key={ref.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-2xl overflow-hidden group"
                style={{ background: 'rgba(15,23,42,0.8)', border: `1px solid ${ref.custom ? 'rgba(99,102,241,0.2)' : 'rgba(59,130,246,0.1)'}` }}>
                <button onClick={() => setExpanded(expanded === ref.id ? null : ref.id)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-white/[0.02] transition-colors text-left">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: ref.custom ? 'rgba(99,102,241,0.1)' : 'rgba(59,130,246,0.1)', border: `1px solid ${ref.custom ? 'rgba(99,102,241,0.25)' : 'rgba(59,130,246,0.2)'}` }}>
                    <Scale size={14} className={ref.custom ? 'text-indigo-400' : 'text-blue-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold ${ref.custom ? 'text-indigo-400' : 'text-blue-400'}`}>{ref.article}</span>
                      <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{ref.law}</span>
                      {ref.custom && <span className="text-[9px] font-black text-indigo-400 px-1.5 py-0.5 rounded-full bg-indigo-500/10">PERSONALIZADO</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate pr-4">{ref.description}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {canDelete && ref.custom && (
                      <button onClick={e => { e.stopPropagation(); setCustomNormas(prev => prev.filter(n => n.id !== ref.id)) }}
                        className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all">
                        <Trash2 size={11} className="text-red-400" />
                      </button>
                    )}
                    {expanded === ref.id ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                  </div>
                </button>

                <AnimatePresence>
                  {expanded === ref.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
                        <div className="p-4 rounded-xl" style={{ background: ref.custom ? 'rgba(99,102,241,0.06)' : 'rgba(59,130,246,0.05)', border: `1px solid ${ref.custom ? 'rgba(99,102,241,0.12)' : 'rgba(59,130,246,0.1)'}` }}>
                          <div className="flex items-start gap-2">
                            <BookOpen size={13} className={`${ref.custom ? 'text-indigo-400' : 'text-blue-400'} mt-0.5 flex-shrink-0`} />
                            <div className="space-y-2">
                              <p className="text-xs text-slate-300 leading-relaxed">{ref.description}</p>
                              {ref.relevance && <p className="text-[10px] text-slate-500"><span className="text-slate-400 font-semibold">Aplicación:</span> {ref.relevance}</p>}
                              {!ref.custom && (
                                <div className="flex items-center gap-2 mt-2">
                                  <a href="https://www.bcn.cl" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
                                    <ExternalLink size={10} />Ver texto oficial — Biblioteca del Congreso
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <AnimatePresence>
        {showModal && <NuevaNormaModal onClose={() => setShowModal(false)} onSave={n => setCustomNormas(prev => [...prev, n])} />}
      </AnimatePresence>
    </div>
  )
}
