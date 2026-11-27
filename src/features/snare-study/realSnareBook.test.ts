import {expect,it} from 'vitest'
import fixtures from './realSnareBookFixtures'
import {inspectNoteValue} from '../song-practice/noteValueHints'
import {durationEvidenceChoices} from '../song-practice/durationEvidenceChoices'
it('checks known-coordinate book heads at three scales and leaves three-beam thirty-seconds for explicit review',()=>{
 const rows=fixtures.map(f=>{const ink=new Uint8Array(f.width*f.height),stemInk=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1;for(const i of f.stemInk)stemInk[i]=1;return f.cases.map((r,id)=>({expected:r.value,hint:inspectNoteValue({width:f.width,height:f.height,ink,stemInk,angle:0,staffs:[f.staff]},f.staff,{id,x:r.x,y:r.y,shape:'oval',instrument:'Snare',strength:1,stemHint:true,flagHint:false})}))})
 expect(rows.map(row=>row.filter(c=>c.expected==='quarter'&&c.hint.value==='quarter').length)).toEqual([4,2,4])
 for(const row of rows){const short=row.find(c=>c.expected==='thirty-second')!;expect(short.hint.value).toBe('unknown');expect(short.hint.beamBands).toBe(3);expect(durationEvidenceChoices(short.hint).map(c=>c.value)).toContain(.5)}
})
