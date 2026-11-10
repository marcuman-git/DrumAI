import { useEffect, useRef } from 'react'
import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
import { previewBounds } from './candidatePreviewBounds'
import type { CandidatePreviewSource } from './candidatePreviewBounds'
export function FocusedCandidatePreview({ note, source, hint }: { note: NoteCandidate; source: CandidatePreviewSource; hint?: NoteValueHint }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const target = canvas.current; if (!target) return
    const ctx = target.getContext('2d'); if (!ctx) return
    const bounds = previewBounds(note, source, hint)
    const raster = document.createElement('canvas'); raster.width = bounds.width; raster.height = bounds.height
    const original = raster.getContext('2d'); if (!original) return
    const image = original.createImageData(bounds.width, bounds.height)
    for (let row = 0; row < bounds.height; row++) {
      const start = ((bounds.top + row) * source.width + bounds.left) * 4
      image.data.set(source.pixels.subarray(start, start + bounds.width * 4), row * bounds.width * 4)
    }
    original.putImageData(image, 0, 0)
    target.width = Math.min(480, bounds.width * 4); target.height = Math.min(400, bounds.height * 4)
    ctx.imageSmoothingEnabled = false
    ctx.drawImage?.(raster, 0, 0, bounds.width, bounds.height, 0, 0, target.width, target.height)
    ctx.strokeStyle = '#0891b2'; ctx.lineWidth = 2
    ctx.strokeRect((note.x - 6 - bounds.left) / bounds.width * target.width, (bounds.y - 5 - bounds.top) / bounds.height * target.height, 12 / bounds.width * target.width, 10 / bounds.height * target.height)
  }, [note, source, hint])
  return <section aria-label="Focused symbol inspection" className="rounded border border-cyan-300/40 p-3"><h5 className="text-sm font-semibold">Inspect candidate #{note.id + 1}: {note.instrument}</h5><canvas ref={canvas} aria-label={`Magnified candidate ${note.id + 1}`} className="mt-2 block h-auto max-h-80 max-w-full rounded bg-white" /><p className="mt-2 text-xs text-zinc-300">Original crop pixels, magnified for manual inspection. Cyan marks the candidate head. Suggested duration: {hint?.value ?? 'unknown'}. Magnification does not improve recognition confidence or modify notes.</p></section>
}
