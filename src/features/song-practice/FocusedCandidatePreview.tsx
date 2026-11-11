import { useEffect, useRef, useState } from 'react'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
import { previewBounds } from './candidatePreviewBounds'
import type { CandidatePreviewSource } from './candidatePreviewBounds'
export function FocusedCandidatePreview({ note, source, hint }: { note: NoteCandidate; source: CandidatePreviewSource; hint?: NoteValueHint }) {
  const [outline, setOutline] = useState(true)
  const [wide, setWide] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const target = canvas.current; if (!target) return
    const ctx = target.getContext('2d'); if (!ctx) return
    const bounds = previewBounds(note, source, hint, wide ? 2 : 1)
    const raster = document.createElement('canvas'); raster.width = bounds.width; raster.height = bounds.height
    const original = raster.getContext('2d'); if (!original) return
    const image = original.createImageData(bounds.width, bounds.height)
    for (let row = 0; row < bounds.height; row++) {
      const start = ((bounds.top + row) * source.width + bounds.left) * 4
      image.data.set(source.pixels.subarray(start, start + bounds.width * 4), row * bounds.width * 4)
    }
    original.putImageData(image, 0, 0)
    const scale = Math.min(4, 480 / bounds.width, 400 / bounds.height)
    target.width = Math.max(1, Math.round(bounds.width * scale)); target.height = Math.max(1, Math.round(bounds.height * scale))
    ctx.imageSmoothingEnabled = false
    ctx.drawImage?.(raster, 0, 0, bounds.width, bounds.height, 0, 0, target.width, target.height)
    ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 2
    if (outline) ctx.strokeRect((note.x - 6 - bounds.left) / bounds.width * target.width, (bounds.y - 5 - bounds.top) / bounds.height * target.height, 12 / bounds.width * target.width, 10 / bounds.height * target.height)
  }, [note, source, hint, outline, wide])
  return <section aria-label="Focused symbol inspection" className="rounded border border-cyan-300/40 p-3"><h5 className="text-sm font-semibold">Inspect candidate #{note.id + 1}: {note.instrument}</h5><div className="mt-2 flex flex-wrap gap-2"><button aria-pressed={!outline} onClick={() => setOutline((value) => !value)} className="rounded border border-white/30 px-3 py-2 text-sm">Clean source view</button><button aria-pressed={wide} onClick={() => setWide((value) => !value)} className="rounded border border-white/30 px-3 py-2 text-sm">Wider context</button></div><canvas ref={canvas} aria-label={`Magnified candidate ${note.id + 1}`} className="mt-2 block h-auto max-h-80 max-w-full rounded bg-white" /><p className="mt-2 text-xs text-zinc-300">Original crop pixels, magnified for manual inspection. {outline ? 'Cyan marks the candidate head.' : 'Outline hidden: original source pixels only.'} Compare heads, stems, beams and the source legend. Nearby symbols can belong to separate voices. Suggested duration: {hint?.value ?? 'unknown'}. Magnification does not improve recognition confidence or modify notes.</p></section>
}
