import { REAL_RHYTHM_REFERENCES } from './realRhythmReferences'
import { expect,it } from 'vitest'
import key from './realCymbalKeyFixture'
import score from './realCymbalScoreFixture'
import feedback from './feedback012Fixture'
import {findNoteCandidates} from './notationRecognition'
import {benchmarkHeads} from './recognitionBenchmark'
import {inspectNoteValue} from './noteValueHints'
const imageFor=(f: {width:number;height:number;ink:number[]})=>{const ink=new Uint8Array(f.width*f.height);for(const index of f.ink)ink[index]=1;return {width:f.width,height:f.height,ink,angle:0,staffs:[]}}
for(const f of [key,score])it(`recovers manually labelled cymbal identities: ${f.source}`,()=>{
 const image=imageFor(f);const notes=findNoteCandidates(image,f.staff,'master-key',{cleanHeads:true,tolerance:2})
 const result=benchmarkHeads(notes,f.heads,5,5)
 expect(result.missed).toEqual([])
 for(const head of f.heads.filter(h=>h.instrument==='Ride'))expect(notes.filter(n=>Math.abs(n.x-head.x)<=5).some(n=>n.instrument==='Hi-hat')).toBe(false)
})
it('counts nine double-beam source notes and rejects the dotted note as unsupported',()=>{
 const image=imageFor(feedback);const notes=findNoteCandidates(image,feedback.staff,'master-key',{cleanHeads:true,tolerance:2,kick:4.5})
 for(const head of REAL_RHYTHM_REFERENCES) {
  const note=notes.find(n=>n.instrument===head.instrument&&Math.abs(n.x-head.x)<=4&&Math.abs(n.y-head.y)<=3)
  expect(note).toBeDefined()
  const hint=inspectNoteValue(image,feedback.staff,note!)
  expect(hint.value,JSON.stringify({head,hint})).toBe(head.value)
  if(head.x===67)expect(hint.possibleDot).toBe(true)
 }
})
it('checks another original score bar with ledger heads and dotted/beamed/quarter durations',async()=>{
 const {default:f}=await import('./realSecondBarFixture')
 const image=imageFor(f);const notes=findNoteCandidates(image,f.staff,'master-key',{cleanHeads:true,tolerance:2,kick:4.5})
 expect(benchmarkHeads(notes,f.heads,5,5).missed).toEqual([])
 for(const reference of f.durations) {
  const note=notes.find(n=>n.instrument===reference.instrument&&Math.abs(n.x-reference.x)<=6&&Math.abs(n.y-reference.y)<=4)
  expect(note,JSON.stringify({reference,notes:notes.filter(n=>n.shape==='oval')})).toBeDefined()
  expect(inspectNoteValue(image,f.staff,note!).value).toBe(reference.value)
 }
})
it('validates a fourth original score bar with two Crash heads and three duration cases',async()=>{
 const {default:f}=await import('./realFourthBarFixture')
 const image=imageFor(f);const notes=findNoteCandidates(image,f.staff,'master-key',{cleanHeads:true,tolerance:2,kick:4.5})
 expect(benchmarkHeads(notes,f.heads,5,5).missed).toEqual([])
 for(const reference of f.durations){const note=notes.find(n=>n.instrument===reference.instrument&&Math.abs(n.x-reference.x)<=6&&Math.abs(n.y-reference.y)<=4);expect(note).toBeDefined();expect(inspectNoteValue(image,f.staff,note!).value).toBe(reference.value)}
})
