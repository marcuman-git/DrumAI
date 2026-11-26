import {sameTime} from './rhythmTime'
import {diagnoseReviewedRhythm,formatSlotRanges} from './reviewedRhythmDiagnostics'
import {barSlots} from './chartMeter'
import type {RecognitionDraft} from './notationRecognition'
import {validRecoveredDraft} from './passageRecovery'
export function collectionDiagnostics(sections:RecognitionDraft[],source:string):string[]{
 const issues:string[]=[]
 if(!sections.length)issues.push('Add a reviewed section before sending.')
 const meters=new Set(sections.flatMap(d=>d.bars??[d.bar]).map(bar=>bar.beats===2?'2/4':'4/4'))
 if(meters.size>1)issues.push('Sections use different meters. Review them in a matching meter.')
 if(sections.reduce((n,d)=>n+(d.bars?.length??1),0)>256)issues.push('The collection exceeds 256 bars.')
 sections.forEach((d,i)=>{if(d.source!==source)issues.push(`Section ${i+1}: source filename differs.`);if(!validRecoveredDraft(d,true))issues.push(`Section ${i+1}: resolve rhythm coverage, references or invalid review data.`)})
 const bars=sections.flatMap(d=>d.bars??[d.bar])
 bars.forEach((bar,index)=>{
  if(bar.rhythmEvents)for(const voice of diagnoseReviewedRhythm(bar.rhythmEvents,barSlots(bar)))if(voice.gaps.length||voice.overlaps.length||voice.overflowEvents.length)issues.push(`Bar ${index+1}, ${voice.instrument}: missing ${formatSlotRanges(voice.gaps)}; overlapping ${formatSlotRanges(voice.overlaps)}; ${voice.overflowEvents.length} overflowing event(s).`)
  for(const event of bar.rhythmEvents??[])if(event.step===0&&event.tieFromPrevious&&!bars[index-1]?.rhythmEvents?.some(previous=>previous.instrument===event.instrument&&previous.kind==='note'&&sameTime(previous.step+previous.duration,barSlots(bars[index-1]))))issues.push(`Bar ${index+1}: incoming ${event.instrument} tie needs a preceding note or source-checked detachment.`)
 })
 return [...new Set(issues)]
}
