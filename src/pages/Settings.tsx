import { motion, AnimatePresence } from 'framer-motion'
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, HelpCircle, LogOut, ChevronRight, Check, RefreshCw, Key, Eye, EyeOff, ExternalLink, Zap, Lock, Unlock } from 'lucide-react'
import { useState, useEffect } from 'react'

const SUPER_ADMIN = {
  nombre: 'Raúl Díaz Espejo',
  email: 'rauldiazespejo@gmail.com',
  rol: 'Super Administrador',
  colegio: 'LEXARA PRO · NexusForge',
}

const API_CONFIGS = [
  {
    id: 'groq',
    label: 'Groq',
    keyName: 'lexara_groq_key',
    badge: 'GRATIS',
    badgeColor: '#22c55e',
    color: '#22c55e',
    desc: '14.400 req/día gratis · Llama 3.3 70B · Whisper',
    link: 'https://console.groq.com',
    linkLabel: 'console.groq.com',
    placeholder: 'gsk_...',
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    keyName: 'lexara_deepseek_key',
    badge: 'MUY BARATO',
    badgeColor: '#06b6d4',
    color: '#06b6d4',
    desc: '$0.14 / 1M tokens · DeepSeek-R1 razonamiento avanzado',
    link: 'https://platform.deepseek.com',
    linkLabel: 'platform.deepseek.com',
    placeholder: 'sk-...',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    keyName: 'lexara_openai_key',
    badge: 'PAGO',
    badgeColor: '#10a37f',
    color: '#10a37f',
    desc: 'GPT-4o, GPT-4o Mini · Análisis premium',
    link: 'https://platform.openai.com/api-keys',
    linkLabel: 'platform.openai.com',
    placeholder: 'sk-...',
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    keyName: 'lexara_anthropic_key',
    badge: 'PAGO',
    badgeColor: '#f59e0b',
    color: '#f59e0b',
    desc: 'Claude 3.5 Sonnet · Contratos complejos',
    link: 'https://console.anthropic.com',
    linkLabel: 'console.anthropic.com',
    placeholder: 'sk-ant-...',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    keyName: 'lexara_gemini_key',
    badge: 'PAGO',
    badgeColor: '#4285f4',
    color: '#4285f4',
    desc: 'Gemini 1.5 Pro · Documentos extensos',
    link: 'https://aistudio.google.com/app/apikey',
    linkLabel: 'aistudio.google.com',
    placeholder: 'AIza...',
  },
]

