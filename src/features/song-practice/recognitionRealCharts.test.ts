import samples from './recognitionChartFixtures'
import { expect, it } from 'vitest'
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
  expect(findNoteCandidates(image, image.staffs[0])).toEqual(fixture.expectedCandidates)
})
