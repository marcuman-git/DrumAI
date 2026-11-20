import {useReducer} from 'react'
export interface BoundaryHistory {past:number[][];present:number[];future:number[][]}
export type BoundaryAction={type:'edit';cuts:number[]}|{type:'restore';history:BoundaryHistory}|{type:'undo'}|{type:'redo'}
export function boundaryHistoryReducer(state:BoundaryHistory,action:BoundaryAction):BoundaryHistory{
 if(action.type==='restore')return {past:action.history.past.slice(-20),present:action.history.present,future:action.history.future.slice(0,20)}
 if(action.type==='undo')return state.past.length?{past:state.past.slice(0,-1),present:state.past.at(-1)!,future:[state.present,...state.future].slice(0,20)}:state
 if(action.type==='redo')return state.future.length?{past:[...state.past,state.present].slice(-20),present:state.future[0],future:state.future.slice(1)}:state
 if(JSON.stringify(state.present)===JSON.stringify(action.cuts))return state
 return {past:[...state.past,state.present].slice(-20),present:action.cuts,future:[]}
}
export function useBoundaryHistory(){const [history,dispatch]=useReducer(boundaryHistoryReducer,{past:[],present:[0,50,100],future:[]});return {history,cuts:history.present,setCuts:(cuts:number[])=>dispatch({type:'edit',cuts}),restore:(history:BoundaryHistory)=>dispatch({type:'restore',history}),undo:()=>dispatch({type:'undo'}),redo:()=>dispatch({type:'redo'})}}
