import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, convertInchesToTwip, Header, Footer,
  PageNumber, TableBorders, VerticalAlign
} from 'docx'

// ── Paleta LEXARA ─────────────────────────────────────────────────────────────
const C = {
  dark:    '0f172a',
  navy:    '1e3a8a',
  indigo:  '3730a3',
  violet:  '4f46e5',
  gray:    '475569',
  light:   'f1f5f9',
  slate:   '94a3b8',
  white:   'FFFFFF',
  red:     'dc2626',
  orange:  'ea580c',
  yellow:  'ca8a04',
  green:   '16a34a',
  border:  'e2e8f0',
  gold:    'fbbf24',
}

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface RiesgoInforme {
  clausula: string
  riesgoJuridico: string
  nivel: 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO'
  parteAfectada: string
}

export interface InformeLegalData {
  titulo: string
  proyecto?: string
  parteA: string
  parteB: string
  objetoContrato: string
  naturalezaJuridica: string
  observacionGeneral: string
  aspectosGenerales: string
  obligacionesParteA: string
  obligacionesParteB: string
  condicionesEconomicas: string
  clausulasEspeciales: string
  responsabilidadLaboral: string
  terminoAnticipado: string
  resolucionConflictos: string
  aspectosProcesales: string
  riesgos: RiesgoInforme[]
  recomendaciones: string[]
  ciudad: string
  fecha: string
  modeloIA: string
}

// ── Helpers tipográficos ──────────────────────────────────────────────────────
function run(text: string, opts: {
  bold?: boolean; size?: number; color?: string
  italics?: boolean; font?: string; allCaps?: boolean
} = {}) {
  return new TextRun({
    text,
    bold: opts.bold ?? false,
    size: (opts.size ?? 10) * 2,
    color: opts.color ?? C.dark,
    italics: opts.italics ?? false,
    font: opts.font ?? 'Calibri',
    allCaps: opts.allCaps ?? false,
  })
}

function emptyLine() {
  return new Paragraph({ children: [run('')], spacing: { after: 80 } })
}

function sectionTitle(roman: string, title: string) {
  return new Paragraph({
    children: [
      run(`${roman}. `, { bold: true, size: 11, color: C.violet }),
      run(title.toUpperCase(), { bold: true, size: 11, color: C.navy, allCaps: false }),
    ],
    spacing: { before: 320, after: 120 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 3, color: C.violet },
    },
    shading: { type: ShadingType.SOLID, color: 'f0f4ff' },
  })
}

function subTitle(text: string) {
  return new Paragraph({
    children: [run(text, { bold: true, size: 10, color: C.navy })],
    spacing: { before: 160, after: 60 },
    indent: { left: 360 },
  })
}

function bodyText(text: string, indent = true) {
  const lines = text.split('\n').filter(l => l.trim())
  return lines.map(line =>
    new Paragraph({
      children: [run(line.trim(), { size: 10, color: C.gray })],
      spacing: { before: 40, after: 60, line: 280 },
      indent: indent ? { left: 360 } : undefined,
    })
  )
}

function bulletPoint(text: string) {
  return new Paragraph({
    children: [run(text, { size: 10, color: C.gray })],
    spacing: { before: 40, after: 60, line: 280 },
    indent: { left: 720, hanging: 240 },
    bullet: { level: 0 },
  })
}

function numberedPoint(n: number, text: string) {
  return new Paragraph({
    children: [
      run(`${n}. `, { bold: true, size: 10, color: C.violet }),
      run(text, { size: 10, color: C.gray }),
    ],
    spacing: { before: 100, after: 80, line: 280 },
    indent: { left: 540 },
  })
}

function divider() {
  return new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border } },
    spacing: { before: 200, after: 200 },
  })
}

