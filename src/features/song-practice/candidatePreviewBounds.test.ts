import { expect, it } from 'vitest'
import { previewBounds } from './candidatePreviewBounds'
import type { NoteCandidate } from './notationRecognition'
const note: NoteCandidate = { id: 0, x: 1, y: 1, instrument: 'Snare', shape: 'oval', strength: 1, stemHint: false, flagHint: false }
it('clips the magnified region at source edges and accounts for skew', () => {
  const source = { width: 200, height: 100, angle: 0 }
  const bounds = previewBounds(note, source)
  expect(bounds.left).toBe(0); expect(bounds.top).toBe(0)
  expect(bounds.width).toBeGreaterThan(0); expect(bounds.height).toBeGreaterThan(0)
  const right = previewBounds({ ...note, x: 199, y: 99 }, source)
  expect(right.left + right.width).toBeLessThanOrEqual(200)
  expect(right.top + right.height).toBeLessThanOrEqual(100)
  expect(previewBounds({ ...note, x: 150, y: 50 }, { ...source, angle: 2 }).y).toBeGreaterThan(50)
})
