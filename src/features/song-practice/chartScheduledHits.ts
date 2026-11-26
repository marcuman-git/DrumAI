import {chartPlaybackNote} from './chartTieReview'
import type {ChartBar,ChartInstrument} from './chartKit'
export function chartScheduledHits(bar:ChartBar,instrument:ChartInstrument,slot:number,entry=false){if(!bar.rhythmEvents){const dynamic=chartPlaybackNote(bar,instrument,slot,entry);return dynamic?[{offset:0,dynamic,grace:undefined,articulation:undefined}]:[]}
 return bar.rhythmEvents.filter(e=>e.instrument===instrument&&e.kind==='note'&&Math.floor(e.step)===slot&&(!e.tieFromPrevious||entry&&e.step===0)).map(e=>({offset:e.step-slot,dynamic:e.dynamic,grace:e.grace,articulation:e.articulation}))}
