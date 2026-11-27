import {expect,it} from 'vitest'
import {backInBlackPracticeExcerpt} from './backInBlackPracticeExcerpt'
import {chartPlaybackAudit} from './chartPlaybackAudit'
import {isSongChart} from './songChartLogic'
it('encodes two quarter-hat intro bars and two eighth-hat groove bars from the supplied screenshot',()=>{
 const chart=backInBlackPracticeExcerpt();expect(isSongChart(chart)).toBe(true);expect(chart.bpm).toBe(94);expect(chart.bars).toHaveLength(4)
 expect(chart.bars[0].rhythmEvents?.filter(e=>e.kind==='note').map(e=>[e.step,e.duration])).toEqual([[0,4],[4,4],[8,4],[12,4]])
 expect(chartPlaybackAudit(chart)).toHaveLength(32)
 expect(chart.bars[2].Snare.filter(Boolean)).toHaveLength(2);expect(chart.bars[2].Kick.filter(Boolean)).toHaveLength(2)
})
