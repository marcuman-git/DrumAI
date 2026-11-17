import type { RecognitionImage, StaffCandidate } from './notationRecognition'
export interface StemGeometry { x: number; end: number; length: number; direction: number }
export interface BeamFlagEvidence { beamBands: number; flagBands: number; evidence: 'beam' | 'flag' | 'none'; clipped: boolean }
/** Count separated bands along local slopes; staff-line ink never supplies support. */
export function inspectBeamFlags(image: RecognitionImage, staff: StaffCandidate, stem: StemGeometry): BeamFlagEvidence {
 const {width,height,ink}=image; const gap=staff.gap
 const at=(x:number,y:number)=>x>=0&&y>=0&&x<width&&y<height ? ink[Math.round(y)*width+Math.round(x)]??0 : 0
 const staffLines=Array.from({length:5},(_,i)=>staff.top+i*gap)
 const onStaff=(y:number)=>staffLines.some(line=>Math.abs(line-y)<=1)
 const clipped=stem.end<=1||stem.end>=height-2
 if(stem.length<gap*1.6) return {beamBands:0,flagBands:0,evidence:'none',clipped}
 const distance=Math.floor(Math.min(gap*1.8,stem.length-gap*0.8))
 function runs(rows: (boolean|null)[], minimum=1) {
  const lengths:number[]=[]; let length=0
  for(const value of [...rows,false]) {if(value===null)continue; if(value)length++;else if(length){lengths.push(length);length=0}}
  return lengths.filter(length=>length>=minimum).length
 }
 let beamBands=0; let bestSupport=0; let shortBands=0
 for(const side of [-1,1]) for(const slope of [0,-0.15,0.15,-0.3,0.3,-0.45,0.45]) {
  const rows:(boolean|null)[]=[]; const shortRows:(boolean|null)[]=[]; let support=0
  for(let index=-2;index<=distance;index++) {
   const y=stem.end-stem.direction*index; let dark=0;let total=0;let shortDark=0;let shortTotal=0
   for(let dx=3;dx<=gap*1.8;dx++) {
    const row=y+slope*dx*side; const column=stem.x+side*dx
    if(onStaff(row)||row<0||row>=height||column<0||column>=width)continue
    total++;dark+=at(column,row);if(dx<=gap*0.85){shortTotal++;shortDark+=at(column,row)}
   }
   const attached=!!at(stem.x+side*2,y)&&!!at(stem.x+side*3,y);
   const supported=attached&&total>=Math.max(4,gap*0.65)&&dark/total>=0.7
   shortRows.push(shortTotal<3?null:shortDark/shortTotal>=0.7&&attached);
   rows.push(total<4?null:supported);if(supported)support+=dark/total
  }
  const count=runs(rows)
  if(support>bestSupport){bestSupport=support;beamBands=count}
  shortBands=Math.max(shortBands,runs(shortRows,2))
 }
 if(beamBands)beamBands=Math.max(beamBands,shortBands)
 let flagBands=0
 if(!beamBands&&stem.length>=gap*2) {
  // Flags curve to the right for both stem directions. Count separated short clusters.
  const rows:(boolean|null)[]=[]
  for(let index=1;index<=gap*1.8;index++) {
   const y=stem.end-stem.direction*index
   if(onStaff(y)){rows.push(null);continue}
   let dark=0
   for(let dx=3;dx<=Math.max(6,gap*0.8);dx++)dark+=at(stem.x+dx,y)
   rows.push(dark>=Math.max(3,gap*0.22))
  }
  flagBands=runs(rows,Math.max(2,Math.round(gap*0.18)))
 }
 return {beamBands,flagBands,evidence:beamBands?'beam':flagBands?'flag':'none',clipped}
}
