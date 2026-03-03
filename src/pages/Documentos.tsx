import { motion } from 'framer-motion'
import { FileText, Upload, Search, FolderOpen, File, Download, Eye } from 'lucide-react'
import { useState } from 'react'

const DOCS_DEMO = [
  { id: 'd1', nombre: 'Demanda Juicio Ordinario — Constructora Pacífico', tipo: 'Escrito judicial', caso: 'C-1234-2024', fecha: '2024-01-15', tamaño: '245 KB', formato: 'pdf' },
  { id: 'd2', nombre: 'Contrato de Arriendo — Local Barrio Italia', tipo: 'Contrato', caso: 'C-4521-2023', fecha: '2024-01-10', tamaño: '128 KB', formato: 'pdf' },
  { id: 'd3', nombre: 'Poder Notarial — Importadora Los Andes', tipo: 'Poder', caso: 'RIT O-234-2024', fecha: '2024-01-08', tamaño: '89 KB', formato: 'pdf' },
  { id: 'd4', nombre: 'Liquidación de Finiquito — Martínez Rivera', tipo: 'Laboral', caso: 'RIT O-234-2024', fecha: '2023-12-20', tamaño: '56 KB', formato: 'xlsx' },
  { id: 'd5', nombre: 'Acta Mediación Familiar — Valenzuela', tipo: 'Acta', caso: 'Divorcio C-789', fecha: '2024-02-01', tamaño: '34 KB', formato: 'pdf' },
  { id: 'd6', nombre: 'Reclamación TTA — Importadora Los Andes', tipo: 'Escrito judicial', caso: 'RUC 1400012345', fecha: '2024-02-05', tamaño: '312 KB', formato: 'pdf' },
]

const TIPOS = ['Todos', 'Escrito judicial', 'Contrato', 'Poder', 'Laboral', 'Acta']

const FORMATO_COLOR: Record<string, string> = { pdf: '#ef4444', xlsx: '#22c55e', docx: '#3b82f6', jpg: '#eab308' }

export default function Documentos() {
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('Todos')

  const docs = DOCS_DEMO.filter(d => {
    const matchBusq = d.nombre.toLowerCase().includes(busqueda.toLowerCase()) || d.caso.toLowerCase().includes(busqueda.toLowerCase())
    const matchTipo = filtroTipo === 'Todos' || d.tipo === filtroTipo
    return matchBusq && matchTipo
  })

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
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
            <Upload size={12} />Subir
          </button>
        </div>
        <p className="text-xs text-slate-500">{DOCS_DEMO.length} documentos · Escritos, contratos, poderes y más</p>
      </motion.div>

      {/* Búsqueda */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar por nombre o causa..."
          className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs text-slate-300 outline-none"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }} />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TIPOS.map(t => (
          <button key={t} onClick={() => setFiltroTipo(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${filtroTipo === t ? 'text-white' : 'text-slate-500'}`}
            style={filtroTipo === t ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' } : { background: 'rgba(255,255,255,0.04)' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Lista documentos */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {docs.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2">
            <FolderOpen size={28} className="text-slate-700" />
            <p className="text-xs text-slate-600">Sin documentos que coincidan</p>
          </div>
        ) : docs.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < docs.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
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
            </div>
          </motion.div>
        ))}
      </div>

      {/* Zona de arrastre */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-indigo-500/40 transition-all"
        style={{ border: '2px dashed rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.03)' }}>
        <Upload size={20} className="text-indigo-500/50" />
        <p className="text-xs font-semibold text-slate-500">Arrastra documentos aquí</p>
        <p className="text-[10px] text-slate-700">PDF, DOCX, XLSX, JPG — Máx. 50 MB</p>
        <p className="text-[9px] text-indigo-400/50 mt-1">Análisis automático con IA disponible para contratos</p>
      </motion.div>
    </div>
  )
}
