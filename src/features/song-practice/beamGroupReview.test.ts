import {expect,it} from 'vitest'
import {beamReviewGroups,setBeamGroupDuration} from './beamGroupReview'
import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
import type {RhythmEvent} from './rhythmTypes'
const notes:NoteCandidate[]=[0,1,2].map(id=>({id,x:20+id*20,y:40,instrument:'Snare',shape:'oval',strength:1,stemHint:true,flagHint:false}))
const base:NoteValueHint={value:'eighth',stemDirection:'up',beamBands:1,left:0,top:0,width:1,height:1}
it('identifies mixed ink-linked groups without changing their individual hints',()=>{const hints={0:{...base,contextNeighbours:[1]},1:{...base,value:'sixteenth' as const,contextNeighbours:[0]},2:{...base}};const before=structuredClone(hints),groups=beamReviewGroups(notes,hints);expect(groups).toHaveLength(1);expect(groups[0].ids).toEqual([0,1]);expect(groups[0].mixed).toBe(true);expect(hints).toEqual(before)})
it('changes linked note durations only after an explicit choice and retains rests and ties',()=>{const events:RhythmEvent[]=[{sourceCandidateId:0,instrument:'Snare',step:0,duration:1,kind:'note',dynamic:3,tieFromPrevious:true},{sourceCandidateId:1,instrument:'Snare',step:4,duration:4,kind:'rest',dynamic:2},{sourceCandidateId:2,instrument:'Kick',step:8,duration:4,kind:'note',dynamic:2}],before=structuredClone(events);const next=setBeamGroupDuration(events,[0,1],2);expect(next[0]).toMatchObject({step:0,duration:2,tieFromPrevious:true,dynamic:3});expect(next[1]).toEqual(events[1]);expect(next[2]).toEqual(events[2]);expect(events).toEqual(before)})
