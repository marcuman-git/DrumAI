import {expect,it} from 'vitest'
import verse from './realVerseBeamFixtures'
import {benchmarkBeamGroups} from './beamGroupSourceBenchmark'
import {benchmarkSourceScales} from './sourceScaleBenchmark'
import {benchmarkRecoveredHeadValues} from './recoveredHeadValueBenchmark'
import mixed from './realMixedGrooveFixtures'
import {benchmarkMixedGrooveRests} from './restSourceBenchmark'
it('preserves independently labelled mixed short-beam values and stacked pairs across four rendering scales',()=>{const groups=benchmarkBeamGroups(verse),known=benchmarkSourceScales(verse),automatic=benchmarkRecoveredHeadValues(verse);expect(groups.reduce((sum,r)=>sum+r.summary.durationsCorrect,0)).toBe(52);expect(known.reduce((sum,r)=>sum+r.summary.durationsCorrect,0)).toBe(52);expect(automatic.reduce((sum,r)=>sum+r.summary.recovered,0)).toBe(52);expect(automatic.reduce((sum,r)=>sum+r.summary.durationsCorrect,0)).toBe(52);for(const r of groups){expect(r.summary.sharedPairsLinked).toBe(4);expect(r.summary.crossGroupLinks).toBe(0);expect(r.groups).toHaveLength(4);expect(r.groups.find(g=>g.ids.includes(6))?.mixed).toBe(true);expect(r.cases[6].detectedValue).toBe('sixteenth');expect(r.cases[7].detectedValue).toBe('eighth')}})
it('measures development-score rest recovery separately from manual silence and notehead accuracy',()=>{const report=benchmarkMixedGrooveRests(mixed);expect(report).toHaveLength(4);expect(report.every(r=>r.reference.duration===2)).toBe(true);expect(report.filter(r=>r.recovered)).toHaveLength(4)})
