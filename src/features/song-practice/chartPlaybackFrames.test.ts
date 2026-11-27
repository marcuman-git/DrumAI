import type {ChartBar} from './chartKit'
import {expect,it} from 'vitest'
import {chartPlaybackFrames} from './chartPlaybackFrames'
import {chartScheduledHits} from './chartScheduledHits'
import {newSongChart,blankBar} from './songChartLogic'
import {defaultMix} from './chartPracticeSettings'
it('matches the screenshot: eight eighth onsets and no silent sixteenth frames or sounds',()=>{
 const bar=newSongChart().bars[0]
 const frames=Array.from({length:16},(_,slot)=>chartPlaybackFrames(bar,slot,false,'eighth')).flat()
 expect(frames.map(f=>f.step)).toEqual([0,2,4,6,8,10,12,14])
 expect(chartScheduledHits(bar,'Hi-hat',5)).toEqual([])
 expect(frames.filter(f=>f.instruments.includes('Hi-hat')).map(f=>f.step/4)).toEqual([0,.5,1,1.5,2,2.5,3,3.5])
 expect(chartPlaybackFrames(bar,5,false,'sixteenth')).toEqual([{step:5,offset:0,instruments:[]}])
})
it('preserves off-count and fractional reviewed onsets, ignores projected grid and tie continuations',()=>{
 const bar:ChartBar=blankBar();bar.Kick[5]=2
 bar.rhythmEvents=[{instrument:'Snare',kind:'note',dynamic:2,step:5.5,duration:.5},{instrument:'Hi-hat',kind:'note',dynamic:2,step:5,duration:1,tieFromPrevious:true}]
 expect(chartScheduledHits(bar,'Kick',5)).toEqual([])
 expect(chartPlaybackFrames(bar,5,false,'quarter')).toEqual([{step:5.5,offset:.5,instruments:['Snare']}])
 bar.rhythmEvents[1].step=0
 expect(chartPlaybackFrames(bar,0,true,'eighth')[0].instruments).toEqual(['Hi-hat'])
 expect(chartPlaybackFrames(bar,0,false,'eighth')[0].instruments).toEqual([])
})
it('retains counting silence while removing muted, zero-volume and non-solo sound indicators',()=>{
 const bar=newSongChart().bars[0],mix=defaultMix();mix.Kick.muted=true;mix['Hi-hat'].solo=true
 expect(chartPlaybackFrames(bar,0,false,'eighth',mix)[0].instruments).toEqual(['Hi-hat'])
 expect(chartPlaybackFrames(bar,0,false,'eighth',mix,0)[0].instruments).toEqual([])
})

import {chartPlaybackAudit} from './chartPlaybackAudit'
it('audits source-pattern attacks and makes hidden/muted grace attacks explicit',()=>{
 const chart=newSongChart();expect(chartPlaybackAudit(chart)).toHaveLength(12)
 chart.bars=[blankBar()];chart.bars[0].rhythmEvents=[{instrument:'Ride',kind:'note',dynamic:2,step:1.5,duration:.5,grace:2}]
 chart.mix=defaultMix();chart.mix.Ride!.muted=true
 expect(chartPlaybackAudit(chart)).toEqual([{bar:0,instrument:'Ride',step:1.5,grace:2,muted:true,projected:0}])
})
