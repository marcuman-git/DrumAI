import {CHART_INSTRUMENTS} from './chartKit'
import type {ChartBar,ChartInstrument} from './chartKit'
import {chartScheduledHits} from './chartScheduledHits'
import {defaultMix,mixLevel} from './chartPracticeSettings'
import type {ChartMix} from './chartPracticeSettings'
import {staffCountLabel} from './staffCountLabels'
import type {StaffCountMode} from './staffCountLabels'
/** A visual frame is a selected counting position or an actual sounding onset.
 * Internal silent subdivisions never create a frame or an audio hit. */
export function chartPlaybackFrames(bar:ChartBar,slot:number,entry:boolean,mode:StaffCountMode,mix?:ChartMix,volume=1){
 const onsets=new Map<number,ChartInstrument[]>()
 for(const instrument of CHART_INSTRUMENTS){
  if(volume*mixLevel(mix??defaultMix(),instrument)<=0)continue
  for(const hit of chartScheduledHits(bar,instrument,slot,entry)){
   const instruments=onsets.get(hit.offset)??[]
   if(!instruments.includes(instrument))instruments.push(instrument)
   onsets.set(hit.offset,instruments)
  }
 }
 if(staffCountLabel(slot,mode)&&!onsets.has(0))onsets.set(0,[])
 return [...onsets].sort(([a],[b])=>a-b).map(([offset,instruments])=>({step:slot+offset,offset,instruments}))
}
