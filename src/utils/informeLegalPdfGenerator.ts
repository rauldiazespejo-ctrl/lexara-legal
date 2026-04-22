/**
 * Informe jurídico en PDF — LEXARA PRO
 * Portada con logo, secciones I–X, tabla de riesgos, pie y membrete corporativo.
 */
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { InformeLegalData, RiesgoInforme } from './informeLegalGenerator'

const W = 210
const M = 18
const CONTENT_W = W - 2 * M
const Y_MAX = 275
const Y0 = 28

const C = {
  indigo: [55, 48, 163] as [number, number, number],
  navy: [30, 27, 75] as [number, number, number],
  slate: [71, 85, 105] as [number, number, number],
  gray: [60, 60, 60] as [number, number, number],
  line: [226, 232, 240] as [number, number, number],
  coverBg: [248, 250, 255] as [number, number, number],
  white: 255,
}

function publicAsset(path: string): string {
  const b = import.meta.env.BASE_URL || '/'
  const base = b.endsWith('/') ? b.slice(0, -1) : b
  return `${base || ''}/${path.replace(/^\//, '')}`
}

/**
 * Logo fijo: `public/lexara-logo.png` (misma gráfica que el SVG, raster 512px).
 * Data URL para incrustar en el PDF con jsPDF; sin conversión en canvas.
 */
