import type {NoteCandidate} from './notationRecognition'
import type {NoteValueHint} from './noteValueHints'
import type {RhythmEvent} from './rhythmTypes'
import {timeTick,tickTime,supportedDuration,decomposeTime} from './rhythmTime'
import {checkReviewedRhythm} from './reviewedRhythm'
export interface TimingColumn {ids:number[];x:number}
export interface TimingOptions {slots:number;gap:number;columns?:TimingColumn[];anchors?:Record<number,number>;durations?:Record<number,number>;existing?:readonly RhythmEvent[];useBeams?:boolean}
export interface TimingProposal {label:string;events:RhythmEvent[];onsets:Record<number,number>;assumedRestSlots:number}
export interface TimingResolution {status:'resolved'|'ambiguous'|'blocked';columns:TimingColumn[];ranges:number[][];proposals:TimingProposal[];issues:string[];warnings:string[];beamLinks:number}
/** Physical columns identify simultaneity. Pixel distances never become musical durations. */
export function timingColumns(notes:readonly NoteCandidate[],hints:Record<number,NoteValueHint>,gap:number):TimingColumn[]{
 const groups:NoteCandidate[][]=[]
 for(const note of [...notes].sort((a,b)=>a.x-b.x||a.id-b.id)){const group=groups.find(g=>g.some(n=>(hints[n.id]?.sharedStemNeighbours??[]).includes(note.id)||(hints[note.id]?.sharedStemNeighbours??[]).includes(n.id))||Math.abs(note.x-g[0].x)<=gap*.4);if(group)group.push(note);else groups.push([note])}
 return groups.map(g=>({ids:g.map(n=>n.id),x:g.reduce((n,v)=>n+v.x,0)/g.length})).sort((a,b)=>a.x-b.x)
}
export function sourceDuration(hint?:NoteValueHint):number|undefined{
 if(!hint)return undefined
 const value=hint.value==='quarter'?4:hint.value==='eighth'?2:hint.value==='sixteenth'?1:undefined
 if(hint.manualReviewed)return value
 if(hint.clippedStem||hint.possibleDot||hint.stemDirection==='unknown')return undefined
 // Conflicting isolated-flag counts are not converted into an authoritative value.
 const comparison=hint.evidenceComparison
 if(hint.evidence==='flag'&&hint.value==='sixteenth'&&comparison&&comparison.curveFlagBands===2&&comparison.corroboratedFlagBands===0)return undefined
 return value
}
interface Edge {from:number;to:number;min:number;exact?:number}
/** Bounded difference constraints: source order, voice coverage, beam chains and explicit anchors. */
export function resolveMusicalTiming(notes:readonly NoteCandidate[],hints:Record<number,NoteValueHint>,options:TimingOptions):TimingResolution{
 const {slots,gap}=options,columns=options.columns??timingColumns(notes,hints,gap),issues:string[]=[],warnings:string[]=[],existing=options.existing??[],durations=new Map<number,number>(),locked=new Map<number,RhythmEvent>(),index=new Map(columns.flatMap((c,i)=>c.ids.map(id=>[id,i] as const)))
 const result:TimingResolution={status:'blocked',columns,ranges:[],proposals:[],issues,warnings,beamLinks:0}
 if(![8,16].includes(slots)||!Number.isFinite(gap)||gap<4||!notes.length||notes.length>128||columns.length>64||new Set(notes.map(n=>n.id)).size!==notes.length||notes.some(n=>!Number.isInteger(n.id)||n.id<0||!Number.isFinite(n.x)||!Number.isFinite(n.y))){issues.push('Choose one supported bar with at most64 onset columns and128 checked heads.');return result}
 const ids=columns.flatMap(c=>c.ids);if(ids.length!==notes.length||new Set(ids).size!==ids.length||ids.some(id=>!notes.some(n=>n.id===id))||columns.some(c=>!c.ids.length||!Number.isFinite(c.x))){issues.push('Every checked head must occur in exactly one onset column.');return result}
 for(const column of columns)if(new Set(column.ids.map(id=>notes.find(n=>n.id===id)!.instrument)).size!==column.ids.length)issues.push('Two checked heads occupy one instrument/onset column. Resolve duplicate detections before timing review.')
 for(const event of existing)if(event.sourceCandidateId!==undefined&&!locked.has(event.sourceCandidateId))locked.set(event.sourceCandidateId,event)
 for(const note of notes){const old=locked.get(note.id);if(old?.kind==='rest'){issues.push(`Head #${note.id+1}: a checked notehead is represented as a rest. Uncheck the rejected head or restore its note event.`);continue}const duration=old?.duration??options.durations?.[note.id]??sourceDuration(hints[note.id]);if(duration===undefined||!supportedDuration(duration)){issues.push(`Head #${note.id+1}: choose a reviewed duration; clipped, dotted or unresolved flags need an explicit value.`);continue}durations.set(note.id,duration);if(!old&&!hints[note.id]?.manualReviewed)warnings.push(`Head #${note.id+1}: duration remains a source suggestion; compare its stem, beam/flag and dot.`)}
 if(issues.length)return result
 const total=timeTick(slots),gcd=(a:number,b:number):number=>b?gcd(b,a%b):a
 let quantum=[...durations.values(),...Object.values(options.anchors??{}),...existing.map(e=>e.step)].reduce((n,v)=>gcd(n,timeTick(v)),gcd(total,12));quantum=Math.max(1,quantum)
 const domains=columns.map(c=>Array.from({length:Math.max(0,Math.floor((total-Math.max(...c.ids.map(id=>timeTick(durations.get(id)!))))/quantum)+1)},(_,i)=>i*quantum))
 const fixed=existing.filter(e=>e.sourceCandidateId===undefined||!index.has(e.sourceCandidateId)||locked.get(e.sourceCandidateId)!==e)
 for(const [i,column] of columns.entries()){
  const anchors=column.ids.flatMap(id=>{const anchor=locked.get(id)?.step??options.anchors?.[id];return anchor===undefined?[]:[anchor]})
  if(anchors.some(a=>!Number.isFinite(a)||a<0||a>=slots||Math.abs(a-tickTime(timeTick(a)))>.001)||new Set(anchors.map(timeTick)).size>1){issues.push(`Column ${i+1}: simultaneous heads have conflicting or invalid anchors.`);continue}
  if(anchors.length)domains[i]=domains[i].filter(t=>t===timeTick(anchors[0]))
  domains[i]=domains[i].filter(t=>column.ids.every(id=>{const note=notes.find(n=>n.id===id)!,instrument=locked.get(id)?.instrument??note.instrument;return fixed.every(e=>e.instrument!==instrument||t+timeTick(durations.get(id)!)<=timeTick(e.step)||t>=timeTick(e.step+e.duration))}))
 }
 const edges:Edge[]=columns.slice(1).map((_,i)=>({from:i,to:i+1,min:quantum}))
 const prior=new Map<string,{column:number;id:number}>()
 for(const [i,column] of columns.entries())for(const id of column.ids){const note=notes.find(n=>n.id===id)!,instrument=locked.get(id)?.instrument??note.instrument,previous=prior.get(instrument);if(previous)edges.push({from:previous.column,to:i,min:timeTick(durations.get(previous.id)!)});prior.set(instrument,{column:i,id})}
 if(options.useBeams!==false)for(const [i,column] of columns.entries()){
  const peers=column.ids.flatMap(id=>(hints[id]?.contextNeighbours??[]).flatMap(peer=>{const j=index.get(peer);return j!==undefined&&j>i&&hints[id]?.stemDirection===hints[peer]?.stemDirection?[{id,j}]:[]}))
  if(!peers.length)continue;const nearest=Math.min(...peers.map(p=>p.j)),values=[...new Set(peers.filter(p=>p.j===nearest).map(p=>timeTick(durations.get(p.id)!)))]
  if(values.length!==1){issues.push(`Column ${i+1}: connected stems disagree on their advancing duration. Review voices or break the beam timing assumption.`);continue}
  edges.push({from:i,to:nearest,min:values[0],exact:values[0]});result.beamLinks++
 }
 function propagate(values:number[][]):boolean{let changed=true,passes=0;while(changed&&++passes<512){changed=false;for(const edge of edges){let a=values[edge.from],b=values[edge.to];const bs=new Set(b),as=new Set(a),nextA=a.filter(t=>edge.exact!==undefined?bs.has(t+edge.exact):b.length&&t+edge.min<=b.at(-1)!),nextB=b.filter(t=>edge.exact!==undefined?as.has(t-edge.exact):a.length&&t-edge.min>=a[0]);if(nextA.length!==a.length||nextB.length!==b.length)changed=true;values[edge.from]=a=nextA;values[edge.to]=b=nextB;if(!a.length||!b.length)return false}if(values.some(v=>!v.length))return false}return !changed}
 if(issues.length||!propagate(domains)){issues.push('Source durations, beam links, bar length or manual anchors conflict. Check missing heads, rests, voices and beam interruptions; no notes were changed.');return result}
 result.ranges=domains.map(values=>values.map(tickTime))
 let searchLimited=false
 function proposal(latest:boolean):TimingProposal|undefined{
  let visited=0
  function materialize(values:number[][]):TimingProposal|undefined{
  const onsets=Object.fromEntries(columns.flatMap((c,i)=>c.ids.map(id=>[id,tickTime(values[i][0])]))),events:RhythmEvent[]=[...fixed.map(e=>({...e}))]
  for(const note of notes){const old=locked.get(note.id);events.push({...old,sourceCandidateId:note.id,instrument:old?.instrument??note.instrument,step:onsets[note.id],duration:durations.get(note.id)!,kind:old?.kind??'note',dynamic:old?.dynamic??2})}
  let assumedRestSlots=0
  try{for(const instrument of new Set(events.map(e=>e.instrument))){let position=0;const voice=events.filter(e=>e.instrument===instrument).sort((a,b)=>a.step-b.step);for(const event of voice){if(timeTick(event.step)<timeTick(position))return undefined;if(timeTick(event.step)>timeTick(position)){const length=event.step-position;for(const fragment of decomposeTime(position,length))events.push({...fragment,instrument,kind:'rest',dynamic:2});assumedRestSlots+=length}position=event.step+event.duration}if(timeTick(position)<total){const length=slots-position;for(const fragment of decomposeTime(position,length))events.push({...fragment,instrument,kind:'rest',dynamic:2});assumedRestSlots+=length}}}catch{return undefined}
  if(!checkReviewedRhythm(events,slots).valid)return undefined
  return {label:latest?'Latest compatible placements':'Earliest compatible placements',events:events.sort((a,b)=>a.step-b.step||a.instrument.localeCompare(b.instrument)),onsets,assumedRestSlots}
  }
  function search(values:number[][]):TimingProposal|undefined{if(++visited>2000){searchLimited=true;return undefined}const index=values.findIndex(v=>v.length>1);if(index<0)return materialize(values);for(const tick of latest?[...values[index]].reverse():values[index]){const next=values.map(v=>[...v]);next[index]=[tick];if(propagate(next)){const found=search(next);if(found)return found}if(searchLimited)return undefined}return undefined}
  return search(domains.map(v=>[...v]))
 }
 const earliest=proposal(false),latest=proposal(true)
 if(earliest)result.proposals.push(earliest);if(latest&&JSON.stringify(latest.onsets)!==JSON.stringify(earliest?.onsets))result.proposals.push(latest)
 if(searchLimited)warnings.push('Timing search reached its bound. Add explicit onset anchors to reduce alternatives; no exhaustive accuracy claim is made.');
 if(!result.proposals.length){issues.push(searchLimited?'Add an onset anchor and retry this bounded timing search.':'No complete supported rhythm fits these constraints. Keep current edits and correct source timing manually.');return result}
 result.status=domains.every(d=>d.length===1)?'resolved':'ambiguous'
 if(result.status==='ambiguous')warnings.push('More than one timing fits. Add beat/rest anchors or compare the earliest/latest proposals; pixel spacing has not selected a winner.')
 if(result.proposals.some(p=>p.assumedRestSlots>0))warnings.push('Gap rests are proposed silence, not detected rest glyphs. Verify every voice against the source.')
 if(result.beamLinks)warnings.push('Connected beam stems are treated as consecutive rhythmic events. If a rest intervenes, disable beam timing and add explicit anchors.')
 return result
}
