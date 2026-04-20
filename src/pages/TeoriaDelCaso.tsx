// @ts-nocheck
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  Mic, MicOff, Upload, FileText, Play, Square, Loader2,
  AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Download,
  BookOpen, Scale, Shield, Zap, Brain, FileDown, Trash2,
  Volume2, FileAudio, PlusCircle, Save, RefreshCw, X
} from 'lucide-react'
import { extractTextFromFile } from '../utils/extractText'
import { getGroqChatModelId } from '../services/groqModels'
import {
  getZaiChatModelId,
  getKimiChatModelId,
  getQwenChatModelId,
  getZaiChatCompletionsUrl,
  KIMI_CHAT_URL,
  QWEN_CHAT_URL,
} from '../services/asiaAiModels'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx'

// ── Tipos ──────────────────────────────────────────────────────────────────────
interface HechoJuridico {
  tipo: 'hecho' | 'prueba' | 'fundamento' | 'parte'
  descripcion: string
  relevancia: 'alta' | 'media' | 'baja'
  normaAplicable?: string
}

interface TeoriaDelCaso {
  titulo: string
  resumenEjecutivo: string
  hechosPrincipales: string
  pruebasDisponibles: string
  normaAplicable: string
  teoriaDefensa?: string
  teoriaAcusacion?: string
  estrategiaProcesal: string
  debilidadesRiesgos: string
  conclusionJuridica: string
  hechos: HechoJuridico[]
  modeloIA: string
  fecha: string
}

// ── Prompts ────────────────────────────────────────────────────────────────────
function buildPromptHechos(texto: string): string {
  return `Eres un abogado experto en derecho chileno con amplio conocimiento del Código Civil, Código Penal, Código Procesal Penal, Código del Trabajo y normativa vigente en Chile.

Analiza el siguiente texto (puede ser transcripción de audio o contenido de documentos de prueba) y extrae los hechos jurídicamente relevantes para construir una teoría del caso.

TEXTO A ANALIZAR:
${texto.substring(0, 12000)}

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "titulo": "título descriptivo del caso (max 80 chars)",
  "resumenEjecutivo": "resumen ejecutivo del caso en 3-4 oraciones",
  "hechosPrincipales": "descripción detallada de los hechos principales (4-6 párrafos)",
  "pruebasDisponibles": "análisis de las pruebas disponibles y su valor probatorio según derecho chileno",
  "normaAplicable": "normas legales chilenas aplicables (citar artículos específicos: Código Civil, Código Penal, CPC, CPP, CT, etc.)",
  "teoriaDefensa": "teoría del caso desde perspectiva de la defensa",
  "teoriaAcusacion": "teoría del caso desde perspectiva de la parte demandante/acusación",
  "estrategiaProcesal": "estrategia procesal recomendada con fundamento en procedimiento chileno",
  "debilidadesRiesgos": "debilidades del caso y riesgos jurídicos identificados",
  "conclusionJuridica": "conclusión jurídica fundamentada en el ordenamiento jurídico chileno",
  "hechos": [
    {
      "tipo": "hecho|prueba|fundamento|parte",
      "descripcion": "descripción del hecho/prueba/fundamento/parte",
      "relevancia": "alta|media|baja",
      "normaAplicable": "artículo o norma específica si aplica"
    }
  ]
}`
}

// ── API keys ───────────────────────────────────────────────────────────────────
const getGroqKey = () => localStorage.getItem('lexara_groq_key') || ''
const getOpenAIKey = () => localStorage.getItem('lexara_openai_key') || ''
const getClaudeKey = () => localStorage.getItem('lexara_anthropic_key') || ''
const getGeminiKey = () => localStorage.getItem('lexara_gemini_key') || ''
const getKimiKey = () => localStorage.getItem('lexara_kimi_key') || ''
const getZaiKey = () => localStorage.getItem('lexara_zai_key') || ''
const getQwenKey = () => localStorage.getItem('lexara_qwen_key') || ''

