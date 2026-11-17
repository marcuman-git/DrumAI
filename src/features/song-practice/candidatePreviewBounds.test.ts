import { expect, it } from 'vitest'
import { previewBounds } from './candidatePreviewBounds'
import type { NoteCandidate } from './notationRecognition'
const note: NoteCandidate = { id: 0, x: 1, y: 1, instrument: 'Snare', shape: 'oval', strength: 1, stemHint: false, flagHint: false }
it('clips the magnified region at source edges and accounts for skew', () => {
  const source = { width: 200, height: 100, angle: 0 }
  const bounds = previewBounds(note, source)
  expect(bounds.left).toBe(0); expect(bounds.top).toBe(0)
  expect(bounds.width).toBeGreaterThan(0); expect(bounds.height).toBeGreaterThan(0)
  const right = previewBounds({ ...note, x: 199, y: 99 }, source)
  expect(right.left + right.width).toBeLessThanOrEqual(200)
  expect(right.top + right.height).toBeLessThanOrEqual(100)
  expect(previewBounds({ ...note, x: 150, y: 50 }, { ...source, angle: 2 }).y).toBeGreaterThan(50)
})
it('contains all skew-projected corners of a wide hint window in both directions', async()=>{
 const {sourcePoint}=await import('./candidatePreviewBounds')
 const hint={value:'eighth' as const,stemDirection:'up' as const,beamBands:1,left:20,top:80,width:350,height:60}
 for(const angle of [-5,5]) {
  const source={width:500,height:300,angle}
  const bounds=previewBounds({...note,x:200,y:120},source,hint)
  for(const x of [20,370])for(const y of [80,140]) {
   const point=sourcePoint(x,y,source)
   expect(point.x).toBeGreaterThanOrEqual(bounds.left);expect(point.x).toBeLessThanOrEqual(bounds.left+bounds.width)
   expect(point.y).toBeGreaterThanOrEqual(bounds.top);expect(point.y).toBeLessThanOrEqual(bounds.top+bounds.height)
  }
  const beam=previewBounds({...note,x:200,y:120},{...source,staff:{top:80,gap:20}},hint,3)
  expect(beam.width).toBeGreaterThan(bounds.width)
 }
})
