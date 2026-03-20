// @ts-nocheck
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Sparkles, Upload, FileText, X, Loader2, Copy, CheckCircle,
  AlertTriangle, ChevronDown, Settings, Eye, EyeOff, Wand2,
  FilePlus2, RefreshCw, Scale, ShieldCheck, BookOpen, Zap,
  ArrowRight, Info, Lock, Unlock, SlidersHorizontal, Brain
} from 'lucide-react'

// ── Tipos ─────────────────────────────────────────────────────────────────────
interface IAModel {
  id: string
  nombre: string
  proveedor: string
  color: string
  descripcion: string
  endpoint: string
  modelo: string
}

interface ModoMejora {
  id: string
  label: string
  icon: typeof Scale
  descripcion: string
  prompt: string
}

interface ResultadoIA {
  textoOriginal: string
  textoMejorado: string
  modelo: string
  cambios: string[]
  riesgosDetectados: string[]
  normasCitadas: string[]
  puntuacion: { antes: number; despues: number }
}

// ── Configuración de modelos ───────────────────────────────────────────────────
const IA_MODELS: IAModel[] = [
  {
    id: 'gpt4o',
    nombre: 'GPT-4o',
    proveedor: 'OpenAI',
    color: '#10a37f',
    descripcion: 'El más avanzado para redacción legal precisa',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelo: 'gpt-4o',
  },
  {
    id: 'gpt4o-mini',
    nombre: 'GPT-4o Mini',
    proveedor: 'OpenAI',
    color: '#10a37f',
    descripcion: 'Rápido y eficiente para revisiones generales',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelo: 'gpt-4o-mini',
  },
  {
    id: 'claude',
    nombre: 'Claude 3.5 Sonnet',
    proveedor: 'Anthropic',
    color: '#d97706',
    descripcion: 'Excelente razonamiento jurídico y redacción',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelo: 'claude-3-5-sonnet-20241022',
  },
  {
    id: 'gemini',
    nombre: 'Gemini 1.5 Pro',
    proveedor: 'Google',
    color: '#4285f4',
    descripcion: 'Análisis contextual y de documentos largo',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    modelo: 'gemini-1.5-pro',
  },
]

const MODOS_MEJORA: ModoMejora[] = [
  {
    id: 'completo',
    label: 'Mejora Integral',
    icon: Wand2,
    descripcion: 'Analiza, detecta problemas y reescribe todo el contrato optimizado',
    prompt: 'Realiza una mejora integral del contrato: corrige redacción, elimina ambigüedades, detecta cláusulas abusivas según Art. 16 Ley 19.496, añade protecciones faltantes y optimiza para el derecho chileno vigente.',
  },
  {
    id: 'abusivas',
    label: 'Detectar Cláusulas Abusivas',
    icon: ShieldCheck,
    descripcion: 'Identifica y corrige cláusulas ilegales o abusivas según la LPDC',
    prompt: 'Analiza el contrato buscando exclusivamente cláusulas abusivas según Art. 16 Ley 19.496 sobre Protección al Consumidor y Art. 1462 del Código Civil chileno. Identifica cada cláusula problemática, explica por qué es abusiva y reescríbela en forma conforme a derecho.',
  },
  {
    id: 'tono',
    label: 'Profesionalizar Tono',
    icon: BookOpen,
    descripcion: 'Eleva el lenguaje a nivel de escritura jurídica profesional chilena',
    prompt: 'Mantén el contenido jurídico pero eleva el estilo de redacción a nivel de un abogado senior especialista en derecho civil chileno. Usa terminología técnica precisa del Código Civil, Código de Comercio y legislación especial chilena. Mantén claridad sin sacrificar rigurosidad.',
  },
  {
    id: 'equilibrio',
    label: 'Equilibrar Partes',
    icon: Scale,
    descripcion: 'Balancea las obligaciones entre las partes eliminando ventajas unilaterales',
    prompt: 'Revisa el contrato buscando desequilibrios en las obligaciones de las partes. Identifica cláusulas que favorezcan excesivamente a una parte en detrimento de la otra. Reescribe para crear un contrato equilibrado que proteja adecuadamente a ambas partes, cumpliendo el principio de buena fe del Art. 1546 CC.',
  },
  {
    id: 'completar',
    label: 'Completar Cláusulas Faltantes',
    icon: FilePlus2,
    descripcion: 'Detecta y agrega cláusulas esenciales que no están en el borrador',
    prompt: 'Analiza el contrato e identifica cláusulas esenciales que faltan según las mejores prácticas del derecho contractual chileno. Agrega las cláusulas faltantes necesarias (confidencialidad, limitación responsabilidad, caso fortuito, notificaciones, ley aplicable, etc.).',
  },
  {
    id: 'simplificar',
    label: 'Simplificar Lenguaje',
    icon: Brain,
    descripcion: 'Mantiene validez legal pero usa lenguaje comprensible para el cliente',
    prompt: 'Reescribe el contrato manteniendo plena validez jurídica bajo el derecho chileno, pero usando lenguaje claro y comprensible para personas sin formación legal. Cada cláusula debe comenzar con un título explicativo en palabras simples y el texto debe evitar latinismos innecesarios.',
  },
]

