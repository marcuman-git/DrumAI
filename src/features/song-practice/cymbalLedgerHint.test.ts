import { expect, it } from 'vitest'
import { hasIsolatedCymbalLedger } from './cymbalLedgerHint'
function sample() { return { width: 140, height: 130, ink: new Uint8Array(140 * 130), angle: 0, staffs: [] } }
it('finds an isolated above-staff ledger without assigning an instrument', () => {
 const image = sample()
 for (let x = 48; x <= 72; x++) image.ink[42 * 140 + x] = 1
 expect(hasIsolatedCymbalLedger(image, { top: 60, gap: 12 }, 60, 42)).toBe(true)
})
it('rejects extended beams and staff-level lines as ledger evidence', () => {
 const image = sample()
 for (let x = 20; x <= 100; x++) image.ink[42 * 140 + x] = 1
 expect(hasIsolatedCymbalLedger(image, { top: 60, gap: 12 }, 60, 42)).toBe(false)
 expect(hasIsolatedCymbalLedger(image, { top: 40, gap: 12 }, 60, 42)).toBe(false)
 expect(hasIsolatedCymbalLedger(sample(), { top: 60, gap: 12 }, 60, 42)).toBe(false)
})
