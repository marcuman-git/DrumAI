import { expect, it } from 'vitest'
import { analyzeStaffs, findNoteCandidates } from './notationRecognition'
import { cymbalPositionFixture } from './cymbalPositionBenchmark'
for (const scale of [1, 2]) for (const skew of [0, 2, -2]) for (const hatOffset of [-0.5, -0.25]) {
 it(`distinguishes cymbals: scale ${scale}, skew ${skew}, hat offset ${hatOffset}`, () => {
  const source = cymbalPositionFixture(scale, skew, hatOffset)
  const image = analyzeStaffs(source.pixels, source.width, source.height)
  const notes = findNoteCandidates(image, image.staffs[0], 'master-key', { cleanHeads: true, tolerance: Math.min(4, 2 * scale) })
  for (const head of source.heads) {
   const nearby = notes.filter(note => Math.abs(note.x - head.x) <= 4 * scale && Math.abs(note.y - head.y) <= 4 * scale)
   expect(nearby.some(note => note.instrument === head.instrument), JSON.stringify({ head, nearby })).toBe(true)
   if (head.instrument === 'Hi-hat') expect(nearby.some(note => note.instrument === 'Ride')).toBe(false)
  }
 })
}
