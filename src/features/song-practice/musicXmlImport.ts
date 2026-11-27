import {expandedMusicXmlMeasures} from './musicXmlRepeats'
import {supportedDuration,alignedTime,tickTime,timeTick,sameTime} from './rhythmTime'
import {fillReviewedRests,reviewedBar} from './reviewedRhythm'
import { checkReviewedRhythm } from './reviewedRhythm'
import type { RhythmEvent } from './rhythmTypes'
import { blankBar } from './songChartLogic'
import type { ChartBar, ChartInstrument, SongChart } from './songChartLogic'
const text = (node: Element, selector: string) => node.querySelector(selector)?.textContent?.trim() ?? ''
export function importMusicXml(xml: string, partId?:string): SongChart {
  if (xml.length > 8*1024*1024 || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Use an uncompressed MusicXML file without a DTD, below8 MB.')
  const document = new DOMParser().parseFromString(xml, 'application/xml')
  if (document.querySelector('parsererror') || document.documentElement.localName !== 'score-partwise') throw new Error('Expected a valid score-partwise MusicXML document.')
  const parts = document.querySelectorAll('score-partwise > part')
  if (parts.length !== 1 && !partId) throw new Error('Select one percussion part before importing.')
  const part=partId?Array.from(parts).find(item=>item.getAttribute('id')===partId):parts[0]
  if(!part)throw Error('Selected part is missing.')
  const definitions=Array.from(document.querySelectorAll('part-list > score-part'))
  const definition=definitions.find(item=>item.getAttribute('id')===part.getAttribute('id')) ?? (parts.length===1 ? definitions[0] ?? document.createElement('score-part') : undefined)
  if(!definition)throw Error('Selected part has no instrument definition.')

  const mapping = new Map<string, ChartInstrument>()
  for (const item of definition.querySelectorAll('midi-instrument')) {
    const midi = Number(text(item, 'midi-unpitched'))
    // MusicXML midi-unpitched is one-based (GM drum-note number plus one).
    const gm: Record<number, ChartInstrument> = { 36: 'Kick 2', 37: 'Kick', 39: 'Snare', 41: 'Snare', 42: 'Floor tom 2', 44: 'Floor tom 1', 46: 'Tom 3', 48: 'Tom 2', 49: 'Tom 2', 51: 'Tom 1', 43: 'Hi-hat', 45: 'Pedal hi-hat', 47: 'Open hi-hat', 50: 'Crash', 58: 'Crash', 52: 'Ride', 54: 'Ride bell', 60: 'Ride', 53: 'China', 56: 'Splash' }
    const instrument = gm[midi]
    if (instrument) mapping.set(item.getAttribute('id') ?? '', instrument)
  }
  const measures = expandedMusicXmlMeasures(part)
  if (!measures.length || measures.length > 256) throw new Error('Import between one and256 complete 2/4 or 4/4 bars.')
  let divisions = 0; let bpm = 60; let meter: '2/4' | '4/4' | null = null; let chartMeter: '2/4' | '4/4' | null = null; let barsTempoSeen = false
   const openTies=new Map<ChartInstrument,number>(); const previousBars:ChartBar[]=[]
  const sharedVoices=new Map<string,Set<ChartInstrument>>()
  for(const note of part.querySelectorAll('note')){const instrument=mapping.get(note.querySelector('instrument')?.getAttribute('id')??'');const voice=text(note,'voice');if(instrument&&voice){const used=sharedVoices.get(voice)??new Set<ChartInstrument>();used.add(instrument);sharedVoices.set(voice,used)}}
  const bars = Array.from(measures, (measure) => {
    const attributes = measure.querySelector(':scope > attributes')
    if (attributes) {
      if (text(attributes, 'divisions')) divisions = Number(text(attributes, 'divisions'))
      if (attributes.querySelector('time')) { const beats = text(attributes, 'time > beats'); meter = ['2', '4'].includes(beats) && text(attributes, 'time > beat-type') === '4' ? (beats === '2' ? '2/4' : '4/4') : null }
    }
    if (!meter || !Number.isFinite(divisions) || divisions <= 0) throw new Error('Explicit divisions and 2/4 or 4/4 meter are required.')
    if (chartMeter && chartMeter !== meter) throw new Error('Mixed meters within a chart are not supported. Import separate sections.'); chartMeter = meter
    const slots = meter === '2/4' ? 8 : 16
    const tempo = measure.querySelector('sound[tempo]')?.getAttribute('tempo')
    if (tempo) { const next = Number(tempo); if (!Number.isInteger(next) || next < 40 || next > 240) throw new Error('Tempo must be 40–240 BPM.'); if (barsTempoSeen && next !== bpm) throw new Error('Tempo changes within imported charts are not supported.'); bpm = next; barsTempoSeen = true }
    const bar:ChartBar = { ...blankBar(), ...(meter === '2/4' ? { beats: 2 as const } : {}) }; let cursor = 0; let previous = 0; let extent = 0; let hasPrevious = false; let events:RhythmEvent[]=[];const graceCounts=new Map<ChartInstrument,number>(); const voiceMap=new Map<string,ChartInstrument>([...sharedVoices].filter(([,names])=>names.size===1).map(([voice,names])=>[voice,[...names][0]])); 
    for (const entry of Array.from(measure.children)) {
      if (!['note','backup','forward'].includes(entry.localName)) continue
      if(entry.querySelector('grace')){const name=mapping.get(entry.querySelector('instrument')?.getAttribute('id')??'');if(!name||entry.querySelector('rest'))throw Error('Grace notes require a mapped percussion instrument.');const count=(graceCounts.get(name)??0)+1;if(count>2)throw Error('Only flam and drag grace groups are supported.');graceCounts.set(name,count);continue}
      if(entry.querySelector('time-modification')&&(text(entry,'actual-notes')!=='3'||text(entry,'normal-notes')!=='2'))throw Error('Only3:2 triplets are supported; expand other tuplets manually.')
      const duration = Number(text(entry, 'duration')) / divisions * 4
      if(!alignedTime(duration)||duration<=0)throw Error('Duration does not align to the supported fine rhythm clock.');if(entry.localName==='note'&&!supportedDuration(duration))throw Error('Unsupported rhythmic value.');
      if (entry.localName === 'backup') { cursor=tickTime(timeTick(cursor-duration)); hasPrevious = false; if (cursor < 0) throw new Error('Invalid voice timing.'); continue }
      const chord = !!entry.querySelector('chord'); const start = chord ? previous : cursor
      if (chord && !hasPrevious) throw new Error('Chord has no preceding note.')
      if (timeTick(start+duration)>timeTick(slots) || start < 0) throw new Error('Incomplete or overflowing bar timing.')
      if (entry.localName === 'note' && !entry.querySelector('rest')) {
        const instrument = mapping.get(entry.querySelector('instrument')?.getAttribute('id') ?? '')
        if (!instrument || !entry.querySelector('unpitched')) throw new Error('Unsupported or unspecified instrument. Use supported GM drum/tom/cymbal voices; extras such as cowbell remain unsupported.')
        const dynamic=entry.querySelector('accent, strong-accent') ? 3 : entry.querySelector('notehead[parentheses="yes"]') ? 1 : 2
        const stop=!!entry.querySelector('tie[type="stop"]'); const tieStart=!!entry.querySelector('tie[type="start"]')
        if(stop && !sameTime(openTies.get(instrument)??-99,start) || !stop && openTies.has(instrument))throw new Error('Unsupported or broken tie. Ties must join adjacent reviewed notes of the same instrument.')
        if(stop)openTies.delete(instrument);if(tieStart)openTies.set(instrument,start+duration)
        if(!stop)bar[instrument]![Math.floor(start)] = dynamic
        if(supportedDuration(duration))events.push({instrument,step:start,duration:tickTime(timeTick(duration)),kind:'note',dynamic,...(graceCounts.has(instrument)?{grace:graceCounts.get(instrument) as 1|2}:{}),...(text(entry,'other-articulation')?{articulation:text(entry,'other-articulation') as RhythmEvent['articulation']}:{}),...(stop?{tieFromPrevious:true}:{})});graceCounts.delete(instrument)
      }
      if(entry.localName==='note' && entry.querySelector('rest')) { if(entry.querySelector('tie'))throw new Error('Rests cannot be tied.'); const instrument=voiceMap.get(text(entry,'voice'))??(mapping.size===0?'Snare':undefined); if(instrument && supportedDuration(duration))events.push({instrument,step:start,duration:duration as RhythmEvent['duration'],kind:'rest',dynamic:2,...(entry.getAttribute('print-object')==='no'?{restOrigin:'gap' as const}:entry.getAttribute('print-object')==='yes'?{restOrigin:'explicit' as const}:{})}) }
      if (!chord) { previous = cursor; cursor=tickTime(timeTick(cursor+duration)); hasPrevious = entry.localName === 'note' }
      extent = Math.max(extent, start + duration)
    }
    for(const [instrument,end] of openTies){if(!sameTime(end,slots))throw new Error('Tie does not reach the next bar.');openTies.set(instrument,0)}
    if (!sameTime(extent,slots)) throw new Error('Pickup or incomplete bars require manual entry.')
    if(graceCounts.size)throw Error('Grace note group has no following main note.');
    events=events.filter((event,index)=>events.findIndex(other=>JSON.stringify(other)===JSON.stringify(event))===index);
    for(const instrument of [...new Set(events.map(e=>e.instrument))])events=fillReviewedRests(events,instrument,slots)
    if(!checkReviewedRhythm(events,slots,previousBars.at(-1)).valid)throw Error('Resolve overlapping voices or broken ties before importing.');Object.assign(bar,reviewedBar(events,slots,previousBars.at(-1)))
    previousBars.push(bar)
    return bar
  })
  if(openTies.size)throw new Error('Tie start has no following continuation.')
  return { id: crypto.randomUUID(), title: (text(document.documentElement, 'work-title') || 'Imported MusicXML').slice(0, 80), bpm, bars, ...(chartMeter === '2/4' ? { meter: '2/4' as const } : {}) }
}
