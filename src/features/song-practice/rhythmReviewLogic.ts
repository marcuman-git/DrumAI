import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'

export function reviewRhythm(notes: NoteCandidate[], hints: Record<string, NoteValueHint>, first: number, last: number, slotCount = 16) {
  const slots = new Set<number>()
  const endings = new Map<string, number>()
  let unknown = 0; let outside = 0; let conflicts = 0; let overflow = 0
  for (const note of [...notes].sort((a, b) => a.x - b.x)) {
    if (!Number.isFinite(first) || !Number.isFinite(last) || last <= first || note.x < first || note.x > last) { outside++; continue }
    const slot = Math.round((note.x - first) / (last - first) * (slotCount - 1))
    slots.add(slot)
    const value = hints[note.id]?.value
    const duration = value === 'quarter' ? 4 : value === 'eighth' ? 2 : value === 'sixteenth' ? 1 : 0
    if (!duration) { unknown++; continue }
    if ((endings.get(note.instrument) ?? 0) > slot) conflicts++
    endings.set(note.instrument, Math.max(endings.get(note.instrument) ?? 0, slot + duration))
    if (slot + duration > slotCount) overflow++
  }
  return { unknown, outside, conflicts, overflow, empty: slotCount - slots.size }
}

