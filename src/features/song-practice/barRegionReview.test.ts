import { expect, it } from 'vitest'
import { reviewBarRegion } from './barRegionReview'
import type { NoteCandidate } from './notationRecognition'
function region() { const width = 200; const ink = new Uint8Array(width * 100); for (const x of [60, 130]) for (let y = 30; y <= 70; y++) ink[y * width + x] = 1; return { width, height: 100, ink, angle: 0, staffs: [{ top: 30, gap: 10 }] } }
it('discounts a full-height note stem but retains an independent boundary', () => {
 const note: NoteCandidate = { id: 0, x: 64, y: 65, instrument: 'Kick', shape: 'oval', strength: 1, stemHint: true, flagHint: false }
 const result = reviewBarRegion(region(), { top: 30, gap: 10 }, [note], 10, 190)
 expect(result.discountedStems).toBe(1)
 expect(result.probableBoundaries).toEqual([130])
})
it('keeps multiple-staff warnings without silently considering them a single bar', () => {
 const image = region(); image.staffs.push({ top: 75, gap: 5 })
 expect(reviewBarRegion(image, image.staffs[0], [], 10, 190).multipleStaffs).toBe(true)
})
