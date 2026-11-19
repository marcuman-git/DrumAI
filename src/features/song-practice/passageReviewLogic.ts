import {newSongChart,isSongChart} from './songChartLogic'
import type {RecognitionDraft} from './notationRecognition'
export interface PassagePixels {pixels:Uint8ClampedArray;width:number;height:number}
/** User boundaries are percentages of one selected staff, never inferred measure parsing. */
export function splitPassage(pixels:Uint8ClampedArray,width:number,height:number,boundaries:readonly number[]):PassagePixels[]{
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<20||height<20||width*height>810000||pixels.length!==width*height*4||boundaries.length<3||boundaries.length>9||boundaries[0]!==0||boundaries.at(-1)!==100||boundaries.some((value,i)=>!Number.isFinite(value)||value<0||value>100||i>0&&value<=boundaries[i-1]))throw new Error('Set increasing bar boundaries from 0% to 100%, for 2–8 bars.')
 return boundaries.slice(0,-1).map((start,i)=>{const left=Math.round(start/100*width),right=Math.round(boundaries[i+1]/100*width),w=right-left;if(w<20)throw new Error('Each bar needs at least 20 pixels. Select a larger passage or fewer bars.');const crop=new Uint8ClampedArray(w*height*4);for(let row=0;row<height;row++)crop.set(pixels.subarray((row*width+left)*4,(row*width+right)*4),row*w*4);return {pixels:crop,width:w,height}})
}
export function passageDraftsReady(drafts:readonly (RecognitionDraft|null)[]):boolean{return drafts.length>=2&&drafts.length<=8&&drafts.every(d=>!!d)&&new Set(drafts.map(d=>d!.bar.beats??4)).size===1&&isSongChart({...newSongChart(),meter:drafts[0]!.bar.beats===2?'2/4':'4/4',bars:drafts.map(d=>d!.bar)})}
