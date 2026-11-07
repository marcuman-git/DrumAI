import { describe, expect, it } from 'vitest'
import { selectRegion, usableRegion } from './pdfRegionLogic'
describe('PDF region coordinates', () => {
  it('normalizes reverse drags and clips outside-page positions', () => {
    expect(selectRegion({ x: 0.8, y: 0.9 }, { x: -1, y: 2 })).toEqual({ x: 0, y: 0.9, width: 0.8, height: 0.09999999999999998 })
    expect(usableRegion(selectRegion({ x: 0, y: 0 }, { x: 0.001, y: 0.001 }))).toBe(false)
    expect(usableRegion(selectRegion({ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.5 }))).toBe(true)
  })
})
