import { expect, it } from 'vitest'
import { importMusicXml } from './musicXmlImport'
const score = (notes: string, midi = 39) => `<score-partwise><part-list><score-part id="P"><midi-instrument id="sn"><midi-unpitched>${midi}</midi-unpitched></midi-instrument></score-part></part-list><part id="P"><measure><attributes><divisions>4</divisions><time><beats>4</beats><beat-type>4</beat-type></time></attributes>${notes}</measure></part></score-partwise>`
const hit = '<note><unpitched/><instrument id="sn"/><duration>4</duration></note>'
it('imports encoded quarter timing and rests without pixel guesses', () => {
  const chart = importMusicXml(score(hit + '<note><rest/><duration>12</duration></note>'))
  expect(chart.bpm).toBe(60); expect(chart.bars[0].Snare[0]).toBe(2); expect(chart.bars[0].Snare.filter(Boolean)).toHaveLength(1)
})
it('rejects unsupported cymbals, malformed XML, entities and partial bars', () => {
  expect(() => importMusicXml(score(hit.repeat(4), 57))).toThrow('Unsupported')
  expect(() => importMusicXml('<broken>')).toThrow()
  expect(() => importMusicXml('<!DOCTYPE x>' + score(hit.repeat(4)))).toThrow()
  expect(() => importMusicXml(score(hit))).toThrow('incomplete')
})
it('handles independent voices with backup and simultaneous chords', () => {
  const chart = importMusicXml(score(hit.repeat(4) + '<backup><duration>16</duration></backup>' + hit.repeat(4)))
  expect(chart.bars[0].Snare.filter(Boolean)).toHaveLength(4)
})
it('tempo parsing has no state leakage between imports', () => {
  const a = score(hit.repeat(4)).replace('<attributes>', '<direction><sound tempo="90"/></direction><attributes>')
  expect(importMusicXml(a).bpm).toBe(90)
  expect(importMusicXml(a.replace('90','80')).bpm).toBe(80)
})
it('imports distinct GM Crash and Ride instruments into their own rows', () => {
  expect(importMusicXml(score(hit.repeat(4), 50)).bars[0].Crash?.filter(Boolean)).toHaveLength(4)
  expect(importMusicXml(score(hit.repeat(4), 52)).bars[0].Ride?.filter(Boolean)).toHaveLength(4)
})
it('maps encoded bass/tom/pedal voices using one-based GM MusicXML numbers', () => {
  for(const [midi,row] of [[36,'Kick 2'],[42,'Floor tom 2'],[44,'Floor tom 1'],[46,'Tom 3'],[48,'Tom 2'],[51,'Tom 1'],[45,'Pedal hi-hat']] as const) {
    expect(importMusicXml(score(hit.repeat(4),midi)).bars[0][row]?.filter(Boolean)).toHaveLength(4)
  }
})
it('keeps GM open hi-hat separate from closed hi-hat', () => {
  expect(importMusicXml(score(hit.repeat(4), 47)).bars[0]['Open hi-hat']?.filter(Boolean)).toHaveLength(4)
  expect(importMusicXml(score(hit.repeat(4), 43)).bars[0]['Hi-hat'].filter(Boolean)).toHaveLength(4)
})
it('imports two-beat measures with inherited meter and rejects pickups and mixed meters', () => {
 const two = score(hit.repeat(2)).replace('<beats>4</beats>', '<beats>2</beats>')
 const xml = two.replace('</measure></part>', '</measure><measure>' + hit.repeat(2) + '</measure></part>')
 const chart = importMusicXml(xml)
 expect(chart.meter).toBe('2/4'); expect(chart.bars).toHaveLength(2)
 expect(chart.bars.every((bar) => bar.beats === 2 && bar.Snare[4] === 2 && bar.Snare.slice(8).every((note) => note === 0))).toBe(true)
 expect(() => importMusicXml(two.replace(hit.repeat(2), hit))).toThrow('incomplete')
 const mixed = xml.replace('<measure><note>', '<measure><attributes><time><beats>4</beats><beat-type>4</beat-type></time></attributes><note>')
 expect(() => importMusicXml(mixed)).toThrow('Mixed meters')
})
