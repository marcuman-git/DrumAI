import { expect,it } from 'vitest'
import source from './realHighwaySourceFixture'
import { inspectNoteValue } from './noteValueHints'
import { hasCircledCymbalHead } from './circledCymbalHint'
import type { NoteCandidate } from './notationRecognition'
it('checks eight visually labelled single-beam values from a separate supplied song PDF',()=>{
 const ink=new Uint8Array(source.width*source.height);for(const i of source.ink)ink[i]=1
 const image={width:source.width,height:source.height,ink,angle:0,staffs:[source.staff]}
 for(const reference of source.cases){const note={...reference,id:0,instrument:'Hi-hat',strength:1,stemHint:true,flagHint:false} as NoteCandidate;const hint=inspectNoteValue(image,source.staff,note);expect(hint.value,JSON.stringify({reference,hint})).toBe(reference.value);expect(hasCircledCymbalHead(image,source.staff,reference.x,reference.y)).toBe(false);expect(reference.identity).toContain('withheld')}
})
