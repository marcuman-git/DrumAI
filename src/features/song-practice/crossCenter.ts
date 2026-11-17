import type { RecognitionImage, StaffCandidate } from './notationRecognition'
/** Fit both cross diagonals while excluding staff lines and the stem's outer column. */
export function crossHeadCenter(image: RecognitionImage, staff: StaffCandidate, x: number, y: number): number {
 const half=Math.max(3,Math.round(staff.gap*0.4));const lines=Array.from({length:5},(_,i)=>staff.top+i*staff.gap)
 const at=(px:number,py:number)=>px>=0&&py>=0&&px<image.width&&py<image.height?image.ink[Math.round(py)*image.width+Math.round(px)]??0:0
 let best=y;let score=-1
 for(let center=Math.round(y-staff.gap*0.35);center<=y+staff.gap*0.35;center++) for (const slope of [0.6, 0.8, 1]) {
  let dark=0;let total=0
  for(let dx=2;dx<=half;dx++)for(const sign of [-1,1]) {
   const upper=center-Math.round(dx*slope)*sign;const lower=center+Math.round(dx*slope)*sign
   if(lines.some(line=>Math.abs(line-upper)<=1||Math.abs(line-lower)<=1))continue
   total++;dark+=at(x-dx,upper)*at(x+dx,lower)
  }
  const value=total>=4?dark/total:-1
  if(value>score||value===score&&Math.abs(center-y)<Math.abs(best-y)){score=value;best=center}
 }
 return score>=0.5?best:y
}