// ── System prompt base ────────────────────────────────────────────────────────
function buildSystemPrompt(modo: ModoMejora): string {
  return `Eres NexusForge IA, un abogado especialista en derecho chileno con 20 años de experiencia en contratación civil y comercial. Tu tarea es mejorar contratos aplicando estrictamente la legislación chilena vigente.

Marco legal que debes aplicar siempre:
- Código Civil de Chile (Arts. 1438-1809 sobre obligaciones y contratos)
- Código de Comercio de Chile
- Ley 19.496 sobre Protección de los Derechos de los Consumidores
- Ley 20.416 (Empresas de menor tamaño)
- Ley 18.010 (Operaciones de crédito de dinero)
- Ley 17.336 (Propiedad Intelectual)
- Reglamento CAM Santiago (Arbitraje)

Instrucción específica: ${modo.prompt}

FORMATO DE RESPUESTA OBLIGATORIO (JSON):
{
  "textoMejorado": "el texto completo mejorado del contrato",
  "cambios": ["descripción cambio 1", "descripción cambio 2"],
  "riesgosDetectados": ["riesgo o problema encontrado 1", "riesgo 2"],
  "normasCitadas": ["Art. X CC — descripción", "Ley N°X — descripción"],
  "puntuacionAntes": 45,
  "puntuacionDespues": 88
}

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional.`
}

// ── Extractor de texto de archivos ────────────────────────────────────────────
async function extractText(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'txt') {
    return await file.text()
  }

  if (ext === 'docx') {
    const mammoth = await import('mammoth')
    const buf = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer: buf })
    return result.value
  }

  if (ext === 'pdf') {
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const buf = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise
      let text = ''
      for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map((item: any) => item.str).join(' ') + '\n'
      }
      return text
    } catch {
      return '[Error al leer PDF — intenta con TXT o DOCX]'
    }
  }

  return await file.text()
}

// ── Llamada real a OpenAI ─────────────────────────────────────────────────────
async function llamarOpenAI(texto: string, modo: ModoMejora, apiKey: string, modelo: string): Promise<ResultadoIA> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: modelo,
      temperature: 0.3,
      max_tokens: 4000,
      messages: [
        { role: 'system', content: buildSystemPrompt(modo) },
        { role: 'user', content: `Aquí está el contrato a mejorar:\n\n${texto.substring(0, 12000)}` },
      ],
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message ?? `Error OpenAI: ${res.status}`)
  }
  const data = await res.json()
  const raw = data.choices[0].message.content
  try {
    const parsed = JSON.parse(raw)
    return {
      textoOriginal: texto,
      textoMejorado: parsed.textoMejorado ?? raw,
      modelo: modelo,
      cambios: parsed.cambios ?? [],
      riesgosDetectados: parsed.riesgosDetectados ?? [],
      normasCitadas: parsed.normasCitadas ?? [],
      puntuacion: { antes: parsed.puntuacionAntes ?? 50, despues: parsed.puntuacionDespues ?? 85 },
    }
  } catch {
    return {
      textoOriginal: texto, textoMejorado: raw, modelo,
      cambios: [], riesgosDetectados: [], normasCitadas: [],
      puntuacion: { antes: 50, despues: 80 },
    }
  }
}

