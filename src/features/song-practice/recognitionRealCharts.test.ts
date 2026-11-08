import samples from './recognitionChartFixtures'
import { expect, it } from 'vitest'
import screenshot from './recognitionScreenshotFixture'
import { analyzeStaffs, findNoteCandidates } from './notationRecognition'
import type { NoteCandidate, StaffCandidate } from './notationRecognition'
interface Fixture { title: string; width: number; height: number; ink: number[]; staff: StaffCandidate; expectedCandidates: NoteCandidate[] }
// Frozen output regressions from local thresholded PDF crops, NOT annotated musical truth.
const fixtures = samples as Fixture[]
for (const fixture of fixtures) it(`keeps real-chart candidate output stable: ${fixture.title}`, () => {
  const pixels = new Uint8ClampedArray(fixture.width * fixture.height * 4).fill(255)
  for (const index of fixture.ink) pixels[index * 4] = pixels[index * 4 + 1] = pixels[index * 4 + 2] = 0
  const image = analyzeStaffs(pixels, fixture.width, fixture.height)
  expect(image.staffs[0]).toEqual(fixture.staff)
  const notes = findNoteCandidates(image, image.staffs[0])
  for (const previous of fixture.expectedCandidates) expect(notes.some((note) => note.x === previous.x && note.y === previous.y && note.shape === previous.shape && note.instrument === previous.instrument)).toBe(true)
})
it('finds the six manually checked filled heads in the screenshot bar, including below-staff kicks', () => {
  const pixels = new Uint8ClampedArray(screenshot.width * screenshot.height * 4).fill(255)
  for (const index of screenshot.ink) pixels[index * 4] = pixels[index * 4 + 1] = pixels[index * 4 + 2] = 0
  const image = analyzeStaffs(pixels, screenshot.width, screenshot.height)
  expect(image.staffs.length).toBeGreaterThan(0)
  const notes = findNoteCandidates(image, image.staffs[0])
  for (const head of screenshot.heads) expect(notes.some((note) => note.shape === 'oval' && note.instrument === head.instrument && Math.abs(note.x - head.x) <= 8 && Math.abs(note.y - head.y) <= 7)).toBe(true)
})
