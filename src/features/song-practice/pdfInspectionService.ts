import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
export interface PdfPageInspection { page: number; textCharacters: number; images: number }
export interface PdfInspection { pageCount: number; pages: PdfPageInspection[]; assessment: string }
export async function inspectLocalPdf(file: File, signal: AbortSignal): Promise<PdfInspection> {
  if (file.size > 20 * 1024 * 1024) throw new Error('PDF exceeds 20 MB.')
  signal.throwIfAborted()
  const pdfjs = await import('pdfjs-dist')
  signal.throwIfAborted()
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  const data = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  const task = pdfjs.getDocument({ data, useWasm: false, useSystemFonts: false, disableFontFace: true, useWorkerFetch: false })
  const cancel = () => { void task.destroy().catch(() => undefined) }
  signal.addEventListener('abort', cancel, { once: true })
  try {
    const document = await task.promise
    signal.throwIfAborted()
    const pages: PdfPageInspection[] = []
    for (let page = 1; page <= Math.min(document.numPages, 10); page++) {
      signal.throwIfAborted()
      const content = await document.getPage(page)
      const text = await content.getTextContent()
      signal.throwIfAborted()
      const operators = await content.getOperatorList()
      signal.throwIfAborted()
      const imageOps = [pdfjs.OPS.paintImageXObject, pdfjs.OPS.paintInlineImageXObject, pdfjs.OPS.paintImageMaskXObject]
      pages.push({ page, textCharacters: text.items.reduce((total, item) => total + ('str' in item ? item.str.replace(/\s/g, '').length : 0), 0), images: operators.fnArray.filter((op) => imageOps.includes(op)).length })
      content.cleanup()
    }
    const hasText = pages.some((page) => page.textCharacters > 0)
    const hasImages = pages.some((page) => page.images > 0)
    return { pageCount: document.numPages, pages, assessment: hasText ? 'Text layer detected. Text extraction is feasible, but text presence does not prove that musical notes are recognizable.' : hasImages ? 'No extractable text found in sampled pages; image-based content is present. A scanned chart is possible and would require optical music recognition.' : 'No extractable text or sampled image operators found. Vector notation or unsupported content is possible; manual review is required.' }
  } finally {
    signal.removeEventListener('abort', cancel)
    await task.destroy().catch(() => undefined)
  }
}
