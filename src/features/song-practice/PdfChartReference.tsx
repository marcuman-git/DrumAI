import { sourceReferencePage, sourceComparisonPage, type SourceReferenceRequest } from './sourceReferenceNavigation'
import type { RecognitionDraft } from './notationRecognition'
import { useEffect, useRef, useState } from 'react'
import { PdfRegionSelector } from './PdfRegionSelector'
import { PdfInspectionPanel } from './PdfInspectionPanel'
import {SourceCollection} from './SourceCollection'
import {SourceCropInspection} from './SourceCropInspection'
import type {SourceReferenceRequest as InspectionRequest} from './sourceReferenceNavigation'
import { RenderedPdfPage } from './RenderedPdfPage'
import { GlassCard } from '../../shared/components/GlassCard'

export const MAX_REFERENCE_BYTES = 20 * 1024 * 1024

export async function validatePdfReference(file: File) {
  if (!file.name.toLowerCase().endsWith('.pdf') || file.size > MAX_REFERENCE_BYTES || file.size < 5) {
    throw new Error('Choose a PDF file no larger than 20 MB.')
  }
  const header = await file.slice(0, 5).text()
  if (header !== '%PDF-') throw new Error('This file does not have a valid PDF header.')
}

export function PdfChartReference({ onDraft, sourceReference }: { onDraft?: (draft: RecognitionDraft) => void; sourceReference?: SourceReferenceRequest | null } = {}) {
  const [collectionMode,setCollectionMode]=useState(false),[incoming,setIncoming]=useState<RecognitionDraft|null>(null),[inspection,setInspection]=useState<InspectionRequest|null>(null)
  const [reference, setReference] = useState<{ url: string; name: string; file: File } | null>(null)
  const [comparePage,setComparePage] = useState<number | null>(null)
  const [page, setPage] = useState<number | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('Choose a local PDF to read beside the editable drum chart.')
  const generation = useRef(0)
  const urlRef = useRef<string | null>(null)
  useEffect(() => () => {
    generation.current += 1
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
  }, [])

  useEffect(() => {
    if (!sourceReference) return
    const target = reference ? sourceReferencePage(sourceReference, reference.name) : null
    if (target === null) { setError(false); setMessage('Choose the matching local PDF: ' + sourceReference.source + '. Source navigation has not changed the viewer.'); return }
    setInspection(sourceReference);setPage(target); setComparePage(sourceComparisonPage(sourceReference,reference!.name)); setError(false); setMessage('Source reference: ' + reference!.name + ', page ' + target + '.');
    previewRef.current?.scrollIntoView?.({block:'center',behavior:'smooth'})
  }, [sourceReference, reference])

  function clear() {
    generation.current += 1
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
    setIncoming(null);setInspection(null);setReference(null)
    setPage(null)
    setComparePage(null)
    setError(false)
    setMessage('PDF removed. Your editable chart is unchanged.')
  }

  async function choose(file: File) {
    const request = ++generation.current
    try {
      await validatePdfReference(file)
      if (request !== generation.current) return
      const url = URL.createObjectURL(file)
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      urlRef.current = url
      setPage(null)
      setComparePage(null)
      setIncoming(null);setInspection(null);setReference({ url, name: file.name, file })
      setError(false)
      setMessage('Reference loaded. Enter notes manually in the chart editor. PDF viewing does not create practice events.')
    } catch (error) {
      if (request === generation.current) { setError(true); setMessage(error instanceof Error ? error.message : 'Unable to open this PDF.') }
    }
  }

  return <GlassCard layout={false} className="min-w-0 space-y-3">
    <h3 className="text-lg font-semibold">PDF Chart Reference</h3>
    <p className="text-sm text-zinc-300">Local PDF reference with optional experimental recognition. No upload or production-quality transcription. PDFs are not saved in chart JSON or practice backups. Choose the file again after leaving Song Practice or refreshing.</p>
    <label className="block rounded-lg border border-cyan-200/50 bg-cyan-950/40 p-3 text-sm text-cyan-100">Choose local PDF (max 20 MB)
      <input aria-label="Choose local PDF" type="file" className="mt-2 block w-full text-sm file:mr-2 file:rounded file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:text-slate-950" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void choose(file) }} />
    </label>
    <p role={error ? 'alert' : 'status'} className={error ? 'rounded-lg border-2 border-amber-300 bg-amber-950/60 p-3 text-sm font-semibold text-amber-100' : 'text-sm text-cyan-200'}>{error ? 'File not loaded: ' : ''}{message}</p>
    {reference && <>
      <p className="break-words text-sm font-semibold">{reference.name}</p>
      <div className="flex flex-wrap gap-2">
        <a href={page ? `${reference.url}#page=${page}` : reference.url} target="_blank" rel="noopener noreferrer" className="rounded border border-cyan-200/50 px-3 py-2 text-sm text-cyan-100">Open PDF locally</a>
        <button onClick={clear} className="rounded border border-white/25 px-3 py-2 text-sm">Remove PDF</button>
      </div>
      <label className="block"><input aria-label="Collect multiple staffs and pages" type="checkbox" checked={collectionMode} onChange={e=>setCollectionMode(e.target.checked)}/>Collect reviewed sections across staffs and pages before sending.</label>
      <PdfRegionSelector key={`region-${reference.url}`} file={reference.file} recoveryRequest={inspection} onDraft={draft=>{if(collectionMode)setIncoming(draft);else onDraft?.(draft)}} />
      <div hidden={!collectionMode}><SourceCollection key={reference.url} file={reference.file} incoming={incoming} onSend={onDraft} onInspect={request=>{setInspection(request);setPage(request.page);setComparePage(request.comparePage??null)}}/></div>
      {inspection?.crop&&<div className={inspection.compareCrop?'grid gap-3 lg:grid-cols-2':''}><SourceCropInspection file={reference.file} crop={inspection.crop} point={inspection.point}/>{inspection.compareCrop&&<SourceCropInspection file={reference.file} crop={inspection.compareCrop}/>}</div>}
      <PdfInspectionPanel key={reference.url} file={reference.file} />
      <div ref={previewRef} className={comparePage?"grid gap-3 lg:grid-cols-2":""}><div><RenderedPdfPage key={`${reference.url}-${page}-${sourceReference?.requestId}`} file={reference.file} initialPage={page??1} title="Rendered source PDF page"/><details><summary>Browser PDF fallback</summary>{comparePage&&<p className="text-sm">Source page {page}</p>}<iframe title="Local PDF chart preview" src={page ? `${reference.url}#page=${page}` : reference.url} className="h-[65vh] min-h-80 w-full rounded-lg border border-white/20 bg-zinc-100" /></details></div>
      {comparePage&&<section aria-label="Comparison source page"><RenderedPdfPage key={`${reference.url}-${comparePage}-${sourceReference?.requestId}`} file={reference.file} initialPage={comparePage} title="Rendered comparison PDF page"/><details><summary>Browser comparison fallback</summary><p className="text-sm">Comparison page {comparePage}</p><a href={`${reference.url}#page=${comparePage}`} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-100">Open comparison page locally</a><iframe title="Local PDF comparison preview" src={`${reference.url}#page=${comparePage}`} className="h-[65vh] min-h-80 w-full rounded-lg border border-white/20 bg-zinc-100" /></details></section>}</div>
      <p className="text-xs text-zinc-400">Use your browser viewer for page navigation and zoom. If the preview is blank or unsupported on mobile, use Open PDF locally. Damaged or password-protected PDFs may require your device's PDF reader.</p>
    </>}
  </GlassCard>
}
