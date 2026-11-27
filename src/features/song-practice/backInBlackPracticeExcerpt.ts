import {reviewedBar,fillReviewedRests} from './reviewedRhythm'
import type {RhythmEvent} from './rhythmTypes'
import type {SongChart} from './songChartLogic'
/** Manually encoded first four visible bars from the user's supplied platform screenshot.
 * This is a four-bar practice excerpt, not a claimed full-song transcription. */
export function backInBlackPracticeExcerpt():SongChart{
 const intro=()=>reviewedBar([0,4,8,12].map(step=>({instrument:'Hi-hat',kind:'note',step,duration:4,dynamic:2})))
 const groove=()=>{let events:RhythmEvent[]=[0,2,4,6,8,10,12,14].map(step=>({instrument:'Hi-hat',kind:'note',step,duration:2,dynamic:2}));for(const [instrument,steps] of [['Snare',[4,12]],['Kick',[0,8]]] as const){events.push(...steps.map(step=>({instrument,kind:'note' as const,step,duration:2,dynamic:2 as const})));events=fillReviewedRests(events,instrument)}return reviewedBar(events)}
 return {id:crypto.randomUUID(),title:'Back in Black — 4-bar practice excerpt',bpm:94,bars:[intro(),intro(),groove(),groove()],barLabels:['Intro','Intro','Groove','Groove']}
}
