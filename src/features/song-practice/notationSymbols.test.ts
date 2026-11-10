import { expect, it } from 'vitest'
import { hasOpenHatRing, percussionClefHint } from './notationSymbols'
import type { RecognitionImage } from './notationRecognition'
const image = (): RecognitionImage => ({ width: 240, height: 140, angle: 0, staffs: [], ink: new Uint8Array(33600) })
it('hints a two-bar percussion clef near the beginning, but not long note stems', () => {
  const sample = image(); const staff = { top: 40, gap: 10 }
  for (const x of [12, 17]) for (let y = 50; y <= 70; y++) sample.ink[y * 240 + x] = 1
  expect(percussionClefHint(sample, staff)).toEqual({ left: 10, right: 19 })
  for (const x of [12, 17]) for (let y = 42; y <= 80; y++) sample.ink[y * 240 + x] = 1
  expect(percussionClefHint(sample, staff)).toBeNull()
})
it('distinguishes a hollow open-circle hint from a filled marker', () => {
  const sample = image(); const staff = { top: 40, gap: 10 }; const x = 100; const y = 45; const center = 31
  for (let step = 0; step < 24; step++) { const angle = step / 24 * Math.PI * 2; sample.ink[Math.round(center + Math.sin(angle) * 4) * 240 + Math.round(x + Math.cos(angle) * 4)] = 1 }
  expect(hasOpenHatRing(sample, staff, x, y)).toBe(true)
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) sample.ink[(center + dy) * 240 + x + dx] = 1
  expect(hasOpenHatRing(sample, staff, x, y)).toBe(false)
})
