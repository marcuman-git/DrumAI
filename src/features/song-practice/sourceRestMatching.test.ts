import {expect,it} from 'vitest'
import {benchmarkMixedGrooveRests} from './restSourceBenchmark'
import mixed from './realMixedGrooveFixtures'
import verse from './realVerseBeamFixtures'
import {detectRestHints} from './restRecognition'
import {benchmarkRestHoldouts} from './restHoldoutBenchmark'
it('recovers development rests across scales and reports separate-score failures rather than claiming general rest accuracy',()=>{expect(benchmarkMixedGrooveRests(mixed).filter(r=>r.recovered)).toHaveLength(4);const holdout=benchmarkRestHoldouts();expect(holdout.reduce((n,r)=>n+r.summary.references,0)).toBe(12);expect(holdout.reduce((n,r)=>n+r.summary.recovered,0)).toBe(3);expect(holdout.every(r=>!r.quarterMislabelled)).toBe(true);expect(holdout.reduce((n,r)=>n+r.summary.unmatched,0)).toBe(0)})
it('does not invent rest glyphs in a labelled rest-free mixed-beam source passage',()=>{for(const f of verse){const ink=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1;expect(detectRestHints({width:f.width,height:f.height,ink,angle:0,staffs:[f.staff]},f.staff,f.cases)).toEqual([])}})
it('rejects broad dark or gray backgrounds as source-derived rest shapes',()=>{const image={width:100,height:100,ink:new Uint8Array(10000).fill(1),stemInk:new Uint8Array(10000).fill(1),angle:0,staffs:[]};expect(detectRestHints(image,{top:40,gap:10})).toEqual([]);image.ink.fill(0);expect(detectRestHints(image,{top:40,gap:10})).toEqual([])})
