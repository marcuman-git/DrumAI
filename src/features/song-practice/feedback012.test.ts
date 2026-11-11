import { expect, it } from 'vitest'
import sample from './feedback012Fixture'
import { findNoteCandidates } from './notationRecognition'
it('retains the checked floor-tom fill and below-staff kick from the actual feedback bar', () => {
  const ink = new Uint8Array(sample.width * sample.height); for (const index of sample.ink) ink[index] = 1
  const notes = findNoteCandidates({ width: sample.width, height: sample.height, ink, angle: 0, staffs: [] }, sample.staff, 'master-key', { cleanHeads: true, tolerance: 2, kick: 4.5, snare: 1.5 })
  for (const head of sample.heads) expect(notes.some((note) => note.instrument === head.instrument && Math.abs(note.x - head.x) <= 4 && Math.abs(note.y - head.y) <= 3), JSON.stringify(head)).toBe(true)
})
it('reduces extra candidates on the feedback bar while retaining checked filled heads', () => {
  const ink = new Uint8Array(sample.width * sample.height); for (const index of sample.ink) ink[index] = 1
  const image = { width: sample.width, height: sample.height, ink, angle: 0, staffs: [] }
  const before = findNoteCandidates(image, sample.staff, 'master-key', { tolerance: 2, kick: 4.5, snare: 1.5 })
  const after = findNoteCandidates(image, sample.staff, 'master-key', { cleanHeads: true, tolerance: 2, kick: 4.5, snare: 1.5 })
  expect(after.length).toBeLessThan(before.length)
  expect(after.length).toBeLessThanOrEqual(25)
})
it('retains the two source cymbal crosses during beam filtering', () => {
 const ink = new Uint8Array(sample.width * sample.height); for (const index of sample.ink) ink[index] = 1
 const image = { width: sample.width, height: sample.height, ink, angle: 0, staffs: [] }
 const notes = findNoteCandidates(image, sample.staff, 'master-key', { cleanHeads: true, tolerance: 2, kick: 4.5, snare: 1.5 })
 for (const [x, y] of [[21, 54], [67, 44]]) expect(notes.some((note) => note.shape === 'cross' && Math.abs(note.x - x) <= 4 && Math.abs(note.y - y) <= 3)).toBe(true)
})
