import {REAL_REST_TEMPLATES} from './realRestTemplates'
import type {RecognitionImage,StaffCandidate} from './notationRecognition'
import type {RestCandidate} from './restRecognition'
/** Source-derived hints use shape and empty surroundings; they remain manually reviewed suggestions. */
export function sourceRestHints(image:RecognitionImage,staff:StaffCandidate,heads:readonly {x:number;y:number}[]):RestCandidate[]{
 const at=(x:number,y:number)=>x>=0&&x<image.width&&y>=0&&y<image.height?image.ink[Math.round(y)*image.width+Math.round(x)]??0:0
 const onStaff=(y:number)=>Array.from({length:5},(_,i)=>staff.top+i*staff.gap).some(line=>Math.abs(y-line)<=1)
 const found:RestCandidate[]=[]
 for(const template of REAL_REST_TEMPLATES)for(const xSize of [.7,.85,1])for(const ySize of [.85,1,1.15]){
  const sx=staff.gap/template.gap*xSize,sy=staff.gap/template.gap*ySize,w=Math.ceil(template.rows[0].length*sx),h=Math.ceil(template.rows.length*sy)
  for(let y=Math.max(0,Math.floor(staff.top+staff.gap*.5));y<Math.min(image.height-h,staff.top+staff.gap*2.4);y++)for(let x=0;x<image.width-w;x++){
   if(!at(x+Math.round(4*sx),y+Math.round(3*sy)))continue
   const cx=x+template.anchorX*sx,cy=y+template.anchorY*sy
   if(heads.some(head=>Math.abs(head.x-cx)<staff.gap*.9&&Math.abs(head.y-cy)<staff.gap*1.2))continue
   let hits=0,expected=0,extra=0,empty=0
   template.rows.forEach((row,dy)=>{const py=y+Math.round(dy*sy);if(onStaff(py))return;for(let dx=0;dx<row.length;dx++){const dark=at(x+Math.round(dx*sx),py);if(row[dx]==='1'){expected++;hits+=dark}else{empty++;extra+=dark}}})
   const score=expected>=20&&empty>=40?hits/expected-extra/empty*.7:0
   if(score<.84)continue
   let marginInk=0,marginTotal=0
   for(let yy=y;yy<=y+h;yy++){if(onStaff(yy))continue;for(const xx of [x-2,x-1,x+w,x+w+1]){marginInk+=at(xx,yy);marginTotal++}}
   if(marginTotal&&marginInk/marginTotal>.12)continue
   const candidate:RestCandidate={id:0,x:Math.round(cx),y:Math.round(cy),duration:template.duration,strength:score,sourceTemplate:true,bounds:{left:x,top:y,width:w,height:h}}
   const index=found.findIndex(item=>Math.abs(item.x-candidate.x)<staff.gap&&Math.abs(item.y-candidate.y)<staff.gap*1.5)
   if(index<0)found.push(candidate);else if(score>found[index].strength)found[index]=candidate
  }
 }
 return found.sort((a,b)=>a.x-b.x).slice(0,64).map((candidate,id)=>({...candidate,id}))
}
