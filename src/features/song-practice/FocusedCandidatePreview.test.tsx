import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { FocusedCandidatePreview } from './FocusedCandidatePreview'
import { previewBounds } from './candidatePreviewBounds'
import type { NoteCandidate } from './notationRecognition'
const note: NoteCandidate = { id: 0, x: 100, y: 60, instrument: 'Snare', shape: 'oval', strength: 1, stemHint: true, flagHint: false }
afterEach(() => { cleanup(); vi.restoreAllMocks() })
it('toggles a clean source view without changing source pixels or note data', () => {
 const strokeRect = vi.fn(); const drawImage = vi.fn()
 vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData: vi.fn(), drawImage, strokeRect } as unknown as CanvasRenderingContext2D)
 const pixels = new Uint8ClampedArray(200 * 140 * 4).fill(255)
 render(<FocusedCandidatePreview note={note} source={{ pixels, width: 200, height: 140, angle: 0 }} />)
 expect(strokeRect).toHaveBeenCalledTimes(1)
 fireEvent.click(screen.getByRole('button', { name: 'Clean source view' }))
 expect(strokeRect).toHaveBeenCalledTimes(1)
 expect(screen.getByRole('button', { name: 'Clean source view' })).toHaveAttribute('aria-pressed', 'true')
 expect(screen.getByText(/Outline hidden/)).toBeVisible()
 fireEvent.click(screen.getByRole('button', { name: 'Wider context' }))
 expect(screen.getByRole('button', { name: 'Wider context' })).toHaveAttribute('aria-pressed', 'true')
 expect(pixels.every((value) => value === 255)).toBe(true)
 expect(note.instrument).toBe('Snare')
 expect(drawImage).toHaveBeenCalledTimes(3)
})
it('preserves source aspect ratio for wide stem/beam regions', () => {
 vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ createImageData: (w: number, h: number) => ({ data: new Uint8ClampedArray(w * h * 4) }), putImageData: vi.fn(), drawImage: vi.fn(), strokeRect: vi.fn() } as unknown as CanvasRenderingContext2D)
 const source = { pixels: new Uint8ClampedArray(500 * 200 * 4), width: 500, height: 200, angle: 0 }
 const hint = { value: 'quarter' as const, stemDirection: 'up' as const, beamBands: 0, left: 0, top: 40, width: 400, height: 40 }
 render(<FocusedCandidatePreview note={note} source={source} hint={hint} />)
 const canvas = screen.getByLabelText('Magnified candidate 1') as HTMLCanvasElement
 const bounds = previewBounds(note, source, hint)
 expect(Math.abs(canvas.width / canvas.height - bounds.width / bounds.height)).toBeLessThan(0.05)
})
it('expands context while keeping an edge crop inside original pixels', () => {
 const source = { width: 200, height: 140, angle: 2 }
 const normal = previewBounds(note, source)
 const wide = previewBounds(note, source, undefined, 2)
 expect(wide.width).toBeGreaterThan(normal.width)
 expect(wide.height).toBeGreaterThan(normal.height)
 const edge = previewBounds({ ...note, x: 1, y: 1 }, source, undefined, 2)
 expect(edge.left).toBe(0); expect(edge.top).toBe(0)
 expect(edge.left + edge.width).toBeLessThanOrEqual(source.width)
 expect(edge.top + edge.height).toBeLessThanOrEqual(source.height)
})
