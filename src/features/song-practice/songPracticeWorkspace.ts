import {CHART_INSTRUMENTS} from './chartKit'
import type {ChartInstrument} from './chartKit'
import {alignedTime} from './rhythmTime'
import {isSongChart} from './songChartLogic'
import type {SongChart} from './songChartLogic'
import type {StaffCountMode} from './staffCountLabels'
export interface PracticeView {instruments?:readonly ChartInstrument[];countMode:StaffCountMode;loop:boolean;zoom:number;follow:boolean;volume:number;bar:number;step:number}
export const defaultPracticeView=():PracticeView=>({countMode:'eighth',loop:false,zoom:100,follow:true,volume:.3,bar:0,step:0})
const WORKSPACE='drummaster-song-practice-workspace-v1',VIEWS='drummaster-song-practice-views-v1'
function validView(value:unknown):value is PracticeView{if(!value||typeof value!=='object')return false;const v=value as PracticeView;return ['quarter','eighth','sixteenth'].includes(v.countMode)&&typeof v.loop==='boolean'&&typeof v.follow==='boolean'&&[60,80,100,125,150].includes(v.zoom)&&Number.isFinite(v.volume)&&v.volume>=0&&v.volume<=1&&Number.isInteger(v.bar)&&v.bar>=0&&Number.isFinite(v.step)&&v.step>=0&&v.step<16&&alignedTime(v.step)&&(v.instruments===undefined||Array.isArray(v.instruments)&&v.instruments.length<=CHART_INSTRUMENTS.length&&v.instruments.every(name=>CHART_INSTRUMENTS.includes(name)))}
export function loadPracticeWorkspace():SongChart|null{try{const raw=localStorage.getItem(WORKSPACE);if(!raw||raw.length>12*1024*1024)return null;const data=JSON.parse(raw);return data.version===1&&isSongChart(data.chart)?data.chart:null}catch{return null}}
export function loadPracticeView(id:string):PracticeView{try{const data=JSON.parse(localStorage.getItem(VIEWS)??'{}');return validView(data[id])?data[id]:defaultPracticeView()}catch{return defaultPracticeView()}}
export function savePracticeWorkspace(chart:SongChart,view:PracticeView):boolean{try{if(!isSongChart(chart)||!validView(view))return false;const raw=JSON.stringify({version:1,chart});if(raw.length>12*1024*1024)return false;let views:Record<string,PracticeView>={};try{const old=JSON.parse(localStorage.getItem(VIEWS)??'{}');views=Object.fromEntries(Object.entries(old).filter(([,v])=>validView(v)).slice(-19)) as Record<string,PracticeView>}catch{/* Recover corrupt preferences. */}delete views[chart.id];views[chart.id]=view;localStorage.setItem(VIEWS,JSON.stringify(views));localStorage.setItem(WORKSPACE,raw);return true}catch{return false}}
