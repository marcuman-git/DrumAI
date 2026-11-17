import type { RecognitionImage, StaffCandidate } from './notationRecognition'
/** Small isolated component to the right of a head; never confirms dotted timing. */
export function possibleNoteDot(image: RecognitionImage, staff: StaffCandidate, x: number, y: number): boolean {
 const {width,height,ink}=image;const gap=staff.gap;const radius=Math.max(2,Math.round(gap*0.48))
 const at=(px:number,py:number)=>px>=0&&py>=0&&px<width&&py<height?ink[py*width+px]??0:0
 const visited=new Set<number>(); const limit=Math.max(16,Math.ceil(gap*gap*0.25))
 for(let px=Math.ceil(x+radius+3);px<=x+gap*1.6;px++)for(let py=Math.ceil(y-gap*0.45);py<=y+gap*0.45;py++) {
  if(!at(px,py)||visited.has(py*width+px))continue
  const pending:[number,number][]=[[px,py]];const component=new Set<number>();let touchesKnown=false;let count=0;let left=px;let right=px;let top=py;let bottom=py
  while(pending.length&&count<=limit) {
   const [cx,cy]=pending.pop()!;const key=cy*width+cx
   if(!at(cx,cy))continue
   if(visited.has(key)){if(!component.has(key))touchesKnown=true;continue}
   component.add(key);visited.add(key);count++;left=Math.min(left,cx);right=Math.max(right,cx);top=Math.min(top,cy);bottom=Math.max(bottom,cy)
   for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if(dx||dy)pending.push([cx+dx,cy+dy])
  }
  if(!touchesKnown&&!pending.length&&count>=2&&count<=limit&&left>x+radius+2&&right-left+1<=Math.max(4,gap*0.55)&&bottom-top+1<=Math.max(4,gap*0.55)&&top>0&&bottom<height-1&&right<width-1) return true
 }
 return false
}