export async function loadLexaraLogoForPdf(): Promise<string | null> {
  try {
    const url = publicAsset('lexara-logo.png')
    const r = await fetch(url, { cache: 'force-cache' })
    if (!r.ok) return null
    const blob = await r.blob()
    return await new Promise((resolve) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result as string)
      fr.onerror = () => resolve(null)
      fr.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

type PDFHandle = { doc: jsPDF; y: number; logo: string | null }

function newPage(h: PDFHandle) {
  h.doc.addPage()
  h.y = Y0
}

function ensureSpace(h: PDFHandle, needMm: number) {
  if (h.y + needMm > Y_MAX) newPage(h)
}

function drawBandTitle(h: PDFHandle, title: string) {
  ensureSpace(h, 12)
  h.doc.setFillColor(...C.indigo)
  h.doc.rect(M, h.y, CONTENT_W, 8, 'F')
  h.doc.setTextColor(C.white, C.white, C.white)
  h.doc.setFont('helvetica', 'bold')
  h.doc.setFontSize(9)
  h.doc.text(title, M + 2, h.y + 5.5, { maxWidth: CONTENT_W - 4 })
  h.doc.setTextColor(...C.gray)
  h.doc.setFont('helvetica', 'normal')
  h.y += 11
}

function addParagraphBlock(h: PDFHandle, text: string) {
  if (!text?.trim()) return
  const parts = text.trim().split(/\n+/)
  for (const part of parts) {
    const lines = h.doc.splitTextToSize(part.trim(), CONTENT_W)
    for (const line of lines) {
      ensureSpace(h, 5)
      h.doc.setFontSize(9.5)
      h.doc.setTextColor(...C.gray)
      h.doc.text(line, M, h.y, { maxWidth: CONTENT_W })
      h.y += 4.3
    }
    h.y += 1.2
  }
  h.y += 1
}

function section(h: PDFHandle, roman: string, title: string, body: string) {
  drawBandTitle(h, `${roman}. ${title.toUpperCase()}`)
  addParagraphBlock(h, body)
}

function drawCover(h: PDFHandle, data: InformeLegalData) {
  const d = h.doc
  d.setFillColor(...C.coverBg)
  d.rect(0, 0, W, 297, 'F')

  if (h.logo) {
    const lw = 42
    const lx = (W - lw) / 2
    d.addImage(h.logo, 'PNG', lx, 22, lw, lw)
  } else {
    d.setTextColor(...C.indigo)
    d.setFont('helvetica', 'bold')
    d.setFontSize(20)
    d.text('LEXARA PRO', W / 2, 50, { align: 'center' })
  }

  d.setTextColor(...C.navy)
  d.setFont('helvetica', 'bold')
  d.setFontSize(11)
  d.text('INFORME JURÍDICO DE CONTRATO', W / 2, h.logo ? 75 : 60, { align: 'center' })
  d.setFontSize(13)
  d.setTextColor(15, 23, 42)
  const tit = (data.titulo || 'Análisis contractual').slice(0, 120)
  d.text(tit, W / 2, h.logo ? 86 : 72, { align: 'center', maxWidth: W - 2 * M })

  d.setFont('helvetica', 'normal')
  d.setFontSize(8.5)
  d.setTextColor(...C.slate)
  if (data.proyecto && data.proyecto !== 'N/A') {
    d.setFont('helvetica', 'bold')
    d.text(String(data.proyecto).toUpperCase(), W / 2, h.logo ? 98 : 84, { align: 'center' })
    d.setFont('helvetica', 'normal')
  }
  d.setFontSize(9)
  d.text(`${data.parteA}  ·  ${data.parteB}`, W / 2, h.logo ? 108 : 92, { align: 'center', maxWidth: W - 2 * M })

  d.setFont('helvetica', 'italic')
  d.setFontSize(8)
  d.setTextColor(99, 102, 241)
  d.text('(Perspectiva Derecho Chileno)', W / 2, h.logo ? 118 : 102, { align: 'center' })

  d.setDrawColor(...C.line)
  d.setLineWidth(0.3)
  d.line(M, h.logo ? 128 : 112, W - M, h.logo ? 128 : 112)

  d.setFont('helvetica', 'normal')
  d.setFontSize(8.5)
  d.setTextColor(...C.slate)
  d.text(`${data.ciudad || 'Santiago'} · ${data.fecha}`, W / 2, h.logo ? 136 : 120, { align: 'center' })
  d.setFontSize(7.5)
  d.text(`Modelo de análisis: ${data.modeloIA}`, W / 2, h.logo ? 143 : 127, { align: 'center' })
}

function applyHeadersFooters(h: PDFHandle, data: InformeLegalData) {
  const d = h.doc
  const total = d.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    d.setPage(p)
    const ph = d.internal.pageSize.getHeight()
    if (p >= 2) {
      if (h.logo) {
        d.addImage(h.logo, 'PNG', M, 9, 7, 7)
      }
      d.setFont('helvetica', 'bold')
      d.setFontSize(7.5)
      d.setTextColor(79, 70, 229)
      d.text('LEXARA PRO', M + (h.logo ? 8.5 : 0), 14.2)
      d.setFont('helvetica', 'normal')
      d.setTextColor(...C.slate)
      d.setFontSize(7)
      d.text('Informe jurídico · Derecho chileno', M + (h.logo ? 8.5 : 0), 18.2)
      d.setDrawColor(...C.line)
      d.setLineWidth(0.2)
      d.line(M, 21, W - M, 21)
    }
    d.setFont('helvetica', 'normal')
    d.setFontSize(7)
    d.setTextColor(148, 163, 184)
    const foot = `Página ${p} de ${total}  ·  LEXARA PRO  ·  ${data.fecha}  ·  Ordenamiento jurídico chileno`
    d.text(foot, W / 2, ph - 7, { align: 'center' })
  }
}

function addRiesgosTable(h: PDFHandle, riesgos: RiesgoInforme[]) {
  ensureSpace(h, 40)
  const body =
    riesgos?.length > 0
      ? riesgos.map((r) => [r.clausula, r.riesgoJuridico, r.nivel, r.parteAfectada])
      : [['—', 'Sin riesgos registrados', '—', '—']]

  autoTable(h.doc, {
    startY: h.y,
    head: [['Cláusula / tema', 'Riesgo', 'Nivel', 'Parte afectada']],
    body,
    margin: { left: M, right: M },
    tableWidth: CONTENT_W,
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 1.8,
      textColor: C.gray,
      lineColor: C.line,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: C.navy,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
    },
    alternateRowStyles: { fillColor: [250, 250, 252] },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 78 },
      2: { cellWidth: 24 },
      3: { cellWidth: 32 },
    },
  })
  const last = (h.doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
  h.y = (last?.finalY ?? h.y) + 8
}

