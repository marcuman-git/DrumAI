import type {RecognitionImage,StaffCandidate} from './notationRecognition'
export function beamContextEvidence(image:RecognitionImage,staff:StaffCandidate,left:{x:number;y:number},right:{x:number;y:number}):'connected'|'interrupted'|'none'{
 const dx=right.x-left.x,dy=right.y-left.y
 if(Math.abs(dx)<staff.gap*.8||Math.abs(dx)>staff.gap*7||Math.abs(dy/dx)>.5)return 'none'
 const at=(x:number,y:number)=>x>=0&&x<image.width&&y>=0&&y<image.height?image.ink[Math.round(y)*image.width+Math.round(x)]??0:0
 let dark=0,total=0,missing=0,maxMissing=0
 for(let d=3;d<Math.abs(dx)-2;d++){
  const x=left.x+Math.sign(dx)*d,y=left.y+dy*d/Math.abs(dx)
  if(Array.from({length:5},(_,i)=>staff.top+i*staff.gap).some(line=>Math.abs(line-y)<=1))continue
  total++;const support=Math.max(at(x,y-1),at(x,y),at(x,y+1));dark+=support;missing=support?0:missing+1;maxMissing=Math.max(maxMissing,missing)
 }
 if(total<staff.gap)return 'none'
 if(dark/total>=.8&&maxMissing<=Math.max(1,Math.round(staff.gap*.18)))return 'connected'
 if(dark/total>=.65&&maxMissing<=Math.max(2,Math.round(staff.gap*.5)))return 'interrupted'
 return 'none'
}
