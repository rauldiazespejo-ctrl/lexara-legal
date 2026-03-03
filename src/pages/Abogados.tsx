import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Search, Mail, Phone, Briefcase, Trash2, Edit2, X, Save, Shield, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export interface Abogado {
  id: string
  nombre: string
  rut: string
  email: string
  telefono: string
  especialidades: string[]
  rol: 'socio' | 'asociado' | 'pasante'
  colegio: string
  numeroColegio: string
  casosActivos: number
  avatar: string
  activo: boolean
}

const ABOGADOS_INIT: Abogado[] = [
  { id: 'a1', nombre: 'Raúl Díaz Espejo', rut: '15.234.567-K', email: 'rauldiazespejo@gmail.com', telefono: '+56 9 9876 5432', especialidades: ['Comercial', 'Civil', 'Tributario'], rol: 'socio', colegio: 'Colegio de Abogados de Chile', numeroColegio: '45.231', casosActivos: 8, avatar: 'RD', activo: true },
  { id: 'a2', nombre: 'María González R.', rut: '12.987.654-3', email: 'mgonzalez@lexara.cl', telefono: '+56 9 8765 4321', especialidades: ['Civil', 'Familia'], rol: 'socio', colegio: 'Colegio de Abogados de Chile', numeroColegio: '38.100', casosActivos: 12, avatar: 'MG', activo: true },
  { id: 'a3', nombre: 'Andrés Muñoz', rut: '18.456.789-2', email: 'amunoz@lexara.cl', telefono: '+56 9 7654 3210', especialidades: ['Laboral', 'Penal'], rol: 'asociado', colegio: 'Colegio de Abogados de Chile', numeroColegio: '52.445', casosActivos: 6, avatar: 'AM', activo: true },
]

