import { useEffect, useRef, useState } from 'react'
import type { PdfInspection } from './pdfInspectionService'
export function PdfInspectionPanel({ file }: { file: File }) {
  const [result, setResult] = useState<PdfInspection | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('Inspect this PDF locally to check its structure. This does not generate chart notes.')
  const controller = useRef<AbortController | null>(null)
  useEffect(() => () => { controller.current?.abort(); controller.current = null }, [])
  async function inspect() {
    controller.current?.abort()
    const request = new AbortController(); controller.current = request
    setBusy(true); setResult(null); setMessage('Inspecting up to the first 10 pages locally...')
    const timeout = window.setTimeout(() => request.abort(), 30000)
    try {
      const { inspectLocalPdf } = await import('./pdfInspectionService')
      const value = await inspectLocalPdf(file, request.signal)
      if (request.signal.aborted) return
      setResult(value); setMessage('Inspection complete. No notes were generated and no practice data was changed.')
    } catch {
      if (controller.current === request) setMessage(request.signal.aborted ? 'Inspection cancelled or timed out. Your PDF and chart are unchanged.' : 'Inspection failed. The file may be damaged, encrypted/password-protected, or unsupported. Use your local PDF viewer and the editable drum chart.')
    } finally {
      window.clearTimeout(timeout)
      if (controller.current === request) setBusy(false)
    }
  }
  return <section aria-label="Local PDF inspection" className="space-y-3 rounded-lg border border-cyan-200/30 bg-black/20 p-3">
    <h4 className="font-semibold">PDF Structure Inspection</h4>
    <p className="text-xs text-zinc-300">File bytes remain on your device. Inspection reports counts, not extracted text. It does not execute PDF scripts, perform OCR, or recognize drum notes. Results are temporary and not stored in backups.</p>
    <div className="flex gap-2"><button disabled={busy} onClick={() => void inspect()} className="rounded border border-cyan-200/40 px-3 py-2 disabled:opacity-40">{busy ? 'Inspecting...' : 'Inspect PDF locally'}</button>{busy && <button onClick={() => { controller.current?.abort(); setMessage('Inspection cancelled. Your PDF and chart are unchanged.'); setBusy(false) }} className="rounded border border-white/25 px-3 py-2">Cancel inspection</button>}</div>
    {result && <><p className="text-sm text-cyan-100">Document pages: {result.pageCount}. Sampled pages: {result.pages.length}.</p><p className="rounded border border-amber-200/40 bg-amber-950/30 p-2 text-sm">{result.assessment}</p><div className="grid gap-2 sm:grid-cols-2">{result.pages.map((page) => <p key={page.page} className="rounded border border-white/15 p-2 text-xs">Page {page.page}: {page.textCharacters} non-space text characters / {page.images} image paint operations</p>)}</div></>}
    <p role="status" className="text-sm text-cyan-100">{message}</p>
  </section>
}
