import { NotationRecognitionPanel } from './NotationRecognitionPanel'
import type { RecognitionDraft } from './notationRecognition'
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { selectRegion, usableRegion } from './pdfRegionLogic'
import type { PdfRegion } from './pdfRegionLogic'
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export function PdfRegionSelector({ file, onDraft }: { file: File; onDraft?: (draft: RecognitionDraft) => void }) {
  const [recognition, setRecognition] = useState<{ pixels: Uint8ClampedArray; width: number; height: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const controller = useRef<AbortController | null>(null)
  const origin = useRef<{ x: number; y: number; pointer: number } | null>(null)
  const [opened, setOpened] = useState(false)
  const [renderRevision, setRenderRevision] = useState(0)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const [region, setRegion] = useState<PdfRegion | null>(null)
  const [geometry, setGeometry] = useState<{ width: number; height: number; rotation: number } | null>(null)
  const [message, setMessage] = useState('Render a page, then select one notation system. No automatic recognition is performed.')
  useEffect(() => {
    if (!opened) return
    const request = new AbortController(); controller.current = request
    const timeout = window.setTimeout(() => request.abort(), 30000)
    void (async () => {
      try {
        const { renderLocalPdfPage } = await import('./pdfPageRenderer')
        if (!canvasRef.current || request.signal.aborted) return
        const result = await renderLocalPdfPage(file, page, canvasRef.current, request.signal)
        if (request.signal.aborted) return
        setPageCount(result.pageCount); setGeometry(result); setReady(true)
        setMessage('Page rendered. Enable Select region, then drag across the notation using mouse or touch.')
      } catch {
        if (!request.signal.aborted) setMessage('Page could not render. Try the browser PDF preview for damaged, encrypted or unsupported files.')
        else if (controller.current === request) setMessage('Rendering cancelled or timed out. Your chart is unchanged.')
      } finally { window.clearTimeout(timeout); if (controller.current === request) setBusy(false) }
    })()
    return () => { controller.current = null; request.abort(); window.clearTimeout(timeout) }
  }, [file, opened, page, renderRevision])
  function prepare() { controller.current?.abort(); controller.current = null; setRecognition(null); setBusy(true); setReady(false); setRegion(null); setGeometry(null); origin.current = null; setMessage('Rendering PDF page locally...') }
  function selectAnotherRegion() { origin.current = null; setRecognition(null); setRegion(null); setSelecting(true); setMessage('Select another bar by dragging on the rendered page. Previous analysis cleared; chart notes unchanged.') }
  function point(event: PointerEvent<HTMLDivElement>) {
    const box = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - box.left) / box.width, y: (event.clientY - box.top) / box.height }
  }
  function startRecognition() {
    if (!usableRegion(region) || !canvasRef.current) return
    try {
      const source = canvasRef.current; const sw = region.width * source.width; const sh = region.height * source.height
      const scale = Math.min(1, 900 / sw, 900 / sh); const crop = document.createElement('canvas')
      crop.width = Math.max(20, Math.floor(sw * scale)); crop.height = Math.max(20, Math.floor(sh * scale))
      const context = crop.getContext('2d'); if (!context) throw new Error('Canvas unavailable')
      context.drawImage(source, region.x * source.width, region.y * source.height, sw, sh, 0, 0, crop.width, crop.height)
      setRecognition({ pixels: context.getImageData(0, 0, crop.width, crop.height).data, width: crop.width, height: crop.height }); setSelecting(false)
    } catch { setMessage('Region pixels could not be read. Render the page again and select a clearer region.') }
  }
  function exportCrop() {
    if (!usableRegion(region) || !canvasRef.current) return
    const source = canvasRef.current; const crop = document.createElement('canvas')
    crop.width = Math.max(1, Math.round(region.width * source.width)); crop.height = Math.max(1, Math.round(region.height * source.height))
    const context = crop.getContext('2d'); if (!context) return
    context.drawImage(source, region.x * source.width, region.y * source.height, region.width * source.width, region.height * source.height, 0, 0, crop.width, crop.height)
    crop.toBlob((blob) => { if (blob) download(blob, `drummaster-page-${page}-region.png`) }, 'image/png')
  }
  return <section aria-label="PDF notation region" className="space-y-3 rounded-lg border border-white/20 p-3">
    <h4 className="font-semibold">PDF Page + Region Selection</h4>
    <p className="text-xs text-zinc-300">Local rendering and selection only. Region selection does not change your chart. Experimental analysis can propose a draft only after your confirmation. Exports may contain private or copyrighted sheet music; keep them local. Selections are temporary.</p>
    <div className="flex flex-wrap gap-2"><button onClick={() => { if (!opened) prepare(); else { setRegion(null); setRecognition(null); setReady(false); setBusy(false) } setOpened((value) => !value) }} className="rounded border border-cyan-200/40 px-3 py-2">{opened ? 'Close page renderer' : 'Render PDF page'}</button>{opened && <><button disabled={busy} onClick={() => { prepare(); setRenderRevision((value) => value + 1) }} className="rounded border border-cyan-200/40 px-3 py-2 disabled:opacity-40">Reset PDF rendering</button><button disabled={!ready} onClick={selectAnotherRegion} className="rounded border border-amber-200/40 px-3 py-2 disabled:opacity-40">Select another region</button><button disabled={busy || page <= 1} onClick={() => { prepare(); setPage((value) => value - 1) }} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Previous PDF page</button><span className="self-center text-sm">Page {page} / {pageCount}</span><button disabled={busy || page >= pageCount} onClick={() => { prepare(); setPage((value) => value + 1) }} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Next PDF page</button>{busy && <button onClick={() => { controller.current?.abort(); setOpened(false); setBusy(false); setReady(false); setMessage('Rendering cancelled. Your chart is unchanged.') }} className="rounded border border-white/25 px-3 py-2">Cancel rendering</button>}</>}</div>
    {opened && <><button disabled={!ready} aria-pressed={selecting} onClick={() => { setSelecting((value) => !value); origin.current = null }} className="rounded border border-amber-200/40 px-3 py-2 disabled:opacity-40">Select region {selecting ? 'On' : 'Off'}</button><p className="text-xs text-zinc-400">Turn selection Off to scroll on touch devices. Page view fits its container.</p>
      <div aria-label="Rendered PDF selection surface" className={`relative overflow-hidden rounded border border-white/20 bg-white ${selecting ? 'touch-none cursor-crosshair' : ''}`} onPointerDown={(event) => { if (!selecting || !ready) return; const start = point(event); setRecognition(null); origin.current = { ...start, pointer: event.pointerId }; event.currentTarget.setPointerCapture(event.pointerId); setRegion(selectRegion(start, start)) }} onPointerMove={(event) => { if (origin.current?.pointer === event.pointerId) setRegion(selectRegion(origin.current, point(event))) }} onPointerUp={(event) => { if (origin.current?.pointer !== event.pointerId) return; setRegion(selectRegion(origin.current, point(event))); origin.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }} onLostPointerCapture={() => { origin.current = null }} onPointerCancel={() => { origin.current = null; setRegion(null) }}>
        <canvas ref={canvasRef} aria-label="Rendered local PDF page" className={`block h-auto w-full ${ready ? '' : 'invisible'}`} />
        {region && ready && <div className="pointer-events-none absolute border-2 border-amber-500 bg-amber-300/20" style={{ left: `${region.x * 100}%`, top: `${region.y * 100}%`, width: `${region.width * 100}%`, height: `${region.height * 100}%` }} />}
      </div>
      <div className="flex flex-wrap gap-2"><button disabled={!usableRegion(region)} onClick={selectAnotherRegion} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Clear region</button><button disabled={!ready || !usableRegion(region)} onClick={exportCrop} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Download region PNG</button><button disabled={!ready || !usableRegion(region)} onClick={() => download(new Blob([JSON.stringify({ app: 'DrumMaster AI PDF Region', schema: 1, source: file.name, page, coordinates: 'normalized displayed-page coordinates, origin top-left', region, pageGeometry: geometry, recognition: 'not performed' }, null, 2)], { type: 'application/json' }), 'drummaster-pdf-region.json')} className="rounded border border-white/25 px-3 py-2 disabled:opacity-40">Export region JSON</button></div>
    </>}
    {opened && ready && <button disabled={!usableRegion(region)} onClick={startRecognition} className="rounded border border-amber-200/40 px-3 py-2 disabled:opacity-40">Analyze selected notation region (Experimental)</button>}
    {recognition && opened && ready && <NotationRecognitionPanel key={recognition.width + '-' + recognition.height + '-' + page} {...recognition} source={file.name} page={page} onDraft={onDraft} />}
    <p role="status" className="text-sm text-cyan-100">{message}</p>
  </section>
}
