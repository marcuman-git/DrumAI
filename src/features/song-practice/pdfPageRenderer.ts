import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
export async function renderLocalPdfPage(file: File, pageNumber: number, canvas: HTMLCanvasElement, signal: AbortSignal) {
  if (file.size > 20 * 1024 * 1024) throw new Error('PDF exceeds 20 MB.')
  signal.throwIfAborted()
  const pdfjs = await import('pdfjs-dist')
  signal.throwIfAborted()
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  const data = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  const task = pdfjs.getDocument({ data, useWasm: false, useSystemFonts: true, useWorkerFetch: false })
  let rendering: { cancel: () => void } | null = null
  const cancel = () => { rendering?.cancel(); void task.destroy().catch(() => undefined) }
  signal.addEventListener('abort', cancel, { once: true })
  try {
    const document = await task.promise
    signal.throwIfAborted()
    if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > document.numPages) throw new Error('Page out of range.')
    const page = await document.getPage(pageNumber)
    signal.throwIfAborted()
    const base = page.getViewport({ scale: 1 })
    const scale = Math.min(1400 / base.width, Math.sqrt(4_000_000 / (base.width * base.height)), 3)
    const viewport = page.getViewport({ scale })
    canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas rendering unavailable.')
    const render = page.render({ canvas, canvasContext: context, viewport, annotationMode: 0, background: '#ffffff' })
    rendering = render
    await render.promise
    signal.throwIfAborted()
    return { pageCount: document.numPages, width: base.width, height: base.height, rotation: base.rotation }
  } finally {
    signal.removeEventListener('abort', cancel)
    await task.destroy().catch(() => undefined)
  }
}
