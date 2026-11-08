import { expect, it } from 'vitest'
import { inspectNoteValue } from './noteValueHints'
import type { NoteCandidate, RecognitionImage } from './notationRecognition'
function sample(beams = 0, direction = -1) {
  const width = 180; const height = 160; const ink = new Uint8Array(width * height)
  const x = 70; const y = 78; const stemX = direction === -1 ? 76 : 64; const end = y + direction * 36
  for (let dx = -6; dx <= 6; dx++) for (let dy = -4; dy <= 4; dy++) if ((dx/6)**2+(dy/4)**2<=1) ink[(y+dy)*width+x+dx]=1
  for(let row=Math.min(y,end);row<=Math.max(y,end);row++) ink[row*width+stemX]=1
  for(let beam=0;beam<beams;beam++) for(let dx=0;dx<=30;dx++) ink[(end-direction*beam*7)*width+stemX+dx]=1
  const note: NoteCandidate = { id: 0, x, y, instrument: 'Snare', shape: 'oval', strength: 1, stemHint: true, flagHint: !!beams }
  const image: RecognitionImage = { width, height, ink, angle: 0, staffs: [] }
  return { note, image }
}
it('distinguishes possible quarter, eighth and sixteenth on controlled stems/beams', () => {
  for(const [bands,value] of [[0,'quarter'],[1,'eighth'],[2,'sixteenth']] as const) {
    const {image,note}=sample(bands); const hint=inspectNoteValue(image,{top:60,gap:12},note)
    expect(hint.value).toBe(value); expect(hint.stemDirection).toBe('up'); expect(hint.width).toBeGreaterThan(12)
  }
})
it('inspects downward stems and marks isolated heads unknown', () => {
  const {image,note}=sample(1,1)
  expect(inspectNoteValue(image,{top:60,gap:12},note).stemDirection).toBe('down')
  image.ink.fill(0)
  expect(inspectNoteValue(image,{top:60,gap:12},note).value).toBe('unknown')
})
it('does not mislabel three beam bands as a supported sixteenth note', () => {
  const {image,note}=sample(3)
  expect(inspectNoteValue(image,{top:60,gap:12},note).value).toBe('unknown')
})