function APIKeyRow({ cfg }: { cfg: typeof API_CONFIGS[0] }) {
  const [val, setVal] = useState(() => localStorage.getItem(cfg.keyName) ?? '')
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)
  const hasKey = !!localStorage.getItem(cfg.keyName)

  function save() {
    if (val.trim()) {
      localStorage.setItem(cfg.keyName, val.trim())
    } else {
      localStorage.removeItem(cfg.keyName)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-3.5 rounded-2xl space-y-2.5" style={{ background: 'rgba(15,23,42,0.6)', border: `1px solid ${hasKey ? cfg.color + '25' : 'rgba(255,255,255,0.06)'}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: cfg.color + '18' }}>
            <Key size={11} style={{ color: cfg.color }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-white">{cfg.label}</p>
              <span className="text-[7px] font-black px-1.5 py-0.5 rounded" style={{ background: cfg.badgeColor + '20', color: cfg.badgeColor }}>
                {cfg.badge}
              </span>
              {hasKey ? <Unlock size={9} style={{ color: cfg.color }} /> : <Lock size={9} className="text-slate-700" />}
            </div>
            <p className="text-[9px] text-slate-600">{cfg.desc}</p>
          </div>
        </div>
        <a href={cfg.link} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[9px] hover:underline flex-shrink-0 ml-2"
          style={{ color: cfg.color + 'cc' }}>
          <ExternalLink size={8} />{cfg.linkLabel}
        </a>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder={cfg.placeholder}
            className="w-full pl-3 pr-8 py-2 rounded-xl text-xs text-slate-300 outline-none font-mono"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            onKeyDown={e => e.key === 'Enter' && save()}
          />
          <button onClick={() => setShow(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2">
            {show ? <EyeOff size={11} className="text-slate-600" /> : <Eye size={11} className="text-slate-600" />}
          </button>
        </div>
        <button onClick={save}
          className="px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
          style={{ background: saved ? 'rgba(34,197,94,0.15)' : cfg.color + '18', color: saved ? '#22c55e' : cfg.color, border: `1px solid ${saved ? 'rgba(34,197,94,0.3)' : cfg.color + '30'}` }}>
          {saved ? <><Check size={10} />Guardado</> : 'Guardar'}
        </button>
      </div>
    </div>
  )
}

async function fetchUF(): Promise<number | null> {
  try {
    const res = await fetch('https://mindicador.cl/api/uf')
    const data = await res.json()
    return data?.serie?.[0]?.valor ?? null
  } catch {
    return null
  }
}

function useUFValue() {
  const [uf, setUf] = useState<number>(() => {
    const cached = localStorage.getItem('lexara_uf_value')
    const ts = localStorage.getItem('lexara_uf_ts')
    if (cached && ts && (Date.now() - parseInt(ts)) / 1000 / 3600 < 6) return parseFloat(cached)
    return 0
  })
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>(() => {
    const ts = localStorage.getItem('lexara_uf_ts')
    return ts ? new Date(parseInt(ts)).toLocaleString('es-CL') : '—'
  })

  async function refresh() {
    setLoading(true)
    const val = await fetchUF()
    if (val) {
      setUf(val)
      const now = Date.now()
      localStorage.setItem('lexara_uf_value', val.toString())
      localStorage.setItem('lexara_uf_ts', now.toString())
      setLastUpdate(new Date(now).toLocaleString('es-CL'))
    }
    setLoading(false)
  }

  useEffect(() => {
    const cached = localStorage.getItem('lexara_uf_value')
    const ts = localStorage.getItem('lexara_uf_ts')
    const ageHours = ts ? (Date.now() - parseInt(ts)) / 1000 / 3600 : 99
    if (!cached || ageHours >= 6) refresh()
  }, [])

  return { uf, loading, lastUpdate, refresh }
}

export default function Settings() {
  const [notifPlazos, setNotifPlazos] = useState(true)
  const [notifAudiencias, setNotifAudiencias] = useState(true)
  const [diasAlerta, setDiasAlerta] = useState('5')
  const [apiTabOpen, setApiTabOpen] = useState(true)
  const { uf, loading, lastUpdate, refresh } = useUFValue()

  const initials = SUPER_ADMIN.nombre.split(' ').slice(0, 2).map(w => w[0]).join('')
  const keysConfigured = API_CONFIGS.filter(c => !!localStorage.getItem(c.keyName)).length

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
            <SettingsIcon size={14} className="text-indigo-400" />
          </div>
          <h1 className="text-xl font-black text-white">Configuración</h1>
        </div>
        <p className="text-xs text-slate-500">Perfil, APIs de IA y preferencias del sistema</p>
      </motion.div>

      {/* Perfil */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 flex items-center gap-3" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>{initials}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-white">{SUPER_ADMIN.nombre}</p>
          <p className="text-[10px] text-indigo-400 font-semibold">{SUPER_ADMIN.rol}</p>
          <p className="text-[10px] text-slate-500">{SUPER_ADMIN.email}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">{SUPER_ADMIN.colegio}</p>
        </div>
      </motion.div>

      {/* UF */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div className="flex-1">
          <p className="text-xs font-bold text-emerald-400">UF (Valor actualizado · mindicador.cl)</p>
          <p className="text-[9px] text-slate-600">Última actualización: {lastUpdate}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-black text-emerald-400">
            {uf > 0 ? `$${uf.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          </p>
          <button onClick={refresh} disabled={loading}
            className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors disabled:opacity-50">
            <RefreshCw size={12} className={`text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* APIs de IA */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(99,102,241,0.2)' }}>
        <button onClick={() => setApiTabOpen(v => !v)}
          className="w-full flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors"
          style={{ background: 'rgba(15,23,42,0.7)' }}>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
            <Key size={13} className="text-indigo-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-white">APIs de Inteligencia Artificial</p>
            <p className="text-[9px] text-slate-500">{keysConfigured}/{API_CONFIGS.length} claves configuradas · Groq gratis recomendado</p>
          </div>
          {apiTabOpen
            ? <ChevronRight size={14} className="text-slate-600 rotate-90 transition-transform" />
            : <ChevronRight size={14} className="text-slate-600 transition-transform" />}
        </button>
        <AnimatePresence initial={false}>
          {apiTabOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
              className="overflow-hidden">
              <div className="p-3 space-y-3" style={{ background: 'rgba(10,18,35,0.5)' }}>
                <div className="flex items-start gap-2 p-2.5 rounded-xl"
                  style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <Zap size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-slate-400 leading-relaxed">
                    Configura <span className="text-emerald-400 font-bold">Groq (GRATIS)</span> primero — activa análisis de contratos, Teoría del Caso y Redactor sin costo alguno. Las claves se guardan solo en tu dispositivo.
                  </p>
                </div>
                {API_CONFIGS.map(cfg => (
                  <APIKeyRow key={cfg.id} cfg={cfg} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Notificaciones */}
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
              className="w-10 rounded-full transition-all flex items-center px-0.5"
              style={{ background: item.val ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : 'rgba(255,255,255,0.08)', minHeight: '22px', justifyContent: item.val ? 'flex-end' : 'flex-start' }}>
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        ))}
        <div>
          <p className="text-xs text-slate-300 mb-1.5">Días de anticipación para alertas</p>
          <div className="flex gap-2">
            {['3', '5', '7', '10'].map(d => (
              <button key={d} onClick={() => setDiasAlerta(d)}
                className="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={diasAlerta === d
                  ? { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#64748b' }}>
                {d}d {diasAlerta === d && <Check size={9} className="inline ml-0.5" />}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Otros */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="rounded-2xl overflow-hidden" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { icon: Shield, label: 'Privacidad y datos', sub: 'Almacenamiento local · Sin telemetría', color: '#22c55e' },
          { icon: Database, label: 'Respaldo y exportación', sub: 'Exportar a JSON / PDF', color: '#06b6d4' },
          { icon: Palette, label: 'Apariencia', sub: 'Tema oscuro activo', color: '#8b5cf6' },
          { icon: HelpCircle, label: 'Ayuda y documentación', sub: 'Guías de uso y tutoriales', color: '#64748b' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${i < 3 ? 'border-b border-white/[0.04]' : ''}`}>
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

      <div className="text-center py-2">
        <p className="text-[10px] text-slate-700">LEXARA PRO v1.0.0 · Plataforma Legal Chile · 2026</p>
        <p className="text-[9px] text-slate-800 mt-0.5">Arquitectura y desarrollo por NexusForge</p>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-red-400 transition-all hover:bg-red-500/10"
        style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
        <LogOut size={13} />Cerrar sesión
      </button>
    </div>
  )
}
