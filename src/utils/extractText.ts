import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.txt') || file.type === 'text/plain') {
    return await file.text()
  }

  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    return await extractFromPDF(file)
  }

  if (
    name.endsWith('.docx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return await extractFromDOCX(file)
  }

  if (name.endsWith('.doc') || file.type === 'application/msword') {
    try {
      return await extractFromDOCX(file)
    } catch {
      return await file.text()
    }
  }

  if (name.endsWith('.rtf') || file.type === 'application/rtf') {
    const raw = await file.text()
    return raw.replace(/\{[^{}]*\}|\\[a-zA-Z]+\d*\s?|[{}\\]/g, ' ').replace(/\s+/g, ' ').trim()
  }

  return await file.text()
}

async function extractFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise

  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(pageText)
  }

  const full = pages.join('\n\n').replace(/\s{3,}/g, '  ').trim()
  if (full.length < 100) {
    throw new Error(
      'El PDF parece ser escaneado o protegido. Por favor conviértelo a texto o use un PDF con texto seleccionable.'
    )
  }
  return full
}

async function extractFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const text = result.value.trim()
  if (text.length < 50) {
    throw new Error('No se pudo extraer texto del archivo Word.')
  }
  return text
}