// ── Transcripción con Groq Whisper (GRATIS) ────────────────────────────────────
async function transcribirGroq(audioBlob: Blob, apiKey: string): Promise<string> {
  const ext = audioBlob.type.includes('webm') ? 'webm'
    : audioBlob.type.includes('mp4') ? 'mp4'
    : audioBlob.type.includes('ogg') ? 'ogg' : 'mp3'
  const formData = new FormData()
  formData.append('file', audioBlob, `audio.${ext}`)
  formData.append('model', 'whisper-large-v3')
  formData.append('language', 'es')
  formData.append('response_format', 'text')
  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq Whisper error ${res.status}`)
  }
  return await res.text()
}

// ── Transcripción con OpenAI Whisper ──────────────────────────────────────────
async function transcribirOpenAI(audioBlob: Blob, apiKey: string): Promise<string> {
  const ext = audioBlob.type.includes('webm') ? 'webm' : audioBlob.type.includes('mp4') ? 'mp4' : 'mp3'
  const formData = new FormData()
  formData.append('file', audioBlob, `audio.${ext}`)
  formData.append('model', 'whisper-1')
  formData.append('language', 'es')
  formData.append('response_format', 'text')
  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  })
  if (!res.ok) throw new Error(`OpenAI Whisper error ${res.status}`)
  return await res.text()
}

// ── Análisis con Groq Llama 3.3 70B (GRATIS) ──────────────────────────────────
async function analizarConGroq(texto: string, apiKey: string): Promise<TeoriaDelCaso> {
  const model = getGroqChatModelId()
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: buildPromptHechos(texto) }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq error ${res.status}`)
  }
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || '{}'
  return { ...JSON.parse(raw), modeloIA: `Groq · ${model}`, fecha: new Date().toLocaleDateString('es-CL') }
}

async function analizarConZai(texto: string, apiKey: string): Promise<TeoriaDelCaso> {
  const model = getZaiChatModelId()
  const res = await fetch(getZaiChatCompletionsUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Accept-Language': 'en-US,en',
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: buildPromptHechos(texto) }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Z.AI error ${res.status}`)
  }
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || '{}'
  return { ...JSON.parse(raw), modeloIA: `Z.AI · ${model}`, fecha: new Date().toLocaleDateString('es-CL') }
}

async function analizarConKimi(texto: string, apiKey: string): Promise<TeoriaDelCaso> {
  const model = getKimiChatModelId()
  const res = await fetch(KIMI_CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: buildPromptHechos(texto) }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Kimi error ${res.status}`)
  }
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || '{}'
  return { ...JSON.parse(raw), modeloIA: `Kimi · ${model}`, fecha: new Date().toLocaleDateString('es-CL') }
}

