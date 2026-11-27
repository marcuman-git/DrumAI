import {reviewedBar} from '../song-practice/reviewedRhythm'
import type {RhythmEvent} from '../song-practice/rhythmTypes'
import type {SongChart} from '../song-practice/songChartLogic'
import {validateStudy} from './snareStudy'
import type {SnareStudy} from './snareStudy'
export function snareStudyChart(study:SnareStudy,bpm:number):SongChart{
 const meter=study.bars[0]?.meter
 if(!validateStudy(study)||!['2/4','4/4'].includes(meter)||study.bars.some(bar=>bar.meter!==meter)||!Number.isInteger(bpm)||bpm<40||bpm>240)throw Error('Song-chart transfer supports a single2/4 or4/4 meter at40–240 BPM. Practise other meters in Snare Studies.')
 const bars:SongChart['bars']=[]
 for(const bar of study.bars){const events:RhythmEvent[]=bar.events.flatMap(e=>{const count=e.roll??1;return Array.from({length:count},(_,i)=>({instrument:'Snare',kind:e.kind,step:e.step+i*e.duration/count,duration:e.duration/count,dynamic:e.accent&&i===0?3:2,...(e.tie?{tieFromPrevious:true}:{}),...(e.grace?{grace:e.grace}:{})}))});bars.push(reviewedBar(events,meter==='2/4'?8:16,bars.at(-1)))}
 return {id:crypto.randomUUID(),title:study.title,bpm,bars,...(meter==='2/4'?{meter:'2/4'}:{}),barLabels:bars.map(()=>study.focus.slice(0,40))}
}