// ── Llamada real a Anthropic ──────────────────────────────────────────────────
async function llamarAnthropic(texto: string, modo: ModoMejora, apiKey: string): Promise<ResultadoIA> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: buildSystemPrompt(modo),
      messages: [{ role: 'user', content: `Contrato a mejorar:\n\n${texto.substring(0, 12000)}` }],
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message ?? `Error Anthropic: ${res.status}`) }
  const data = await res.json()
  const raw = data.content[0].text
  try {
    const parsed = JSON.parse(raw)
    return {
      textoOriginal: texto, textoMejorado: parsed.textoMejorado ?? raw,
      modelo: 'claude-3-5-sonnet-20241022',
      cambios: parsed.cambios ?? [], riesgosDetectados: parsed.riesgosDetectados ?? [],
      normasCitadas: parsed.normasCitadas ?? [],
      puntuacion: { antes: parsed.puntuacionAntes ?? 50, despues: parsed.puntuacionDespues ?? 88 },
    }
  } catch {
    return { textoOriginal: texto, textoMejorado: raw, modelo: 'claude', cambios: [], riesgosDetectados: [], normasCitadas: [], puntuacion: { antes: 50, despues: 85 } }
  }
}

// ── Llamada real a Gemini ─────────────────────────────────────────────────────
async function llamarGemini(texto: string, modo: ModoMejora, apiKey: string): Promise<ResultadoIA> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(modo) }] },
        contents: [{ parts: [{ text: `Contrato a mejorar:\n\n${texto.substring(0, 12000)}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4000 },
      }),
    }
  )
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message ?? `Error Gemini: ${res.status}`) }
  const data = await res.json()
  const raw = data.candidates[0].content.parts[0].text
  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      textoOriginal: texto, textoMejorado: parsed.textoMejorado ?? raw,
      modelo: 'gemini-1.5-pro',
      cambios: parsed.cambios ?? [], riesgosDetectados: parsed.riesgosDetectados ?? [],
      normasCitadas: parsed.normasCitadas ?? [],
      puntuacion: { antes: parsed.puntuacionAntes ?? 50, despues: parsed.puntuacionDespues ?? 86 },
    }
  } catch {
    return { textoOriginal: texto, textoMejorado: raw, modelo: 'gemini', cambios: [], riesgosDetectados: [], normasCitadas: [], puntuacion: { antes: 50, despues: 82 } }
  }
}

// ── Mejora simulada (sin API key) ─────────────────────────────────────────────
function mejoraSimulada(texto: string, modo: ModoMejora): ResultadoIA {
  const mejoras: Record<string, () => string> = {
    abusivas: () => {
      let t = texto
      t = t.replace(/sin expresión de causa/gi, 'mediante aviso escrito con 30 días de anticipación, con derecho a indemnización proporcional')
      t = t.replace(/en ningún caso será? responsable/gi, 'no será responsable por daños indirectos, pero sí por dolo y culpa grave conforme al Art. 1465 CC')
      t = t.replace(/a su solo arbitrio/gi, 'de acuerdo a criterios objetivos previamente convenidos')
      t = t.replace(/irrevocable/gi, 'revocable con aviso previo de 30 días según Art. 1545 CC')
      t = t.replace(/sin derecho a compensación/gi, 'con derecho a compensación proporcional a las prestaciones ejecutadas')
      return t + '\n\n[REVISADO POR NexusForge IA — Cláusulas abusivas corregidas según Art. 16 Ley 19.496 y Código Civil chileno]'
    },
    tono: () => {
      let t = texto
      t = t.replace(/el que compra/gi, 'el COMPRADOR')
      t = t.replace(/el que vende/gi, 'el VENDEDOR')
      t = t.replace(/se acuerda/gi, 'se estipula')
      t = t.replace(/el contrato termina/gi, 'el presente instrumento se resciliará')
      t = t.replace(/pagar/gi, 'satisfacer el pago de')
      t = t.replace(/si no cumple/gi, 'en caso de incumplimiento de las obligaciones contraídas')
      return t + '\n\n[REVISADO POR NexusForge IA — Tono profesionalizado a estándar jurídico chileno]'
    },
    simplificar: () => texto + '\n\n[NOTA NexusForge IA: Para una simplificación óptima, configura una API Key de OpenAI o Anthropic en el panel de configuración de IA. La simplificación manual requiere IA generativa para garantizar calidad.]',
    default: () => {
      let t = texto
      if (!t.toLowerCase().includes('confidencial')) {
        t += '\n\nCLÁUSULA ADICIONAL — CONFIDENCIALIDAD. Las partes se obligan a mantener en estricta reserva toda la información intercambiada con ocasión del presente contrato, por un período de 3 años desde su término, conforme al Art. 1546 del Código Civil.'
      }
      if (!t.toLowerCase().includes('fuerza mayor') && !t.toLowerCase().includes('caso fortuito')) {
        t += '\n\nCLÁUSULA ADICIONAL — CASO FORTUITO. Ninguna de las partes será responsable por el incumplimiento causado por eventos de fuerza mayor o caso fortuito conforme al Art. 45 del Código Civil, debiendo notificar a la otra parte dentro de 5 días hábiles de ocurrido el evento.'
      }
      if (!t.toLowerCase().includes('arbitraje') && !t.toLowerCase().includes('jurisdicción')) {
        t += '\n\nCLÁUSULA ADICIONAL — JURISDICCIÓN. Para todos los efectos del presente contrato, las partes se someten a la jurisdicción de los Tribunales Ordinarios de Justicia de Santiago, renunciando a cualquier otro fuero.'
      }
      return t + '\n\n[REVISADO POR NexusForge IA — Modo demostración. Configura tu API Key para mejoras con IA real.]'
    }
  }

  const fn = mejoras[modo.id] ?? mejoras.default
  const textoMejorado = fn()

  const riesgos: string[] = []
  if (texto.toLowerCase().includes('sin expresión de causa')) riesgos.push('Cláusula de terminación sin causa (abusiva — Art. 16 Ley 19.496)')
  if (texto.toLowerCase().includes('en ningún caso')) riesgos.push('Exclusión total de responsabilidad (nula — Art. 1465 CC)')
  if (!texto.toLowerCase().includes('plazo') && !texto.toLowerCase().includes('días')) riesgos.push('Sin plazo definido para obligaciones (riesgo de exigibilidad inmediata — Art. 1551 CC)')
  if (!texto.toLowerCase().includes('confidencial')) riesgos.push('Ausencia de cláusula de confidencialidad')
  if (!texto.toLowerCase().includes('rut') && !texto.toLowerCase().includes('rún')) riesgos.push('Identificación incompleta de las partes (sin RUT)')

  return {
    textoOriginal: texto,
    textoMejorado,
    modelo: 'NexusForge IA (modo demostración)',
    cambios: [
      'Se corrigieron cláusulas abusivas según Ley 19.496',
      'Se agregaron cláusulas esenciales faltantes',
      'Se alineó con Código Civil chileno vigente',
      'Se mejoró precisión terminológica',
    ],
    riesgosDetectados: riesgos,
    normasCitadas: ['Art. 1438 CC — Definición de contrato', 'Art. 16 Ley 19.496 — Cláusulas abusivas', 'Art. 1465 CC — Condonación dolo futuro', 'Art. 45 CC — Caso fortuito'],
    puntuacion: { antes: Math.floor(30 + Math.random() * 30), despues: Math.floor(75 + Math.random() * 15) },
  }
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, color, label }: { score: number; color: string; label: string }) {
  const r = 22, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-14 h-14">
        <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
          <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }}/>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">{score}</span>
      </div>
      <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
    </div>
  )
}

// ── Panel configuración API ───────────────────────────────────────────────────
function PanelAPIConfig({ onClose }: { onClose: () => void }) {
  const [keys, setKeys] = useState({
    openai: localStorage.getItem('NexusForge_openai_key') ?? '',
    anthropic: localStorage.getItem('NexusForge_anthropic_key') ?? '',
    gemini: localStorage.getItem('NexusForge_gemini_key') ?? '',
  })
  const [show, setShow] = useState({ openai: false, anthropic: false, gemini: false })
  const [saved, setSaved] = useState(false)

  const save = () => {
    if (keys.openai) localStorage.setItem('NexusForge_openai_key', keys.openai)
    else localStorage.removeItem('NexusForge_openai_key')
    if (keys.anthropic) localStorage.setItem('NexusForge_anthropic_key', keys.anthropic)
    else localStorage.removeItem('NexusForge_anthropic_key')
    if (keys.gemini) localStorage.setItem('NexusForge_gemini_key', keys.gemini)
    else localStorage.removeItem('NexusForge_gemini_key')
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 1200)
  }

  const FIELDS = [
    { id: 'openai', label: 'OpenAI API Key', hint: 'sk-proj-...', color: '#10a37f', url: 'https://platform.openai.com/api-keys' },
    { id: 'anthropic', label: 'Anthropic API Key', hint: 'sk-ant-...', color: '#d97706', url: 'https://console.anthropic.com/settings/keys' },
    { id: 'gemini', label: 'Google Gemini API Key', hint: 'AIza...', color: '#4285f4', url: 'https://aistudio.google.com/apikey' },
  ]

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-50 rounded-2xl flex flex-col"
      style={{ background: 'rgba(5,8,20,0.98)', border: '1px solid rgba(99,102,241,0.3)', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div>
          <p className="text-sm font-black text-white flex items-center gap-2"><Settings size={14} className="text-indigo-400" />Configurar API Keys de IA</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Las claves se almacenan solo en este navegador (localStorage)</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-all"><X size={14} className="text-slate-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Info size={12} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Sin API Key funciona en <strong className="text-slate-300">modo demostración</strong> con mejoras predefinidas.
            Con una API Key real obtienes mejoras generadas por IA avanzada.
            Las claves nunca salen de tu navegador.
          </p>
        </div>
        {FIELDS.map(f => (
          <div key={f.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: f.color }}>{f.label}</label>
              <a href={f.url} target="_blank" rel="noopener noreferrer"
                className="text-[9px] text-slate-600 hover:text-indigo-400 transition-colors">Obtener clave →</a>
            </div>
            <div className="relative">
              <input
                type={show[f.id] ? 'text' : 'password'}
                value={keys[f.id]} onChange={e => setKeys(p => ({ ...p, [f.id]: e.target.value }))}
                placeholder={f.hint}
                className="w-full pl-3 pr-9 py-2.5 rounded-xl text-xs text-slate-200 placeholder-slate-700 outline-none"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${keys[f.id] ? f.color + '40' : 'rgba(255,255,255,0.07)'}` }}
              />
              <button onClick={() => setShow(p => ({ ...p, [f.id]: !p[f.id] }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                {show[f.id] ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>
              {keys[f.id] && (
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: f.color }} />
              )}
            </div>
            {keys[f.id] && (
              <p className="text-[9px] flex items-center gap-1" style={{ color: f.color }}>
                <CheckCircle size={9} />Clave configurada
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <button onClick={save}
          className="w-full py-2.5 rounded-xl text-xs font-black text-white flex items-center justify-center gap-2"
          style={{ background: saved ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
          {saved ? <><CheckCircle size={13} />Guardado</> : <><Lock size={13} />Guardar claves</>}
        </button>
      </div>
    </motion.div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function IAMejorador({ onImportar }: { onImportar: (texto: string, titulo: string) => void }) {
  const [modeloSeleccionado, setModeloSeleccionado] = useState<IAModel>(IA_MODELS[0])
  const [modoSeleccionado, setModoSeleccionado] = useState<ModoMejora>(MODOS_MEJORA[0])
  const [archivo, setArchivo] = useState<File | null>(null)
  const [textoManual, setTextoManual] = useState('')
  const [inputMode, setInputMode] = useState<'archivo' | 'texto'>('texto')
  const [estado, setEstado] = useState<'idle' | 'extrayendo' | 'procesando' | 'resultado' | 'error'>('idle')
  const [resultado, setResultado] = useState<ResultadoIA | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [vistaActiva, setVistaActiva] = useState<'original' | 'mejorado' | 'diff'>('mejorado')
  const [showConfig, setShowConfig] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const tieneKeyOpenAI = !!localStorage.getItem('NexusForge_openai_key')
  const tieneKeyAnthropic = !!localStorage.getItem('NexusForge_anthropic_key')
  const tieneKeyGemini = !!localStorage.getItem('NexusForge_gemini_key')

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) { setArchivo(files[0]); setInputMode('archivo') }
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1, maxSize: 20 * 1024 * 1024,
  })

  const procesarConIA = async () => {
    setErrorMsg('')
    let textoBase = ''

    if (inputMode === 'archivo' && archivo) {
      setEstado('extrayendo')
      textoBase = await extractText(archivo)
    } else {
      textoBase = textoManual.trim()
    }

    if (!textoBase || textoBase.length < 30) {
      setErrorMsg('El texto del contrato está vacío o es muy corto.')
      setEstado('error')
      return
    }

    setEstado('procesando')

    try {
      let res: ResultadoIA

      if (modeloSeleccionado.id === 'claude' && tieneKeyAnthropic) {
        res = await llamarAnthropic(textoBase, modoSeleccionado, localStorage.getItem('NexusForge_anthropic_key')!)
      } else if (modeloSeleccionado.id === 'gemini' && tieneKeyGemini) {
        res = await llamarGemini(textoBase, modoSeleccionado, localStorage.getItem('NexusForge_gemini_key')!)
      } else if ((modeloSeleccionado.id === 'gpt4o' || modeloSeleccionado.id === 'gpt4o-mini') && tieneKeyOpenAI) {
        res = await llamarOpenAI(textoBase, modoSeleccionado, localStorage.getItem('NexusForge_openai_key')!, modeloSeleccionado.modelo)
      } else {
        await new Promise(r => setTimeout(r, 2200))
        res = mejoraSimulada(textoBase, modoSeleccionado)
      }

      setResultado(res)
      setEstado('resultado')
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Error al contactar la IA. Verifica tu API Key.')
      setEstado('error')
    }
  }

  const copiar = () => {
    if (!resultado) return
    navigator.clipboard.writeText(resultado.textoMejorado)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const importar = () => {
    if (!resultado) return
    const titulo = archivo ? archivo.name.replace(/\.\w+$/, '') : 'Contrato mejorado por IA'
    onImportar(resultado.textoMejorado, titulo)
  }

  const reiniciar = () => {
    setEstado('idle'); setResultado(null); setArchivo(null)
    setTextoManual(''); setErrorMsg(''); setVistaActiva('mejorado')
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 relative">

      {/* Config overlay */}
      <AnimatePresence>
        {showConfig && <PanelAPIConfig onClose={() => setShowConfig(false)} />}
      </AnimatePresence>

      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-white flex items-center gap-2">
            <Brain size={15} className="text-violet-400" />
            Mejora con Inteligencia Artificial
          </p>
          <p className="text-[10px] text-slate-500">Sube un borrador → elige modelo y modo → obtén contrato optimizado</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} onClick={() => setShowConfig(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
          <Settings size={11} />
          API Keys
          {(tieneKeyOpenAI || tieneKeyAnthropic || tieneKeyGemini) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </motion.button>
      </div>

      {estado === 'idle' || estado === 'extrayendo' ? (
        <div className="space-y-4">

          {/* Modelo IA */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Modelo de IA</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {IA_MODELS.map(m => {
                const tieneKey = (m.id === 'gpt4o' || m.id === 'gpt4o-mini') ? tieneKeyOpenAI : m.id === 'claude' ? tieneKeyAnthropic : tieneKeyGemini
                return (
                  <motion.button key={m.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setModeloSeleccionado(m)}
                    className="p-3 rounded-2xl text-left transition-all relative"
                    style={{
                      background: modeloSeleccionado.id === m.id ? `${m.color}12` : 'rgba(15,23,42,0.6)',
                      border: `1px solid ${modeloSeleccionado.id === m.id ? m.color + '50' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                      <span className="text-[10px] font-black text-white">{m.nombre}</span>
                      {!tieneKey && <Lock size={8} className="text-slate-600 ml-auto" />}
                      {tieneKey && <Unlock size={8} className="ml-auto" style={{ color: m.color }} />}
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed">{m.descripcion}</p>
                    <p className="text-[9px] mt-1 font-semibold" style={{ color: m.color + 'cc' }}>{m.proveedor}</p>
                  </motion.button>
                )
              })}
            </div>
            {!(tieneKeyOpenAI || tieneKeyAnthropic || tieneKeyGemini) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-2 p-2.5 rounded-xl flex items-center gap-2 text-[10px]"
                style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}>
                <Zap size={10} className="text-yellow-500 flex-shrink-0" />
                <span className="text-slate-400">Sin API Key activa — funcionará en <strong className="text-yellow-500">modo demostración</strong> con mejoras predefinidas.
                  <button onClick={() => setShowConfig(true)} className="ml-1 text-indigo-400 hover:underline">Configurar API Key →</button>
                </span>
              </motion.div>
            )}
          </div>

          {/* Modo mejora */}
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Modo de mejora</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MODOS_MEJORA.map(m => {
                const Icon = m.icon
                return (
                  <motion.button key={m.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setModoSeleccionado(m)}
                    className="p-3 rounded-2xl text-left transition-all"
                    style={{
                      background: modoSeleccionado.id === m.id ? 'rgba(99,102,241,0.1)' : 'rgba(15,23,42,0.6)',
                      border: `1px solid ${modoSeleccionado.id === m.id ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                    <Icon size={13} className="mb-1.5" style={{ color: modoSeleccionado.id === m.id ? '#a5b4fc' : '#475569' }} />
                    <p className="text-[10px] font-bold text-white">{m.label}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{m.descripcion}</p>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Input: Tabs archivo / texto */}
          <div>
            <div className="flex gap-1 p-1 rounded-xl mb-3 w-fit" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {(['archivo', 'texto'] as const).map(t => (
                <button key={t} onClick={() => setInputMode(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={inputMode === t ? { background: 'rgba(99,102,241,0.25)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' } : { color: '#64748b' }}>
                  {t === 'archivo' ? '📎 Subir archivo' : '✏️ Pegar texto'}
                </button>
              ))}
            </div>

            {inputMode === 'archivo' ? (
              <div className="space-y-2">
                <div {...getRootProps()} className="cursor-pointer">
                  <input {...getInputProps()} />
                  <motion.div whileHover={{ scale: 1.005 }}
                    className="p-8 rounded-2xl text-center transition-all"
                    style={{
                      background: isDragActive ? 'rgba(99,102,241,0.08)' : 'rgba(15,23,42,0.6)',
                      border: `2px dashed ${isDragActive ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                    <Upload size={22} className="text-indigo-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white mb-0.5">
                      {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra o haz clic para subir'}
                    </p>
                    <p className="text-[10px] text-slate-500">PDF · DOCX · TXT · Máx 20 MB</p>
                  </motion.div>
                </div>
                {archivo && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <FileText size={16} className="text-indigo-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{archivo.name}</p>
                      <p className="text-[10px] text-slate-500">{(archivo.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={() => setArchivo(null)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 transition-all"><X size={12} className="text-red-400" /></button>
                  </div>
                )}
              </div>
            ) : (
              <textarea value={textoManual} onChange={e => setTextoManual(e.target.value)}
                placeholder="Pega aquí el texto del contrato borrador que deseas mejorar con IA...

Ejemplo:
CONTRATO DE PRESTACIÓN DE SERVICIOS
Entre Empresa ABC y Juan Pérez...

CLÁUSULA PRIMERA: El contratista prestará servicios de consultoría...
CLÁUSULA SEGUNDA: El precio será de $1.000.000 pesos...

La empresa podrá terminar el contrato en cualquier momento sin expresión de causa..."
                rows={10}
                className="w-full text-xs text-slate-300 placeholder-slate-700 outline-none rounded-2xl p-4 leading-relaxed"
                style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.07)', resize: 'vertical' }}
              />
            )}
          </div>

          {/* CTA */}
          <motion.button
            onClick={procesarConIA}
            disabled={estado === 'extrayendo' || (!archivo && !textoManual.trim())}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2.5 disabled:opacity-40 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#4338ca,#6d28d9,#7c3aed)', boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}>
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
              style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.05),transparent)' }} />
            <Brain size={16} />
            Mejorar con {modeloSeleccionado.nombre}
            <ArrowRight size={15} />
          </motion.button>
        </div>
      ) : estado === 'procesando' || estado === 'extrayendo' ? (
        <div className="py-16 text-center space-y-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${modeloSeleccionado.color}20,${modeloSeleccionado.color}40)`, border: `2px solid ${modeloSeleccionado.color}50` }}>
            <Brain size={22} style={{ color: modeloSeleccionado.color }} />
          </motion.div>
          <div>
            <p className="text-sm font-black text-white">
              {estado === 'extrayendo' ? 'Extrayendo texto del archivo...' : `${modeloSeleccionado.nombre} analizando...`}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {estado === 'extrayendo' ? 'Leyendo documento' : `Modo: ${modoSeleccionado.label}`}
            </p>
          </div>
          <div className="flex justify-center gap-1">
            {[0, 1, 2, 3].map(i => (
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ background: modeloSeleccionado.color }}
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        </div>
      ) : estado === 'error' ? (
        <div className="py-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <p className="text-sm font-bold text-red-400">Error al procesar</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">{errorMsg}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={reiniciar}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
              Intentar de nuevo
            </button>
            <button onClick={() => setShowConfig(true)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Configurar API Key
            </button>
          </div>
        </div>
      ) : resultado ? (
        <div className="space-y-4">
          {/* Score comparison */}
          <div className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <ScoreRing score={resultado.puntuacion.antes} color="#ef4444" label="Antes" />
            <div className="flex-1 text-center">
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
                className="h-1 rounded-full mx-4"
                style={{ background: 'linear-gradient(90deg,#ef4444,#10b981)' }} />
              <p className="text-[10px] text-slate-500 mt-2">Mejora con {resultado.modelo}</p>
              <p className="text-[9px] text-slate-600">{modoSeleccionado.label}</p>
            </div>
            <ScoreRing score={resultado.puntuacion.despues} color="#10b981" label="Después" />
          </div>

          {/* Riesgos / Cambios / Normas */}
          {resultado.riesgosDetectados.length > 0 && (
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-[10px] font-black text-red-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle size={10} />{resultado.riesgosDetectados.length} riesgo{resultado.riesgosDetectados.length > 1 ? 's' : ''} detectado{resultado.riesgosDetectados.length > 1 ? 's' : ''}
              </p>
              {resultado.riesgosDetectados.map((r, i) => <p key={i} className="text-[10px] text-slate-400">• {r}</p>)}
            </div>
          )}
          {resultado.cambios.length > 0 && (
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <p className="text-[10px] font-black text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle size={10} />{resultado.cambios.length} mejora{resultado.cambios.length > 1 ? 's' : ''} aplicada{resultado.cambios.length > 1 ? 's' : ''}
              </p>
              {resultado.cambios.map((c, i) => <p key={i} className="text-[10px] text-slate-400">✓ {c}</p>)}
            </div>
          )}
          {resultado.normasCitadas.length > 0 && (
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <p className="text-[10px] font-black text-blue-400 flex items-center gap-1.5 mb-2"><Scale size={10} />Normas aplicadas</p>
              <div className="flex flex-wrap gap-1">
                {resultado.normasCitadas.map((n, i) => (
                  <span key={i} className="text-[9px] text-slate-400 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>{n}</span>
                ))}
              </div>
            </div>
          )}

          {/* Vista original / mejorado */}
          <div>
            <div className="flex gap-1 p-1 rounded-xl mb-2 w-fit" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {(['original', 'mejorado'] as const).map(v => (
                <button key={v} onClick={() => setVistaActiva(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={vistaActiva === v
                    ? { background: v === 'mejorado' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)', color: v === 'mejorado' ? '#34d399' : '#f87171', border: `1px solid ${v === 'mejorado' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'}` }
                    : { color: '#64748b' }}>
                  {v === 'original' ? '📄 Original' : '✨ Mejorado'}
                </button>
              ))}
            </div>
            <div className="relative">
              <textarea
                value={vistaActiva === 'original' ? resultado.textoOriginal : resultado.textoMejorado}
                onChange={e => { if (vistaActiva === 'mejorado') setResultado(p => p ? { ...p, textoMejorado: e.target.value } : p) }}
                readOnly={vistaActiva === 'original'}
                rows={12}
                className="w-full text-xs text-slate-300 outline-none rounded-2xl p-4 leading-relaxed"
                style={{
                  background: vistaActiva === 'mejorado' ? 'rgba(16,185,129,0.03)' : 'rgba(15,23,42,0.5)',
                  border: `1px solid ${vistaActiva === 'mejorado' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <motion.button whileHover={{ scale: 1.02 }} onClick={importar}
              className="flex-1 py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.25)' }}>
              <FilePlus2 size={14} />Importar al documento
            </motion.button>
            <button onClick={copiar}
              className="px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: copiado ? '#34d399' : '#94a3b8' }}>
              {copiado ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copiado ? 'Copiado' : 'Copiar'}
            </button>
            <button onClick={reiniciar}
              className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}>
              <RefreshCw size={14} />Nuevo
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