// ── Logo LEXARA SVG → inline como texto (se renderiza como imagen describible)
// En Word usamos un bloque de encabezado estilizado con texto ya que docx no soporta SVG inline
function logoHeaderCell() {
  return new TableCell({
    width: { size: 30, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    shading: { type: ShadingType.SOLID, color: C.navy },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    },
    children: [
      new Paragraph({
        children: [
          run('⚖', { bold: true, size: 24, color: C.gold, font: 'Segoe UI Symbol' }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 20 },
      }),
      new Paragraph({
        children: [run('LEXARA', { bold: true, size: 16, color: C.white, allCaps: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 20 },
      }),
      new Paragraph({
        children: [run('Legal Intelligence', { size: 8, color: 'a5b4fc', italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
      }),
    ],
  })
}

function titleCell(titulo: string, proyecto: string, parteA: string, parteB: string) {
  return new TableCell({
    width: { size: 70, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    shading: { type: ShadingType.SOLID, color: C.indigo },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    },
    children: [
      new Paragraph({
        children: [run('ANÁLISIS JURÍDICO DEL CONTRATO DE SERVICIOS', { bold: true, size: 13, color: C.white, allCaps: true })],
        spacing: { before: 80, after: 40 },
        indent: { left: 240 },
      }),
      ...(proyecto ? [new Paragraph({
        children: [run(proyecto.toUpperCase(), { bold: true, size: 11, color: C.gold })],
        spacing: { before: 0, after: 40 },
        indent: { left: 240 },
      })] : []),
      new Paragraph({
        children: [run(`${parteA}  ·  ${parteB}`, { size: 9, color: 'c7d2fe', italics: true })],
        spacing: { before: 0, after: 60 },
        indent: { left: 240 },
      }),
      new Paragraph({
        children: [run('(Perspectiva Derecho Chileno)', { size: 8, color: '818cf8', italics: true })],
        spacing: { before: 0, after: 80 },
        indent: { left: 240 },
      }),
    ],
  })
}

// ── Tabla de riesgos ──────────────────────────────────────────────────────────
const NIVEL_COLOR: Record<string, string> = {
  'CRÍTICO': 'fef2f2',
  'ALTO':    'fff7ed',
  'MEDIO':   'fefce8',
  'BAJO':    'f0fdf4',
}
const NIVEL_TEXT_COLOR: Record<string, string> = {
  'CRÍTICO': C.red,
  'ALTO':    C.orange,
  'MEDIO':   C.yellow,
  'BAJO':    C.green,
}

function tablaRiesgos(riesgos: RiesgoInforme[]) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      ['CLÁUSULA / TEMA', 20],
      ['RIESGO JURÍDICO / OPERACIONAL', 50],
      ['NIVEL', 15],
      ['PARTE AFECTADA', 15],
    ].map(([label, size]) => new TableCell({
      width: { size: size as number, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.SOLID, color: C.navy },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        children: [run(label as string, { bold: true, size: 9, color: C.white, allCaps: true })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 80 },
      })],
    })),
  })

  const dataRows = riesgos.map(r => new TableRow({
    children: [
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        children: [new Paragraph({
          children: [run(r.clausula, { bold: true, size: 9, color: C.navy })],
          spacing: { before: 80, after: 80 },
          indent: { left: 80 },
        })],
      }),
      new TableCell({
        width: { size: 50, type: WidthType.PERCENTAGE },
        children: [new Paragraph({
          children: [run(r.riesgoJuridico, { size: 9, color: C.gray })],
          spacing: { before: 80, after: 80 },
          indent: { left: 80 },
        })],
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: NIVEL_COLOR[r.nivel] ?? C.light },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          children: [run(r.nivel, { bold: true, size: 9, color: NIVEL_TEXT_COLOR[r.nivel] ?? C.gray })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
        })],
      }),
      new TableCell({
        width: { size: 15, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          children: [run(r.parteAfectada, { size: 9, color: C.gray, italics: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 80 },
        })],
      }),
    ],
  }))

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      left: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      right: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: C.border },
    },
    rows: [headerRow, ...dataRows],
  })
}