const ROL_CONFIG = {
  socio: { label: 'Socio', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  asociado: { label: 'Asociado', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  pasante: { label: 'Pasante', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
}

const ESP_LIST = ['Civil', 'Comercial', 'Laboral', 'Penal', 'Familia', 'Tributario', 'Administrativo', 'Ejecutivo']
const EMPTY = { nombre: '', rut: '', email: '', telefono: '', especialidades: [] as string[], rol: 'asociado' as Abogado['rol'], colegio: 'Colegio de Abogados de Chile', numeroColegio: '' }

function AbogadoModal({ abogado, onClose, onSave }: { abogado?: Abogado; onClose: () => void; onSave: (a: Abogado) => void }) {
  const [form, setForm] = useState(abogado ? { ...abogado } : { ...EMPTY, id: '', avatar: '', casosActivos: 0, activo: true } as Abogado)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.rut.trim()) e.rut = 'Requerido'
    if (!form.email.includes('@')) e.email = 'Email inválido'
    return e
  }

  const save = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const initials = form.nombre.split(' ').slice(0, 2).map(s => s[0]).join('').toUpperCase()
    onSave({ ...form, id: form.id || `a${Date.now()}`, avatar: initials || 'AB' })
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
          <span className="text-sm font-black text-white">{abogado ? 'Editar Abogado' : 'Nuevo Abogado'}</span>
          <button onClick={onClose}><X size={15} className="text-slate-500" /></button>
        </div>
        <div className="overflow-y-auto p-5 space-y-3" style={{ maxHeight: 'calc(90vh - 130px)' }}>
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Nombre completo *</p>
            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Juan Pérez Soto" className={cls} style={inp} />
            {errors.nombre && <p className="text-[10px] text-red-400 mt-0.5">{errors.nombre}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-500 mb-1">RUT *</p>
              <input value={form.rut} onChange={e => setForm(f => ({ ...f, rut: e.target.value }))} placeholder="12.345.678-9" className={cls} style={inp} />
              {errors.rut && <p className="text-[10px] text-red-400 mt-0.5">{errors.rut}</p>}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Rol</p>
              <select value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value as Abogado['rol'] }))} className={cls} style={inp}>
                <option value="socio">Socio</option>
                <option value="asociado">Asociado</option>
                <option value="pasante">Pasante</option>
              </select>
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 mb-1">Email *</p>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="abogado@lexara.cl" className={cls} style={inp} />
            {errors.email && <p className="text-[10px] text-red-400 mt-0.5">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-slate-500 mb-1">Teléfono</p>
              <input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} placeholder="+56 9 1234 5678" className={cls} style={inp} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 mb-1">N° Colegio</p>
              <input value={form.numeroColegio} onChange={e => setForm(f => ({ ...f, numeroColegio: e.target.value }))} placeholder="45.231" className={cls} style={inp} />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 mb-1.5">Especialidades</p>
            <div className="flex flex-wrap gap-1.5">
              {ESP_LIST.map(esp => (
                <button key={esp} onClick={() => setForm(f => ({ ...f, especialidades: f.especialidades.includes(esp) ? f.especialidades.filter(e => e !== esp) : [...f.especialidades, esp] }))}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all"
                  style={form.especialidades.includes(esp) ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.4)' } : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {esp}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-2 border-t border-white/[0.06] pt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400" style={{ background: 'rgba(255,255,255,0.04)' }}>Cancelar</button>
          <button onClick={save} className="flex-1 py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
            <Save size={13} />{abogado ? 'Guardar cambios' : 'Crear Abogado'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Abogados() {
  const { canDelete, isSuperAdmin } = useAuth()
  const [abogados, setAbogados] = useState<Abogado[]>(ABOGADOS_INIT)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Abogado | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Abogado | null>(null)

  const filtered = abogados.filter(a => !search || a.nombre.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()))

  const save = (a: Abogado) => setAbogados(prev => prev.some(x => x.id === a.id) ? prev.map(x => x.id === a.id ? a : x) : [a, ...prev])

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Abogados</h1>
            {isSuperAdmin && <Shield size={13} className="text-indigo-400" />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{abogados.filter(a => a.activo).length} activos · {abogados.filter(a => a.rol === 'socio').length} socios</p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => { setEditTarget(undefined); setShowModal(true) }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
            <Plus size={13} />Nuevo Abogado
          </button>
        )}
      </motion.div>

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email..."
          className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs text-slate-300 outline-none"
          style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }} />
      </div>

      <div className="space-y-2">
        {filtered.map((a, i) => {
          const cfg = ROL_CONFIG[a.rol]
          return (
            <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-4 flex items-start gap-3 group"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                style={{ background: a.rol === 'socio' ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                {a.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{a.nombre}</span>
                  {a.rol === 'socio' && <Star size={10} className="text-amber-400" fill="#f59e0b" />}
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">RUT {a.rut} · Colegio N° {a.numeroColegio}</p>
                <div className="flex gap-3 mt-1">
                  <span className="flex items-center gap-1 text-[10px] text-slate-500"><Mail size={9} />{a.email}</span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500"><Phone size={9} />{a.telefono}</span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {a.especialidades.map(e => (
                    <span key={e} className="text-[10px] px-2 py-0.5 rounded-full text-indigo-400" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>{e}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-1 flex-shrink-0">
                <div className="text-right mr-1">
                  <p className="text-sm font-black text-white">{a.casosActivos}</p>
                  <p className="text-[10px] text-slate-600">causas</p>
                </div>
                {isSuperAdmin && (
                  <>
                    <button onClick={() => { setEditTarget(a); setShowModal(true) }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500/20">
                      <Edit2 size={12} className="text-indigo-400" />
                    </button>
                    <button onClick={() => setDeleteTarget(a)}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20">
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {showModal && <AbogadoModal abogado={editTarget} onClose={() => setShowModal(false)} onSave={save} />}
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-xs rounded-2xl p-5 space-y-4 text-center"
              style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(239,68,68,0.15)' }}>
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-black text-white">¿Eliminar abogado?</p>
                <p className="text-xs text-slate-400 mt-1">{deleteTarget.nombre}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-400" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancelar</button>
                <button onClick={() => { setAbogados(p => p.filter(a => a.id !== deleteTarget.id)); setDeleteTarget(null) }}
                  className="flex-1 py-2 rounded-xl text-xs font-black text-white" style={{ background: 'rgba(239,68,68,0.7)' }}>Eliminar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
