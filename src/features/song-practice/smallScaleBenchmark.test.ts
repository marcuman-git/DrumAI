import {expect,it} from 'vitest'
import fixtures from './realSmallScaleFixtures'
import {benchmarkSourceScales} from './sourceScaleBenchmark'
it('measures smaller PDF renders including dense lower-voice shared stems',()=>{const report=benchmarkSourceScales(fixtures);expect(report.reduce((n,r)=>n+r.summary.references,0)).toBe(48);expect(report.reduce((n,r)=>n+r.summary.durationsCorrect,0)).toBe(48);for(const r of report){expect(r.summary.durationsCorrect).toBe(r.summary.references);expect(r.summary.evidenceCorrect).toBe(r.summary.references)}})
