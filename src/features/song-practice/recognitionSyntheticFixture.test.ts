import { expect, it } from 'vitest'
import { syntheticRecognitionBar } from './recognitionSyntheticFixture'
import { analyzeStaffs, findNoteCandidates } from './notationRecognition'
import { benchmarkHeads } from './recognitionBenchmark'
for (const [scale, skew] of [[1, 0], [2, 0], [1, 2], [2, -2]]) it(`benchmarks labelled controlled heads at scale ${scale}, skew ${skew}`, () => {
 const fixture = syntheticRecognitionBar(scale, skew)
 const image = analyzeStaffs(fixture.pixels, fixture.width, fixture.height)
 expect(image.staffs).toHaveLength(1)
 const notes = findNoteCandidates(image, image.staffs[0], 'master-key', { cleanHeads: true, tolerance: 2, kick: 4.5 })
 const result = benchmarkHeads(notes, fixture.heads, 4 * scale, 3 * scale)
 expect(result.missed).toEqual([])
 expect(result.recovered).toBe(4)
})
