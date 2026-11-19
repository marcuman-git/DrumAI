import {expect,it} from 'vitest'
import fixtures from './realPublisherScaleFixtures'
import {benchmarkSourceScales} from './sourceScaleBenchmark'
it('checks four visually labelled eighths from Will’s Drum Lessons at three fresh rendering scales',()=>{const report=benchmarkSourceScales(fixtures);expect(report.map(r=>r.dpi)).toEqual([108,144,216]);for(const r of report){expect(r.publisher).toContain('Will');expect(r.summary.durationsCorrect).toBe(4);expect(r.summary.evidenceCorrect).toBe(4);expect(r.summary.symbolsCorrect).toBe(4)}})
