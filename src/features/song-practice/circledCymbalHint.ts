import type { RecognitionImage, StaffCandidate } from './notationRecognition'
/** Ring around the head, distinct from an open-hi-hat marker above a head. Identity stays manual. */
export function hasCircledCymbalHead(image: RecognitionImage, staff: StaffCandidate, x: number, y: number): boolean {
 const {width,height,ink}=image; const gap=staff.gap
 const at=(px:number,py:number)=>px>=0&&py>=0&&px<width&&py<height?ink[Math.round(py)*width+Math.round(px)]??0:0
 for(let radius=Math.max(4,Math.round(gap*0.5));radius<=gap*0.95;radius++)for(const shift of [-1,0,1]) {
  const cy=y+shift
  if(x-radius<0||x+radius>=width||cy-radius<0||cy+radius>=height)continue
  const quadrants=[0,0,0,0]
  for(let step=0;step<32;step++) {
   const angle=step/32*Math.PI*2;let supported=0
   for(const adjustment of [-1,0,1])supported=Math.max(supported,at(x+Math.cos(angle)*(radius+adjustment),cy+Math.sin(angle)*(radius+adjustment)))
   quadrants[Math.floor(step/8)]+=supported
  }
  if(quadrants.some(count=>count<6))continue
  let dark=0;let area=0
  const inner=Math.max(2,Math.round(radius*0.55))
  for(let dy=-inner;dy<=inner;dy++)for(let dx=-inner;dx<=inner;dx++)if(dx*dx+dy*dy<=inner*inner){area++;dark+=at(x+dx,cy+dy)}
  if(dark/area<0.7)return true
 }
 return false
}
