import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, Plus, Phone, Mail, AlertTriangle, Building2, User, ChevronRight, Trash2, X, Save, Shield } from 'lucide-react'
import { CLIENTES } from '../data/appData'
import type { Cliente, Specialty } from '../types'
import { useAuth } from '../context/AuthContext'

const SPECIALTY_COLORS: Record<Specialty, string> = {
  civil: '#3b82f6', comercial: '#8b5cf6', laboral: '#22c55e',
  penal: '#ef4444', familia: '#ec4899', tributario: '#f97316',
  administrativo: '#06b6d4', procesal: '#eab308',
}
const SPECIALTY_LABELS: Record<Specialty, string> = {
  civil: 'Civil', comercial: 'Comercial', laboral: 'Laboral',
  penal: 'Penal', familia: 'Familia', tributario: 'Tributario',
  administrativo: 'Administrativo', procesal: 'Procesal',
}

const ESPECIALIDADES_LIST = Object.keys(SPECIALTY_LABELS) as Specialty[]

const ABOGADOS = ['María González R.', 'Andrés Muñoz', 'Raúl Díaz Espejo', 'Sin asignar']

const EMPTY_FORM = {
  nombre: '', rut: '', tipo: 'persona' as 'persona' | 'empresa',
  email: '', telefono: '', direccion: '',
  abogadoAsignado: 'María González R.', estado: 'activo' as 'activo' | 'prospecto' | 'inactivo',
  especialidades: [] as Specialty[], notas: '', conflictoInteres: false,
}

function NuevoClienteModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Cliente) => void }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nombre.trim()) e.nombre = 'Nombre requerido'
    if (!form.rut.trim()) e.rut = 'RUT requerido'
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email válido requerido'
    if (!form.telefono.trim()) e.telefono = 'Teléfono requerido'
    if (form.especialidades.length === 0) e.especialidades = 'Selecciona al menos una especialidad'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const nuevo: Cliente = {
      id: `cl${Date.now()}`,
      ...form,
      fechaIngreso: new Date().toISOString().split('T')[0],
      casosActivos: 0,
      deudaHonorarios: 0,
      documentos: 0,
    }
    onSave(nuevo)
    onClose()
  }

  const toggleEsp = (esp: Specialty) => {
    setForm(f => ({
      ...f,
      especialidades: f.especialidades.includes(esp)
        ? f.especialidades.filter(e => e !== esp)
        : [...f.especialidades, esp]
    }))
    setErrors(e => ({ ...e, especialidades: '' }))
  }

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="text-[10px] text-slate-500 mb-1 block">{label}</label>
      {children}
      {error && <p className="text-[10px] text-red-400 mt-0.5">{error}</p>}
    </div>
  )

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 rounded-xl text-xs text-slate-200 outline-none transition-all ${err ? 'border-red-500/50' : 'border-white/[0.08]'}`
  const inputStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-md rounded-3xl overflow-hidden"
          style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '90vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
                <Plus size={14} className="text-white" />
              </div>
              <span className="text-sm font-black text-white">Nuevo Cliente</span>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
              <X size={15} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-5 space-y-4" style={{ maxHeight: 'calc(90vh - 140px)' }}>

            {/* Tipo */}
            <div>
              <label className="text-[10px] text-slate-500 mb-1.5 block">Tipo de cliente</label>
              <div className="grid grid-cols-2 gap-2">
                {(['persona', 'empresa'] as const).map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, tipo: t }))}
                    className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${form.tipo === t ? 'text-white' : 'text-slate-500'}`}
                    style={form.tipo === t ? { background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {t === 'persona' ? <User size={12} /> : <Building2 size={12} />}
                    {t === 'persona' ? 'Persona Natural' : 'Empresa / Persona Jurídica'}
                  </button>
                ))}
              </div>
            </div>

            <Field label={form.tipo === 'empresa' ? 'Razón social' : 'Nombre completo'} error={errors.nombre}>
              <input value={form.nombre} onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); setErrors(x => ({ ...x, nombre: '' })) }}
                placeholder={form.tipo === 'empresa' ? 'Constructora ABC SpA' : 'Juan Pérez González'}
                className={inputCls(errors.nombre)} style={inputStyle} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="RUT" error={errors.rut}>
                <input value={form.rut} onChange={e => { setForm(f => ({ ...f, rut: e.target.value })); setErrors(x => ({ ...x, rut: '' })) }}
                  placeholder="12.345.678-9"
                  className={inputCls(errors.rut)} style={inputStyle} />
              </Field>
              <Field label="Estado">
                <select value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value as typeof form.estado }))}
                  className={inputCls()} style={inputStyle}>
                  <option value="activo">Activo</option>
                  <option value="prospecto">Prospecto</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </Field>
            </div>

            <Field label="Correo electrónico" error={errors.email}>
              <input type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(x => ({ ...x, email: '' })) }}
                placeholder="contacto@empresa.cl"
                className={inputCls(errors.email)} style={inputStyle} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Teléfono" error={errors.telefono}>
                <input value={form.telefono} onChange={e => { setForm(f => ({ ...f, telefono: e.target.value })); setErrors(x => ({ ...x, telefono: '' })) }}
                  placeholder="+56 9 1234 5678"
                  className={inputCls(errors.telefono)} style={inputStyle} />
              </Field>
              <Field label="Abogado asignado">
                <select value={form.abogadoAsignado} onChange={e => setForm(f => ({ ...f, abogadoAsignado: e.target.value }))}
                  className={inputCls()} style={inputStyle}>
                  {ABOGADOS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Dirección">
              <input value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))}
                placeholder="Av. Apoquindo 3000, Las Condes"
                className={inputCls()} style={inputStyle} />
            </Field>

            <Field label="Especialidades" error={errors.especialidades}>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {ESPECIALIDADES_LIST.map(esp => (
                  <button key={esp} onClick={() => toggleEsp(esp)}
                    className="px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all"
                    style={form.especialidades.includes(esp)
                      ? { background: `${SPECIALTY_COLORS[esp]}25`, color: SPECIALTY_COLORS[esp], border: `1px solid ${SPECIALTY_COLORS[esp]}50` }
                      : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {SPECIALTY_LABELS[esp]}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex items-center gap-3">
              <button onClick={() => setForm(f => ({ ...f, conflictoInteres: !f.conflictoInteres }))}
                className={`w-10 flex items-center px-0.5 rounded-full transition-all ${form.conflictoInteres ? 'justify-end' : 'justify-start'}`}
                style={{ height: '22px', background: form.conflictoInteres ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.08)', minWidth: '40px' }}>
                <div className="w-4 h-4 rounded-full bg-white" />
              </button>
              <span className="text-xs text-slate-400">Marcar conflicto de interés</span>
            </div>

            <Field label="Notas internas">
              <textarea value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))}
                rows={2} placeholder="Observaciones, historial, referencias..."
                className={`${inputCls()} resize-none`} style={inputStyle} />
            </Field>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-white/[0.06] flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              Cancelar
            </button>
            <button onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
              <Save size={13} />Guardar Cliente
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ConfirmDelete({ nombre, onConfirm, onCancel }: { nombre: string; onConfirm: () => void; onCancel: () => void }) {
  return (
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
          <p className="text-sm font-black text-white">¿Eliminar cliente?</p>
          <p className="text-xs text-slate-500 mt-1">{nombre}</p>
          <p className="text-[10px] text-slate-600 mt-1">Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400"
            style={{ background: 'rgba(255,255,255,0.05)' }}>Cancelar</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl text-xs font-black text-white"
            style={{ background: 'rgba(239,68,68,0.7)' }}>Eliminar</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Clientes() {
  const { canDelete, canCreate, isSuperAdmin } = useAuth()
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'todos' | 'activo' | 'prospecto'>('todos')
  const [showModal, setShowModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Cliente | null>(null)

  const filtered = clientes.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !search || c.nombre.toLowerCase().includes(q) || c.rut.includes(q) || c.email.toLowerCase().includes(q)
    const matchFilter = filter === 'todos' || c.estado === filter
    return matchSearch && matchFilter
  })

  const handleSave = (nuevo: Cliente) => setClientes(prev => [nuevo, ...prev])
  const handleDelete = (id: string) => { setClientes(prev => prev.filter(c => c.id !== id)); setDeleteTarget(null) }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Clientes</h1>
            {isSuperAdmin && <span title="SuperAdmin"><Shield size={13} className="text-indigo-400" /></span>}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{clientes.filter(c => c.estado === 'activo').length} activos · {clientes.filter(c => c.estado === 'prospecto').length} prospectos</p>
        </div>
        {canCreate && (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
            <Plus size={14} /><span className="hidden sm:inline">Nuevo Cliente</span>
          </motion.button>
        )}
      </motion.div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nombre, RUT, email..."
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs text-slate-300 placeholder-slate-600 outline-none"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }} />
        </div>
        {(['todos', 'activo', 'prospecto'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${filter === f ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            style={filter === f ? { background: 'rgba(29,78,216,0.25)', border: '1px solid rgba(99,102,241,0.35)' } : { background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {f === 'todos' ? 'Todos' : f === 'activo' ? 'Activos' : 'Prospectos'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-all group"
            style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${c.conflictoInteres ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
              style={{ background: c.tipo === 'empresa' ? 'linear-gradient(135deg,#1d4ed8,#7c3aed)' : 'linear-gradient(135deg,#059669,#0284c7)' }}>
              {c.tipo === 'empresa' ? <Building2 size={18} /> : <User size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-white">{c.nombre}</span>
                {c.conflictoInteres && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <AlertTriangle size={9} /> Conflicto
                  </span>
                )}
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${c.estado === 'activo' ? 'text-green-400' : c.estado === 'prospecto' ? 'text-yellow-400' : 'text-slate-500'}`}
                  style={{ background: c.estado === 'activo' ? 'rgba(34,197,94,0.1)' : c.estado === 'prospecto' ? 'rgba(234,179,8,0.1)' : 'rgba(255,255,255,0.05)' }}>
                  {c.estado}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">RUT {c.rut}</p>
              <div className="flex gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-[10px] text-slate-500"><Mail size={9} />{c.email}</span>
                <span className="flex items-center gap-1 text-[10px] text-slate-500"><Phone size={9} />{c.telefono}</span>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {c.especialidades.map(esp => (
                  <span key={esp} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${SPECIALTY_COLORS[esp]}15`, color: SPECIALTY_COLORS[esp], border: `1px solid ${SPECIALTY_COLORS[esp]}30` }}>
                    {SPECIALTY_LABELS[esp]}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-1 flex-shrink-0">
              <div className="text-right mr-1">
                <p className="text-xs font-black text-white">{c.casosActivos}</p>
                <p className="text-[10px] text-slate-600">casos</p>
                {c.deudaHonorarios > 0 && <p className="text-[10px] font-semibold text-yellow-500 mt-1">{c.deudaHonorarios} UF</p>}
              </div>
              {canDelete && (
                <button onClick={() => setDeleteTarget(c)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                  title="Eliminar cliente">
                  <Trash2 size={13} className="text-red-400" />
                </button>
              )}
              <ChevronRight size={14} className="text-slate-700 self-center" />
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Users size={28} className="text-slate-800 mx-auto mb-2" />
            <p className="text-xs text-slate-600">Sin clientes que coincidan</p>
          </div>
        )}
      </div>

      {showModal && <NuevoClienteModal onClose={() => setShowModal(false)} onSave={handleSave} />}
      {deleteTarget && (
        <ConfirmDelete nombre={deleteTarget.nombre} onConfirm={() => handleDelete(deleteTarget.id)} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  )
}
