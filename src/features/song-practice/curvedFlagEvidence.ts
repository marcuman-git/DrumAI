import type {RecognitionImage,StaffCandidate} from './notationRecognition'
import type {StemGeometry} from './beamFlagEvidence'
/** Count curves connected to the right of the stem, excluding staff-line paths and the head. */
export function inspectConnectedFlags(image:RecognitionImage,staff:StaffCandidate,stem:StemGeometry):{bands:number;corroboratedBands:number} {
 const gap=staff.gap,limit=Math.floor(Math.min(gap*3.2,stem.length-gap*.8)),maxX=Math.ceil(gap*1.4)
 if(limit<gap||stem.length<gap*2)return {bands:0,corroboratedBands:0}
 const onStaff=(y:number)=>Array.from({length:5},(_,i)=>staff.top+i*gap).some(line=>Math.abs(line-y)<=1)
 const at=(dx:number,d:number)=>{const x=Math.round(stem.x+dx),y=Math.round(stem.end-stem.direction*d);if(x<0||x>=image.width||y<0||y>=image.height)return {bands:0,corroboratedBands:0};const index=y*image.width+x;return image.ink[index]||(gap<10&&image.stemInk?.[index]&&!(x>=2&&x+2<image.width&&image.stemInk[index-2]&&image.stemInk[index+2])?1:0)}
 const seen=new Set<number>(),queue:[number,number][]=[]
 for(let d=0;d<=limit;d++){const y=stem.end-stem.direction*d;if(!onStaff(y)&&at(1,d)&&at(2,d))queue.push([2,d])}
 while(queue.length){const [x,d]=queue.pop()!;const key=d*(maxX+1)+x;if(x<2||x>maxX||d<0||d>limit||seen.has(key)||!at(x,d)||onStaff(stem.end-stem.direction*d))continue;seen.add(key)
  for(const dx of [-1,0,1])for(const dd of [-1,0,1])if(dx||dd)queue.push([x+dx,d+dd])
  // A thin staff line may interrupt the curve; bridge only across excluded rows on this column.
  for(const direction of [-1,1])for(let skip=2;skip<=4;skip++)if(Array.from({length:skip-1},(_,i)=>onStaff(stem.end-stem.direction*(d+direction*(i+1)))).every(Boolean)){for(let shift=-Math.ceil(skip*.6);shift<=Math.ceil(skip*.6);shift++)queue.push([x+shift,d+direction*skip])}
 }
 const rows=[...seen].map(key=>Math.floor(key/(maxX+1)))
 if(!rows.length||Math.max(...rows)-Math.min(...rows)<gap*.8)return {bands:0,corroboratedBands:0}
 const counts:number[]=[];let best=0
 for(let x=Math.max(3,Math.round(gap*.4));x<=gap*1.1;x++){
  let count=0,length=0
  for(let d=0;d<=limit+1;d++){
   if(d<=limit&&onStaff(stem.end-stem.direction*d))continue
   if(seen.has(d*(maxX+1)+x))length++
   else if(length){if(length>=Math.max(gap<10?2:1,Math.round(gap*.1)))count++;length=0}
  }
  counts.push(count);best=Math.max(best,count)
 }
 let consecutive=0,corroborated=0;for(const count of counts){consecutive=count===2?consecutive+1:0;corroborated=Math.max(corroborated,consecutive)}
 return {bands:best,corroboratedBands:corroborated>=Math.max(2,Math.round(gap*.18))?2:0}
}

export function connectedFlagBands(image:RecognitionImage,staff:StaffCandidate,stem:StemGeometry):number{return inspectConnectedFlags(image,staff,stem).bands}
