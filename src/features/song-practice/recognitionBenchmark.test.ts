import { expect, it } from 'vitest'
import { benchmarkHeads } from './recognitionBenchmark'
import { findNoteCandidates } from './notationRecognition'
import fixture from './feedback012Fixture'
import type { NoteCandidate } from './notationRecognition'
const head: NoteCandidate = { id: 0, x: 20, y: 30, instrument: 'Snare', shape: 'oval', strength: 1, stemHint: true, flagHint: false }
it('does not count duplicate candidates twice', () => {
 const result = benchmarkHeads([head, { ...head, id: 1 }], [{ x: 20, y: 30, instrument: 'Snare' }])
 expect(result.recovered).toBe(1); expect(result.unmatchedCandidates).toHaveLength(1)
})
it('finds maximum one-to-one recovery instead of greedy storage-order matching', () => {
 const result = benchmarkHeads([head, { ...head, id: 1, x: 25 }], [{ x: 22, y: 30 }, { x: 18, y: 30 }], 3, 3)
 expect(result.recovered).toBe(2)
})
it('reports misses, wrong mappings and empty reference sets honestly', () => {
 expect(benchmarkHeads([head], [{ x: 20, y: 30, instrument: 'Kick' }]).missed).toHaveLength(1)
 expect(benchmarkHeads([], []).recoveryPercent).toBeNull()
 expect(() => benchmarkHeads([], [], -1)).toThrow()
})
it('benchmarks checked real source heads without asserting full notation accuracy', () => {
 const ink = new Uint8Array(fixture.width * fixture.height); for (const index of fixture.ink) ink[index] = 1
 const notes = findNoteCandidates({ width: fixture.width, height: fixture.height, ink, angle: 0, staffs: [] }, fixture.staff, 'master-key', { cleanHeads: true, tolerance: 2, kick: 4.5, snare: 1.5 })
 const result = benchmarkHeads(notes, [...fixture.heads, { x: 21, y: 54, shape: 'cross' }, { x: 67, y: 44, shape: 'cross' }])
 expect(result.recovered).toBe(13); expect(result.missed).toEqual([])
 expect(result.unmatchedCandidates.length).toBeGreaterThan(0)
})
