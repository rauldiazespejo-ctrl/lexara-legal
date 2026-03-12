// @ts-nocheck
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  FileText, Upload, Brain, Download, Loader2, AlertTriangle,
  CheckCircle, X, Settings, Eye, EyeOff, Lock, Unlock,
  Scale, Shield, BookOpen, Zap, Info, RefreshCw, ArrowRight,
  FileDown, Star, ChevronDown, ChevronUp
} from 'lucide-react'
import { downloadInformeLegal, type InformeLegalData, type RiesgoInforme } from '../utils/informeLegalGenerator'
import { extractTextFromFile } from '../utils/extractText'

// ── Modelos IA ────────────────────────────────────────────────────────────────
const MODELOS = [
  { id: 'gpt4o', label: 'GPT-4o', proveedor: 'OpenAI', color: '#10a37f', keyName: 'lexara_openai_key', modelo: 'gpt-4o' },
  { id: 'gpt4omini', label: 'GPT-4o Mini', proveedor: 'OpenAI', color: '#34d399', keyName: 'lexara_openai_key', modelo: 'gpt-4o-mini' },
  { id: 'claude', label: 'Claude 3.5', proveedor: 'Anthropic', color: '#f59e0b', keyName: 'lexara_anthropic_key', modelo: 'claude-3-5-sonnet-20241022' },
  { id: 'gemini', label: 'Gemini 1.5', proveedor: 'Google', color: '#4285f4', keyName: 'lexara_gemini_key', modelo: 'gemini-1.5-pro' },
]

// ── Prompt estructurado ────────────────────────────────────────────────────────
function buildPrompt(textoContrato: string): string {
  return `Eres LEXARA IA, abogado experto en derecho chileno con 20 años de experiencia en contratos civiles, comerciales y laborales. Debes analizar el siguiente contrato y emitir un informe jurídico completo siguiendo ESTRICTAMENTE la estructura indicada.

CONTRATO A ANALIZAR:
${textoContrato.substring(0, 14000)}

INSTRUCCIÓN CRÍTICA: Responde ÚNICAMENTE con JSON válido siguiendo esta estructura exacta:

{
  "titulo": "nombre/tipo del contrato identificado",
  "proyecto": "nombre del proyecto o 'N/A'",
  "parteA": "nombre completo de la parte A/contratante",
  "parteB": "nombre completo de la parte B/contratista",
  "objetoContrato": "descripción precisa del objeto",
  "naturalezaJuridica": "calificación jurídica con artículo del CC o norma chilena aplicable",
  "observacionGeneral": "observación general de 2-3 párrafos sobre el contrato, su equilibrio y características principales",
  "aspectosGenerales": "análisis de 3-5 párrafos sobre naturaleza jurídica, autonomía de la voluntad (Art. 1545 CC), modalidad contractual, ley aplicable",
  "obligacionesParteA": "análisis detallado de las obligaciones del contratante, identificando riesgos para esta parte",
  "obligacionesParteB": "análisis detallado de las obligaciones del contratista, identificando riesgos para esta parte",
  "condicionesEconomicas": "análisis de plazos de pago, intereses, reajustabilidad (UF/IPC), garantías económicas, facturación, cláusulas penales",
  "clausulasEspeciales": "análisis de cláusulas especiales críticas identificadas en el contrato (Stand-by, exclusividad, no competencia, etc.)",
  "responsabilidadLaboral": "análisis de cumplimiento Ley 20.123 subcontratación, responsabilidad solidaria/subsidiaria, derechos trabajadores",
  "terminoAnticipado": "análisis de causales de término, indemnizaciones, cláusulas penales (Art. 1535 CC), excepción contrato no cumplido (Art. 1552 CC)",
  "resolucionConflictos": "análisis de cláusula arbitral o jurisdicción pactada, tipo árbitro, sede CAM Santiago si aplica",
  "aspectosProcesales": "análisis de garantías (boletas, retenciones), ausencias de garantías, riesgos procesales",
  "riesgos": [
    {
      "clausula": "nombre de la cláusula o tema",
      "riesgoJuridico": "descripción del riesgo jurídico u operacional en 1-2 oraciones",
      "nivel": "CRÍTICO|ALTO|MEDIO|BAJO",
      "parteAfectada": "nombre de la parte afectada"
    }
  ],
  "recomendaciones": [
    "recomendación 1 completa con fundamento jurídico",
    "recomendación 2",
    "recomendación 3",
    "recomendación 4",
    "recomendación 5"
  ]
}

INSTRUCCIONES ADICIONALES:
- Cita siempre artículos del Código Civil chileno, Código de Comercio u otras leyes chilenas relevantes
- Los textos de análisis deben ser en español, lenguaje jurídico profesional chileno
- Identifica mínimo 4 riesgos y máximo 8 riesgos en la tabla
- Las recomendaciones deben ser concretas y accionables, con fundamento legal específico
- Si el contrato está incompleto o es un borrador, señálalo en observacionGeneral
- Responde SOLO con el JSON, sin texto adicional, sin markdown`
}

