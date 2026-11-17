import { expect,it } from 'vitest'
import fixtures from './realSourceScaleFixtures'
import { benchmarkSourceScales } from './sourceScaleBenchmark'
it('compares labelled eighth values and plain crosses in fresh 108, 144 and 216 DPI PDF renders',()=>{
 const report=benchmarkSourceScales(fixtures)
 expect(report.map(result=>result.dpi)).toEqual([108,144,216])
 for(const result of report){expect(result.summary.durationsCorrect,JSON.stringify(result)).toBe(8);expect(result.summary.symbolsCorrect,JSON.stringify(result)).toBe(8);expect(result.cases.every(value=>value.reference.identity.includes('withheld'))).toBe(true)}
})

import mixed from './realMixedDurationScaleFixtures'
it('reports mixed-duration labels and beam/flag evidence at three PDF rendering scales, including unresolved low-DPI cases',()=>{
 const report=benchmarkSourceScales(mixed)
 expect(report).toHaveLength(9)
 expect(report.reduce((n,r)=>n+r.summary.references,0)).toBe(36)
 for(const result of report.filter(r=>r.dpi>=144)){expect(result.summary.durationsCorrect,JSON.stringify(result)).toBe(result.summary.references);expect(result.summary.evidenceCorrect).toBe(result.summary.references)}
 expect(report.filter(r=>r.source.endsWith('isolated-flag')).every(r=>r.cases[0].evidence==='flag'&&r.cases[0].durationCorrect)).toBe(true)
 const low=report.filter(r=>r.dpi===108);expect(low.reduce((n,r)=>n+r.summary.durationsCorrect,0)).toBe(8);expect(low.flatMap(r=>r.cases).filter(c=>!c.durationCorrect)).toHaveLength(4)
 expect(new Set(report.flatMap(r=>r.cases.map(c=>c.reference.value)))).toEqual(new Set(['quarter','eighth','sixteenth']))
})
