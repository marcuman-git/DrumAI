import type { NoteCandidate } from './notationRecognition'
export interface ReferenceHead { x: number; y: number; instrument?: string; shape?: NoteCandidate['shape'] }
/** One-to-one matching prevents duplicate suggestions from inflating recovered heads.
 * Unmatched suggestions are not proven false unless references exhaustively label the crop.
 */
export function benchmarkHeads(notes: readonly NoteCandidate[], references: readonly ReferenceHead[], toleranceX = 4, toleranceY = 3) {
  if (!Number.isFinite(toleranceX) || !Number.isFinite(toleranceY) || toleranceX < 0 || toleranceY < 0) throw new Error('Invalid benchmark tolerance')
  const edges = references.map((reference) => notes.map((note, index) => ({ note, index }))
    .filter(({ note }) => Math.abs(note.x - reference.x) <= toleranceX && Math.abs(note.y - reference.y) <= toleranceY && (!reference.instrument || note.instrument === reference.instrument) && (!reference.shape || note.shape === reference.shape))
    .sort((a, b) => Math.hypot(a.note.x - reference.x, a.note.y - reference.y) - Math.hypot(b.note.x - reference.x, b.note.y - reference.y)).map(({ index }) => index))
  const owner = new Map<number, number>()
  function match(reference: number, seen: Set<number>): boolean {
    for (const note of edges[reference]) {
      if (seen.has(note)) continue
      seen.add(note)
      const previous = owner.get(note)
      if (previous === undefined || match(previous, seen)) { owner.set(note, reference); return true }
    }
    return false
  }
  for (let reference = 0; reference < references.length; reference++) match(reference, new Set())
  const matched = new Set(owner.values())
  return { referenceHeads: references.length, recovered: matched.size, missed: references.flatMap((head, index) => matched.has(index) ? [] : [head]), unmatchedCandidates: notes.filter((_, index) => !owner.has(index)), recoveryPercent: references.length ? Math.round(matched.size / references.length * 100) : null }
}
