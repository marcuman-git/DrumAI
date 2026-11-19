import { expect, it } from 'vitest'
import { playbackStart, validPickup } from './chartPickup'
import { blankBar, isSongChart, newSongChart, parseSongChart } from './songChartLogic'
import { changeChartMeter } from './chartMeter'
it('retains pickup timing through JSON and starts later sections at their actual bar',()=>{
 const chart={...newSongChart(),bars:[blankBar(),blankBar()],pickupOffset:12};chart.bars[0].Snare[12]=2
 expect(validPickup(chart)).toBe(true);expect(playbackStart(chart,0)).toBe(12);expect(playbackStart(chart,1)).toBe(16)
 expect(parseSongChart(JSON.stringify({app:'DrumMaster AI Chart',schema:1,chart})).pickupOffset).toBe(12)
 expect(()=>changeChartMeter(chart,'2/4')).toThrow('Turn off pickup')
 chart.bars[0].Kick[4]=2;expect(validPickup(chart)).toBe(false);expect(isSongChart(chart)).toBe(false);expect(playbackStart(chart,0)).toBe(0)
})
it('rejects malformed offsets and supports two-beat pickups',()=>{
 const chart={...newSongChart(),meter:'2/4' as const,bars:[{...blankBar(),beats:2 as const}],pickupOffset:4}
 expect(isSongChart(chart)).toBe(true);expect(playbackStart(chart,0)).toBe(4)
 for(const pickupOffset of [-1,0,8,1.5,NaN])expect(validPickup({...chart,pickupOffset})).toBe(false)
})
