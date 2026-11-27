import {expect,it} from 'vitest'
import {benchmarkMusicalTimingSources} from './musicalTimingSourceBenchmark'
it('resolves checked real-source Back in Black, intro, mixed-rest and partial-beam bars at four scales without using pixel spacing as time',()=>{const report=benchmarkMusicalTimingSources();expect(report).toHaveLength(20);expect(report.every(r=>r.summary.complete)).toBe(true);expect(report.reduce((n,r)=>n+r.summary.correctTiming,0)).toBe(232);expect(report.reduce((n,r)=>n+r.summary.headsRecovered,0)).toBe(232);expect(report.reduce((n,r)=>n+r.summary.unmatchedDetections,0)).toBe(6)})

it('keeps the 72 DPI Highway durations blocked until six explicit source duration choices are supplied',()=>{const row=benchmarkMusicalTimingSources().find(r=>r.source.startsWith('Highway')&&r.dpi===72)!;expect(row.automaticStatus).toBe('blocked');expect(row.manualDurationCount).toBe(6);expect(row.status).toBe('resolved')})

import {reviewedBar} from './reviewedRhythm'
import {chartPlaybackAudit} from './chartPlaybackAudit'
it('imports all checked source-bar proposals without adding attacks in gap rests or empty display slots',()=>{
 for(const row of benchmarkMusicalTimingSources()){
  const chart={id:'source-check',title:row.source,bpm:60,bars:[reviewedBar(row.proposed)]}
  const attacks=chartPlaybackAudit(chart).map(e=>`${e.instrument}:${e.step}`).sort()
  expect(attacks,row.source+' '+row.dpi).toEqual(row.expected.map(e=>`${e.instrument}:${e.step}`).sort())
 }
})
