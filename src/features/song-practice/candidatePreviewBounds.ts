import type { NoteCandidate } from './notationRecognition'
import type { NoteValueHint } from './noteValueHints'
export interface CandidatePreviewSource { pixels: Uint8ClampedArray; width: number; height: number; angle: number }
export function previewBounds(note: NoteCandidate, source: Pick<CandidatePreviewSource, 'width' | 'height' | 'angle'>, hint?: NoteValueHint) {
  const y = note.y + Math.tan(source.angle * Math.PI / 180) * (note.x - source.width / 2)
  const left = Math.max(0, Math.min(source.width - 1, Math.floor(Math.min(note.x - 24, hint?.left ?? note.x - 24))))
  const top = Math.max(0, Math.min(source.height - 1, Math.floor(Math.min(y - 40, hint ? hint.top + y - note.y : y - 40))))
  const right = Math.min(source.width, Math.max(left + 1, Math.ceil(Math.max(note.x + 24, hint ? hint.left + hint.width : note.x + 24))))
  const bottom = Math.min(source.height, Math.max(top + 1, Math.ceil(Math.max(y + 30, hint ? hint.top + hint.height + y - note.y : y + 30))))
  return { left, top, width: right - left, height: bottom - top, y }
}
