import { motion } from 'framer-motion'
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, HelpCircle, LogOut, ChevronRight, Check } from 'lucide-react'
import { useState } from 'react'

const SECCIONES = [
  {
    titulo: 'Perfil',
    items: [
      { icon: User, label: 'Datos del abogado', sub: 'María González R. · Abogada', color: '#6366f1' },
    ]
  },
  {
    titulo: 'Preferencias',
    items: [
      { icon: Bell, label: 'Notificaciones', sub: 'Alertas de plazos y audiencias', color: '#f59e0b' },
      { icon: Palette, label: 'Apariencia', sub: 'Tema oscuro activo', color: '#8b5cf6' },
    ]
  },
  {
    titulo: 'Legal & Seguridad',
    items: [
      { icon: Shield, label: 'Privacidad y datos', sub: 'Almacenamiento local · Sin telemetría', color: '#22c55e' },
      { icon: Database, label: 'Respaldo y exportación', sub: 'Exportar a JSON / PDF', color: '#06b6d4' },
    ]
  },
  {
    titulo: 'Soporte',
    items: [
      { icon: HelpCircle, label: 'Ayuda y documentación', sub: 'Guías de uso y tutoriales', color: '#64748b' },
    ]
  },
]

const UF_VALUE = 38012

export default function Settings() {
  const [notifPlazos, setNotifPlazos] = useState(true)
  const [notifAudiencias, setNotifAudiencias] = useState(true)
  const [diasAlerta, setDiasAlerta] = useState('5')

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
            <SettingsIcon size={14} className="text-indigo-400" />
          </div>
          <h1 className="text-xl font-black text-white">Configuración</h1>
        </div>
        <p className="text-xs text-slate-500">Perfil, notificaciones y preferencias del sistema</p>
      </motion.div>

      {/* Perfil */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>MG</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white">María González R.</p>
          <p className="text-[10px] text-slate-500">Abogada · Colegio de Abogados de Chile Nº 45.231</p>
          <p className="text-[10px] text-indigo-400">RUT: 15.234.567-K</p>
        </div>
        <button className="p-2 rounded-xl hover:bg-white/[0.05] transition-colors">
          <ChevronRight size={14} className="text-slate-600" />
        </button>
      </motion.div>

      {/* UF valor */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div className="flex-1">
          <p className="text-xs font-bold text-emerald-400">UF (Valor de referencia)</p>
          <p className="text-[10px] text-slate-500">Actualizar manualmente desde CMF · cmfchile.cl</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-emerald-400">${UF_VALUE.toLocaleString('es-CL')}</p>
          <p className="text-[9px] text-slate-600">CLP por UF</p>
        </div>
      </motion.div>

      {/* Alertas de plazos */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-xs font-bold text-slate-300 flex items-center gap-2"><Bell size={13} className="text-amber-400" />Notificaciones de Plazos</p>
        {[
          { label: 'Alertar plazos fatales', sub: 'Recordatorio previo al vencimiento', val: notifPlazos, set: setNotifPlazos },
          { label: 'Alertar audiencias', sub: 'Notificación 24h antes de cada audiencia', val: notifAudiencias, set: setNotifAudiencias },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-300">{item.label}</p>
              <p className="text-[10px] text-slate-600">{item.sub}</p>
            </div>
            <button onClick={() => item.set(!item.val)}
              className={`w-10 h-5.5 rounded-full transition-all flex items-center px-0.5 ${item.val ? 'justify-end' : 'justify-start'}`}
              style={{ background: item.val ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.08)', minHeight: '22px' }}>
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        ))}
        <div>
          <p className="text-xs text-slate-300 mb-1.5">Días de anticipación para alertas</p>
          <div className="flex gap-2">
            {['3', '5', '7', '10'].map(d => (
              <button key={d} onClick={() => setDiasAlerta(d)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${diasAlerta === d ? 'text-white' : 'text-slate-500'}`}
                style={diasAlerta === d ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' } : { background: 'rgba(255,255,255,0.04)' }}>
                {d}d {diasAlerta === d && <Check size={9} className="inline ml-0.5" />}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Secciones */}
      {SECCIONES.slice(1).map((sec, si) => (
        <motion.div key={sec.titulo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + si * 0.04 }}
          className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider px-4 pt-3 pb-1">{sec.titulo}</p>
          {sec.items.map((item, i) => {
            const Icon = item.icon
            return (
              <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < sec.items.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}18` }}>
                  <Icon size={13} style={{ color: item.color }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-slate-300">{item.label}</p>
                  <p className="text-[10px] text-slate-600">{item.sub}</p>
                </div>
                <ChevronRight size={13} className="text-slate-700 flex-shrink-0" />
              </button>
            )
          })}
        </motion.div>
      ))}

      {/* Versión */}
      <div className="text-center py-2">
        <p className="text-[10px] text-slate-700">LEXARA Legal Suite v1.0.0 · Chile · 2024</p>
        <p className="text-[9px] text-slate-800 mt-0.5">Desarrollado para el ejercicio del derecho en Chile</p>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-red-400 transition-all hover:bg-red-500/10"
        style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
        <LogOut size={13} />Cerrar sesión
      </button>
    </div>
  )
}
