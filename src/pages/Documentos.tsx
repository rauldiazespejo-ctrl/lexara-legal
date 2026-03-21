import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Upload, Search, FolderOpen, File, Download, Eye, Trash2, AlertTriangle } from 'lucide-react'
import { useState, useRef } from 'react'

interface DocItem {
  id: string
  nombre: string
  tipo: string
  caso: string
  fecha: string
  tamaño: string
  formato: string
}

const TIPOS = ['Todos', 'Escrito judicial', 'Contrato', 'Poder', 'Laboral', 'Acta']
const FORMATO_COLOR: Record<string, string> = { pdf: '#ef4444', xlsx: '#22c55e', docx: '#3b82f6', jpg: '#eab308' }

function ConfirmModal({ nombre, onConfirm, onCancel }: { nombre: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm rounded-2xl p-5 space-y-4"
        style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(239,68,68,0.25)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Eliminar documento</p>
            <p className="text-[10px] text-slate-500">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          ¿Confirmas eliminar <span className="text-white font-semibold">"{nombre}"</span>?
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
            Eliminar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Documentos() {
  const [docs, setDocs] = useState<DocItem[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [confirmDelete, setConfirmDelete] = useState<DocItem | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = docs.filter(d => {
    const matchBusq = d.nombre.toLowerCase().includes(busqueda.toLowerCase()) || d.caso.toLowerCase().includes(busqueda.toLowerCase())
    const matchTipo = filtroTipo === 'Todos' || d.tipo === filtroTipo
    return matchBusq && matchTipo
  })

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
      const newDoc: DocItem = {
        id: `d${Date.now()}_${Math.random().toString(36).slice(2)}`,
        nombre: file.name.replace(/\.[^.]+$/, ''),
        tipo: ext === 'pdf' ? 'Escrito judicial' : ext === 'docx' ? 'Contrato' : 'Otro',
        caso: 'Sin asignar',
        fecha: new Date().toISOString().slice(0, 10),
        tamaño: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
        formato: ext,
      }
      setDocs(prev => [newDoc, ...prev])
    })
  }

  function handleDelete(doc: DocItem) {
    setDocs(prev => prev.filter(d => d.id !== doc.id))
    setConfirmDelete(null)
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <FileText size={14} className="text-indigo-400" />
            </div>
            <h1 className="text-xl font-black text-white">Documentos</h1>
          </div>
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
            <Upload size={12} />Subir
          </button>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.xlsx,.jpg,.jpeg,.png" className="hidden"
            onChange={e => handleFiles(e.target.files)} />
        </div>
        <p className="text-xs text-slate-500">{docs.length} documentos · Escritos, contratos, poderes y más</p>
      </motion.div>

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre o causa..."
          className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs text-slate-300 outline-none"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TIPOS.map(t => (
          <button key={t} onClick={() => setFiltroTipo(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${filtroTipo === t ? 'text-white' : 'text-slate-500'}`}
            style={filtroTipo === t ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' } : { background: 'rgba(255,255,255,0.04)' }}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {filtered.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2">
            <FolderOpen size={28} className="text-slate-700" />
            <p className="text-xs text-slate-600">
              {docs.length === 0 ? 'No hay documentos — sube el primero' : 'Sin documentos que coincidan'}
            </p>
          </div>
        ) : filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${FORMATO_COLOR[d.formato] ?? '#6366f1'}18` }}>
              <File size={14} style={{ color: FORMATO_COLOR[d.formato] ?? '#6366f1' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{d.nombre}</p>
              <p className="text-[10px] text-slate-500">{d.tipo} · {d.caso} · {d.fecha}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-[9px] text-slate-700">{d.tamaño}</span>
              <button className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
                <Eye size={12} className="text-slate-600" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
                <Download size={12} className="text-slate-600" />
              </button>
              <button onClick={() => setConfirmDelete(d)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors group">
                <Trash2 size={12} className="text-slate-600 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer transition-all"
        style={{
          border: `2px dashed ${dragOver ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.2)'}`,
          background: dragOver ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.03)',
        }}>
        <Upload size={20} className="text-indigo-500/50" />
        <p className="text-xs font-semibold text-slate-500">Arrastra documentos aquí o haz click para subir</p>
        <p className="text-[10px] text-slate-700">PDF, DOCX, XLSX, JPG — Máx. 50 MB</p>
        <p className="text-[9px] text-indigo-400/50 mt-1">Análisis automático con IA disponible para contratos</p>
      </motion.div>

      <AnimatePresence>
        {confirmDelete && (
          <ConfirmModal
            nombre={confirmDelete.nombre}
            onConfirm={() => handleDelete(confirmDelete)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
