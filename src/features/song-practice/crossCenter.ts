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

/** Refine a displaced dense-scan cross only when both diagonals improve together. */
export function refineCrossHeadCenter(image:RecognitionImage,staff:StaffCandidate,x:number,y:number):{x:number;y:number}{
 const radius=Math.max(3,Math.round(staff.gap*.4)),reach=Math.max(2,Math.round(staff.gap*.6))
 const lines=Array.from({length:5},(_,i)=>staff.top+i*staff.gap)
 const at=(px:number,py:number)=>px>=0&&py>=0&&px<image.width&&py<image.height?image.ink[Math.round(py)*image.width+Math.round(px)]??0:0
 function fit(cx:number,cy:number){let best=0;for(const slope of [.6,.8,1]){let support=0,total=0;for(let dx=1;dx<=radius;dx++)for(const sign of [-1,1]){const dy=Math.round(dx*slope)*sign;if(lines.some(line=>Math.abs(line-(cy-dy))<=1||Math.abs(line-(cy+dy))<=1))continue;total++;support+=Math.max(at(cx-dx,cy-dy-1),at(cx-dx,cy-dy),at(cx-dx,cy-dy+1))*Math.max(at(cx+dx,cy+dy-1),at(cx+dx,cy+dy),at(cx+dx,cy+dy+1))}if(total>=4)best=Math.max(best,support/total)}return best}
 const original=fit(x,y);if(original>=.8)return {x,y};let best={x,y,score:original}
 for(let dx=-reach;dx<=reach;dx++)for(let dy=-Math.round(staff.gap*.45);dy<=staff.gap*.45;dy++){const score=fit(x+dx,y+dy);if(score>best.score||score===best.score&&Math.hypot(dx,dy)<Math.hypot(best.x-x,best.y-y))best={x:x+dx,y:y+dy,score}}
 return best.score>=.85&&best.score>original+.2?{x:best.x,y:best.y}:{x,y}
}