async function analizarConQwen(texto: string, apiKey: string): Promise<TeoriaDelCaso> {
  const model = getQwenChatModelId()
  const res = await fetch(QWEN_CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: buildPromptHechos(texto) }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Qwen error ${res.status}`)
  }
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || '{}'
  return { ...JSON.parse(raw), modeloIA: `Qwen · ${model}`, fecha: new Date().toLocaleDateString('es-CL') }
}

// ── Análisis con GPT-4o ────────────────────────────────────────────────────────
async function analizarConGPT(texto: string, apiKey: string): Promise<TeoriaDelCaso> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: buildPromptHechos(texto) }],
    }),
  })
  if (!res.ok) throw new Error(`GPT-4o error ${res.status}`)
  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content || '{}'
  const parsed = JSON.parse(raw)
  return { ...parsed, modeloIA: 'GPT-4o', fecha: new Date().toLocaleDateString('es-CL') }
}

async function analizarConClaude(texto: string, apiKey: string): Promise<TeoriaDelCaso> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [{ role: 'user', content: buildPromptHechos(texto) }],
    }),
  })
  if (!res.ok) throw new Error(`Claude error ${res.status}`)
  const data = await res.json()
  let raw = data.content?.[0]?.text || '{}'
  raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(raw)
  return { ...parsed, modeloIA: 'Claude 3.5 Sonnet', fecha: new Date().toLocaleDateString('es-CL') }
}

async function analizarConGemini(texto: string, apiKey: string): Promise<TeoriaDelCaso> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
      contents: [{ parts: [{ text: buildPromptHechos(texto) }] }],
    }),
  })
  if (!res.ok) throw new Error(`Gemini error ${res.status}`)
  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  const parsed = JSON.parse(raw)
  return { ...parsed, modeloIA: 'Gemini 1.5 Pro', fecha: new Date().toLocaleDateString('es-CL') }
}

// ── Análisis demo sin API ──────────────────────────────────────────────────────
function analizarDemo(texto: string): TeoriaDelCaso {
  const tieneContrato = /contrat|acuerdo|convenio/i.test(texto)
  const tieneLaboral = /despid|trabajador|empleador|contrat.*trabajo/i.test(texto)
  const tienePenal = /delito|imputado|víctima|denuncia|querella|fiscal/i.test(texto)
  const tipo = tienePenal ? 'Penal' : tieneLaboral ? 'Laboral' : tieneContrato ? 'Contractual' : 'Civil'
  return {
    titulo: `Caso ${tipo} — Análisis Preliminar`,
    resumenEjecutivo: `Se ha analizado el contenido proporcionado y se han identificado elementos jurídicamente relevantes propios de un conflicto de naturaleza ${tipo.toLowerCase()} bajo el ordenamiento jurídico chileno. El análisis fue realizado en modo de demostración; para resultados precisos configure una API key en Configuración.`,
    hechosPrincipales: `Del análisis del texto se desprenden los siguientes hechos con relevancia jurídica:\n\n1. Se identifican menciones que sugieren la existencia de una relación jurídica entre las partes.\n2. Existen elementos que podrían configurar incumplimiento de obligaciones contractuales o legales.\n3. Los antecedentes sugieren la necesidad de acreditación probatoria para sustentar las pretensiones.\n\nNOTA: Este es un análisis de demostración. Configure su API key de OpenAI para obtener un análisis exhaustivo y preciso del caso específico.`,
    pruebasDisponibles: `Las pruebas identificadas en el texto deben ser analizadas conforme a los estándares del sistema procesal chileno. Según el Art. 341 del CPC, los medios de prueba admisibles incluyen: instrumentos, testigos, confesión de parte, inspección personal del tribunal, informe de peritos y presunciones.`,
    normaAplicable: tieneLaboral
      ? 'Código del Trabajo — Arts. 159-171 (término de contrato); Art. 168 (acción de despido injustificado, plazo 60 días hábiles)'
      : tienePenal
        ? 'Código Procesal Penal — Arts. 230 y ss. (formalización); Código Penal según tipo delictual'
        : 'Código Civil — Arts. 1545 (fuerza obligatoria del contrato), 1546 (buena fe), 1548-1551 (mora), 1556 (indemnización de perjuicios)',
    teoriaDefensa: `La defensa deberá acreditar el cumplimiento de las obligaciones legales y contractuales, o en su defecto, la existencia de causales eximentes de responsabilidad contempladas en el ordenamiento jurídico chileno.`,
    teoriaAcusacion: `La parte demandante/acusación deberá probar los elementos constitutivos de su pretensión, la relación causal entre la conducta y el daño, y la cuantificación de los perjuicios conforme al Art. 1556 CC.`,
    estrategiaProcesal: `Estrategia recomendada: (1) Recopilación y resguardo de prueba documental; (2) Identificación de testigos; (3) Evaluación de plazos procesales fatales; (4) Análisis de viabilidad de medidas cautelares.`,
    debilidadesRiesgos: `Riesgos identificados: prescripción de acciones (verificar plazos según Art. 2515 CC o norma especial); carga de la prueba; posibles defensas de contraparte.`,
    conclusionJuridica: `Conforme al análisis preliminar, el caso presenta elementos suficientes para sustentar una acción legal. Se recomienda profundizar el análisis con asesoría jurídica especializada y configurar una API key para obtener un análisis exhaustivo basado en la IA.`,
    hechos: [
      { tipo: 'hecho', descripcion: 'Existencia de relación jurídica entre las partes', relevancia: 'alta' },
      { tipo: 'fundamento', descripcion: tipo === 'Laboral' ? 'Art. 168 Código del Trabajo — acción de despido injustificado' : 'Art. 1545 Código Civil — fuerza obligatoria del contrato', relevancia: 'alta', normaAplicable: tipo === 'Laboral' ? 'Art. 168 CT' : 'Art. 1545 CC' },
      { tipo: 'prueba', descripcion: 'Documentos y antecedentes aportados al análisis', relevancia: 'media' },
    ],
    modeloIA: 'LEXARA PRO (modo demo)',
    fecha: new Date().toLocaleDateString('es-CL'),
  }
}

// ── Exportar Word ──────────────────────────────────────────────────────────────
async function exportarTeoriaWord(teoria: TeoriaDelCaso, transcripcion?: string) {
  const C = { primary: '1D4ED8', dark: '0F172A', accent: '3B82F6', text: '1E293B', light: 'EFF6FF' }
  const h = (text: string, level = 1) => new Paragraph({
    text, heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 120 },
    run: { bold: true, color: C.primary, size: level === 1 ? 28 : 24 },
  })
  const p = (text: string, opts?: any) => new Paragraph({
    children: [new TextRun({ text, size: 20, color: C.text, ...opts })],
    spacing: { after: 160 }, alignment: AlignmentType.JUSTIFIED,
  })
  const seccion = (titulo: string, contenido: string) => [
    h(titulo, 2),
    ...(contenido || '').split('\n').filter(Boolean).map(line => p(line)),
  ]
  const nivelColor = (n: string) => n === 'alta' ? 'C53030' : n === 'media' ? 'D97706' : '15803D'

  const hechoRows = (teoria.hechos || []).map(hecho => new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: hecho.tipo.toUpperCase(), bold: true, size: 16, color: C.primary })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [p(hecho.descripcion)], width: { size: 50, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: hecho.relevancia.toUpperCase(), bold: true, size: 16, color: nivelColor(hecho.relevancia) })] })], width: { size: 15, type: WidthType.PERCENTAGE } }),
      new TableCell({ children: [p(hecho.normaAplicable || '—')], width: { size: 20, type: WidthType.PERCENTAGE } }),
    ],
  }))

  const doc = new Document({
    creator: 'LEXARA PRO — NexusForge',
    title: `Teoría del Caso — ${teoria.titulo}`,
    description: `Generado por LEXARA PRO el ${teoria.fecha}`,
    sections: [{
      properties: {},
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: 'LEXARA PRO', bold: true, size: 52, color: C.primary })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Desarrollado por NexusForge', size: 18, color: '64748B' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'TEORÍA DEL CASO', bold: true, size: 36, color: C.text })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: teoria.titulo, italics: true, size: 24, color: '475569' })] }),
        new Paragraph({ children: [new TextRun({ text: `Fecha: ${teoria.fecha}  ·  Motor IA: ${teoria.modeloIA}`, size: 16, color: '94A3B8' })], spacing: { after: 400 } }),
        ...seccion('I. Resumen Ejecutivo', teoria.resumenEjecutivo),
        ...seccion('II. Hechos Principales', teoria.hechosPrincipales),
        ...seccion('III. Pruebas Disponibles', teoria.pruebasDisponibles),
        ...seccion('IV. Normativa Aplicable', teoria.normaAplicable),
        ...(teoria.teoriaAcusacion ? seccion('V. Teoría del Caso — Parte Demandante/Acusación', teoria.teoriaAcusacion) : []),
        ...(teoria.teoriaDefensa ? seccion('VI. Teoría del Caso — Defensa', teoria.teoriaDefensa) : []),
        ...seccion('VII. Estrategia Procesal', teoria.estrategiaProcesal),
        ...seccion('VIII. Debilidades y Riesgos', teoria.debilidadesRiesgos),
        ...seccion('IX. Conclusión Jurídica', teoria.conclusionJuridica),
        h('X. Hechos Jurídicamente Relevantes'),
        hechoRows.length > 0 ? new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: ['Tipo', 'Descripción', 'Relevancia', 'Norma'].map(t =>
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: 'FFFFFF', size: 18 })] })], shading: { fill: C.primary } })
              ),
            }),
            ...hechoRows,
          ],
        }) : p('No se identificaron hechos estructurados.'),
        ...(transcripcion ? [h('XI. Transcripción Completa'), p(transcripcion.substring(0, 8000))] : []),
        new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: `LEXARA PRO · NexusForge · Derecho Chileno · ${teoria.fecha}`, size: 14, color: '94A3B8' })] }),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `LEXARA_PRO_Teoria_Caso_${teoria.titulo.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40)}.docx`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Componentes UI ─────────────────────────────────────────────────────────────
function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  const map: Record<string, { bg: string; text: string }> = {
    alta:       { bg: 'rgba(220,38,38,0.12)',  text: '#f87171' },
    media:      { bg: 'rgba(217,119,6,0.12)',  text: '#fb923c' },
    baja:       { bg: 'rgba(22,163,74,0.12)',  text: '#4ade80' },
    hecho:      { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa' },
    prueba:     { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa' },
    fundamento: { bg: 'rgba(234,179,8,0.12)',  text: '#fbbf24' },
    parte:      { bg: 'rgba(16,185,129,0.12)', text: '#34d399' },
  }
  const s = map[color] || { bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc' }
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.text}30` }}>
      {children}
    </span>
  )
}

