import {clearPickupReviews} from './collectionHistory'
import {validDraftPickup} from './chartPickup'
import {sourceFingerprint} from './sourceReviewSession'
import {splitPassage} from './passageReviewLogic'
import type {RecognitionDraft} from './notationRecognition'
import {isSongChart,newSongChart} from './songChartLogic'
import {validSourceCrop,type SourceCrop} from './sourceTrace'
export interface PassageSnapshot {version:1;sourceKey:string;sourceCrop?:SourceCrop;cuts:number[];drafts:(RecognitionDraft|null)[];sessions:(string|null)[];boundaryHistory?:{past:number[][];future:number[][]}}
export function savePassageSnapshot(sourceKey:string,cuts:number[],drafts:(RecognitionDraft|null)[],sessions:(string|null)[],sourceCrop?:SourceCrop,boundaryHistory?:{past:number[][];future:number[][]}):string{const text=JSON.stringify({version:1,sourceKey,sourceCrop,cuts,drafts,sessions,boundaryHistory} satisfies PassageSnapshot);if(text.length>8_000_000)throw new Error('Passage export exceeds the recovery limit.');return text}
export function restorePassageSnapshot(text:string,pixels:Uint8ClampedArray,width:number,height:number,source:string,page:number,sourceCrop?:SourceCrop):PassageSnapshot{
 if(text.length>8_000_000)throw new Error('Passage snapshot is too large.')
 const value=JSON.parse(text) as PassageSnapshot;if(!value||value.version!==1||value.sourceKey!==sourceFingerprint(pixels,width,height,source,page))throw new Error('Select the matching original source, page and crop before restoring.')
 if(sourceCrop&&(!validSourceCrop(value.sourceCrop)||JSON.stringify(sourceCrop)!==JSON.stringify(value.sourceCrop)))throw new Error('The saved source crop coordinates differ.')
 if(!Array.isArray(value.cuts))throw new Error('Invalid saved boundary plan.')
 const parts=splitPassage(pixels,width,height,value.cuts??[])
 if(!Array.isArray(value.drafts)||value.drafts.length!==parts.length||!Array.isArray(value.sessions)||value.sessions.length!==parts.length)throw new Error('Invalid passage snapshot.')
 for(const d of value.drafts)if(d&&((d.bars?.length??1)!==1||!validRecoveredDraft(d,true)||d.source!==source||d.page!==page))throw new Error('Invalid recovered bar or source reference.')
 const validPlans=(plans:unknown)=>Array.isArray(plans)&&plans.length<=20&&plans.every(cuts=>Array.isArray(cuts)&&cuts.length>=3&&cuts.length<=9&&cuts[0]===0&&cuts.at(-1)===100&&cuts.every(n=>Number.isFinite(n)&&n>=0&&n<=100))
 if(value.boundaryHistory&&(!validPlans(value.boundaryHistory.past)||!validPlans(value.boundaryHistory.future)))throw new Error('Invalid recovered boundary history.')
 if(value.sessions.some(s=>s!==null&&(typeof s!=='string'||s.length>1_000_000)))throw new Error('Invalid bar review session.')
 return {...value,drafts:value.drafts.map(d=>d?clearPickupReviews([d])[0]:null)}
}
export function validRecoveredDraft(d:RecognitionDraft,allowIncoming=false):boolean{
 if(!d||typeof d.source!=='string'||d.source.length>120||!Number.isInteger(d.page)||d.page<1||d.page>999)return false
 if(d.recovery!==undefined&&(typeof d.recovery!=='string'||d.recovery.length>8_000_000)||d.reviewSession!==undefined&&(typeof d.reviewSession!=='string'||d.reviewSession.length>1_000_000))return false
 if(!validDraftPickup(d))return false
 const bars=d.bars??[d.bar];if(!Array.isArray(bars)||!bars.length||bars.length>16||!bars[0])return false;if(bars.some(bar=>!bar||typeof bar!=='object'||bar.rhythmEvents!==undefined&&!Array.isArray(bar.rhythmEvents)))return false;if(bars.some(bar=>bar?.rhythmEvents?.some(e=>e.tieFromPrevious!==undefined&&typeof e.tieFromPrevious!=='boolean'||e.tieFromPrevious&&e.kind!=='note')))return false;const checked=allowIncoming?bars.map(bar=>{if(!bar?.rhythmEvents)return bar;const events=bar.rhythmEvents.map(e=>e.step===0?{...e,tieFromPrevious:false}:e);return {...bar,rhythmEvents:events,...Object.fromEntries(events.filter(e=>e.step===0&&e.kind==='note').map(e=>[e.instrument,(bar[e.instrument]??Array(16).fill(0)).map((n,i)=>i===0?e.dynamic:n)]))}}):bars;if(!bars.length||bars.length>16||!isSongChart({...newSongChart(),meter:bars[0].beats===2?'2/4':'4/4',bars:checked}))return false
 if(d.pages!==undefined&&(!Array.isArray(d.pages)||d.pages.length!==bars.length||d.pages.some(p=>!Number.isInteger(p)||p<1||p>999)))return false
 return d.references===undefined||Array.isArray(d.references)&&d.references.length===bars.length&&d.references.every(crops=>Array.isArray(crops)&&crops.length<=16&&crops.every(validSourceCrop))
}
export async function localPdfKey(file:File):Promise<string>{const bytes=new Uint8Array(await file.arrayBuffer());let hash=2166136261;for(const byte of bytes)hash=Math.imul(hash^byte,16777619)>>>0;return JSON.stringify([file.name,file.size,hash])}
export interface CollectionSnapshot {version:1;fileKey:string;sections:RecognitionDraft[];history?:{past:RecognitionDraft[][];future:RecognitionDraft[][]}}
export function restoreCollection(text:string,fileKey:string):CollectionSnapshot{if(text.length>8_000_000)throw new Error('Collection is too large.');const value=JSON.parse(text) as CollectionSnapshot;if(!value||value.version!==1||value.fileKey!==fileKey||!Array.isArray(value.sections)||value.sections.length>16||value.sections.some(d=>!validRecoveredDraft(d,true))||value.sections.reduce((n,d)=>n+(d.bars?.length??1),0)>16)throw new Error('Collection source or reviewed sections do not match.');
 const validStates=(states:unknown)=>Array.isArray(states)&&states.length<=20&&states.every(sections=>Array.isArray(sections)&&sections.length<=16&&sections.every(d=>validRecoveredDraft(d,true))&&sections.reduce((n,d)=>n+(d.bars?.length??1),0)<=16)
 if(value.history&&(!validStates(value.history.past)||!validStates(value.history.future)))throw new Error('Invalid saved collection history.')
 return {...value,sections:clearPickupReviews(value.sections),history:value.history?{past:value.history.past.map(clearPickupReviews),future:value.history.future.map(clearPickupReviews)}:undefined}}
/** Bound the actual UTF-8 file size, preserving the current collection before old history. */
export function serializeCollection(fileKey:string,sections:RecognitionDraft[],history?:{past:RecognitionDraft[][];future:RecognitionDraft[][]}):string {
 let saved={past:history?.past??[],future:history?.future??[]}
 let text=JSON.stringify({version:1,fileKey,sections,history:saved})
 while(new Blob([text]).size>8_000_000&&(saved.past.length||saved.future.length)){
  saved={past:saved.past.length?saved.past.slice(1):saved.past,future:saved.past.length?saved.future:saved.future.slice(0,-1)}
  text=JSON.stringify({version:1,fileKey,sections,history:saved})
 }
 if(new Blob([text]).size>8_000_000)throw new Error('Collection export exceeds the recovery limit.')
 return text
}
