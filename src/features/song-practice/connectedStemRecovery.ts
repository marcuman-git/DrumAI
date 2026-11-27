import type {RecognitionImage,StaffCandidate,NoteCandidate} from './notationRecognition'
/** Recover a stem through actual connected head ink when a stylized cross center sits below its attachment. */
export function connectedStemRecovery(image:RecognitionImage,staff:StaffCandidate,note:NoteCandidate){
 const gap=staff.gap,at=(x:number,y:number)=>x>=0&&y>=0&&x<image.width&&y<image.height?(image.ink[y*image.width+x]??0):0,left=Math.max(0,Math.floor(note.x-gap)),right=Math.min(image.width-1,Math.ceil(note.x+gap)),top=Math.max(0,Math.floor(note.y-gap)),bottom=Math.min(image.height-1,Math.ceil(note.y+gap)),connected=new Set<number>(),queue:[number,number][]=[]
 for(let y=Math.round(note.y)-2;y<=Math.round(note.y)+2;y++)for(let x=Math.round(note.x)-2;x<=Math.round(note.x)+2;x++)if(at(x,y))queue.push([x,y])
 while(queue.length&&connected.size<Math.ceil(gap*gap*4)){const [x,y]=queue.pop()!,key=y*image.width+x;if(x<left||x>right||y<top||y>bottom||!at(x,y)||connected.has(key))continue;connected.add(key);const onStaff=Array.from({length:5},(_,i)=>staff.top+i*gap).some(line=>Math.abs(y-line)<=1);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)if((dx||dy)&&(!onStaff||dx===0))queue.push([x+dx,y+dy])}
 let best:{length:number;x:number;end:number;direction:number;support:number}|undefined
 for(const direction of [-1,1])for(let x=left;x<=right;x++){let y:number|undefined;for(let distance=Math.floor(gap);distance>=2;distance--){const py=Math.round(note.y+direction*distance);if(connected.has(py*image.width+x)){y=py;break}}if(y===undefined)continue;let end=y,missing=0,support=0;for(let d=1;d<=gap*9;d++){const py=y+direction*d;if(py<0||py>=image.height)break;if(at(x,py)){missing=0;end=py;support++}else if(++missing>1)break}const length=Math.abs(end-note.y),run=Math.abs(end-y);if(run<gap*1.6||support<run*.8)continue;if(!best||length>best.length||length===best.length&&support>best.support)best={length,x,end,direction,support}}
 return best
}
