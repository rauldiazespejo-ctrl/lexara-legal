import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell,
  WidthType, ShadingType, convertInchesToTwip, Header, Footer,
  PageNumber, NumberFormat
} from 'docx'

export interface ClausulaDoc {
  numero: number
  titulo: string
  texto: string
}

export interface DatosContrato {
  tipoContrato: string
  parteA: string
  parteB: string
  ciudad: string
  fecha: string
  clausulas: ClausulaDoc[]
}

const COLOR_DARK   = '0f172a'
const COLOR_INDIGO = '4f46e5'
const COLOR_GRAY   = '475569'
const COLOR_LIGHT  = 'f1f5f9'

function textRun(text: string, opts: {
  bold?: boolean; size?: number; color?: string; italics?: boolean; font?: string
} = {}) {
  return new TextRun({
    text,
    bold: opts.bold ?? false,
    size: (opts.size ?? 11) * 2,
    color: opts.color ?? COLOR_DARK,
    italics: opts.italics ?? false,
    font: opts.font ?? 'Calibri',
  })
}

function heading1(text: string) {
  return new Paragraph({
    children: [textRun(text, { bold: true, size: 15, color: COLOR_DARK })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLOR_INDIGO } },
  })
}

function clausulaHeading(numero: number, titulo: string) {
  return new Paragraph({
    children: [
      textRun(`CLÁUSULA ${toRomano(numero)}: `, { bold: true, size: 11, color: COLOR_INDIGO }),
      textRun(titulo.toUpperCase(), { bold: true, size: 11, color: COLOR_DARK }),
    ],
    spacing: { before: 300, after: 80 },
  })
}

function bodyParagraph(text: string) {
  const lines = text.split('\n').filter(l => l.trim())
  return lines.map(line =>
    new Paragraph({
      children: [textRun(line.trim(), { size: 11, color: COLOR_GRAY })],
      spacing: { before: 40, after: 60, line: 276 },
      indent: { left: 360 },
    })
  )
}

function separator() {
  return new Paragraph({
    children: [textRun('')],
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' } },
    spacing: { before: 160, after: 160 },
  })
}

function toRomano(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
  let result = ''
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i] }
  }
  return result
}

export async function generateDocx(datos: DatosContrato): Promise<Blob> {
  const doc = new Document({
    creator: 'NexusForge — Sistema Legal Inteligente',
    title: datos.tipoContrato,
    description: `Generado por LEXARA PRO � NexusForge el ${new Date().toLocaleDateString('es-CL')}`,
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22, color: COLOR_DARK },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1.2),
            right: convertInchesToTwip(1.2),
            bottom: convertInchesToTwip(1.2),
            left: convertInchesToTwip(1.2),
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                textRun('NexusForge', { bold: true, size: 9, color: COLOR_INDIGO }),
                textRun('   ·   Sistema Legal Inteligente   ·   Derecho Chileno', { size: 9, color: 'cbd5e1', italics: true }),
              ],
              alignment: AlignmentType.RIGHT,
              border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' } },
              spacing: { after: 80 },
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                textRun('Página ', { size: 9, color: '94a3b8' }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '94a3b8', font: 'Calibri' }),
                textRun(' de ', { size: 9, color: '94a3b8' }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '94a3b8', font: 'Calibri' }),
                textRun(`   ·   ${datos.tipoContrato}   ·   Generado por LEXARA PRO � NexusForge — ${new Date().toLocaleDateString('es-CL')}`, { size: 9, color: 'cbd5e1', italics: true }),
              ],
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' } },
              spacing: { before: 80 },
            }),
          ],
        }),
      },
      children: [
        // ── Portada ─────────────────────────────────────────────
        new Paragraph({
          children: [textRun(datos.tipoContrato.toUpperCase(), { bold: true, size: 18, color: COLOR_DARK })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480, after: 80 },
        }),
        new Paragraph({
          children: [textRun('CONTRATO PARTICULAR', { bold: false, size: 12, color: COLOR_INDIGO, italics: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 40 },
        }),
        new Paragraph({
          children: [textRun(`${datos.ciudad}, ${datos.fecha}`, { size: 11, color: COLOR_GRAY })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 480 },
        }),

        // ── Partes ───────────────────────────────────────────────
        ...(datos.parteA || datos.parteB ? [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [textRun('PARTE A', { bold: true, size: 9, color: 'ffffff' })],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { type: ShadingType.SOLID, color: COLOR_INDIGO },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [textRun('PARTE B', { bold: true, size: 9, color: 'ffffff' })],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    shading: { type: ShadingType.SOLID, color: COLOR_INDIGO },
                    width: { size: 50, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({ children: [textRun(datos.parteA || '—', { size: 10, color: COLOR_GRAY })], spacing: { before: 80, after: 80 }, indent: { left: 120 } }),
                    ],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({ children: [textRun(datos.parteB || '—', { size: 10, color: COLOR_GRAY })], spacing: { before: 80, after: 80 }, indent: { left: 120 } }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ children: [textRun('')], spacing: { after: 200 } }),
        ] : []),

        // ── Cláusulas ────────────────────────────────────────────
        heading1('CLÁUSULAS DEL CONTRATO'),
        ...datos.clausulas.flatMap((c, idx) => [
          clausulaHeading(c.numero || idx + 1, c.titulo),
          ...bodyParagraph(c.texto),
          ...(idx < datos.clausulas.length - 1 ? [] : []),
        ]),

        separator(),

        // ── Firma ────────────────────────────────────────────────
        heading1('FIRMAS'),
        new Paragraph({
          children: [textRun(`En ${datos.ciudad}, a ${datos.fecha}, las partes suscriben el presente contrato en dos ejemplares del mismo tenor y un solo efecto, quedando uno en poder de cada parte.`, { size: 10, color: COLOR_GRAY, italics: true })],
          spacing: { before: 0, after: 600 },
          indent: { left: 360 },
        }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE } },
                  children: [
                    new Paragraph({
                      children: [textRun('_______________________________________', { size: 11 })],
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 600 },
                    }),
                    new Paragraph({
                      children: [textRun(datos.parteA || 'PARTE A', { bold: true, size: 10, color: COLOR_DARK })],
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 40, after: 20 },
                    }),
                    new Paragraph({
                      children: [textRun('RUT: ___________________________', { size: 9, color: COLOR_GRAY })],
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                      children: [textRun('Fecha: _________________________', { size: 9, color: COLOR_GRAY })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
                new TableCell({
                  borders: { top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE } },
                  children: [
                    new Paragraph({
                      children: [textRun('_______________________________________', { size: 11 })],
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 600 },
                    }),
                    new Paragraph({
                      children: [textRun(datos.parteB || 'PARTE B', { bold: true, size: 10, color: COLOR_DARK })],
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 40, after: 20 },
                    }),
                    new Paragraph({
                      children: [textRun('RUT: ___________________________', { size: 9, color: COLOR_GRAY })],
                      alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                      children: [textRun('Fecha: _________________________', { size: 9, color: COLOR_GRAY })],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ children: [textRun('')], spacing: { after: 200 } }),
        new Paragraph({
          children: [
            textRun('Documento generado por ', { size: 8, color: 'cbd5e1', italics: true }),
            textRun('NexusForge — Sistema Legal Inteligente', { size: 8, color: COLOR_INDIGO, italics: true }),
            textRun(' · Derecho Chileno · Solo para uso como borrador, sujeto a revisión profesional.', { size: 8, color: 'cbd5e1', italics: true }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  })

  const buffer = await Packer.toBlob(doc)
  return buffer
}

export function downloadDocx(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href    = url
  a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
