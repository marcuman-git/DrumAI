import {expect,it} from 'vitest'
import {attachSourceAnchors,validSourceAnchor,validSourceCrop,cropContainingAnchor} from './sourceTrace'
import {reviewedBar} from './reviewedRhythm'
import {newSongChart,isSongChart} from './songChartLogic'
import {changeChartMeter} from './chartMeter'
import type {RhythmEvent} from './rhythmTypes'
const events:RhythmEvent[]=[{instrument:'Snare',step:0,duration:4,kind:'note',dynamic:2,sourceCandidateId:7},{instrument:'Snare',step:4,duration:4,kind:'rest',dynamic:2}]
it('maps reviewed heads to original normalized PDF locations and retains provenance after meter restructuring',()=>{const crop={page:2,region:{x:.2,y:.3,width:.4,height:.2}},bar=attachSourceAnchors(reviewedBar(events,8),events,[{id:7,x:40,y:50,instrument:'Snare',shape:'oval',strength:1,stemHint:true,flagHint:false}],{width:200,height:100,angle:0},crop);expect(bar.rhythmEvents![0].sourceAnchor).toEqual({page:2,x:.28,y:.4});expect(bar.rhythmEvents![1].sourceAnchor).toBeUndefined();const chart={...newSongChart(),bars:[bar,structuredClone(bar)],meter:'2/4' as const};const joined=changeChartMeter(chart,'4/4');expect(joined.bars[0].rhythmEvents![0].sourceAnchor).toEqual(bar.rhythmEvents![0].sourceAnchor);expect(isSongChart(JSON.parse(JSON.stringify(joined)))).toBe(true);expect(cropContainingAnchor([crop],bar.rhythmEvents![0].sourceAnchor)).toEqual(crop)})
it('rejects malformed source locations without accepting invalid chart events',()=>{expect(validSourceCrop({page:1,region:{x:.9,y:0,width:.2,height:1}})).toBe(false);expect(validSourceAnchor({page:1,x:NaN,y:.2})).toBe(false);expect(validSourceAnchor({page:1000,x:0,y:0})).toBe(false);const chart={...newSongChart(),bars:[reviewedBar(events,8)],meter:'2/4' as const};chart.bars[0].rhythmEvents![0].sourceAnchor={page:1,x:2,y:0};expect(isSongChart(chart)).toBe(false)})

it('validates saved render detail while accepting legacy crops',()=>{const region={x:0,y:0,width:1,height:1};expect(validSourceCrop({page:1,region})).toBe(true);expect(validSourceCrop({page:1,region,renderZoom:2})).toBe(true);expect(validSourceCrop({page:1,region,renderZoom:3})).toBe(false)})
