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
it('does not count the five staff lines as beams and clips context at image edges', () => {
  const {image,note}=sample()
  for(let line=0;line<5;line++)for(let x=0;x<image.width;x++)image.ink[(60+line*12)*image.width+x]=1
  expect(inspectNoteValue(image,{top:60,gap:12},note).value).toBe('quarter')
  const edge=inspectNoteValue(image,{top:60,gap:12},{...note,x:4,y:4})
  expect(edge.left).toBe(0); expect(edge.top).toBeGreaterThanOrEqual(0)
})
it('finds a short isolated flag that does not span the long beam window', () => {
  const { image, note } = sample()
  for (let y = 44; y <= 47; y++) for (let x = 79; x <= 84; x++) image.ink[y * image.width + x] = 1
  expect(inspectNoteValue(image, { top: 60, gap: 12 }, note).value).toBe('eighth')
})
it('marks possible dotted notes unknown instead of straight quarter notes', () => {
 const { image, note } = sample()
 for (const y of [78, 79]) for (const x of [83, 84]) image.ink[y * image.width + x] = 1
 const hint = inspectNoteValue(image, { top: 60, gap: 12 }, note)
 expect(hint.possibleDot).toBe(true)
 expect(hint.value).toBe('unknown')
})
it('counts sloped double beams in either stem direction without splitting thick bands', () => {
 for (const direction of [-1,1]) for(const slope of [-0.3,0.3]) {
  const {image,note}=sample(0,direction);const stemX=direction===-1?76:64;const end=note.y+direction*36
  for(let beam=0;beam<2;beam++)for(let dx=0;dx<=30;dx++)for(let thickness=0;thickness<2;thickness++) {
   const row=Math.round(end-direction*beam*7+slope*dx)+thickness
   image.ink[row*image.width+stemX+dx]=1
  }
  const hint=inspectNoteValue(image,{top:60,gap:12},note)
  expect(hint.value).toBe('sixteenth');expect(hint.evidence).toBe('beam');expect(hint.beamBands).toBe(2)
 }
})
it('separates two short flags for upward and downward stems', () => {
 for(const direction of [-1,1]) {
  const {image,note}=sample(0,direction);const stemX=direction===-1?76:64;const end=note.y+direction*36
  for(const offset of [2,10])for(let dy=0;dy<4;dy++)for(let dx=3;dx<=8;dx++)image.ink[(end-direction*(offset+dy))*image.width+stemX+dx]=1
  const hint=inspectNoteValue(image,{top:60,gap:12},note)
  expect(hint.value).toBe('sixteenth');expect(hint.flagBands).toBe(2);expect(hint.evidence).toBe('flag')
 }
})
it('returns unknown for a stem clipped at the edge rather than inferring a quarter', () => {
 const {image,note}=sample(0);image.ink.fill(0);note.y=42;for(let y=0;y<=note.y;y++)image.ink[y*image.width+76]=1
 const hint=inspectNoteValue(image,{top:60,gap:12},note)
 expect(hint.clippedStem).toBe(true);expect(hint.value).toBe('unknown')
})
it('finds a larger isolated dot without treating staff ink as a dot', () => {
 const {image,note}=sample(0)
 for(let y=76;y<=80;y++)for(let x=82;x<=85;x++)image.ink[y*image.width+x]=1
 expect(inspectNoteValue(image,{top:60,gap:12},note).value).toBe('unknown')
})
