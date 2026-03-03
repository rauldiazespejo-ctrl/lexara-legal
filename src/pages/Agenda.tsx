import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, Gavel, AlertTriangle, CheckCircle, MapPin, ChevronRight, Trash2, Plus } from 'lucide-react'
import { EVENTOS_AGENDA } from '../data/appData'
import type { EventoAgenda } from '../types'
import { useAuth } from '../context/AuthContext'

const TIPO_ICONS: Record<EventoAgenda['tipo'], React.ElementType> = {
  audiencia: Gavel, plazo: AlertTriangle, reunion: Clock,
  diligencia: MapPin, vencimiento: AlertTriangle, otro: CalendarDays,
}
const TIPO_COLORS: Record<EventoAgenda['tipo'], string> = {
  audiencia: '#3b82f6', plazo: '#ef4444', reunion: '#8b5cf6',
  diligencia: '#06b6d4', vencimiento: '#f97316', otro: '#64748b',
}
const PRIORITY_COLORS = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e', ok: '#3b82f6' }

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export default function Agenda() {
  const { canDelete, canCreate } = useAuth()
  const [eventos, setEventos] = useState<EventoAgenda[]>(EVENTOS_AGENDA)
  const [view, setView] = useState<'lista' | 'semana'>('lista')
  const today = new Date()

  // Generate next 14 days
  const dias = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  const getEventosForDate = (date: Date) =>
    eventos.filter(e => e.fecha === date.toISOString().split('T')[0])

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Agenda Legal</h1>
          <p className="text-xs text-slate-500 mt-0.5">{MESES[today.getMonth()]} {today.getFullYear()}</p>
        </div>
        <div className="flex gap-1 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {(['lista', 'semana'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1.5 text-xs font-medium transition-all capitalize ${view === v ? 'text-white' : 'text-slate-500'}`}
              style={view === v ? { background: 'rgba(29,78,216,0.3)' } : { background: 'rgba(15,23,42,0.5)' }}>
              {v === 'lista' ? 'Lista' : 'Próximos'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Audiencias', count: eventos.filter(e => e.tipo === 'audiencia').length, color: '#3b82f6' },
          { label: 'Plazos', count: eventos.filter(e => e.tipo === 'plazo').length, color: '#ef4444' },
          { label: 'Reuniones', count: eventos.filter(e => e.tipo === 'reunion').length, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ background: `${s.color}10`, border: `1px solid ${s.color}20` }}>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[10px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {view === 'semana' ? (
        /* ── PRÓXIMOS 14 DÍAS ── */
        <div className="space-y-2">
          {dias.map((dia, i) => {
            const eventos = getEventosForDate(dia)
            const isToday = dia.toDateString() === today.toDateString()
            if (eventos.length === 0 && !isToday) return null
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${isToday ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="flex items-center gap-3 px-4 py-2.5"
                  style={{ background: isToday ? 'rgba(59,130,246,0.08)' : 'transparent' }}>
                  <div className={`w-8 h-8 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isToday ? 'bg-blue-500' : 'bg-white/[0.05]'}`}>
                    <span className="text-[9px] font-semibold text-slate-400">{DIAS_SEMANA[dia.getDay()]}</span>
                    <span className={`text-sm font-black leading-none ${isToday ? 'text-white' : 'text-slate-300'}`}>{dia.getDate()}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{MESES[dia.getMonth()]}</span>
                  {isToday && <span className="text-[9px] font-bold text-blue-400 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">HOY</span>}
                  {eventos.length > 0 && <span className="ml-auto text-[10px] text-slate-600">{eventos.length} evento{eventos.length > 1 ? 's' : ''}</span>}
                </div>
                {eventos.map((ev, j) => {
                  const Icon = TIPO_ICONS[ev.tipo]
                  const color = TIPO_COLORS[ev.tipo]
                  return (
                    <div key={ev.id} className={`flex items-center gap-3 px-4 py-3 ${j < eventos.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                        <Icon size={13} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{ev.titulo}</p>
                        <p className="text-[10px] text-slate-500 truncate">{ev.hora ? `${ev.hora} · ` : ''}{ev.tribunal || ev.descripcion.substring(0, 50)}</p>
                      </div>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PRIORITY_COLORS[ev.prioridad] }} />
                    </div>
                  )
                })}
                {eventos.length === 0 && isToday && (
                  <div className="px-4 py-3 flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle size={12} className="text-green-500" />Sin compromisos para hoy
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      ) : (
        /* ── LISTA COMPLETA ── */
        <div className="space-y-2">
          {eventos.sort((a, b) => a.fecha.localeCompare(b.fecha)).map((ev, i) => {
            const Icon = TIPO_ICONS[ev.tipo]
            const color = TIPO_COLORS[ev.tipo]
            return (
              <motion.div key={ev.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 p-4 rounded-2xl hover:bg-white/[0.02] transition-all group"
                style={{ background: 'rgba(15,23,42,0.7)', border: `1px solid ${ev.completado ? 'rgba(255,255,255,0.04)' : `${PRIORITY_COLORS[ev.prioridad]}25`}`, opacity: ev.completado ? 0.5 : 1 }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
                  <Icon size={17} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${ev.completado ? 'line-through text-slate-600' : 'text-white'} truncate`}>{ev.titulo}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{ev.fecha}{ev.hora ? ` · ${ev.hora}` : ''}{ev.tribunal ? ` · ${ev.tribunal}` : ''}</p>
                  {ev.casoTitulo && <p className="text-[10px] text-blue-400 mt-0.5 truncate">{ev.casoTitulo}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full" style={{ background: PRIORITY_COLORS[ev.prioridad] }} />
                  {canDelete && (
                    <button onClick={() => setEventos(prev => prev.filter(e => e.id !== ev.id))}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20">
                      <Trash2 size={11} className="text-red-400" />
                    </button>
                  )}
                  <ChevronRight size={13} className="text-slate-700" />
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
