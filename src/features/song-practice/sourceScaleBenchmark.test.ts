import { expect,it } from 'vitest'
import fixtures from './realSourceScaleFixtures'
import { benchmarkSourceScales } from './sourceScaleBenchmark'
it('compares labelled eighth values and plain crosses in fresh 108, 144 and 216 DPI PDF renders',()=>{
 const report=benchmarkSourceScales(fixtures)
 expect(report.map(result=>result.dpi)).toEqual([108,144,216])
 for(const result of report){expect(result.summary.durationsCorrect,JSON.stringify(result)).toBe(8);expect(result.summary.symbolsCorrect,JSON.stringify(result)).toBe(8);expect(result.cases.every(value=>value.reference.identity.includes('withheld'))).toBe(true)}
})
