import {expect,it} from 'vitest'
import {benchmarkMusicalTimingSources} from './musicalTimingSourceBenchmark'
it('resolves checked real-source Back in Black, intro, mixed-rest and partial-beam bars at four scales without using pixel spacing as time',()=>{const report=benchmarkMusicalTimingSources();expect(report).toHaveLength(16);expect(report.every(r=>r.summary.complete)).toBe(true);expect(report.reduce((n,r)=>n+r.summary.correctTiming,0)).toBe(184);expect(report.reduce((n,r)=>n+r.summary.headsRecovered,0)).toBe(184);expect(report.reduce((n,r)=>n+r.summary.unmatchedDetections,0)).toBe(5)})
