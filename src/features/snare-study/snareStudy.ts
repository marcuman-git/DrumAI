import {alignedTime,supportedDuration} from '../song-practice/rhythmTime'
export type Hand='R'|'L'
export type StudyMeter='2/4'|'3/4'|'4/4'|'5/4'|'6/8'
export interface StudyEvent {step:number;duration:number;kind:'note'|'rest';hand?:Hand;accent?:boolean;grace?:1|2;roll?:number;tie?:boolean}
export interface StudyBar {meter:StudyMeter;events:StudyEvent[]}
export interface SnareStudy {id:string;title:string;level:number;focus:string;guide:string;bars:StudyBar[]}
export interface StudyStroke {bar:number;step:number;time:number;hand:Hand;soft:boolean;accent:boolean;grace:boolean;event:number}
export function studySlots(meter:StudyMeter){const [beats,unit]=meter.split('/').map(Number);return beats*16/unit}
export function validateStudy(study:SnareStudy):boolean{
 if(!study.bars.length||study.bars.length>32)return false
 let previous:StudyEvent|undefined
 return study.bars.every(bar=>{if(!['2/4','3/4','4/4','5/4','6/8'].includes(bar.meter)||!bar.events.length)return false;let end=0;for(const e of bar.events){if(!alignedTime(e.step)||!supportedDuration(e.duration)||Math.abs(e.step-end)>.001)return false;if(e.kind!=='note'&&e.kind!=='rest')return false;if(e.kind==='note'&&!['R','L'].includes(e.hand??''))return false;if(e.kind==='rest'&&(e.grace||e.roll||e.tie))return false;if(e.grace&&(![1,2].includes(e.grace)||e.roll||e.tie))return false;if(e.roll&&(!Number.isInteger(e.roll)||e.roll<2||e.roll>32||!alignedTime(e.duration/e.roll)||e.tie))return false;if(e.tie&&previous?.kind!=='note')return false;end=e.step+e.duration;previous=e}return Math.abs(end-studySlots(bar.meter))<.001})
}
/** Exact main/roll onsets; grace notes precede their own main onset. BPM is quarter-note BPM. */
export function studySchedule(study:SnareStudy,bpm:number,reverse=false):{strokes:StudyStroke[];duration:number;barStarts:number[]}{
 if(!validateStudy(study)||!Number.isFinite(bpm)||bpm<30||bpm>240)throw Error('Invalid snare study or tempo.')
 const seconds=60/bpm/4,strokes:StudyStroke[]=[],barStarts:number[]=[];let offset=0
 const hand=(h:Hand):Hand=>reverse?h==='R'?'L':'R':h
 study.bars.forEach((bar,barIndex)=>{barStarts.push(offset*seconds);bar.events.forEach((e,event)=>{if(e.kind==='rest'||e.tie)return;const lead=e.hand!;for(let grace=e.grace??0;grace>0;grace--)strokes.push({bar:barIndex,step:e.step,time:(offset+e.step)*seconds-grace*.025,hand:hand(lead==='R'?'L':'R'),soft:true,accent:false,grace:true,event});const count=e.roll??1;for(let i=0;i<count;i++)strokes.push({bar:barIndex,step:e.step+i*e.duration/count,time:(offset+e.step+i*e.duration/count)*seconds,hand:hand(count===1?lead:Math.floor(i/2)%2===0?lead:lead==='R'?'L':'R'),soft:false,accent:!!e.accent&&i===0,grace:false,event})});offset+=studySlots(bar.meter)})
 return {strokes:strokes.sort((a,b)=>a.time-b.time),duration:offset*seconds,barStarts}
}
export function strokeGuidance(strokes:readonly StudyStroke[],index:number){const current=strokes[index];if(!current)return '';const next=strokes.slice(index+1).find(s=>s.hand===current.hand)??strokes.find(s=>s.hand===current.hand);return current.accent?next?.accent?'Full: high → high':'Down: high → low':next?.accent?'Up: low → high':'Tap: low → low'}
