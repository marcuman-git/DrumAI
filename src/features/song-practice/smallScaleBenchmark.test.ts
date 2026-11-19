import {expect,it} from 'vitest'
import fixtures from './realSmallScaleFixtures'
import {benchmarkSourceScales} from './sourceScaleBenchmark'
it('measures smaller PDF renders while retaining one visible 72-DPI partial-beam limit',()=>{const report=benchmarkSourceScales(fixtures);expect(report.reduce((n,r)=>n+r.summary.references,0)).toBe(36);expect(report.reduce((n,r)=>n+r.summary.durationsCorrect,0)).toBe(35);for(const r of report.filter(r=>r.dpi>=90)){expect(r.summary.durationsCorrect).toBe(r.summary.references);expect(r.summary.evidenceCorrect).toBe(r.summary.references)}})
