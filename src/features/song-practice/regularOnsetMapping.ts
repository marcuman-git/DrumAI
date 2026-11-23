import {completeBar} from './chartKit'
import type {ChartBar} from './chartKit'
import type {NoteCandidate} from './notationRecognition'
import type {StaffCountMode} from './staffCountLabels'
/** Explicit regular-pattern assumption, independent of crop padding and bar edges. */
export function regularOnsetMapping(notes:readonly NoteCandidate[],gap:number,slots:number,mode:StaffCountMode):{bar:ChartBar|null;reason:string;columns:number}{
 const stride=mode==='quarter'?4:mode==='eighth'?2:1
 if(!Number.isFinite(gap)||gap<4||![8,16].includes(slots))return {bar:null,reason:'Invalid staff or source meter.',columns:0}
 const groups:NoteCandidate[][]=[]
 for(const note of [...notes].sort((a,b)=>a.x-b.x)){const group=groups.at(-1);if(group&&Math.abs(note.x-group[0].x)<=gap*.65)group.push(note);else groups.push([note])}
 const expected=slots/stride
 if(groups.length!==expected)return {bar:null,reason:`This assumption requires ${expected} onset columns; checked heads form ${groups.length}. Use manual onset review for rests or mixed spacing.`,columns:groups.length}
 const centers=groups.map(g=>g.reduce((sum,n)=>sum+n.x,0)/g.length),distances=centers.slice(1).map((x,i)=>x-centers[i])
 if(Math.min(...distances)<=gap*.9||Math.max(...distances)/Math.min(...distances)>1.6)return {bar:null,reason:'Onset columns are not regular enough. Use manual onset review.',columns:groups.length}
 if(groups.some(g=>new Set(g.map(n=>n.instrument)).size!==g.length))return {bar:null,reason:'Two checked heads share one instrument and onset. Review duplicate candidates before building.',columns:groups.length}
 const bar:ChartBar={...completeBar(),...(slots===8?{beats:2 as const}:{})}
 groups.forEach((group,i)=>group.forEach(note=>{bar[note.instrument]![i*stride]=2}))
 return {bar,reason:`${notes.length} checked heads mapped to ${groups.length} regular onset columns. Verify this timing assumption against the source.`,columns:groups.length}
}
