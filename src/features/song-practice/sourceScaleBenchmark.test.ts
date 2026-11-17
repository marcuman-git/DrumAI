import { expect,it } from 'vitest'
import fixtures from './realSourceScaleFixtures'
import { benchmarkSourceScales } from './sourceScaleBenchmark'
it('compares labelled eighth values and plain crosses in fresh 108, 144 and 216 DPI PDF renders',()=>{
 const report=benchmarkSourceScales(fixtures)
 expect(report.map(result=>result.dpi)).toEqual([108,144,216])
 for(const result of report){expect(result.summary.durationsCorrect,JSON.stringify(result)).toBe(8);expect(result.summary.symbolsCorrect,JSON.stringify(result)).toBe(8);expect(result.cases.every(value=>value.reference.identity.includes('withheld'))).toBe(true)}
})

import mixed from './realMixedDurationScaleFixtures'
it('reports mixed-duration labels and beam/flag evidence at three PDF rendering scales, including thin-stem and short-beam recovery at low DPI',()=>{
 const report=benchmarkSourceScales(mixed)
 expect(report).toHaveLength(9)
 expect(report.reduce((n,r)=>n+r.summary.references,0)).toBe(36)
 for(const result of report){expect(result.summary.durationsCorrect,JSON.stringify(result)).toBe(result.summary.references);expect(result.summary.evidenceCorrect).toBe(result.summary.references)}
 expect(report.filter(r=>r.source.endsWith('isolated-flag')).every(r=>r.cases[0].evidence==='flag'&&r.cases[0].durationCorrect)).toBe(true)
 const low=report.filter(r=>r.dpi===108);expect(low.reduce((n,r)=>n+r.summary.durationsCorrect,0)).toBe(12);expect(low.flatMap(r=>r.cases).filter(c=>!c.durationCorrect)).toHaveLength(0)
 expect(new Set(report.flatMap(r=>r.cases.map(c=>c.reference.value)))).toEqual(new Set(['quarter','eighth','sixteenth']))
})

import {analyzeStaffs} from './notationRecognition'
import {inspectNoteValue} from './noteValueHints'
it('retains faint pixels through real recognition preprocessing while keeping strict threshold ink separate',()=>{
 for(const f of mixed.filter(f=>f.dpi===108)){const data=new Uint8ClampedArray(f.width*f.height*4).fill(255);for(const index of f.stemInk){for(let c=0;c<3;c++)data[index*4+c]=185}for(const index of f.ink){for(let c=0;c<3;c++)data[index*4+c]=0}
 const image=analyzeStaffs(data,f.width,f.height,160,0);expect([...image.ink].reduce((n,v)=>n+v,0)).toBe(f.ink.length)
 for(const [id,note] of f.cases.entries())expect(inspectNoteValue(image,f.staff,{...note,id,instrument:note.shape==='oval'?'Snare':'Hi-hat',strength:1,stemHint:true,flagHint:false}).value).toBe(note.value)
 }
})
