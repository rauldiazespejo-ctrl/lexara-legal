import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, Eye, EyeOff, Check, Loader2, Cpu, PlugZap, ChevronDown, AlertCircle } from 'lucide-react'
import type { ListedModel } from '../services/asiaAiModels'

type Props = {
  title: string
  subtitle: string
  keyName: string
  placeholder: string
  color: string
  badge: string
  badgeColor: string
  link: string
  linkLabel: string
  getSelectedModelId: () => string
  setSelectedModelId: (id: string) => void
  fetchModels: (apiKey: string) => Promise<ListedModel[]>
  onConnectSuccessHint?: string
}

export default function OpenAiCompatModelHub({
  title,
  subtitle,
  keyName,
  placeholder,
  color,
  badge,
  badgeColor,
  link,
  linkLabel,
  getSelectedModelId,
  setSelectedModelId,
  fetchModels,
  onConnectSuccessHint,
}: Props) {
  const [val, setVal] = useState(() => {
    try {
      return localStorage.getItem(keyName) ?? ''
    } catch {
      return ''
    }
  })
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)
  const [models, setModels] = useState<ListedModel[]>([])
  const [modelsErr, setModelsErr] = useState('')
  const [loadingModels, setLoadingModels] = useState(false)
  const [selectedId, setSelectedId] = useState(() => getSelectedModelId())

  const hasKey = (() => {
    try {
      return !!(val.trim() || localStorage.getItem(keyName))
    } catch {
      return !!val.trim()
    }
  })()

  const saveKey = useCallback(() => {
    try {
      if (val.trim()) localStorage.setItem(keyName, val.trim())
      else localStorage.removeItem(keyName)
    } catch {
      /* ignore */
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [val, keyName])

  const connectAndLoad = useCallback(async () => {
    setModelsErr('')
    const key = val.trim() || (typeof localStorage !== 'undefined' ? localStorage.getItem(keyName) ?? '' : '')
    if (!key) {
      setModelsErr('Guarda primero tu API Key o pégala en el campo.')
      return
    }
    setLoadingModels(true)
    setModels([])
    try {
      const list = await fetchModels(key)
      setModels(list)
      setSelectedId(prev => {
        if (list.some(m => m.id === prev)) return prev
        const next = list[0]?.id ?? prev
        setSelectedModelId(next)
        return next
      })
    } catch (e) {
      setModelsErr(e instanceof Error ? e.message : 'No se pudieron cargar los modelos')
    } finally {
      setLoadingModels(false)
    }
  }, [val, keyName, fetchModels, setSelectedModelId])

  const onSelectModel = (id: string) => {
    setSelectedId(id)
    setSelectedModelId(id)
  }

  return (
    <div
      className="p-3.5 rounded-2xl space-y-3"
      style={{
        background: 'rgba(15,23,42,0.75)',
        border: `1px solid ${hasKey ? color + '28' : 'rgba(255,255,255,0.06)'}`,
      }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '22' }}>
            <Cpu size={15} style={{ color }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs font-black text-white">{title}</p>
              <span className="text-[7px] font-black px-1.5 py-0.5 rounded" style={{ background: badgeColor + '22', color: badgeColor }}>
                {badge}
              </span>
            </div>
            <p className="text-[9px] text-slate-500 leading-snug">{subtitle}</p>
          </div>
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-[9px] font-semibold flex-shrink-0 hover:underline" style={{ color: color + 'dd' }}>
          {linkLabel} →
        </a>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Key size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type={show ? 'text' : 'password'}
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-8 pr-8 py-2.5 rounded-xl text-xs text-slate-200 outline-none font-mono"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}22` }}
            onKeyDown={e => e.key === 'Enter' && saveKey()}
          />
          <button type="button" onClick={() => setShow(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600">
            {show ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        </div>
        <button
          type="button"
          onClick={saveKey}
          className="px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 flex-shrink-0"
          style={{
            background: saved ? 'rgba(34,197,94,0.15)' : color + '20',
            color: saved ? '#22c55e' : color,
            border: `1px solid ${saved ? 'rgba(34,197,94,0.35)' : color + '35'}`,
          }}>
          {saved ? (
            <>
              <Check size={11} /> OK
            </>
          ) : (
            'Guardar'
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => void connectAndLoad()}
        disabled={loadingModels}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black text-white disabled:opacity-50 transition-all"
        style={{
          background: `linear-gradient(135deg, ${color}cc, #6366f1aa)`,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `0 8px 24px ${color}20`,
        }}>
        {loadingModels ? <Loader2 size={14} className="animate-spin" /> : <PlugZap size={14} />}
        {loadingModels ? 'Conectando…' : 'Conectar y cargar modelos'}
      </button>

      <AnimatePresence>
        {modelsErr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 p-2.5 rounded-xl text-[10px] text-amber-300 overflow-hidden"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
            {modelsErr}
          </motion.div>
        )}
      </AnimatePresence>

      {models.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <ChevronDown size={10} /> Modelo de chat
          </p>
          <div className="relative">
            <select
              value={selectedId}
              onChange={e => onSelectModel(e.target.value)}
              className="w-full appearance-none pl-3 pr-9 py-2.5 rounded-xl text-xs font-semibold text-slate-200 outline-none cursor-pointer"
              style={{ background: 'rgba(5,10,25,0.9)', border: `1px solid ${color}35` }}>
              {models.map(m => (
                <option key={m.id} value={m.id}>
                  {m.id}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
          {onConnectSuccessHint && <p className="text-[9px] text-slate-600">{onConnectSuccessHint}</p>}
        </div>
      )}

      {models.length === 0 && !loadingModels && !modelsErr && (
        <p className="text-[9px] text-slate-600 text-center py-1">
          Modelo por defecto: <span className="text-slate-400 font-mono">{getSelectedModelId()}</span>
        </p>
      )}
    </div>
  )
}