function SeccionColapsable({ titulo, icono: Icon, children, defaultOpen = false }: { titulo: string; icono: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(29,78,216,0.15)', border: '1px solid rgba(29,78,216,0.2)' }}>
          <Icon size={15} className="text-blue-400" />
        </div>
        <span className="flex-1 text-sm font-bold text-slate-200 text-left">{titulo}</span>
        {open ? <ChevronUp size={15} className="text-slate-500" /> : <ChevronDown size={15} className="text-slate-500" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden">
            <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────────────────────────
const PASOS = ['Cargar Antecedentes', 'Transcripción', 'Análisis Jurídico', 'Teoría del Caso']

export default function TeoriaDelCaso() {
  // Estado general
  const [paso, setPaso] = useState(0)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Groq key inline
  const [groqKeyInput, setGroqKeyInput] = useState('')
  const [mostrarGroqPanel, setMostrarGroqPanel] = useState(false)

  // Audio
  const [grabando, setGrabando] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [duracion, setDuracion] = useState(0)
  const [speechTranscript, setSpeechTranscript] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognitionRef = useRef<any>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Documentos
  const [documentos, setDocumentos] = useState<{ nombre: string; texto: string }[]>([])

  // Transcripción
  const [transcripcion, setTranscripcion] = useState('')
  const [transcribiendoManual, setTranscribiendoManual] = useState(false)

  // Resultado
  const [teoria, setTeoria] = useState<TeoriaDelCaso | null>(null)

  const guardarGroqKey = () => {
    if (groqKeyInput.trim()) {
      localStorage.setItem('lexara_groq_key', groqKeyInput.trim())
      setMostrarGroqPanel(false)
      setGroqKeyInput('')
    }
  }

  // ── Grabación con Web Speech API (transcripción en vivo, GRATIS) ──────────────
  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1 } })
      // MediaRecorder para guardar el audio
      const mr = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm' })
      chunksRef.current = []
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType })
        setAudioBlob(blob)
        setAudioURL(URL.createObjectURL(blob))
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start(1000)
      mediaRecorderRef.current = mr

      // Web Speech API para transcripción en tiempo real (completamente gratis)
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRec) {
        const rec = new SpeechRec()
        rec.lang = 'es-CL'
        rec.continuous = true
        rec.interimResults = true
        let textoAcumulado = ''
        rec.onresult = (event: any) => {
          let interim = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              textoAcumulado += event.results[i][0].transcript + ' '
            } else {
              interim = event.results[i][0].transcript
            }
          }
          setSpeechTranscript(textoAcumulado + interim)
          setTranscripcion(textoAcumulado + interim)
        }
        rec.onerror = () => {}
        rec.start()
        recognitionRef.current = rec
      }

      setGrabando(true)
      setDuracion(0)
      timerRef.current = setInterval(() => setDuracion(d => d + 1), 1000)
    } catch {
      setError('No se pudo acceder al micrófono. Verifique los permisos del navegador.')
    }
  }

  const detenerGrabacion = () => {
    mediaRecorderRef.current?.stop()
    recognitionRef.current?.stop()
    setGrabando(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const formatDuracion = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // ── Drop audio ────────────────────────────────────────────────────────────
  const onDropAudio = useCallback((files: File[]) => {
    const f = files[0]
    if (!f) return
    setAudioBlob(f)
    setAudioURL(URL.createObjectURL(f))
  }, [])

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps, isDragActive: isAudioDrag } = useDropzone({
    onDrop: onDropAudio, multiple: false,
    accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.mp4', '.ogg', '.webm', '.aac'] },
  })

  // ── Drop documentos ────────────────────────────────────────────────────────
  const onDropDocs = useCallback(async (files: File[]) => {
    for (const f of files) {
      try {
        const texto = await extractTextFromFile(f)
        setDocumentos(prev => [...prev, { nombre: f.name, texto }])
      } catch (e: any) {
        setError(`No se pudo leer "${f.name}": ${e.message}`)
      }
    }
  }, [])

  const { getRootProps: getDocsRootProps, getInputProps: getDocsInputProps, isDragActive: isDocsDrag } = useDropzone({
    onDrop: onDropDocs, multiple: true,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
  })

  // ── Paso 1 → 2: Transcribir ────────────────────────────────────────────────
  const transcribir = async () => {
    if (!audioBlob && documentos.length === 0) {
      setError('Debe cargar al menos un audio o un documento.')
      return
    }
    // Si ya tenemos transcripción del micrófono (Web Speech), ir directo
    if (transcripcion.trim().length > 30 && !audioBlob && documentos.length === 0) {
      setPaso(1); return
    }
    setCargando(true)
    setError(null)
    try {
      let textoFinal = transcripcion // conservar lo que ya hay del Web Speech

      // Transcripción de archivo de audio (usa Groq o OpenAI)
      if (audioBlob && textoFinal.length < 30) {
        const groqKey = getGroqKey()
        const openaiKey = getOpenAIKey()
        if (groqKey) {
          textoFinal = await transcribirGroq(audioBlob, groqKey)
        } else if (openaiKey) {
          textoFinal = await transcribirOpenAI(audioBlob, openaiKey)
        } else {
          // Sin key: dejar al usuario con transcripción manual
          setTranscribiendoManual(true)
          setMostrarGroqPanel(true)
          setPaso(1)
          setCargando(false)
          return
        }
      }

      // Agregar texto de documentos
      if (documentos.length > 0) {
        textoFinal += (textoFinal ? '\n\n--- DOCUMENTOS DE PRUEBA ---\n\n' : '')
          + documentos.map(d => `[${d.nombre}]\n${d.texto}`).join('\n\n')
      }

      setTranscripcion(textoFinal)
      setPaso(1)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  // ── Paso 2 → 3: Analizar ───────────────────────────────────────────────────
  const analizar = async () => {
    if (!transcripcion.trim()) {
      setError('La transcripción está vacía. Ingrese el texto a analizar.')
      return
    }
    setCargando(true)
    setError(null)
    try {
      let resultado: TeoriaDelCaso
      const groqKey = getGroqKey()
      const kimiKey = getKimiKey()
      const zaiKey = getZaiKey()
      const qwenKey = getQwenKey()
      const openaiKey = getOpenAIKey()
      const claudeKey = getClaudeKey()
      const geminiKey = getGeminiKey()

      if (groqKey) {
        resultado = await analizarConGroq(transcripcion, groqKey)
      } else if (kimiKey) {
        resultado = await analizarConKimi(transcripcion, kimiKey)
      } else if (zaiKey) {
        resultado = await analizarConZai(transcripcion, zaiKey)
      } else if (qwenKey) {
        resultado = await analizarConQwen(transcripcion, qwenKey)
      } else if (openaiKey) {
        resultado = await analizarConGPT(transcripcion, openaiKey)
      } else if (claudeKey) {
        resultado = await analizarConClaude(transcripcion, claudeKey)
      } else if (geminiKey) {
        resultado = await analizarConGemini(transcripcion, geminiKey)
      } else {
        resultado = analizarDemo(transcripcion)
      }
      setTeoria(resultado)
      setPaso(3)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.3),rgba(124,58,237,0.2))', border: '1px solid rgba(99,102,241,0.3)' }}>
          <Brain size={22} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Teoría del Caso con IA</h1>
          <p className="text-xs text-slate-500 mt-0.5">Transcripción de audio · Análisis de pruebas · Construcción de teoría jurídica — Derecho Chileno</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {PASOS.map((p, i) => (
          <div key={i} className="flex items-center gap-1 flex-shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${i === paso ? 'text-white' : i < paso ? 'text-blue-400' : 'text-slate-600'}`}
              style={i === paso ? { background: 'rgba(29,78,216,0.25)', border: '1px solid rgba(59,130,246,0.4)' } : i < paso ? { background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' } : { border: '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => i < paso && setPaso(i)}>
              <span className="w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center flex-shrink-0"
                style={{ background: i < paso ? '#3b82f6' : i === paso ? '#1d4ed8' : 'rgba(255,255,255,0.06)', color: i <= paso ? 'white' : '#475569' }}>
                {i < paso ? '✓' : i + 1}
              </span>
              {p}
            </div>
            {i < PASOS.length - 1 && <div className="w-4 h-px" style={{ background: i < paso ? '#3b82f6' : 'rgba(255,255,255,0.08)' }} />}
          </div>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300 flex-1">{error}</p>
            <button onClick={() => setError(null)}><X size={14} className="text-red-500" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel Groq Key gratuito */}
      <AnimatePresence>
        {mostrarGroqPanel && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 rounded-2xl space-y-3"
            style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-blue-400" />
              <p className="text-xs font-bold text-blue-300">Activa IA Gratuita — Groq (Llama 3.3 + Whisper)</p>
              <button onClick={() => setMostrarGroqPanel(false)} className="ml-auto"><X size={13} className="text-slate-500" /></button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Groq ofrece <span className="text-green-400 font-semibold">14.400 requests/día completamente gratis</span> con los modelos más avanzados.
              Obtén tu clave en <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">console.groq.com/keys</a> (solo requiere email).
            </p>
            <div className="flex gap-2">
              <input value={groqKeyInput} onChange={e => setGroqKeyInput(e.target.value)}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                className="flex-1 bg-black/30 text-xs text-slate-200 px-3 py-2 rounded-xl outline-none font-mono"
                style={{ border: '1px solid rgba(59,130,246,0.3)' }}
                onKeyDown={e => e.key === 'Enter' && guardarGroqKey()} />
              <button onClick={guardarGroqKey}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: '#1d4ed8' }}>
                Guardar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {paso === 0 && (
          <motion.div key="paso0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* Audio */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <FileAudio size={14} className="text-blue-400" />
                <span className="text-xs font-bold text-slate-200">Audio del Caso</span>
                <span className="text-[10px] text-slate-600 ml-auto">MP3, WAV, M4A, WebM, OGG</span>
              </div>
              <div className="p-5 space-y-4">
                {/* Grabador */}
                <div className="flex items-center gap-4 flex-wrap">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={grabando ? detenerGrabacion : iniciarGrabacion}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                    style={grabando
                      ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }
                      : { background: 'rgba(29,78,216,0.15)', border: '1px solid rgba(29,78,216,0.3)', color: '#60a5fa' }}>
                    {grabando ? <><MicOff size={16} /><span>Detener</span></> : <><Mic size={16} /><span>Grabar Audio</span></>}
                  </motion.button>
                  {grabando && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-mono text-red-400">{formatDuracion(duracion)}</span>
                      <span className="text-[10px] text-green-400 font-semibold animate-pulse">● Transcribiendo en vivo...</span>
                    </div>
                  )}
                  {!getGroqKey() && (
                    <button onClick={() => setMostrarGroqPanel(v => !v)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold"
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
                      <Zap size={11} />Activar IA Gratis
                    </button>
                  )}
                </div>
                {/* Preview transcripción en vivo */}
                {grabando && speechTranscript && (
                  <div className="p-3 rounded-xl text-[11px] text-slate-400 font-mono leading-relaxed max-h-24 overflow-y-auto"
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {speechTranscript}
                  </div>
                )}
                {/* Drop zone audio */}
                <div {...getAudioRootProps()} className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
                  style={{ borderColor: isAudioDrag ? '#3b82f6' : 'rgba(255,255,255,0.08)', background: isAudioDrag ? 'rgba(59,130,246,0.05)' : 'transparent' }}>
                  <input {...getAudioInputProps()} />
                  <Upload size={24} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-xs text-slate-500">Arrastra un archivo de audio o <span className="text-blue-400">haz clic para buscar</span></p>
                </div>
                {/* Preview audio */}
                {audioURL && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <Volume2 size={16} className="text-blue-400 flex-shrink-0" />
                    <audio src={audioURL} controls className="flex-1 h-8" style={{ filter: 'invert(0.8)' }} />
                    <button onClick={() => { setAudioBlob(null); setAudioURL(null) }}><Trash2 size={14} className="text-red-400" /></button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Documentos */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <FileText size={14} className="text-purple-400" />
                <span className="text-xs font-bold text-slate-200">Documentos de Prueba</span>
                <span className="text-[10px] text-slate-600 ml-auto">PDF, DOCX, TXT</span>
              </div>
              <div className="p-5 space-y-3">
                <div {...getDocsRootProps()} className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all"
                  style={{ borderColor: isDocsDrag ? '#8b5cf6' : 'rgba(255,255,255,0.08)', background: isDocsDrag ? 'rgba(139,92,246,0.05)' : 'transparent' }}>
                  <input {...getDocsInputProps()} />
                  <PlusCircle size={24} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-xs text-slate-500">Arrastra documentos de prueba o <span className="text-purple-400">haz clic</span></p>
                  <p className="text-[10px] text-slate-700 mt-1">Contratos, declaraciones, pericias, informes, resoluciones</p>
                </div>
                {documentos.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                    <FileText size={13} className="text-purple-400 flex-shrink-0" />
                    <p className="flex-1 text-xs text-slate-300 truncate">{d.nombre}</p>
                    <span className="text-[10px] text-slate-600">{(d.texto.length / 1000).toFixed(1)}k chars</span>
                    <button onClick={() => setDocumentos(prev => prev.filter((_, j) => j !== i))}><X size={13} className="text-red-400" /></button>
                  </div>
                ))}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={transcribir} disabled={cargando || (!audioBlob && documentos.length === 0)}
              className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', boxShadow: '0 8px 32px rgba(29,78,216,0.3)' }}>
              {cargando ? <><Loader2 size={18} className="animate-spin" />Transcribiendo con Whisper AI...</> : <><Zap size={18} />Procesar y Transcribir</>}
            </motion.button>
          </motion.div>
        )}

        {/* PASO 1 — Transcripción */}
        {paso === 1 && (
          <motion.div key="paso1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="px-5 py-3 border-b flex items-center gap-2 justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2">
                  {transcripcion ? <CheckCircle size={14} className="text-green-400" /> : <AlertTriangle size={14} className="text-yellow-400" />}
                  <span className="text-xs font-bold text-slate-200">
                    {transcripcion ? 'Transcripción completada' : 'Ingreso manual de transcripción'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-600">{transcripcion.length} caracteres · Editable</span>
              </div>
              <div className="p-5">
                {transcribiendoManual && !transcripcion && (
                  <div className="mb-3 p-3 rounded-xl space-y-2" style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <p className="text-[11px] text-blue-300 font-semibold">Para transcripción automática, activa la IA gratuita de Groq:</p>
                    <div className="flex gap-2">
                      <input value={groqKeyInput} onChange={e => setGroqKeyInput(e.target.value)}
                        placeholder="Pega tu Groq key aquí (gsk_...)"
                        className="flex-1 bg-black/30 text-xs text-slate-200 px-3 py-2 rounded-xl outline-none font-mono"
                        style={{ border: '1px solid rgba(59,130,246,0.3)' }}
                        onKeyDown={e => e.key === 'Enter' && guardarGroqKey()} />
                      <button onClick={guardarGroqKey}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0"
                        style={{ background: '#1d4ed8' }}>Guardar</button>
                    </div>
                    <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-green-400 underline">
                      Obtener clave gratis en console.groq.com/keys →
                    </a>
                  </div>
                )}
                <textarea value={transcripcion} onChange={e => setTranscripcion(e.target.value)}
                  placeholder="La transcripción aparecerá aquí automáticamente, o puede ingresarla manualmente..."
                  rows={16}
                  className="w-full bg-transparent text-sm text-slate-300 placeholder-slate-700 outline-none resize-none leading-relaxed font-mono"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPaso(0)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <RefreshCw size={14} /> Volver
              </button>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={analizar} disabled={cargando || !transcripcion.trim()}
                className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 disabled:opacity-40 transition-all"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', boxShadow: '0 8px 32px rgba(29,78,216,0.3)' }}>
                {cargando ? <><Loader2 size={18} className="animate-spin" />Analizando con IA...</> : <><Brain size={18} />Analizar y Construir Teoría del Caso</>}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* PASO 3 — Teoría del Caso */}
        {paso === 3 && teoria && (
          <motion.div key="paso3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {/* Header resultado */}
            <div className="p-5 rounded-2xl" style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.12),rgba(124,58,237,0.08))', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Scale size={16} className="text-blue-400 flex-shrink-0" />
                    <h2 className="text-lg font-black text-white leading-tight">{teoria.titulo}</h2>
                  </div>
                  <p className="text-xs text-slate-400">{teoria.fecha} · Motor: <span className="text-blue-400 font-semibold">{teoria.modeloIA}</span></p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => exportarTeoriaWord(teoria, transcripcion)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(29,78,216,0.2)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                  <FileDown size={14} />Descargar Word
                </motion.button>
              </div>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">{teoria.resumenEjecutivo}</p>
            </div>

            {/* Hechos destacados */}
            {teoria.hechos && teoria.hechos.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="px-5 py-3 border-b flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  <Shield size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">Hechos Jurídicamente Relevantes</span>
                  <span className="ml-auto text-[10px] text-slate-600">{teoria.hechos.length} identificados</span>
                </div>
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                  {teoria.hechos.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <Badge color={h.tipo}>{h.tipo}</Badge>
                      <p className="flex-1 text-xs text-slate-300 leading-relaxed">{h.descripcion}</p>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge color={h.relevancia}>{h.relevancia}</Badge>
                        {h.normaAplicable && <span className="text-[9px] text-blue-400 font-mono">{h.normaAplicable}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secciones colapsables */}
            <SeccionColapsable titulo="Hechos Principales" icono={BookOpen} defaultOpen>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{teoria.hechosPrincipales}</p>
            </SeccionColapsable>

            <SeccionColapsable titulo="Pruebas Disponibles y Valor Probatorio" icono={Shield}>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{teoria.pruebasDisponibles}</p>
            </SeccionColapsable>

            <SeccionColapsable titulo="Normativa Chilena Aplicable" icono={Scale} defaultOpen>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-mono text-xs">{teoria.normaAplicable}</p>
            </SeccionColapsable>

            {teoria.teoriaAcusacion && (
              <SeccionColapsable titulo="Teoría del Caso — Parte Demandante / Acusación" icono={Zap}>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{teoria.teoriaAcusacion}</p>
              </SeccionColapsable>
            )}

            {teoria.teoriaDefensa && (
              <SeccionColapsable titulo="Teoría del Caso — Defensa" icono={Shield}>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{teoria.teoriaDefensa}</p>
              </SeccionColapsable>
            )}

            <SeccionColapsable titulo="Estrategia Procesal Recomendada" icono={Brain} defaultOpen>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{teoria.estrategiaProcesal}</p>
            </SeccionColapsable>

            <SeccionColapsable titulo="Debilidades y Riesgos Jurídicos" icono={AlertTriangle}>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{teoria.debilidadesRiesgos}</p>
            </SeccionColapsable>

            <div className="p-5 rounded-2xl" style={{ background: 'rgba(29,78,216,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Scale size={15} className="text-blue-400" />
                <h3 className="text-sm font-bold text-blue-300">Conclusión Jurídica</h3>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{teoria.conclusionJuridica}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setPaso(1) }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <RefreshCw size={14} /> Reanalizar
              </button>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={() => exportarTeoriaWord(teoria, transcripcion)}
                className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-all"
                style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)', boxShadow: '0 8px 32px rgba(29,78,216,0.3)' }}>
                <FileDown size={18} />Descargar Teoría del Caso (.docx)
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