// ── Llamadas a APIs ───────────────────────────────────────────────────────────
async function callOpenAI(texto: string, modelo: string, apiKey: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: modelo,
      temperature: 0.2,
      max_tokens: 6000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'Eres un abogado experto en derecho chileno. Responde siempre con JSON válido.' },
        { role: 'user', content: buildPrompt(texto) },
      ],
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message ?? `OpenAI error ${res.status}`) }
  const d = await res.json()
  return JSON.parse(d.choices[0].message.content)
}

async function callAnthropic(texto: string, apiKey: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 6000,
      system: 'Eres un abogado experto en derecho chileno. Responde siempre con JSON válido y nada más.',
      messages: [{ role: 'user', content: buildPrompt(texto) }],
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message ?? `Anthropic error ${res.status}`) }
  const d = await res.json()
  const raw = d.content[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(raw)
}

async function callGemini(texto: string, apiKey: string) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'Eres un abogado experto en derecho chileno. Responde siempre con JSON válido y nada más.' }] },
        contents: [{ parts: [{ text: buildPrompt(texto) }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 6000, responseMimeType: 'application/json' },
      }),
    }
  )
  if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message ?? `Gemini error ${res.status}`) }
  const d = await res.json()
  const raw = d.candidates[0].content.parts[0].text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(raw)
}

