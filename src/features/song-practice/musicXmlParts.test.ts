import {expect,it} from 'vitest'
import {musicXmlPartChoices} from './musicXmlParts'
import {importMusicXml} from './musicXmlImport'
const attrs='<attributes><divisions>4</divisions><time><beats>4</beats><beat-type>4</beat-type></time></attributes>'
const score=`<score-partwise><part-list><score-part id="G"><part-name>Guitar</part-name><midi-instrument id="shared"><midi-unpitched>52</midi-unpitched></midi-instrument></score-part><score-part id="D"><part-name>Drums</part-name><midi-instrument id="shared"><midi-unpitched>39</midi-unpitched></midi-instrument></score-part></part-list><part id="G"><measure>${attrs}<note><pitch><step>C</step><octave>4</octave></pitch><duration>16</duration></note></measure></part><part id="D"><measure>${attrs}${'<note><unpitched/><instrument id="shared"/><duration>4</duration></note>'.repeat(4)}</measure></part></score-partwise>`
it('imports the selected drum track and scopes reused instrument IDs to its own definition',()=>{
 expect(musicXmlPartChoices(score).map(part=>part.name)).toEqual(['Guitar','Drums']);expect(()=>importMusicXml(score)).toThrow('Select')
 const chart=importMusicXml(score,'D');expect(chart.bars[0].Snare.filter(Boolean)).toHaveLength(4);expect(chart.bars[0].Ride?.some(Boolean)).toBe(false)
 expect(()=>importMusicXml(score,'missing')).toThrow('missing');expect(()=>importMusicXml(score,'G')).toThrow()
})
it('rejects DTDs and malformed documents before offering track choices',()=>{expect(()=>musicXmlPartChoices('<!DOCTYPE x><score-partwise/>')).toThrow();expect(()=>musicXmlPartChoices('<bad/>')).toThrow()})
