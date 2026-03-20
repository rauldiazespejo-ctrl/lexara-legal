// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Play, Pause, Square, Trash2, Clock, BarChart2, Target, CheckCircle, Briefcase, ChevronDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAppData } from '../context/AppDataContext'

type TimerState = 'stopped' | 'running' | 'paused'

type Category = 'Reunión' | 'Redacción' | 'Investigación' | 'Trámites' | 'Audiencia'

interface TimeEntry {
  id: string
  caseName: string
  description: string
  category: Category
  durationSeconds: number
  startTime: string
  date: string
  billable: boolean
}

const CATEGORIES: Category[] = ['Reunión', 'Redacción', 'Investigación', 'Trámites', 'Audiencia']

const CATEGORY_COLORS: Record<Category, string> = {
  Reunión: '#3b82f6',
  Redacción: '#8b5cf6',
  Investigación: '#06b6d4',
  Trámites: '#f59e0b',
  Audiencia: '#ef4444',
}

const WEEKLY_DATA = [
  { day: 'Lun', billable: 6.5, nonBillable: 1.0 },
  { day: 'Mar', billable: 7.0, nonBillable: 0.5 },
  { day: 'Mié', billable: 5.5, nonBillable: 2.0 },
  { day: 'Jue', billable: 8.0, nonBillable: 1.0 },
  { day: 'Vie', billable: 6.0, nonBillable: 1.5 },
  { day: 'Sáb', billable: 2.0, nonBillable: 0.0 },
  { day: 'Dom', billable: 0.0, nonBillable: 0.0 },
]

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatDurationShort(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function TimeTracking() {
  const { timeEntries: entries, addTimeEntry, deleteTimeEntry, casos } = useAppData()
  const [timerState, setTimerState] = useState<TimerState>('stopped')
  const [elapsed, setElapsed] = useState(0)
  const [showAssign, setShowAssign] = useState(false)
  const [assignForm, setAssignForm] = useState({
    caseName: casos[0]?.titulo || casos[0]?.clienteNombre || '',
    description: '',
    category: 'Reunión' as Category,
    billable: true,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startClockRef = useRef<string>('')

  const tick = useCallback(() => {
    setElapsed(prev => prev + 1)
  }, [])

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [timerState, tick])

  const handleStart = () => {
    if (timerState === 'stopped') {
      const now = new Date()
      startClockRef.current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      setElapsed(0)
    }
    setTimerState('running')
  }

  const handlePause = () => setTimerState('paused')

  const handleStop = () => {
    setTimerState('stopped')
    if (elapsed > 0) setShowAssign(true)
  }

  const handleAssign = () => {
    if (!assignForm.description.trim()) return
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      caseName: assignForm.caseName,
      description: assignForm.description,
      category: assignForm.category,
      durationSeconds: elapsed,
      startTime: startClockRef.current,
      date: new Date().toISOString().slice(0, 10),
      billable: assignForm.billable,
    }
    addTimeEntry(newEntry)
    setElapsed(0)
    setShowAssign(false)
    setAssignForm({ caseName: casos[0]?.titulo || casos[0]?.clienteNombre || '', description: '', category: 'Reunión', billable: true })
  }

  const handleDelete = (id: string) => deleteTimeEntry(id)

  const today = new Date().toISOString().slice(0, 10)
  const todayEntries = entries.filter(e => e.date === today)
  const recentEntries = [...entries].slice(0, 10)

  const todaySeconds = todayEntries.reduce((s, e) => s + e.durationSeconds, 0)
  const weekSeconds = entries.reduce((s, e) => s + e.durationSeconds, 0)
  const billableSeconds = entries.filter(e => e.billable).reduce((s, e) => s + e.durationSeconds, 0)
  const billablePercent = weekSeconds > 0 ? Math.round((billableSeconds / weekSeconds) * 100) : 0
  const weekGoalHours = 40
  const weekActualHours = +(weekSeconds / 3600).toFixed(1)
  const goalPercent = Math.min(100, Math.round((weekActualHours / weekGoalHours) * 100))

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-black text-white">Control de Tiempo</h1>
        <p className="text-xs text-slate-500 mt-0.5">Registro de horas · González & Asociados</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Horas Hoy', value: formatDurationShort(todaySeconds), icon: Clock, color: '#3b82f6' },
          { label: 'Horas Esta Semana', value: `${weekActualHours}h`, icon: BarChart2, color: '#8b5cf6' },
          { label: 'Facturable %', value: `${billablePercent}%`, icon: CheckCircle, color: '#22c55e' },
          { label: 'Objetivo Semanal', value: `${goalPercent}%`, icon: Target, color: '#f59e0b' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl p-3.5 relative overflow-hidden"
            style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="absolute top-0 right-0 w-14 h-14 rounded-full opacity-10 blur-xl" style={{ background: card.color, transform: 'translate(30%,-30%)' }} />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate">{card.label}</p>
                <p className="text-xl font-black text-white leading-none">{card.value}</p>
                {card.label === 'Objetivo Semanal' && (
                  <p className="text-[10px] text-slate-500 mt-1">{weekActualHours}h / {weekGoalHours}h</p>
                )}
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}>
                <card.icon size={15} style={{ color: card.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Timer size={15} className="text-blue-400" />
          <span className="text-xs font-bold text-slate-300">Temporizador Activo</span>
          {timerState === 'running' && (
            <span className="flex items-center gap-1 ml-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400 font-semibold">En curso</span>
            </span>
          )}
          {timerState === 'paused' && (
            <span className="text-[10px] text-yellow-400 font-semibold ml-auto">Pausado</span>
          )}
        </div>

        <div className="text-center mb-5">
          <p className="text-5xl font-black text-white tabular-nums tracking-widest"
            style={{ fontVariantNumeric: 'tabular-nums', textShadow: timerState === 'running' ? '0 0 30px rgba(59,130,246,0.4)' : 'none', transition: 'text-shadow 0.3s' }}>
            {formatDuration(elapsed)}
          </p>
          {timerState !== 'stopped' && startClockRef.current && (
            <p className="text-[11px] text-slate-500 mt-1">Iniciado a las {startClockRef.current}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          {timerState === 'stopped' && (
            <button onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
              <Play size={15} />Iniciar
            </button>
          )}
          {timerState === 'running' && (
            <>
              <button onClick={handlePause}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-yellow-300"
                style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)' }}>
                <Pause size={14} />Pausar
              </button>
              <button onClick={handleStop}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-red-300"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <Square size={14} />Detener
              </button>
            </>
          )}
          {timerState === 'paused' && (
            <>
              <button onClick={handleStart}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-green-300"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <Play size={14} />Continuar
              </button>
              <button onClick={handleStop}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-red-300"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <Square size={14} />Detener
              </button>
            </>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-2.5 flex items-center gap-2 border-b border-white/[0.04]">
          <Clock size={14} className="text-indigo-400" />
          <span className="text-xs font-bold text-slate-300">Entradas de Hoy</span>
          <span className="ml-auto text-[10px] text-slate-500 font-semibold">{formatDurationShort(todaySeconds)} total</span>
        </div>
        {todayEntries.length === 0 ? (
          <div className="px-4 py-5 text-xs text-slate-600 text-center">Sin registros para hoy</div>
        ) : (
          todayEntries.map((entry, i) => (
            <div key={entry.id}
              className={`px-4 py-3 flex items-center gap-3 ${i < todayEntries.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: `${CATEGORY_COLORS[entry.category]}60` }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{entry.caseName}</p>
                <p className="text-[10px] text-slate-500 truncate">{entry.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${CATEGORY_COLORS[entry.category]}18`, color: CATEGORY_COLORS[entry.category] }}>
                  {entry.category}
                </span>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-200">{formatDurationShort(entry.durationSeconds)}</p>
                  <p className="text-[10px] text-slate-600">{entry.startTime}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={14} className="text-purple-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Resumen Semanal (horas)</span>
        </div>
        <div className="flex gap-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#6366f1' }} />
            <span className="text-[10px] text-slate-500">Facturable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(100,116,139,0.5)' }} />
            <span className="text-[10px] text-slate-500">No facturable</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={WEEKLY_DATA} margin={{ top: 0, right: 5, left: -28, bottom: 0 }} barGap={2}>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', fontSize: 11 }}
              formatter={(value: number, name: string) => [
                `${value}h`,
                name === 'billable' ? 'Facturable' : 'No facturable',
              ]}
            />
            <Bar dataKey="billable" radius={[4, 4, 0, 0]} stackId="a">
              {WEEKLY_DATA.map((_, i) => (
                <Cell key={i} fill={i === 0 ? '#6366f1' : 'rgba(99,102,241,0.55)'} />
              ))}
            </Bar>
            <Bar dataKey="nonBillable" radius={[4, 4, 0, 0]} stackId="a" fill="rgba(100,116,139,0.35)" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-2.5 flex items-center gap-2 border-b border-white/[0.04]">
          <Briefcase size={14} className="text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">Entradas Recientes</span>
        </div>
        {recentEntries.map((entry, i) => (
          <motion.div key={entry.id} layout
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 px-4 py-3 group hover:bg-white/[0.02] transition-colors ${i < recentEntries.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
            <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: `${CATEGORY_COLORS[entry.category]}60` }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{entry.caseName}</p>
              <p className="text-[10px] text-slate-500 truncate">{entry.description}</p>
              <p className="text-[10px] text-slate-600">{entry.date} · {entry.startTime}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block"
                style={{ background: `${CATEGORY_COLORS[entry.category]}18`, color: CATEGORY_COLORS[entry.category] }}>
                {entry.category}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={entry.billable
                  ? { background: 'rgba(34,197,94,0.12)', color: '#22c55e' }
                  : { background: 'rgba(100,116,139,0.12)', color: '#94a3b8' }}>
                {entry.billable ? 'Fact.' : 'N/F'}
              </span>
              <p className="text-xs font-black text-slate-200 w-12 text-right">{formatDurationShort(entry.durationSeconds)}</p>
              <button onClick={() => handleDelete(entry.id)}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20">
                <Trash2 size={12} className="text-red-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {showAssign && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && setShowAssign(false)}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              style={{ background: 'rgba(10,18,35,0.98)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white">Guardar registro</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Duración: <span className="text-blue-400 font-bold">{formatDuration(elapsed)}</span></p>
                </div>
                <button onClick={() => setShowAssign(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
                  <Square size={13} className="text-slate-500" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <p className="text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Caso</p>
                  <div className="relative">
                    <select value={assignForm.caseName}
                      onChange={e => setAssignForm(f => ({ ...f, caseName: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-xs text-slate-200 outline-none appearance-none pr-8"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {casos.map(c => {
                        const label = c.titulo || c.clienteNombre
                        return <option key={c.id} value={label}>{label}</option>
                      })}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Descripción</p>
                  <input
                    value={assignForm.description}
                    onChange={e => setAssignForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="¿Qué hiciste en este tiempo?"
                    className="w-full px-3 py-2.5 rounded-xl text-xs text-slate-200 outline-none placeholder:text-slate-700"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                <div>
                  <p className="text-[10px] text-slate-500 mb-1.5 font-semibold uppercase tracking-wider">Categoría</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setAssignForm(f => ({ ...f, category: cat }))}
                        className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all"
                        style={assignForm.category === cat
                          ? { background: `${CATEGORY_COLORS[cat]}25`, color: CATEGORY_COLORS[cat], border: `1px solid ${CATEGORY_COLORS[cat]}50` }
                          : { background: 'rgba(255,255,255,0.03)', color: '#64748b', border: '1px solid rgba(255,255,255,0.06)' }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-xs text-slate-400 font-medium">¿Es facturable?</span>
                  <button onClick={() => setAssignForm(f => ({ ...f, billable: !f.billable }))}
                    className="w-10 h-5 rounded-full transition-all relative"
                    style={{ background: assignForm.billable ? 'rgba(34,197,94,0.4)' : 'rgba(100,116,139,0.3)' }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                      style={{ background: assignForm.billable ? '#22c55e' : '#475569', left: assignForm.billable ? '22px' : '2px' }} />
                  </button>
                </div>
              </div>

              <div className="px-5 pb-5 flex gap-2">
                <button onClick={() => setShowAssign(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-400"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  Descartar
                </button>
                <button onClick={handleAssign}
                  disabled={!assignForm.description.trim()}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white disabled:opacity-40 transition-opacity"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
                  Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
