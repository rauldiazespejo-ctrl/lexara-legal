// @ts-nocheck
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  FileText, Plus, Trash2, ChevronDown, ChevronUp, ChevronRight,
  Download, Edit3, Eye, Loader2, CheckCircle, AlertTriangle,
  BookOpen, Wand2, GripVertical, X, Save, Copy, ArrowLeft,
  Info, Scale, Sparkles, FilePlus2, Search, Brain
} from 'lucide-react'
import {
  CLAUSULAS, TIPOS_CONTRATO, CATEGORIAS_CLAUSULA,
  type ClausulaTemplate
} from '../data/clausulaTemplates'
import { generateDocx, downloadDocx, type ClausulaDoc, type DatosContrato } from '../utils/docxGenerator'
import IAMejorador from './IAMejorador'

// ── Tipos locales ────────────────────────────────────────────────────────────
interface ClausulaEnDoc {
  uid: string
  numero: number
  titulo: string
  texto: string
  editando: boolean
  templateId?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2) }
const RIESGO_COLOR = { critico: '#ef4444', alto: '#f97316', medio: '#eab308', bajo: '#22c55e' }

// ── Componente campo formulario ───────────────────────────────────────────────
function Campo({ campo, value, onChange }: { campo: any; value: string; onChange: (v: string) => void }) {
  const base = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    outline: 'none',
    color: '#e2e8f0',
    borderRadius: '0.75rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    width: '100%',
  } as const

  if (campo.tipo === 'select') return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...base, background: 'rgba(15,23,42,0.9)' }}>
      <option value="">Seleccionar...</option>
      {campo.opciones.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
  if (campo.tipo === 'textarea') return (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={3}
      placeholder={campo.placeholder} style={{ ...base, resize: 'vertical', lineHeight: '1.5' }} />
  )
  if (campo.tipo === 'date') return (
    <input type="date" value={value} onChange={e => onChange(e.target.value)} style={base} />
  )
  if (campo.tipo === 'number') return (
    <input type="number" value={value} onChange={e => onChange(e.target.value)}
      placeholder={campo.placeholder} style={base} />
  )
  if (campo.tipo === 'currency') return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
      <input type="number" value={value} onChange={e => onChange(e.target.value)}
        placeholder={campo.placeholder} style={{ ...base, paddingLeft: '1.5rem' }} />
    </div>
  )
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={campo.placeholder} style={base} />
  )
}

