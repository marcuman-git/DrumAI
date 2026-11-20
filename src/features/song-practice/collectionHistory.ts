import type {RecognitionDraft} from './notationRecognition'
export interface CollectionHistory {past:RecognitionDraft[][];present:RecognitionDraft[];future:RecognitionDraft[][]}
export type CollectionAction={type:'edit';update:RecognitionDraft[]|((sections:RecognitionDraft[])=>RecognitionDraft[])}|{type:'restore';history:CollectionHistory}|{type:'undo'}|{type:'redo'}
export function clearPickupReviews(sections:RecognitionDraft[]):RecognitionDraft[]{return sections.map(({pickup:_pickup,...draft})=>draft)}
function bounded(values:RecognitionDraft[][],past=true){let result=past?values.slice(-20):values.slice(0,20);while(result.length&&JSON.stringify(result).length>4_000_000)result=past?result.slice(1):result.slice(0,-1);return result}
export function collectionHistoryReducer(state:CollectionHistory,action:CollectionAction):CollectionHistory{
 if(action.type==='restore')return {past:bounded(action.history.past.map(clearPickupReviews)),present:clearPickupReviews(action.history.present),future:bounded(action.history.future.map(clearPickupReviews),false)}
 if(action.type==='undo'){if(!state.past.length)return state;return {past:state.past.slice(0,-1),present:clearPickupReviews(state.past.at(-1)!),future:bounded([state.present,...state.future],false)}}
 if(action.type==='redo'){if(!state.future.length)return state;return {past:bounded([...state.past,state.present]),present:clearPickupReviews(state.future[0]),future:state.future.slice(1)}}
 const next=clearPickupReviews(typeof action.update==='function'?action.update(state.present):action.update)
 if(JSON.stringify(next)===JSON.stringify(state.present))return state
 return {past:bounded([...state.past,state.present]),present:next,future:[]}
}