// ── Análisis demo sin API ─────────────────────────────────────────────────────
function analisisDemo(texto: string): any {
  const lower = texto.toLowerCase()
  const tieneArbitraje = lower.includes('árbitro') || lower.includes('cam') || lower.includes('arbitraje')
  const tieneAnticipo = lower.includes('anticipo') || lower.includes('fondo de activación') || lower.includes('adelanto')
  const tieneStandby = lower.includes('stand-by') || lower.includes('stand by') || lower.includes('disponibilidad')
  const tieneMultas = lower.includes('multa') || lower.includes('penalidad')
  const tieneConfidencialidad = lower.includes('confidencial') || lower.includes('secreto')

  const riesgos: RiesgoInforme[] = [
    { clausula: 'Limitación de Responsabilidad', riesgoJuridico: 'Si existe cláusula de exención total de responsabilidad, podría ser nula por Art. 1465 CC (no se puede condonar el dolo futuro).', nivel: 'ALTO', parteAfectada: 'Ambas partes' },
    { clausula: 'Plazos de Pago', riesgoJuridico: 'Sin cláusula de intereses moratorios expresos, rigen los intereses legales del Art. 1559 CC, que pueden ser insuficientes para cubrir el daño real.', nivel: 'MEDIO', parteAfectada: 'Acreedor' },
  ]
  if (tieneAnticipo) riesgos.push({ clausula: 'Anticipo / Fondo de Activación', riesgoJuridico: 'Anticipo entregado sin boleta de garantía bancaria. Riesgo de pérdida total si el contratista quiebra o incumple antes de iniciar.', nivel: 'CRÍTICO', parteAfectada: 'Contratante' })
  if (tieneStandby) riesgos.push({ clausula: 'Stand-by / Disponibilidad', riesgoJuridico: 'Pago automático por disponibilidad sin justificación suficiente. Puede encarecer significativamente el costo total del contrato.', nivel: 'ALTO', parteAfectada: 'Contratante' })
  if (!tieneConfidencialidad) riesgos.push({ clausula: 'Confidencialidad', riesgoJuridico: 'Ausencia de cláusula NDA. La información técnica y comercial del proyecto queda desprotegida.', nivel: 'MEDIO', parteAfectada: 'Ambas partes' })
  if (tieneMultas) riesgos.push({ clausula: 'Cláusula Penal / Multas', riesgoJuridico: 'Verificar que la multa no sea "enorme" según Art. 1544 CC. Tribunales pueden reducirla si es desproporcionada.', nivel: 'MEDIO', parteAfectada: 'Parte multada' })

  return {
    titulo: 'Contrato Analizado por LEXARA IA',
    proyecto: 'N/A',
    parteA: 'Parte Contratante (identificar en el documento)',
    parteB: 'Parte Contratista (identificar en el documento)',
    objetoContrato: 'Prestación de servicios identificados en el contrato',
    naturalezaJuridica: 'Contrato de arrendamiento de servicios (Art. 2006 CC) o confección de obra (Art. 1996 CC) según corresponda',
    observacionGeneral: `El contrato analizado presenta una estructura ${tieneAnticipo ? 'con mecanismos de pago anticipado inusuales' : 'convencional'}. ${tieneStandby ? 'Destaca la presencia de cláusulas de Stand-by que trasladan riesgos operacionales al contratante.' : 'Se recomienda revisar el balance de obligaciones entre las partes.'} Para un análisis completo con razonamiento jurídico avanzado, configure una API Key de OpenAI, Anthropic o Google en el panel de configuración.\n\n[MODO DEMOSTRACIÓN — Configure su API Key para análisis completo con IA generativa]`,
    aspectosGenerales: `El contrato se rige por las disposiciones del Código Civil chileno, específicamente las normas sobre contratos de prestación de servicios. La autonomía de la voluntad (Art. 1545 CC) permite a las partes establecer las condiciones que estimen convenientes, siendo el contrato ley para las partes una vez perfeccionado por el consentimiento (Art. 1438 CC).\n\nLa calificación jurídica del contrato determina el estatuto legal aplicable, las normas supletorias y los remedios disponibles ante incumplimiento. Es fundamental verificar que las cláusulas no contravengan normas de orden público.`,
    obligacionesParteA: `La parte contratante asume obligaciones principales de pago y colaboración. Conforme al Art. 1552 CC, el contratante no puede alegar incumplimiento del contratista si no ha cumplido sus propias obligaciones previas (excepción de contrato no cumplido).\n\nRiesgos identificados: La obligación de facilitar los medios necesarios para la ejecución del servicio puede generar responsabilidad si su incumplimiento causa retrasos o sobrecostos al contratista.`,
    obligacionesParteB: `El contratista tiene obligaciones de medios o resultado según la naturaleza del servicio. Las obligaciones de resultado implican mayor estándar de exigencia y hacen responsable al contratista ante cualquier incumplimiento, salvo caso fortuito (Art. 45 CC).\n\nSe recomienda verificar que las obligaciones estén descritas con suficiente precisión para evitar disputas interpretativas.`,
    condicionesEconomicas: `Las condiciones económicas deben analizarse en función de los plazos de pago (recomendado máx. 60 días conforme Art. 4 bis Ley 20.416), tasas de interés moratorio (verificar que no exceda el máximo convencional según Ley 18.010), y mecanismos de reajustabilidad.\n\nSe sugiere pactar el precio en UF para contratos de larga duración, protegiendo el valor real de las prestaciones contra la inflación.`,
    clausulasEspeciales: `Se identificaron cláusulas especiales que requieren análisis particular. ${tieneStandby ? 'La cláusula de Stand-by o disponibilidad transforma la obligación de hacer en una obligación de estar disponible, lo cual puede ser económicamente oneroso.' : ''} ${tieneMultas ? 'Las cláusulas penales deben verificarse conforme al Art. 1544 CC para evitar ser declaradas enormes.' : ''}\n\nToda cláusula que limite derechos o amplíe responsabilidades debe interpretarse restrictivamente conforme al Art. 1566 CC.`,
    responsabilidadLaboral: `En contratos de subcontratación, aplica la Ley 20.123 que establece responsabilidad solidaria del contratante respecto de las obligaciones laborales y previsionales del contratista. Esta responsabilidad es irrenunciable por vía contractual frente a los trabajadores.\n\nSe recomienda ejercer el derecho de información y retención (Art. 183-C Código del Trabajo) reteniendo hasta el monto equivalente a las obligaciones laborales verificadas.`,
    terminoAnticipado: `Las causales de término anticipado deben ser equilibradas entre las partes. Conforme al Art. 1489 CC, el incumplimiento grave permite solicitar la resolución judicial. Sin embargo, las cláusulas de término extrajudicial son válidas si están claramente definidas.\n\nLas cláusulas penales por término anticipado (Art. 1535 CC) son válidas pero no pueden ser "enormes" (Art. 1544 CC). Se recomienda proporcionalidad respecto al perjuicio real.`,
    resolucionConflictos: tieneArbitraje
      ? `El contrato contempla resolución de conflictos por la vía arbitral. El arbitraje es eficiente, confidencial y especializado. Se recomienda verificar: tipo de árbitro (de derecho vs. arbitrador), número de árbitros, sede (se recomienda CAM Santiago), plazo del procedimiento y si existe renuncia a recursos.\n\nEl arbitraje arbitrador (en equidad) es más flexible pero menos predecible que el arbitraje de derecho.`
      : `El contrato no contiene cláusula arbitral expresa. Las disputas se resolverán ante los tribunales ordinarios de justicia, lo que puede ser más lento y costoso. Se recomienda incorporar una cláusula de arbitraje ante el CAM Santiago como mecanismo más eficiente.`,
    aspectosProcesales: `${tieneAnticipo ? 'CRÍTICO: El contrato contempla un anticipo o fondo de activación sin boleta de garantía bancaria que respalde la devolución en caso de incumplimiento. Esto expone al contratante a pérdida total del anticipo.' : 'El contrato no contempla garantías de anticipo.'}\n\nSe recomienda establecer: (1) Boleta de garantía de fiel cumplimiento equivalente al 5-10% del contrato, (2) Retención de garantía en cada estado de pago, (3) Boleta por anticipo si aplica.`,
    riesgos,
    recomendaciones: [
      'Incorporar boleta de garantía bancaria o póliza de seguro por el 100% de cualquier anticipo entregado, conforme a las mejores prácticas contractuales chilenas.',
      'Establecer retención de garantía del 5% en cada estado de pago para asegurar la calidad de los trabajos y el cumplimiento de obligaciones laborales (Ley 20.123).',
      'Revisar y limitar la cláusula de intereses moratorios para que no exceda el Máximo Convencional según Ley 18.010 sobre Operaciones de Crédito de Dinero.',
      'Incorporar cláusula arbitral ante el CAM Santiago si no existe, especificando tipo de árbitro (recomendado: de derecho), número de árbitros y sede.',
      'Agregar cláusula de confidencialidad con vigencia de 3 años post término, cumpliendo estándares de la Ley 19.628 sobre Protección de la Vida Privada si se manejan datos personales.',
    ],
  }
}

