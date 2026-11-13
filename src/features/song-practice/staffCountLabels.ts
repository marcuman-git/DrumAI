export type StaffCountMode = 'quarter' | 'eighth' | 'sixteenth'
/** Display only: chart timing and reviewed note durations are not changed. */
export function staffCountLabel(step: number, mode: StaffCountMode): string {
 if (!Number.isInteger(step) || step < 0 || step > 15) return ''
 if (step % 4 === 0) return String(Math.floor(step / 4) + 1)
 if (mode === 'quarter') return ''
 if (mode === 'eighth') return step % 2 === 0 ? '&' : ''
 return ['e', '&', 'a'][step % 4 - 1]
}
