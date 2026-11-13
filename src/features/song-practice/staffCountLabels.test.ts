import { expect, it } from 'vitest'
import { staffCountLabel } from './staffCountLabels'
it('changes count-label density without changing the sixteen-slot bar', () => {
 const labels = (mode: 'quarter' | 'eighth' | 'sixteenth') => Array.from({ length: 16 }, (_, step) => staffCountLabel(step, mode)).filter(Boolean)
 expect(labels('quarter')).toEqual(['1', '2', '3', '4'])
 expect(labels('eighth')).toEqual(['1', '&', '2', '&', '3', '&', '4', '&'])
 expect(labels('sixteenth').slice(0, 4)).toEqual(['1', 'e', '&', 'a'])
 expect(staffCountLabel(16, 'quarter')).toBe('')
})