// ── Tabla resumen ejecutivo ───────────────────────────────────────────────────
function tablaResumenEjecutivo(data: InformeLegalData) {
  const rows = [
    ['Contratante', data.parteA],
    ['Contratista', data.parteB],
    ['Objeto del Contrato', data.objetoContrato],
    ['Naturaleza Jurídica', data.naturalezaJuridica],
  ]
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      left: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      right: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: C.border },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: C.border },
    },
    rows: rows.map(([label, value]) => new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { type: ShadingType.SOLID, color: 'f0f4ff' },
          children: [new Paragraph({
            children: [run(label, { bold: true, size: 9, color: C.navy })],
            spacing: { before: 80, after: 80 },
            indent: { left: 120 },
          })],
        }),
        new TableCell({
          width: { size: 75, type: WidthType.PERCENTAGE },
          children: [new Paragraph({
            children: [run(value, { size: 9, color: C.gray })],
            spacing: { before: 80, after: 80 },
            indent: { left: 120 },
          })],
        }),
      ],
    })),
  })
}

// ── Generador principal ───────────────────────────────────────────────────────
export async function generateInformeLegal(data: InformeLegalData): Promise<Blob> {
  const doc = new Document({
    creator: 'LEXARA — Legal Intelligence Platform',
    title: `Análisis Jurídico — ${data.titulo}`,
    description: `Generado por LEXARA el ${data.fecha}`,
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 20 },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1.1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.1),
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                run('LEXARA', { bold: true, size: 8, color: C.violet }),
                run('   ·   Legal Intelligence Platform   ·   ', { size: 8, color: 'cbd5e1', italics: true }),
                run('Análisis Jurídico — Derecho Chileno', { size: 8, color: C.slate, italics: true }),
              ],
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: C.border } },
              spacing: { after: 60 },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                run('⚖ LEXARA Legal Intelligence  ·  ', { size: 8, color: 'c7d2fe' }),
                run('Basado en Ordenamiento Jurídico Chileno  ·  ', { size: 8, color: C.slate, italics: true }),
                run('Página ', { size: 8, color: C.slate }),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.slate, font: 'Calibri' }),
                run(' de ', { size: 8, color: C.slate }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: C.slate, font: 'Calibri' }),
                run(`  ·  Generado el ${data.fecha}  ·  Modelo: ${data.modeloIA}`, { size: 7, color: 'cbd5e1', italics: true }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: C.border } },
              spacing: { before: 60 },
            }),
          ],
        }),
      },
      children: [
        // ── PORTADA / HEADER ─────────────────────────────────────────────────
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                logoHeaderCell(),
                titleCell(data.titulo, data.proyecto ?? '', data.parteA, data.parteB),
              ],
            }),
          ],
        }),

        emptyLine(),

        // ── RESUMEN EJECUTIVO ────────────────────────────────────────────────
        new Paragraph({
          children: [run('RESUMEN EJECUTIVO', { bold: true, size: 11, color: C.white, allCaps: true })],
          shading: { type: ShadingType.SOLID, color: C.indigo },
          spacing: { before: 240, after: 0 },
          indent: { left: 240 },
        }),

        new Paragraph({
          children: [run('Identificación de las Partes e Información General', { bold: true, size: 10, color: C.navy })],
          shading: { type: ShadingType.SOLID, color: 'eef2ff' },
          spacing: { before: 0, after: 0 },
          indent: { left: 240 },
        }),

        tablaResumenEjecutivo(data),

        new Paragraph({
          children: [run('Observación General:', { bold: true, size: 10, color: C.navy })],
          spacing: { before: 160, after: 40 },
          indent: { left: 360 },
        }),
        ...bodyText(data.observacionGeneral),

        divider(),

        // ── I. ASPECTOS GENERALES ────────────────────────────────────────────
        sectionTitle('I', 'Aspectos Generales y Naturaleza Jurídica'),
        ...bodyText(data.aspectosGenerales),

        // ── II. OBLIGACIONES ─────────────────────────────────────────────────
        sectionTitle('II', 'Análisis de Obligaciones de las Partes'),
        subTitle(`1. Obligaciones de ${data.parteA.split(' ')[0]} (Contratante)`),
        ...bodyText(data.obligacionesParteA),
        emptyLine(),
        subTitle(`2. Obligaciones de ${data.parteB.split(' ')[0]} (Contratista)`),
        ...bodyText(data.obligacionesParteB),

        // ── III. CONDICIONES ECONÓMICAS ──────────────────────────────────────
        sectionTitle('III', 'Condiciones Económicas y Sistema de Pago'),
        ...bodyText(data.condicionesEconomicas),

        // ── IV. CLÁUSULAS ESPECIALES ─────────────────────────────────────────
        sectionTitle('IV', 'Análisis de Cláusulas Especiales Críticas'),
        ...bodyText(data.clausulasEspeciales),

        // ── V. RESPONSABILIDAD LABORAL ───────────────────────────────────────
        sectionTitle('V', 'Responsabilidad Laboral y Previsional'),
        ...bodyText(data.responsabilidadLaboral),

        // ── VI. TÉRMINO ANTICIPADO ───────────────────────────────────────────
        sectionTitle('VI', 'Término Anticipado e Indemnizaciones'),
        ...bodyText(data.terminoAnticipado),

        // ── VII. RESOLUCIÓN DE CONFLICTOS ────────────────────────────────────
        sectionTitle('VII', 'Cláusulas de Resolución de Conflictos'),
        ...bodyText(data.resolucionConflictos),

        // ── VIII. ASPECTOS PROCESALES ────────────────────────────────────────
        sectionTitle('VIII', 'Aspectos Procesales y Garantías'),
        ...bodyText(data.aspectosProcesales),

        // ── IX. RIESGOS ──────────────────────────────────────────────────────
        sectionTitle('IX', 'Riesgos y Observaciones Críticas'),
        emptyLine(),
        tablaRiesgos(data.riesgos),

        emptyLine(),

        // ── X. RECOMENDACIONES ───────────────────────────────────────────────
        sectionTitle('X', 'Recomendaciones Finales'),
        new Paragraph({
          children: [run(
            'Desde la perspectiva de un asesor legal bajo normativa chilena, se sugieren las siguientes modificaciones esenciales:',
            { size: 10, color: C.gray, italics: true }
          )],
          spacing: { before: 80, after: 120 },
          indent: { left: 360 },
        }),
        ...data.recomendaciones.map((r, i) => numberedPoint(i + 1, r)),

        divider(),

        // ── CIERRE ───────────────────────────────────────────────────────────
        emptyLine(),
        new Paragraph({
          children: [run(`${data.ciudad}, a la fecha de emisión del presente informe.`, { size: 10, color: C.gray, italics: true })],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 160, after: 80 },
        }),
        new Paragraph({
          children: [run('_____________________________________________', { size: 10, color: C.slate })],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 320, after: 40 },
        }),
        new Paragraph({
          children: [run('LEXARA Legal Intelligence Platform', { bold: true, size: 9, color: C.violet })],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 20 },
        }),
        new Paragraph({
          children: [run(`Análisis generado con ${data.modeloIA} · Derecho Chileno Vigente`, { size: 8, color: C.slate, italics: true })],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 0, after: 40 },
        }),
        new Paragraph({
          children: [run(
            'AVISO LEGAL: Este informe es un análisis automatizado generado por inteligencia artificial con fines informativos. No constituye asesoría legal profesional. Siempre consulte a un abogado habilitado para asuntos jurídicos concretos.',
            { size: 7, color: C.slate, italics: true }
          )],
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 0 },
          border: {
            top: { style: BorderStyle.SINGLE, size: 1, color: C.border },
          },
        }),
      ],
    }],
  })

  return await Packer.toBlob(doc)
}

// ── Exportar cualquier informe ────────────────────────────────────────────────
export { Packer }
export async function downloadInformeLegal(data: InformeLegalData) {
  const blob = await generateInformeLegal(data)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `LEXARA_Informe_Legal_${data.parteA.replace(/\s+/g, '_').substring(0, 20)}_${new Date().toISOString().split('T')[0]}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