export async function generateInformeLegalPdf(data: InformeLegalData): Promise<Blob> {
  const logo = await loadLexaraLogoForPdf()
  const h: PDFHandle = { doc: new jsPDF({ unit: 'mm', format: 'a4' }), y: Y0, logo }

  drawCover(h, data)
  h.doc.addPage()
  h.y = Y0

  drawBandTitle(h, 'RESUMEN EJECUTIVO')
  h.doc.setFont('helvetica', 'bold')
  h.doc.setFontSize(8.5)
  h.doc.setTextColor(30, 27, 75)
  h.doc.text('Identificación de las partes e información general', M, h.y)
  h.y += 4.5
  h.doc.setFont('helvetica', 'normal')
  addParagraphBlock(
    h,
    `Contratante: ${data.parteA}\nContratista: ${data.parteB}\nObjeto: ${data.objetoContrato}\nNaturaleza jurídica: ${data.naturalezaJuridica}`
  )
  h.doc.setFont('helvetica', 'bold')
  h.doc.setFontSize(8.5)
  h.doc.setTextColor(30, 27, 75)
  ensureSpace(h, 5)
  h.doc.text('Observación general', M, h.y)
  h.y += 4.5
  h.doc.setFont('helvetica', 'normal')
  addParagraphBlock(h, data.observacionGeneral)

  section(h, 'I', 'Aspectos generales y naturaleza jurídica', data.aspectosGenerales)
  drawBandTitle(h, 'II. OBLIGACIONES DE LAS PARTES')
  h.doc.setFont('helvetica', 'bold')
  h.doc.setFontSize(8.5)
  h.doc.text('1. Contratante', M, h.y)
  h.y += 4
  h.doc.setFont('helvetica', 'normal')
  addParagraphBlock(h, data.obligacionesParteA)
  h.doc.setFont('helvetica', 'bold')
  h.doc.text('2. Contratista', M, h.y)
  h.y += 4
  h.doc.setFont('helvetica', 'normal')
  addParagraphBlock(h, data.obligacionesParteB)

  section(h, 'III', 'Condiciones económicas y sistema de pago', data.condicionesEconomicas)
  section(h, 'IV', 'Cláusulas especiales críticas', data.clausulasEspeciales)
  section(h, 'V', 'Responsabilidad laboral y previsional', data.responsabilidadLaboral)
  section(h, 'VI', 'Término anticipado e indemnizaciones', data.terminoAnticipado)
  section(h, 'VII', 'Resolución de conflictos', data.resolucionConflictos)
  section(h, 'VIII', 'Aspectos procesales y garantías', data.aspectosProcesales)
  drawBandTitle(h, 'IX. RIESGOS Y OBSERVACIONES CRÍTICAS')
  addRiesgosTable(h, data.riesgos)

  drawBandTitle(h, 'X. RECOMENDACIONES FINALES')
  h.doc.setFont('helvetica', 'italic')
  h.doc.setFontSize(8.5)
  h.doc.setTextColor(...C.slate)
  h.doc.text(
    'Desde la perspectiva de un asesor legal bajo normativa chilena, se sugieren las siguientes modificaciones esenciales:',
    M,
    h.y,
    { maxWidth: CONTENT_W }
  )
  h.y += 6
  h.doc.setFont('helvetica', 'normal')
  ;(data.recomendaciones || []).forEach((rec, i) => {
    const block = `${i + 1}. ${rec}`
    addParagraphBlock(h, block)
  })

  ensureSpace(h, 24)
  h.doc.setFont('helvetica', 'italic')
  h.doc.setFontSize(9)
  h.doc.setTextColor(...C.slate)
  h.doc.text(`${data.ciudad || 'Santiago'}, a la fecha de emisión del presente informe.`, W - M, h.y, { align: 'right' })
  h.y += 10
  h.doc.setDrawColor(148, 163, 184)
  h.doc.line(W - M - 60, h.y, W - M, h.y)
  h.y += 6
  h.doc.setFont('helvetica', 'bold')
  h.doc.setTextColor(79, 70, 229)
  h.doc.text('LEXARA PRO', W - M, h.y, { align: 'right' })
  h.y += 5
  h.doc.setFont('helvetica', 'normal')
  h.doc.setFontSize(7.5)
  h.doc.setTextColor(...C.slate)
  h.doc.text(`Análisis generado con ${data.modeloIA} · Derecho chileno vigente`, W - M, h.y, { align: 'right' })
  h.y += 10

  ensureSpace(h, 20)
  h.doc.setFontSize(6.5)
  h.doc.setTextColor(100, 116, 139)
  h.doc.setFont('helvetica', 'italic')
  const aviso =
    'Aviso legal: este informe es un análisis asistido por inteligencia artificial con fines informativos. No constituye asesoría legal profesional. Consulte a un abogado habilitado para su caso concreto.'
  const avLines = h.doc.splitTextToSize(aviso, CONTENT_W)
  for (const line of avLines) {
    ensureSpace(h, 4)
    h.doc.text(line, M, h.y, { maxWidth: CONTENT_W, align: 'center' })
    h.y += 3.2
  }

  applyHeadersFooters(h, data)
  return h.doc.output('blob')
}

export async function downloadInformeLegalPdf(data: InformeLegalData): Promise<void> {
  const blob = await generateInformeLegalPdf(data)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const safe = data.parteA.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_áéíóúñ]/g, '').substring(0, 24)
  a.download = `LEXARA_InformeJuridico_${safe || 'contrato'}_${new Date().toISOString().split('T')[0]}.pdf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