// ── Score badge ────────────────────────────────────────────────────────────────
function NivelBadge({ nivel }: { nivel: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    'CRÍTICO': { bg: 'rgba(220,38,38,0.12)', text: '#f87171' },
    'ALTO':    { bg: 'rgba(234,88,12,0.12)', text: '#fb923c' },
    'MEDIO':   { bg: 'rgba(202,138,4,0.12)', text: '#fbbf24' },
    'BAJO':    { bg: 'rgba(22,163,74,0.12)', text: '#4ade80' },
  }
  const s = map[nivel] ?? { bg: 'rgba(99,102,241,0.1)', text: '#a5b4fc' }
  return (
    <span className="text-[9px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.text}30` }}>
      {nivel}
    </span>
  )
}

// ── Sección colapsable ─────────────────────────────────────────────────────────
function SeccionInforme({ roman, titulo, children, defaultOpen = false }: {
  roman: string; titulo: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.02] transition-all"
        style={{ background: 'rgba(15,23,42,0.7)' }}>
        <span className="text-[10px] font-black px-2 py-1 rounded-lg flex-shrink-0"
          style={{ background: 'rgba(79,70,229,0.2)', color: '#a5b4fc', border: '1px solid rgba(79,70,229,0.25)', minWidth: '2rem', textAlign: 'center' }}>
          {roman}
        </span>
        <span className="flex-1 text-xs font-bold text-slate-200 text-left">{titulo}</span>
        {open ? <ChevronUp size={13} className="text-slate-500 flex-shrink-0" /> : <ChevronDown size={13} className="text-slate-500 flex-shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="p-4 pt-0" style={{ background: 'rgba(10,18,35,0.6)' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Vista del informe generado ─────────────────────────────────────────────────
function VistaInforme({ data, onDescargar, onNuevo, cargandoDocx }: {
  data: any
  onDescargar: () => void
  onNuevo: () => void
  cargandoDocx: boolean
}) {
  const riesgos: RiesgoInforme[] = data.riesgos ?? []
  const recomendaciones: string[] = data.recomendaciones ?? []

  return (
    <div className="space-y-3">
      {/* Header del informe */}
      <div className="p-4 rounded-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,rgba(29,78,216,0.15),rgba(91,33,182,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 80% 20%,rgba(99,102,241,0.5),transparent 60%)' }} />
        <div className="relative">
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Scale size={10} />ANÁLISIS JURÍDICO DEL CONTRATO · DERECHO CHILENO
          </p>
          <p className="text-base font-black text-white">{data.titulo ?? 'Contrato Analizado'}</p>
          {data.proyecto && data.proyecto !== 'N/A' && (
            <p className="text-xs text-indigo-300 font-semibold mt-0.5">{data.proyecto}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              Contratante: <strong className="text-slate-200">{data.parteA}</strong>
            </span>
            <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              Contratista: <strong className="text-slate-200">{data.parteB}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Observación general */}
      <div className="p-4 rounded-2xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-2">RESUMEN EJECUTIVO</p>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{data.observacionGeneral}</p>
      </div>

      {/* Secciones I-VIII */}
      {[
        { roman: 'I', titulo: 'Aspectos Generales y Naturaleza Jurídica', text: data.aspectosGenerales, open: true },
        { roman: 'II', titulo: 'Obligaciones del Contratante', text: data.obligacionesParteA },
        { roman: 'III', titulo: 'Obligaciones del Contratista', text: data.obligacionesParteB },
        { roman: 'IV', titulo: 'Condiciones Económicas y Sistema de Pago', text: data.condicionesEconomicas },
        { roman: 'V', titulo: 'Cláusulas Especiales Críticas', text: data.clausulasEspeciales },
        { roman: 'VI', titulo: 'Responsabilidad Laboral y Previsional', text: data.responsabilidadLaboral },
        { roman: 'VII', titulo: 'Término Anticipado e Indemnizaciones', text: data.terminoAnticipado },
        { roman: 'VIII', titulo: 'Resolución de Conflictos', text: data.resolucionConflictos },
        { roman: 'IX-A', titulo: 'Aspectos Procesales y Garantías', text: data.aspectosProcesales },
      ].map(s => (
        <SeccionInforme key={s.roman} roman={s.roman} titulo={s.titulo} defaultOpen={s.open}>
          <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line pt-3">{s.text}</p>
        </SeccionInforme>
      ))}

      {/* Tabla IX — Riesgos */}
      <SeccionInforme roman="IX" titulo="Riesgos y Observaciones Críticas" defaultOpen>
        <div className="space-y-2 pt-3">
          {riesgos.map((r, i) => (
            <div key={i} className="p-3 rounded-xl flex items-start gap-3"
              style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <NivelBadge nivel={r.nivel} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-200">{r.clausula}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{r.riesgoJuridico}</p>
                <p className="text-[9px] text-slate-600 mt-1">Afecta: <span className="text-slate-500">{r.parteAfectada}</span></p>
              </div>
            </div>
          ))}
        </div>
      </SeccionInforme>

      {/* Sección X — Recomendaciones */}
      <SeccionInforme roman="X" titulo="Recomendaciones Finales" defaultOpen>
        <div className="space-y-2 pt-3">
          {recomendaciones.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
              <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black text-emerald-400"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', marginTop: '1px' }}>
                {i + 1}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{r}</p>
            </div>
          ))}
        </div>
      </SeccionInforme>

      {/* Acciones */}
      <div className="flex gap-2 pt-2 flex-wrap">
        <motion.button whileHover={{ scale: 1.02 }} onClick={onDescargar} disabled={cargandoDocx}
          className="flex-1 py-3 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#1e3a8a,#4f46e5,#7c3aed)', boxShadow: '0 6px 24px rgba(79,70,229,0.35)' }}>
          {cargandoDocx ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
          {cargandoDocx ? 'Generando Word...' : 'Descargar Informe (.docx)'}
        </motion.button>
        <button onClick={onNuevo}
          className="px-4 py-3 rounded-2xl text-xs text-slate-400 flex items-center gap-2"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <RefreshCw size={13} />Nuevo análisis
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function InformeLegal() {
  const [modeloId, setModeloId] = useState('gpt4o')
  const [archivo, setArchivo] = useState<File | null>(null)
  const [textoManual, setTextoManual] = useState('')
  const [inputMode, setInputMode] = useState<'archivo' | 'texto'>('texto')
  const [estado, setEstado] = useState<'idle' | 'extrayendo' | 'analizando' | 'resultado' | 'error'>('idle')
  const [informe, setInforme] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [cargandoDocx, setCargandoDocx] = useState(false)
  const [ciudad, setCiudad] = useState('Santiago')
  const [fase, setFase] = useState('')

  const modelo = MODELOS.find(m => m.id === modeloId) ?? MODELOS[0]
  const tieneKey = !!localStorage.getItem(modelo.keyName)

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
    maxFiles: 1, maxSize: 25 * 1024 * 1024,
  })

  const analizar = async () => {
    setErrorMsg('')
    let texto = ''

    if (inputMode === 'archivo' && archivo) {
      setEstado('extrayendo')
      setFase('Extrayendo texto del documento...')
      texto = await extractTextFromFile(archivo)
      if (!texto || texto.length < 40) {
        setErrorMsg('No se pudo extraer texto del archivo. Intenta con .txt o pega el texto manualmente.')
        setEstado('error'); return
      }
    } else {
      texto = textoManual.trim()
      if (texto.length < 40) {
        setErrorMsg('El texto es muy corto. Pega el contenido completo del contrato.')
        setEstado('error'); return
      }
    }

    setEstado('analizando')
    setFase(`${modelo.label} analizando el contrato con 10 secciones...`)

    try {
      let parsed: any
      const apiKey = localStorage.getItem(modelo.keyName) ?? ''

      if (!apiKey) {
        await new Promise(r => setTimeout(r, 2500))
        parsed = analisisDemo(texto)
      } else if (modeloId === 'claude') {
        parsed = await callAnthropic(texto, apiKey)
      } else if (modeloId === 'gemini') {
        parsed = await callGemini(texto, apiKey)
      } else {
        parsed = await callOpenAI(texto, modelo.modelo, apiKey)
      }

      setInforme(parsed)
      setEstado('resultado')
    } catch (e: any) {
      setErrorMsg(e.message ?? 'Error en la IA. Verifica tu API Key o usa el modo demostración.')
      setEstado('error')
    }
  }

  const descargar = async () => {
    if (!informe) return
    setCargandoDocx(true)
    try {
      const data: InformeLegalData = {
        ...informe,
        ciudad,
        fecha: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
        modeloIA: tieneKey ? modelo.label : 'LEXARA IA (Demostración)',
      }
      await downloadInformeLegal(data)
    } catch (e) {
      console.error(e)
    }
    setCargandoDocx(false)
  }

  const reiniciar = () => {
    setEstado('idle'); setInforme(null); setArchivo(null)
    setTextoManual(''); setErrorMsg(''); setFase('')
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  if (estado === 'resultado' && informe) {
    return <VistaInforme data={informe} onDescargar={descargar} onNuevo={reiniciar} cargandoDocx={cargandoDocx} />
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-black text-white flex items-center gap-2">
            <Scale size={15} className="text-blue-400" />
            Informe Jurídico de Contratos
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Análisis estructurado en 10 secciones · Derecho Chileno · Exporta a Word con logo LEXARA
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-slate-600 bg-white/[0.03] px-2 py-1.5 rounded-lg border border-white/[0.06]">
          <BookOpen size={9} />CC · CdC · Ley 20.123 · Ley 19.496
        </div>
      </div>

      {/* Modelo IA */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Motor de análisis</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MODELOS.map(m => {
            const hasKey = !!localStorage.getItem(m.keyName)
            return (
              <motion.button key={m.id} whileTap={{ scale: 0.97 }}
                onClick={() => setModeloId(m.id)}
                className="p-2.5 rounded-xl text-left relative transition-all"
                style={{
                  background: modeloId === m.id ? `${m.color}14` : 'rgba(15,23,42,0.5)',
                  border: `1px solid ${modeloId === m.id ? m.color + '45' : 'rgba(255,255,255,0.06)'}`,
                }}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                  <span className="text-[10px] font-black text-white">{m.label}</span>
                  {hasKey
                    ? <Unlock size={8} className="ml-auto" style={{ color: m.color }} />
                    : <Lock size={8} className="ml-auto text-slate-700" />
                  }
                </div>
                <p className="text-[9px]" style={{ color: m.color + '99' }}>{m.proveedor}</p>
              </motion.button>
            )
          })}
        </div>
        {!tieneKey && (
          <p className="mt-2 text-[10px] text-yellow-500/80 flex items-center gap-1.5 px-1">
            <Zap size={9} />
            Sin API Key → modo demostración activo. Configura tu clave en el módulo "Mejorar con IA"
          </p>
        )}
      </div>

      {/* Ciudad */}
      <div className="flex items-center gap-3">
        <div>
          <p className="text-[10px] text-slate-500 mb-1">Ciudad del informe</p>
          <input value={ciudad} onChange={e => setCiudad(e.target.value)}
            className="w-36 px-3 py-1.5 rounded-xl text-xs text-slate-200 outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      {/* Input */}
      <div>
        <div className="flex gap-1 p-1 rounded-xl mb-3 w-fit" style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['archivo', 'texto'] as const).map(t => (
            <button key={t} onClick={() => setInputMode(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={inputMode === t
                ? { background: 'rgba(29,78,216,0.25)', color: '#93c5fd', border: '1px solid rgba(29,78,216,0.35)' }
                : { color: '#64748b' }}>
              {t === 'archivo' ? '📎 Subir archivo' : '✏️ Pegar texto'}
            </button>
          ))}
        </div>

        {inputMode === 'archivo' ? (
          <div className="space-y-2">
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <motion.div whileHover={{ scale: 1.005 }}
                className="p-8 rounded-2xl text-center"
                style={{
                  background: isDragActive ? 'rgba(29,78,216,0.08)' : 'rgba(15,23,42,0.6)',
                  border: `2px dashed ${isDragActive ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                <Upload size={22} className="text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-white mb-0.5">
                  {isDragActive ? 'Suelta el contrato' : 'Sube el contrato a analizar'}
                </p>
                <p className="text-[10px] text-slate-500">PDF · DOCX · TXT · Máx 25 MB</p>
                <p className="text-[9px] text-slate-700 mt-1">LEXARA extrae el texto y genera el informe jurídico completo</p>
              </motion.div>
            </div>
            {archivo && (
              <div className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(29,78,216,0.2)' }}>
                <FileText size={16} className="text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{archivo.name}</p>
                  <p className="text-[10px] text-slate-500">{(archivo.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => setArchivo(null)} className="p-1.5 rounded-lg hover:bg-red-500/20">
                  <X size={12} className="text-red-400" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <textarea value={textoManual} onChange={e => setTextoManual(e.target.value)}
            placeholder="Pega aquí el texto completo del contrato...

CONTRATO DE PRESTACIÓN DE SERVICIOS
Entre Empresa X y Empresa Y...

CLÁUSULA PRIMERA — OBJETO...
CLÁUSULA SEGUNDA — PRECIO...
..."
            rows={11}
            className="w-full text-xs text-slate-300 placeholder-slate-700 outline-none rounded-2xl p-4 leading-relaxed"
            style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.07)', resize: 'vertical' }}
          />
        )}
      </div>

      {/* Error */}
      <AnimatePresence>
        {estado === 'error' && errorMsg && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 p-3 rounded-xl text-xs overflow-hidden"
            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span className="text-red-400">{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      {(estado === 'analizando' || estado === 'extrayendo') ? (
        <div className="py-12 text-center space-y-3">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: 'rgba(29,78,216,0.15)', border: '2px solid rgba(59,130,246,0.4)' }}>
            <Scale size={22} className="text-blue-400" />
          </motion.div>
          <p className="text-sm font-black text-white">{fase}</p>
          <p className="text-[10px] text-slate-600">Generando informe jurídico estructurado en 10 secciones</p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500"
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        </div>
      ) : (
        <motion.button
          onClick={analizar}
          disabled={!archivo && !textoManual.trim()}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="w-full py-4 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2.5 disabled:opacity-40 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1e3a8a,#3730a3,#4f46e5)', boxShadow: '0 8px 30px rgba(29,78,216,0.35)' }}>
          <Scale size={16} />
          Generar Informe Jurídico con {modelo.label}
          <ArrowRight size={15} />
        </motion.button>
      )}
    </div>
  )
}
