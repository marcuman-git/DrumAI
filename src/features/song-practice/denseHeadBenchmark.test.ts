import {expect,it} from 'vitest'
import dense from './realDenseSourceFixtures'
import mixed from './realMixedEvidenceFixtures'
import publisher from './realPublisherScaleFixtures'
import intro from './realIntroGrooveFixtures'
import {benchmarkDenseHeads} from './denseHeadBenchmark'
it('measures dense-head recovery independently from values and retains unmatched candidates for review',()=>{const fixtures=[...dense,...mixed.filter(f=>!f.source.includes('clipped')),...publisher],standard=benchmarkDenseHeads(fixtures),enhanced=benchmarkDenseHeads(fixtures,true);expect(enhanced.reduce((n,r)=>n+r.summary.references,0)).toBe(160);expect(enhanced.reduce((n,r)=>n+r.summary.recovered,0)).toBe(160);expect(standard.reduce((n,r)=>n+r.summary.recovered,0)).toBe(112);expect(enhanced.reduce((n,r)=>n+r.summary.unmatched,0)).toBe(112);for(const r of enhanced.filter(r=>r.source.includes('section F')))expect(r.summary.recovered).toBe(16)})
it('benchmarks independent simultaneous heads in the supplied Feel Good Inc groove',()=>{const report=benchmarkDenseHeads(intro,true);expect(report.reduce((n,r)=>n+r.summary.recovered,0)).toBeGreaterThanOrEqual(47);for(const r of report.filter(r=>r.dpi>=108))expect(r.summary.recovered).toBe(12)})

it('reports duration failures at automatic positions without replacing them with labelled coordinates',async()=>{const {benchmarkRecoveredHeadValues}=await import('./recoveredHeadValueBenchmark');const report=benchmarkRecoveredHeadValues(intro);expect(report.reduce((n,r)=>n+r.summary.references,0)).toBe(48);expect(report.reduce((n,r)=>n+r.summary.recovered,0)).toBe(47);expect(report.flatMap(r=>r.cases).some(c=>c.recovered&&!c.durationCorrect)).toBe(true);for(const r of report)expect(r.summary.durationsCorrect).toBeLessThanOrEqual(r.summary.recovered)})
