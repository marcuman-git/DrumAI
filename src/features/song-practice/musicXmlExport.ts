import {durationNotation,timeTick,sameTime} from './rhythmTime'
import { CHART_INSTRUMENTS } from './chartKit'
import type { ChartBar, ChartInstrument } from './chartKit'
import { validReviewedBar } from './reviewedRhythm'
export const MUSIC_XML_MIDI: Record<ChartInstrument, number> = { 'Hi-hat':43, Snare:39, Kick:37, Crash:50, Ride:52, 'Kick 2':36, 'Floor tom 2':42, 'Floor tom 1':44, 'Tom 3':46, 'Tom 2':48, 'Tom 1':51, 'Pedal hi-hat':45, 'Open hi-hat':47, China:53, Splash:56, 'Ride bell':54 }
const escape = (value:string) => value.replace(/[<>&"']/g, character => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[character]!))
/** Only explicitly reviewed complete bars are exportable; grid durations are never guessed. */
export function exportReviewedMusicXml(bars:ChartBar[], title='Reviewed percussion', bpm=60):string {
 if(!Number.isInteger(bpm)||bpm<40||bpm>240)throw new Error('Tempo must be 40–240 BPM.')
 if (!bars.length || bars.length>256 || bars.some((bar,index)=>!bar.rhythmEvents || !validReviewedBar(bar,bars[index-1])) || bars.some(bar=>(bar.beats??4)!==(bars[0].beats??4))) throw new Error('Export requires complete reviewed bars in a single meter.')
 const voices=CHART_INSTRUMENTS.filter(name=>bars.some(bar=>bar.rhythmEvents!.some(event=>event.instrument===name)))
 const ids=new Map(voices.map((name,index)=>[name,`I${index+1}`]))
 const measures=bars.map((bar,index)=>{
  const slots=bar.beats===2?8:16
  return `<measure number="${index+1}">${index===0?`<attributes><divisions>48</divisions><time><beats>${slots/4}</beats><beat-type>4</beat-type></time><clef><sign>percussion</sign></clef></attributes><direction><sound tempo="${bpm}"/></direction>`:''}${voices.map((name,voice)=>{
   const events=bar.rhythmEvents!.filter(event=>event.instrument===name).sort((a,b)=>a.step-b.step)
   const content=events.length?events.map(event=>{
    const next=events.find(item=>sameTime(item.step,event.step+event.duration)) ?? (sameTime(event.step+event.duration,slots)?bars[index+1]?.rhythmEvents?.find(item=>item.instrument===name&&item.step===0):undefined)
    const spec=durationNotation(event.duration);const start=!!next?.tieFromPrevious; const stop=!!event.tieFromPrevious
    return `${event.grace?Array.from({length:event.grace},()=>`<note><grace slash="yes"/><unpitched><display-step>C</display-step><display-octave>5</display-octave></unpitched><instrument id="${ids.get(name)}"/><voice>${voice+1}</voice><type>16th</type></note>`).join(''):''}<note>${event.kind==='rest'?'<rest/>':`<unpitched><display-step>C</display-step><display-octave>5</display-octave></unpitched><instrument id="${ids.get(name)}"/>`}<duration>${timeTick(event.duration)}</duration>${stop?'<tie type="stop"/>':''}${start?'<tie type="start"/>':''}<voice>${voice+1}</voice><type>${spec.type}</type>${spec.dot?'<dot/>':''}${spec.triplet?'<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>':''}${event.kind==='note'?`<notehead${event.dynamic===1?' parentheses="yes"':''}>${['Snare','Kick','Kick 2','Floor tom 1','Floor tom 2','Tom 1','Tom 2','Tom 3'].includes(name)?'normal':name==='Ride bell'?'diamond':'x'}</notehead>`:''}${start||stop||event.dynamic===3||event.articulation?`<notations>${stop?'<tied type="stop"/>':''}${start?'<tied type="start"/>':''}${event.dynamic===3||event.articulation?`<articulations>${event.dynamic===3?'<accent/>':''}${event.articulation?`<other-articulation>${escape(event.articulation)}</other-articulation>`:''}</articulations>`:''}</notations>`:''}</note>`
   }).join(''):`<forward><duration>${timeTick(slots)}</duration></forward>`
   return `${voice?`<backup><duration>${timeTick(slots)}</duration></backup>`:''}${content}`
  }).join('')}</measure>`
 }).join('')
 return `<?xml version="1.0" encoding="UTF-8"?><score-partwise version="4.0"><work><work-title>${escape(title)}</work-title></work><part-list><score-part id="P1"><part-name>Percussion</part-name>${voices.map(name=>`<score-instrument id="${ids.get(name)}"><instrument-name>${escape(name)}</instrument-name></score-instrument><midi-instrument id="${ids.get(name)}"><midi-channel>10</midi-channel><midi-unpitched>${MUSIC_XML_MIDI[name]}</midi-unpitched></midi-instrument>`).join('')}</score-part></part-list><part id="P1">${measures}</part></score-partwise>`
}
