import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Search, Plus, ChevronRight, Scale, Gavel, Heart, ShieldAlert, Receipt, Building2, Trash2, X, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CASOS, CLIENTES } from '../data/appData'
import type { Caso, Specialty } from '../types'
import { RISK_COLORS } from '../data/legalDatabase'
import { useAuth } from '../context/AuthContext'

const SPEC_ICONS: Record<Specialty, React.ElementType> = {
  civil: Scale, comercial: Building2, laboral: Gavel,
  penal: ShieldAlert, familia: Heart, tributario: Receipt,
  administrativo: Building2, procesal: Scale,
}
const SPEC_COLORS: Record<Specialty, string> = {
  civil: '#3b82f6', comercial: '#8b5cf6', laboral: '#22c55e',
  penal: '#ef4444', familia: '#ec4899', tributario: '#f97316',
  administrativo: '#06b6d4', procesal: '#eab308',
}

const TRIBUNALES = [
  '1° Juzgado Civil de Santiago', '2° Juzgado Civil de Santiago', '3° Juzgado Civil de Santiago',
  'Juzgado de Letras del Trabajo de Santiago', 'Juzgado de Garantía de Santiago',
  'TOP de Santiago', 'Juzgado de Familia de Santiago', 'TTA de Santiago',
  'Corte de Apelaciones de Santiago', 'Otro',
]

function NuevaCausaModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Caso) => void }) {
  const [form, setForm] = useState({
    titulo: '', tipo: '', especialidad: 'civil' as Specialty,
    tribunal: '', rol: '', clienteId: '', contraparte: '',
    abogado: 'María González R.', valorCausa: '', notas: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.titulo.trim()) e.titulo = 'Requerido'
    if (!form.tribunal.trim()) e.tribunal = 'Requerido'
    if (!form.clienteId) e.clienteId = 'Selecciona un cliente'
    return e
  }

  const save = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const cliente = CLIENTES.find(c => c.id === form.clienteId)
    const nueva: Caso = {
      id: `c${Date.now()}`, rol: form.rol || `C-${Date.now().toString().slice(-4)}-2026`,
      titulo: form.titulo, tipo: form.tipo || 'Ordinario',
      especialidad: form.especialidad, tribunal: form.tribunal,
      clienteId: form.clienteId, clienteNombre: cliente?.nombre ?? '',
      contraparte: form.contraparte, abogado: form.abogado,
      estado: 'active', etapa: 'Ingreso', fechaIngreso: new Date().toISOString().split('T')[0],
      fechaUltimoMovimiento: new Date().toISOString().split('T')[0],
      probabilidadExito: 50, valorCausa: parseFloat(form.valorCausa) || 0,
      honorarios: { modalidad: 'fijo', montoUF: 0, pagado: 0, pendiente: 0 },
      plazos: [], teoriaDelCaso: { hechos: [], derecho: [], prueba: [], estrategia: '', fortalezas: [], debilidades: [], argumentosContrarios: [], completitud: 0 },
      historial: [{ id: 'h1', fecha: new Date().toISOString().split('T')[0], tipo: 'gestión', descripcion: 'Causa ingresada al sistema', autor: form.abogado }],
      documentos: [], audiencias: [], notas: form.notas, alerta: 'low',
    }
    onSave(nueva)
    onClose()
  }

  const inp = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
  const cls = 'w-full px-3 py-2 rounded-xl text-xs text-slate-200 outline-none'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
              <Plus size={14} className="text-white" />
            </div>
            <span className="text-sm font-black text-white">Nueva Causa</span>
          </div>
          <button onClick={onClose}><X size={15} className="text-slate-500" /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-3" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Carátula / Título de la causa *</p>
            <input value={form.titulo} onChange={e => { setForm(f => ({ ...f, titulo: e.target.value })); setErrors(x => ({ ...x, titulo: '' })) }}
              placeholder="Ej: García c/ Pérez — Cobro de pesos" className={cls} style={inp} />
            {errors.titulo && <p className="text-[10px] text-red-400 mt-0.5">{errors.titulo}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Especialidad</p>
              <select value={form.especialidad} onChange={e => setForm(f => ({ ...f, especialidad: e.target.value as Specialty }))} className={cls} style={inp}>
                {(['civil','laboral','penal','familia','tributario','comercial','administrativo','procesal'] as Specialty[]).map(s => (
                  <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Tipo de procedimiento</p>
              <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} className={cls} style={inp}>
                <option value="">Seleccionar...</option>
                <option>Juicio Ordinario</option>
                <option>Juicio Sumario</option>
                <option>Juicio Ejecutivo</option>
                <option>Medida Precautoria</option>
                <option>NLPT Aplicación General</option>
                <option>NLPT Monitorio</option>
                <option>Tutela Laboral</option>
                <option>Divorcio</option>
                <option>Alimentos</option>
                <option>Proceso Penal</option>
                <option>Reclamación Tributaria</option>
                <option>Arbitraje</option>
              </select>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Cliente *</p>
            <select value={form.clienteId} onChange={e => { setForm(f => ({ ...f, clienteId: e.target.value })); setErrors(x => ({ ...x, clienteId: '' })) }} className={cls} style={inp}>
              <option value="">Seleccionar cliente...</option>
              {CLIENTES.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            {errors.clienteId && <p className="text-[10px] text-red-400 mt-0.5">{errors.clienteId}</p>}
          </div>
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Tribunal *</p>
            <select value={form.tribunal} onChange={e => { setForm(f => ({ ...f, tribunal: e.target.value })); setErrors(x => ({ ...x, tribunal: '' })) }} className={cls} style={inp}>
              <option value="">Seleccionar tribunal...</option>
              {TRIBUNALES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.tribunal && <p className="text-[10px] text-red-400 mt-0.5">{errors.tribunal}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-500 mb-1">ROL / RIT / RUC</p>
              <input value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))} placeholder="C-1234-2026" className={cls} style={inp} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Valor causa (UF)</p>
              <input type="number" value={form.valorCausa} onChange={e => setForm(f => ({ ...f, valorCausa: e.target.value }))} placeholder="0" className={cls} style={inp} />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Contraparte</p>
            <input value={form.contraparte} onChange={e => setForm(f => ({ ...f, contraparte: e.target.value }))} placeholder="Nombre de la parte demandada" className={cls} style={inp} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Notas iniciales</p>
            <textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} rows={2} placeholder="Antecedentes, estrategia inicial..." className={`${cls} resize-none`} style={inp} />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2 border-t border-white/[0.06] pt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400" style={{ background: 'rgba(255,255,255,0.04)' }}>Cancelar</button>
          <button onClick={save} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
            <Save size={13} />Crear Causa
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Casos() {
  const { canDelete, canCreate } = useAuth()
  const [casos, setCasos] = useState<Caso[]>(CASOS)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'todos' | Specialty>('todos')
  const [deleteTarget, setDeleteTarget] = useState<Caso | null>(null)
  const [showNueva, setShowNueva] = useState(false)

  const specialties: Specialty[] = ['civil', 'laboral', 'penal', 'familia', 'tributario', 'comercial']

  const filtered = casos.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !search || c.titulo.toLowerCase().includes(q) || c.rol.toLowerCase().includes(q) || c.clienteNombre.toLowerCase().includes(q)
    const matchFilter = filter === 'todos' || c.especialidad === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Causas</h1>
          <p className="text-xs text-slate-500 mt-0.5">{casos.filter(c => c.estado === 'active').length} causas activas · {casos.length} total</p>
        </div>
        {canCreate && (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setShowNueva(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
            <Plus size={14} />Nueva Causa
          </motion.button>
        )}
      </motion.div>

      {/* Filtros especialidad */}

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por rol, título, cliente..."
          className="w-full pl-8 pr-3 py-2 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }} />
      </div>

      {/* Specialty filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button onClick={() => setFilter('todos')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === 'todos' ? 'text-white' : 'text-slate-500'}`}
          style={filter === 'todos' ? { background: 'rgba(29,78,216,0.25)', border: '1px solid rgba(99,102,241,0.35)' } : { background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
          Todos
        </button>
        {specialties.map(sp => {
          const Icon = SPEC_ICONS[sp]
          return (
            <button key={sp} onClick={() => setFilter(sp)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${filter === sp ? 'text-white' : 'text-slate-500'}`}
              style={filter === sp ? { background: `${SPEC_COLORS[sp]}20`, border: `1px solid ${SPEC_COLORS[sp]}40`, color: SPEC_COLORS[sp] } : { background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Icon size={11} />{sp.charAt(0).toUpperCase() + sp.slice(1)}
            </button>
          )
        })}
      </div>

      {/* Cases list */}
      <div className="space-y-2">
        {filtered.map((caso, i) => {
          const SpecIcon = SPEC_ICONS[caso.especialidad]
          return (
            <motion.div key={caso.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="relative group">
              <Link to={`/casos/${caso.id}`}
                className="flex items-start gap-3 p-4 rounded-2xl hover:bg-white/[0.02] transition-all block"
                style={{ background: 'rgba(15,23,42,0.7)', border: 'rgba(255,255,255,0.06) 1px solid' }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${SPEC_COLORS[caso.especialidad]}15`, border: `1px solid ${SPEC_COLORS[caso.especialidad]}25` }}>
                  <SpecIcon size={18} style={{ color: SPEC_COLORS[caso.especialidad] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white leading-tight truncate">{caso.titulo}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{caso.rol} · {caso.tribunal}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-700 flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${RISK_COLORS[caso.alerta]}15`, color: RISK_COLORS[caso.alerta], border: `1px solid ${RISK_COLORS[caso.alerta]}30` }}>
                      {caso.etapa}
                    </span>
                    <span className="text-[10px] text-slate-500">{caso.clienteNombre}</span>
                    <span className="text-[10px] text-slate-600 ml-auto">{caso.fechaUltimoMovimiento}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${caso.probabilidadExito}%`, background: caso.probabilidadExito > 70 ? '#22c55e' : caso.probabilidadExito > 50 ? '#eab308' : '#ef4444' }} />
                    </div>
                    <span className="text-[10px] font-bold flex-shrink-0"
                      style={{ color: caso.probabilidadExito > 70 ? '#22c55e' : caso.probabilidadExito > 50 ? '#eab308' : '#ef4444' }}>
                      {caso.probabilidadExito}% éxito
                    </span>
                  </div>
                </div>
              </Link>
              {canDelete && (
                <button onClick={() => setDeleteTarget(caso)}
                  className="absolute top-3 right-10 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 z-10">
                  <Trash2 size={12} className="text-red-400" />
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="w-full max-w-xs rounded-2xl p-5 space-y-4 text-center"
              style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-black text-white">¿Eliminar causa?</p>
                <p className="text-xs text-slate-400 mt-1">{deleteTarget.titulo}</p>
                <p className="text-[10px] text-slate-600 mt-1">Esta acción no se puede deshacer.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>Cancelar</button>
                <button onClick={() => { setCasos(prev => prev.filter(c => c.id !== deleteTarget.id)); setDeleteTarget(null) }}
                  className="flex-1 py-2 rounded-xl text-xs font-black text-white" style={{ background: 'rgba(239,68,68,0.7)' }}>Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showNueva && <NuevaCausaModal onClose={() => setShowNueva(false)} onSave={c => setCasos(prev => [c, ...prev])} />}
      </AnimatePresence>
    </div>
  )
}