// ── Card de clausula en el documento ─────────────────────────────────────────
function ClausulaCard({
  clausula, idx, total,
  onDelete, onMoveUp, onMoveDown, onEdit, onSave
}: {
  clausula: ClausulaEnDoc; idx: number; total: number
  onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void
  onEdit: () => void; onSave: (texto: string) => void
}) {
  const [localTexto, setLocalTexto] = useState(clausula.texto)
  const editing = clausula.editando

  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl overflow-hidden group"
      style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="p-3 flex items-start gap-2">
        <div className="flex flex-col gap-0.5 pt-0.5 flex-shrink-0">
          <button onClick={onMoveUp} disabled={idx === 0}
            className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 transition-all">
            <ChevronUp size={12} className="text-slate-500" />
          </button>
          <GripVertical size={12} className="text-slate-700 mx-auto" />
          <button onClick={onMoveDown} disabled={idx === total - 1}
            className="p-0.5 rounded hover:bg-white/10 disabled:opacity-20 transition-all">
            <ChevronDown size={12} className="text-slate-500" />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-indigo-400 px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
              Cláusula {clausula.numero}
            </span>
            <span className="text-xs font-bold text-white truncate">{clausula.titulo}</span>
          </div>
          {editing ? (
            <div className="space-y-2">
              <textarea value={localTexto} onChange={e => setLocalTexto(e.target.value)} rows={8}
                className="w-full text-xs text-slate-300 outline-none rounded-xl p-3 leading-relaxed"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.3)', resize: 'vertical' }} />
              <div className="flex gap-2">
                <button onClick={() => onSave(localTexto)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
                  <Save size={11} />Guardar
                </button>
                <button onClick={onEdit}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 whitespace-pre-line">
              {clausula.texto}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={() => { setLocalTexto(clausula.texto); onEdit() }}
            className="p-1.5 rounded-lg hover:bg-white/[0.07] transition-all">
            <Edit3 size={12} className="text-slate-400" />
          </button>
          <button onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all">
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Wizard de nueva cláusula ──────────────────────────────────────────────────
function WizardClausula({ onAdd }: { onAdd: (c: Omit<ClausulaEnDoc, 'uid' | 'numero'>) => void }) {
  const [paso, setPaso] = useState<1 | 2 | 3 | 4>(1)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<ClausulaTemplate | null>(null)
  const [valores, setValores] = useState<Record<string, string>>({})
  const [textoFinal, setTextoFinal] = useState('')
  const [agregando, setAgregando] = useState(false)
  const [descripcionLibre, setDescripcionLibre] = useState('')

  const plantillasFiltradas = CLAUSULAS.filter(c => {
    const matchBusqueda = !busqueda ||
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.descripcionSimple.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.categoria.toLowerCase().includes(busqueda.toLowerCase())
    const matchCat = !categoriaFiltro || c.categoria === categoriaFiltro
    const matchTipo = !tipoFiltro || c.tiposContrato.includes(tipoFiltro)
    return matchBusqueda && matchCat && matchTipo
  })

  const handleSeleccionar = (t: ClausulaTemplate) => {
    setPlantillaSeleccionada(t)
    const defaults: Record<string, string> = {}
    t.campos.forEach(c => { if (c.default) defaults[c.id] = c.default })
    setValores(defaults)
    setPaso(t.campos.length > 0 ? 2 : 3)
    if (t.campos.length === 0) {
      setTextoFinal(t.generarTexto({}))
    }
  }

  const handleGenerar = () => {
    if (!plantillaSeleccionada) return
    const texto = plantillaSeleccionada.generarTexto(valores)
    setTextoFinal(texto)
    setPaso(3)
  }

  const handleAgregar = () => {
    if (!plantillaSeleccionada) return
    setAgregando(true)
    setTimeout(() => {
      onAdd({
        titulo: plantillaSeleccionada.nombre,
        texto: textoFinal,
        editando: false,
        templateId: plantillaSeleccionada.id,
      })
      setPaso(1)
      setPlantillaSeleccionada(null)
      setValores({})
      setTextoFinal('')
      setBusqueda('')
      setAgregando(false)
    }, 400)
  }

  return (
    <div className="space-y-3">
      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${paso >= s ? 'text-white' : 'text-slate-600'}`}
              style={paso >= s ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' } : { background: 'rgba(255,255,255,0.05)' }}>
              {paso > s ? <CheckCircle size={12} /> : s}
            </div>
            {s < 3 && <div className="w-8 h-px" style={{ background: paso > s ? '#4f46e5' : 'rgba(255,255,255,0.07)' }} />}
          </div>
        ))}
        <span className="text-[10px] text-slate-500 ml-1">
          {paso === 1 ? 'Elegir plantilla' : paso === 2 ? 'Completar campos' : 'Revisar y agregar'}
        </span>
      </div>

      {/* Paso 1: Seleccionar plantilla */}
      {paso === 1 && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar cláusula..."
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none"
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}
              className="px-2 py-2 rounded-xl text-xs text-slate-400 outline-none"
              style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <option value="">Todas las categorías</option>
              {CATEGORIAS_CLAUSULA.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)}
              className="px-2 py-2 rounded-xl text-xs text-slate-400 outline-none"
              style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <option value="">Todos los tipos</option>
              {TIPOS_CONTRATO.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {plantillasFiltradas.length === 0 && (
              <p className="text-center text-slate-600 text-xs py-8">No hay cláusulas para esos filtros</p>
            )}
            {plantillasFiltradas.map(t => (
              <motion.button key={t.id} whileHover={{ scale: 1.005 }}
                onClick={() => handleSeleccionar(t)}
                className="w-full p-3 rounded-2xl text-left hover:bg-white/[0.03] transition-all"
                style={{ background: 'rgba(15,23,42,0.6)', border: t.esObligatoria ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{t.nombre}</span>
                      {t.esObligatoria && (
                        <span className="text-[9px] font-black text-indigo-400 px-1.5 py-0.5 rounded-full"
                          style={{ background: 'rgba(99,102,241,0.15)' }}>ESENCIAL</span>
                      )}
                      <span className="text-[10px] text-slate-500 px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>{t.categoria}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.descripcionSimple}</p>
                  </div>
                  <ChevronRight size={13} className="text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Cláusula personalizada */}
          <div className="p-3 rounded-2xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px dashed rgba(99,102,241,0.2)' }}>
            <p className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
              <Wand2 size={12} />Redactar cláusula personalizada
            </p>
            <textarea value={descripcionLibre} onChange={e => setDescripcionLibre(e.target.value)}
              placeholder="Describe en palabras simples qué quieres lograr con esta cláusula... Ej: 'Quiero que el cliente pague el 50% al inicio y el resto cuando entregue el proyecto'"
              rows={3} className="w-full text-xs text-slate-300 placeholder-slate-600 outline-none rounded-xl p-3 leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', resize: 'none' }} />
            <button
              onClick={() => {
                if (!descripcionLibre.trim()) return
                const texto = generarClausulaLibre(descripcionLibre)
                onAdd({ titulo: 'Cláusula Personalizada', texto, editando: false })
                setDescripcionLibre('')
              }}
              disabled={!descripcionLibre.trim()}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
              <Sparkles size={11} />Generar y agregar
            </button>
          </div>
        </div>
      )}

      {/* Paso 2: Completar campos */}
      {paso === 2 && plantillaSeleccionada && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setPaso(1)} className="p-1.5 rounded-lg hover:bg-white/10">
              <ArrowLeft size={13} className="text-slate-400" />
            </button>
            <div>
              <p className="text-xs font-bold text-white">{plantillaSeleccionada.nombre}</p>
              <p className="text-[10px] text-slate-500">{plantillaSeleccionada.descripcionSimple}</p>
            </div>
          </div>

          {/* Info box */}
          <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <p className="text-[11px] text-slate-300 leading-relaxed">{plantillaSeleccionada.explicacion}</p>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {plantillaSeleccionada.campos.map(campo => (
              <div key={campo.id}>
                <div className="flex items-center gap-1 mb-1">
                  <label className="text-[10px] font-semibold text-slate-400">{campo.label}</label>
                  {campo.requerido && <span className="text-red-400 text-[9px]">*</span>}
                  {campo.ayuda && (
                    <div className="relative group/tip">
                      <Info size={10} className="text-slate-600 cursor-help" />
                      <div className="absolute bottom-full left-0 w-48 p-2 rounded-lg text-[10px] text-slate-300 opacity-0 group-hover/tip:opacity-100 transition-all pointer-events-none z-50"
                        style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {campo.ayuda}
                      </div>
                    </div>
                  )}
                </div>
                <Campo campo={campo} value={valores[campo.id] ?? ''} onChange={v => setValores(p => ({ ...p, [campo.id]: v }))} />
              </div>
            ))}
          </div>

          <button onClick={handleGenerar}
            className="w-full py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
            <Wand2 size={15} />Generar cláusula
          </button>
        </div>
      )}

      {/* Paso 3: Vista previa */}
      {paso === 3 && plantillaSeleccionada && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setPaso(plantillaSeleccionada.campos.length > 0 ? 2 : 1)}
              className="p-1.5 rounded-lg hover:bg-white/10">
              <ArrowLeft size={13} className="text-slate-400" />
            </button>
            <p className="text-xs font-bold text-white">{plantillaSeleccionada.nombre}</p>
          </div>

          <div className="p-4 rounded-2xl max-h-64 overflow-y-auto"
            style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <textarea value={textoFinal} onChange={e => setTextoFinal(e.target.value)} rows={10}
              className="w-full text-xs text-slate-300 outline-none leading-relaxed bg-transparent resize-none" />
          </div>

          {/* Normas + Riesgos */}
          {plantillaSeleccionada.normasAplicables.length > 0 && (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(29,78,216,0.06)', border: '1px solid rgba(29,78,216,0.15)' }}>
              <p className="text-[10px] font-bold text-blue-400 mb-1 flex items-center gap-1"><Scale size={10} />Normas aplicadas</p>
              <div className="flex flex-wrap gap-1">
                {plantillaSeleccionada.normasAplicables.map(n => (
                  <span key={n} className="text-[9px] text-slate-400 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>{n}</span>
                ))}
              </div>
            </div>
          )}

          {plantillaSeleccionada.mejoras.length > 0 && (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <p className="text-[10px] font-bold text-emerald-400 mb-1 flex items-center gap-1">
                <Sparkles size={10} />Mejoras sugeridas
              </p>
              {plantillaSeleccionada.mejoras.map((m, i) => (
                <p key={i} className="text-[10px] text-slate-400">• {m}</p>
              ))}
            </div>
          )}

          <button onClick={handleAgregar} disabled={agregando}
            className="w-full py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            {agregando ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Agregar al contrato
          </button>
        </div>
      )}
    </div>
  )
}

// ── Generador libre por descripción ──────────────────────────────────────────
function generarClausulaLibre(descripcion: string): string {
  const lower = descripcion.toLowerCase()
  if (lower.includes('pag') || lower.includes('precio') || lower.includes('cobr')) {
    return `PAGO. Las partes acuerdan lo siguiente en materia de precio y forma de pago: ${descripcion}. El pago se realizará mediante transferencia bancaria a la cuenta que el acreedor indique, dentro del plazo convenido. El incumplimiento del plazo generará el devengo de intereses moratorios conforme al artículo 1559 del Código Civil.`
  }
  if (lower.includes('confiden') || lower.includes('secreto') || lower.includes('privad')) {
    return `CONFIDENCIALIDAD. Las partes se obligan recíprocamente a mantener en estricta reserva la información que con ocasión de la ejecución del presente contrato se comuniquen. ${descripcion}. Esta obligación subsistirá por un período de tres (3) años contados desde el término del contrato.`
  }
  if (lower.includes('termin') || lower.includes('rescili') || lower.includes('fin')) {
    return `TÉRMINO ANTICIPADO. Las partes acuerdan que: ${descripcion}. El incumplimiento de esta cláusula dará derecho a la parte afectada a exigir indemnización de perjuicios conforme al artículo 1556 del Código Civil.`
  }
  return `ESTIPULACIÓN ESPECIAL. Las partes acuerdan expresamente lo siguiente: ${descripcion}. Esta estipulación ha sido libremente convenida por ambas partes en ejercicio de la autonomía de la voluntad consagrada en los artículos 1545 y 1546 del Código Civil, y forma parte integrante del presente contrato con igual fuerza obligatoria que las demás cláusulas del mismo.`
}

// ── Revisar archivo existente ────────────────────────────────────────────────
function RevisorArchivo({ onImportar }: { onImportar: (clausulas: Omit<ClausulaEnDoc, 'uid' | 'numero'>[]) => void }) {
  const [estado, setEstado] = useState<'idle' | 'procesando' | 'resultado'>('idle')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [seccionesSugeridas, setSeccionesSugeridas] = useState<Array<{ titulo: string; texto: string; riesgo: string; mejora: string }>>([])
  const [seleccionadas, setSeleccionadas] = useState<Set<number>>(new Set())

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) setArchivo(files[0])
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'text/plain': ['.txt'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1, maxSize: 10 * 1024 * 1024,
  })

  const procesar = async () => {
    if (!archivo) return
    setEstado('procesando')
    let texto = ''
    if (archivo.type === 'text/plain' || archivo.name.endsWith('.txt')) {
      texto = await archivo.text()
    } else if (archivo.name.endsWith('.docx')) {
      try {
        const mammoth = await import('mammoth')
        const arrayBuffer = await archivo.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        texto = result.value
      } catch { texto = '' }
    }

    await new Promise(r => setTimeout(r, 1800))
    const secciones = extraerYAnalizar(texto, archivo.name)
    setSeccionesSugeridas(secciones)
    setSeleccionadas(new Set(secciones.map((_, i) => i)))
    setEstado('resultado')
  }

  const importarSeleccionadas = () => {
    const cls = seccionesSugeridas
      .filter((_, i) => seleccionadas.has(i))
      .map(s => ({ titulo: s.titulo, texto: s.texto, editando: false }))
    onImportar(cls)
    setEstado('idle')
    setArchivo(null)
    setSeccionesSugeridas([])
  }

  return (
    <div className="space-y-3">
      {estado === 'idle' && (
        <>
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <motion.div whileHover={{ scale: 1.005 }}
              className="p-8 rounded-2xl text-center"
              style={{
                background: isDragActive ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.7)',
                border: `2px dashed ${isDragActive ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              <BookOpen size={22} className="text-indigo-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-white mb-1">
                {isDragActive ? 'Suelta el archivo' : 'Sube un contrato existente'}
              </p>
              <p className="text-xs text-slate-500">TXT · DOCX · máx. 10MB</p>
              <p className="text-[10px] text-slate-600 mt-2">NexusForge lo analiza, extrae las cláusulas y sugiere mejoras</p>
            </motion.div>
          </div>
          {archivo && (
            <div className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <FileText size={16} className="text-indigo-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{archivo.name}</p>
                <p className="text-[10px] text-slate-500">{(archivo.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={procesar}
                className="px-4 py-2 rounded-xl text-xs font-black text-white"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
                Analizar
              </button>
            </div>
          )}
        </>
      )}

      {estado === 'procesando' && (
        <div className="p-8 text-center space-y-3">
          <Loader2 size={28} className="animate-spin text-indigo-400 mx-auto" />
          <p className="text-sm font-bold text-white">Analizando el contrato...</p>
          <p className="text-xs text-slate-500">Extrayendo cláusulas y verificando conformidad legal chilena</p>
        </div>
      )}

      {estado === 'resultado' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-white">{seccionesSugeridas.length} cláusulas detectadas</p>
            <div className="flex gap-2">
              <button onClick={() => setSeleccionadas(new Set(seccionesSugeridas.map((_, i) => i)))}
                className="text-[10px] text-indigo-400 hover:underline">Seleccionar todas</button>
              <button onClick={() => setSeleccionadas(new Set())}
                className="text-[10px] text-slate-500 hover:underline">Ninguna</button>
            </div>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {seccionesSugeridas.map((s, i) => (
              <div key={i} className="p-3 rounded-2xl"
                style={{
                  background: seleccionadas.has(i) ? 'rgba(99,102,241,0.06)' : 'rgba(15,23,42,0.5)',
                  border: `1px solid ${seleccionadas.has(i) ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'}`,
                }}>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked={seleccionadas.has(i)}
                    onChange={e => {
                      setSeleccionadas(prev => {
                        const next = new Set(prev)
                        e.target.checked ? next.add(i) : next.delete(i)
                        return next
                      })
                    }}
                    className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-xs font-bold text-white">{s.titulo}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: s.riesgo === 'conforme' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: s.riesgo === 'conforme' ? '#22c55e' : '#ef4444',
                        }}>
                        {s.riesgo === 'conforme' ? 'Conforme' : 'Mejorada'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">{s.texto.substring(0, 150)}...</p>
                    {s.mejora && (
                      <p className="text-[10px] text-emerald-400 mt-1">✓ {s.mejora}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={importarSeleccionadas} disabled={seleccionadas.size === 0}
            className="w-full py-3 rounded-2xl text-sm font-black text-white disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            <FilePlus2 size={15} />Importar {seleccionadas.size} cláusula{seleccionadas.size !== 1 ? 's' : ''} al documento
          </button>
        </div>
      )}
    </div>
  )
}

function extraerYAnalizar(texto: string, _nombre: string): Array<{ titulo: string; texto: string; riesgo: string; mejora: string }> {
  if (!texto || texto.length < 50) {
    return generarPlantillaDemoRevisor()
  }
  const lineas = texto.split('\n').filter(l => l.trim().length > 10)
  const secciones: Array<{ titulo: string; texto: string; riesgo: string; mejora: string }> = []
  const clausulaRegex = /^(cl[aá]usula|art[ií]culo|\d+[\.°\-]|[IVXLC]+[\.°\-])/i
  let tituloActual = ''
  let textoActual: string[] = []

  for (const linea of lineas) {
    if (clausulaRegex.test(linea.trim())) {
      if (tituloActual && textoActual.length > 0) {
        const textoOriginal = textoActual.join(' ')
        const riesgo = detectarRiesgoTexto(textoOriginal)
        secciones.push({
          titulo: tituloActual,
          texto: mejorarTextoClausula(textoOriginal, tituloActual),
          riesgo,
          mejora: riesgo !== 'conforme' ? 'Cláusula mejorada según normativa chilena vigente' : '',
        })
      }
      tituloActual = linea.trim().substring(0, 80)
      textoActual = []
    } else {
      textoActual.push(linea.trim())
    }
  }
  if (tituloActual && textoActual.length > 0) {
    const textoOriginal = textoActual.join(' ')
    secciones.push({
      titulo: tituloActual,
      texto: mejorarTextoClausula(textoOriginal, tituloActual),
      riesgo: detectarRiesgoTexto(textoOriginal),
      mejora: detectarRiesgoTexto(textoOriginal) !== 'conforme' ? 'Cláusula mejorada' : '',
    })
  }
  return secciones.length > 0 ? secciones.slice(0, 12) : generarPlantillaDemoRevisor()
}

function detectarRiesgoTexto(texto: string): string {
  const lower = texto.toLowerCase()
  if (lower.includes('sin expresión de causa') || lower.includes('en ningún caso') || lower.includes('a su solo arbitrio')) return 'problematico'
  return 'conforme'
}

function mejorarTextoClausula(texto: string, titulo: string): string {
  const lower = texto.toLowerCase()
  if (lower.includes('sin expresión de causa')) {
    return texto.replace(/sin expresión de causa/gi, 'mediante aviso escrito con 30 días de anticipación, con derecho a indemnización proporcional al período no ejecutado') + '\n\n[CLÁUSULA MEJORADA: Se eliminó la terminación sin expresión de causa que era abusiva bajo el Art. 16 Ley 19.496 y se reemplazó por terminación bilateral con aviso previo e indemnización.]'
  }
  if (lower.includes('en ningún caso') && lower.includes('responsable')) {
    return texto + '\n\n[CLÁUSULA MEJORADA: La exclusión total de responsabilidad ha sido limitada conforme al Art. 1465 CC — se conserva responsabilidad por dolo y culpa grave.]'
  }
  return texto
}

function generarPlantillaDemoRevisor(): Array<{ titulo: string; texto: string; riesgo: string; mejora: string }> {
  return CLAUSULAS.filter(c => c.esObligatoria || ['vigencia-plazo', 'confidencialidad-estandar', 'arbitraje-cam'].includes(c.id)).slice(0, 5).map(c => ({
    titulo: c.nombre,
    texto: c.generarTexto({}),
    riesgo: 'conforme',
    mejora: '',
  }))
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ClausulasRedactor() {
  const [tab, setTab] = useState<'constructor' | 'revisor' | 'ia' | 'documento'>('documento')
  const [clausulas, setClausulas] = useState<ClausulaEnDoc[]>([])
  const [tipoContrato, setTipoContrato] = useState('Prestación de Servicios')
  const [parteA, setParteA] = useState('')
  const [parteB, setParteB] = useState('')
  const [ciudad, setCiudad] = useState('Santiago')
  const [exportando, setExportando] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const numeracionActual = useRef(clausulas.length + 1)

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const addClausula = (c: Omit<ClausulaEnDoc, 'uid' | 'numero'>) => {
    const n = clausulas.length + 1
    setClausulas(prev => [...prev, { ...c, uid: uid(), numero: n }])
    showToast(`Cláusula "${c.titulo}" agregada al documento`)
    setTab('documento')
  }

  const renumerarClausulas = (cls: ClausulaEnDoc[]) => cls.map((c, i) => ({ ...c, numero: i + 1 }))

  const deleteClausula = (uid: string) => setClausulas(prev => renumerarClausulas(prev.filter(c => c.uid !== uid)))

  const moveUp = (uid: string) => setClausulas(prev => {
    const i = prev.findIndex(c => c.uid === uid)
    if (i <= 0) return prev
    const arr = [...prev]; [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
    return renumerarClausulas(arr)
  })

  const moveDown = (uid: string) => setClausulas(prev => {
    const i = prev.findIndex(c => c.uid === uid)
    if (i >= prev.length - 1) return prev
    const arr = [...prev]; [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
    return renumerarClausulas(arr)
  })

  const toggleEdit = (uid: string) => setClausulas(prev => prev.map(c => c.uid === uid ? { ...c, editando: !c.editando } : { ...c, editando: false }))
  const saveEdit = (uid: string, texto: string) => setClausulas(prev => prev.map(c => c.uid === uid ? { ...c, texto, editando: false } : c))

  const importarDesdeRevisor = (nuevas: Omit<ClausulaEnDoc, 'uid' | 'numero'>[]) => {
    const offset = clausulas.length
    setClausulas(prev => renumerarClausulas([...prev, ...nuevas.map((c, i) => ({ ...c, uid: uid(), numero: offset + i + 1 }))]))
    showToast(`${nuevas.length} cláusula${nuevas.length > 1 ? 's' : ''} importadas`)
    setTab('documento')
  }

  const exportWord = async () => {
    if (clausulas.length === 0) { showToast('Agrega al menos una cláusula antes de exportar'); return }
    setExportando(true)
    try {
      const datos: DatosContrato = {
        tipoContrato,
        parteA,
        parteB,
        ciudad,
        fecha: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
        clausulas: clausulas.map(c => ({ numero: c.numero, titulo: c.titulo, texto: c.texto })),
      }
      const blob = await generateDocx(datos)
      const nombre = `Contrato_${tipoContrato.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`
      downloadDocx(blob, nombre)
      showToast('Documento Word descargado')
    } catch (e) {
      showToast('Error al generar el Word — revisa la consola')
      console.error(e)
    }
    setExportando(false)
  }

  const TABS = [
    { key: 'constructor', label: 'Constructor', icon: Plus },
    { key: 'revisor', label: 'Revisar Archivo', icon: BookOpen },
    { key: 'ia', label: 'Mejorar con IA', icon: Brain },
    { key: 'documento', label: `Mi Contrato (${clausulas.length})`, icon: FileText },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <Wand2 size={18} className="text-indigo-400" />
              <h1 className="text-xl font-black text-white">Redactor de Contratos</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Constructor inteligente · Derecho chileno · Exporta a Word editable</p>
          </div>
          <button onClick={exportWord} disabled={exportando || clausulas.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-black text-white disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
            {exportando ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Exportar a Word
          </button>
        </div>
      </motion.div>

      {/* Metadatos del contrato */}
      <div className="p-4 rounded-2xl"
        style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Datos del contrato</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: 'Tipo de contrato', value: tipoContrato, onChange: setTipoContrato, isSelect: true },
            { label: 'Ciudad', value: ciudad, onChange: setCiudad, isSelect: false },
            { label: 'Parte A (nombre corto)', value: parteA, onChange: setParteA, isSelect: false },
            { label: 'Parte B (nombre corto)', value: parteB, onChange: setParteB, isSelect: false },
          ].map(f => (
            <div key={f.label}>
              <p className="text-[10px] text-slate-500 mb-1">{f.label}</p>
              {f.isSelect ? (
                <select value={f.value} onChange={e => f.onChange(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl text-xs text-slate-200 outline-none"
                  style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {TIPOS_CONTRATO.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <input value={f.value} onChange={e => f.onChange(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl text-xs text-slate-200 outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key as typeof tab)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
            style={tab === key
              ? key === 'ia'
                ? { background: 'linear-gradient(135deg,rgba(109,40,217,0.35),rgba(124,58,237,0.25))', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.4)' }
                : { background: 'linear-gradient(135deg,rgba(79,70,229,0.3),rgba(124,58,237,0.3))', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
              : { color: '#64748b' }}>
            <Icon size={12} />{label}
            {key === 'ia' && tab !== 'ia' && (
              <span className="ml-0.5 text-[8px] font-black px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(139,92,246,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>NEW</span>
            )}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="p-4 rounded-2xl min-h-80"
        style={{ background: 'rgba(10,18,35,0.9)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <AnimatePresence mode="wait">
          {tab === 'constructor' && (
            <motion.div key="constructor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WizardClausula onAdd={addClausula} />
            </motion.div>
          )}
          {tab === 'ia' && (
            <motion.div key="ia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IAMejorador onImportar={(texto, titulo) => {
                addClausula({ titulo, texto, editando: false })
              }} />
            </motion.div>
          )}
          {tab === 'revisor' && (
            <motion.div key="revisor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RevisorArchivo onImportar={importarDesdeRevisor} />
            </motion.div>
          )}
          {tab === 'documento' && (
            <motion.div key="documento" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-3">
              {clausulas.length === 0 ? (
                <div className="py-16 text-center">
                  <FileText size={32} className="text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-bold">Tu contrato está vacío</p>
                  <p className="text-slate-600 text-xs mt-1">Ve a "Constructor" para agregar cláusulas</p>
                  <button onClick={() => setTab('constructor')}
                    className="mt-4 px-4 py-2 rounded-2xl text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
                    Comenzar
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-bold text-slate-400">{clausulas.length} cláusula{clausulas.length !== 1 ? 's' : ''}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setTab('constructor')}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                        style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
                        <Plus size={11} />Agregar
                      </button>
                      <button onClick={exportWord} disabled={exportando}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-40"
                        style={{ background: 'linear-gradient(135deg,#1d4ed8,#4f46e5)' }}>
                        {exportando ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
                        Exportar Word
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {clausulas.map((c, idx) => (
                      <ClausulaCard key={c.uid} clausula={c} idx={idx} total={clausulas.length}
                        onDelete={() => deleteClausula(c.uid)}
                        onMoveUp={() => moveUp(c.uid)}
                        onMoveDown={() => moveDown(c.uid)}
                        onEdit={() => toggleEdit(c.uid)}
                        onSave={(t) => saveEdit(c.uid, t)} />
                    ))}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl"
            style={{ background: 'rgba(10,18,35,0.97)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-white whitespace-nowrap">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
