import { expect, it } from 'vitest'
import { importMusicXml } from './musicXmlImport'
const score = (notes: string, midi = 39) => `<score-partwise><part-list><score-part id="P"><midi-instrument id="sn"><midi-unpitched>${midi}</midi-unpitched></midi-instrument></score-part></part-list><part id="P"><measure><attributes><divisions>4</divisions><time><beats>4</beats><beat-type>4</beat-type></time></attributes>${notes}</measure></part></score-partwise>`
const hit = '<note><unpitched/><instrument id="sn"/><duration>4</duration></note>'
it('imports encoded quarter timing and rests without pixel guesses', () => {
  const chart = importMusicXml(score(hit + '<note><rest/><duration>12</duration></note>'))
  expect(chart.bpm).toBe(60); expect(chart.bars[0].Snare[0]).toBe(2); expect(chart.bars[0].Snare.filter(Boolean)).toHaveLength(1)
})
it('rejects unsupported cymbals, malformed XML, entities and partial bars', () => {
  expect(() => importMusicXml(score(hit.repeat(4), 50))).toThrow('Unsupported')
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
