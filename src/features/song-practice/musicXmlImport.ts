import { blankBar } from './songChartLogic'
import type { ChartInstrument, SongChart } from './songChartLogic'
const text = (node: Element, selector: string) => node.querySelector(selector)?.textContent?.trim() ?? ''
export function importMusicXml(xml: string): SongChart {
  if (xml.length > 512000 || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('Use an uncompressed MusicXML file without a DTD, below 500 KB.')
  const document = new DOMParser().parseFromString(xml, 'application/xml')
  if (document.querySelector('parsererror') || document.documentElement.localName !== 'score-partwise') throw new Error('Expected a valid score-partwise MusicXML document.')
  const parts = document.querySelectorAll('score-partwise > part')
  if (parts.length !== 1) throw new Error('Export a single percussion part before importing.')
  if (document.querySelector('repeat, ending')) throw new Error('Expand repeats into explicit bars before importing.')
  const mapping = new Map<string, ChartInstrument>()
  for (const item of document.querySelectorAll('score-part > midi-instrument')) {
    const midi = Number(text(item, 'midi-unpitched'))
    // MusicXML midi-unpitched is one-based (GM drum-note number plus one).
    const gm: Record<number, ChartInstrument> = { 36: 'Kick 2', 37: 'Kick', 39: 'Snare', 41: 'Snare', 42: 'Floor tom 2', 44: 'Floor tom 1', 46: 'Tom 3', 48: 'Tom 2', 49: 'Tom 2', 51: 'Tom 1', 43: 'Hi-hat', 45: 'Pedal hi-hat', 47: 'Hi-hat', 50: 'Crash', 58: 'Crash', 52: 'Ride', 54: 'Ride', 60: 'Ride' }
    const instrument = gm[midi]
    if (instrument) mapping.set(item.getAttribute('id') ?? '', instrument)
  }
  const measures = parts[0].querySelectorAll(':scope > measure')
  if (!measures.length || measures.length > 16) throw new Error('Import between one and sixteen complete 4/4 bars.')
  let divisions = 0; let bpm = 60; let meter = false; let barsTempoSeen = false
  const bars = Array.from(measures, (measure) => {
    const attributes = measure.querySelector(':scope > attributes')
    if (attributes) {
      if (text(attributes, 'divisions')) divisions = Number(text(attributes, 'divisions'))
      if (attributes.querySelector('time')) { meter = text(attributes, 'time > beats') === '4' && text(attributes, 'time > beat-type') === '4' }
    }
    if (!meter || !Number.isFinite(divisions) || divisions <= 0) throw new Error('Explicit divisions and 4/4 meter are required.')
    const tempo = measure.querySelector('sound[tempo]')?.getAttribute('tempo')
    if (tempo) { const next = Number(tempo); if (!Number.isInteger(next) || next < 40 || next > 240) throw new Error('Tempo must be 40–240 BPM.'); if (barsTempoSeen && next !== bpm) throw new Error('Tempo changes within imported charts are not supported.'); bpm = next; barsTempoSeen = true }
    const bar = blankBar(); let cursor = 0; let previous = 0; let extent = 0; let hasPrevious = false
    for (const entry of Array.from(measure.children)) {
      if (!['note','backup','forward'].includes(entry.localName)) continue
      if (entry.querySelector('grace, time-modification, tie')) throw new Error('Grace notes and tuplets require manual entry in this editor.')
      const duration = Number(text(entry, 'duration')) / divisions * 4
      if (!Number.isInteger(duration) || duration <= 0) throw new Error('Only durations aligned to sixteenth-note slots are supported.')
      if (entry.localName === 'backup') { cursor -= duration; hasPrevious = false; if (cursor < 0) throw new Error('Invalid voice timing.'); continue }
      const chord = !!entry.querySelector('chord'); const start = chord ? previous : cursor
      if (chord && !hasPrevious) throw new Error('Chord has no preceding note.')
      if (start + duration > 16 || start < 0) throw new Error('Incomplete or overflowing bar timing.')
      if (entry.localName === 'note' && !entry.querySelector('rest')) {
        const instrument = mapping.get(entry.querySelector('instrument')?.getAttribute('id') ?? '')
        if (!instrument || !entry.querySelector('unpitched')) throw new Error('Unsupported or unspecified instrument. Use supported GM drum/tom/cymbal voices; extras such as cowbell remain unsupported.')
        bar[instrument][start] = entry.querySelector('accent, strong-accent') ? 3 : entry.querySelector('notehead[parentheses="yes"]') ? 1 : 2
      }
      if (!chord) { previous = cursor; cursor += duration; hasPrevious = entry.localName === 'note' }
      extent = Math.max(extent, start + duration)
    }
    if (extent !== 16) throw new Error('Pickup or incomplete bars require manual entry.')
    return bar
  })
  return { id: crypto.randomUUID(), title: (text(document.documentElement, 'work-title') || 'Imported MusicXML').slice(0, 80), bpm, bars }
}
