import {expect,it} from 'vitest'
import fixtures from './realFirstGrooveScaleFixtures'
import {benchmarkSourceHeads} from './sourceHeadScaleBenchmark'
it('recovers the eight visually labelled crosses once each in the feedback passage at three scales',()=>{
 const report=benchmarkSourceHeads(fixtures);expect(report.map(r=>r.dpi)).toEqual([108,144,216]);for(const r of report){expect(r.summary,JSON.stringify(r)).toEqual({references:8,recovered:8,crossCandidates:8,unmatched:0});expect(new Set(r.cases.map(c=>c.detected?.id)).size).toBe(8)}
})
