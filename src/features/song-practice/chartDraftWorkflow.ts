import {isSongChart,newSongChart} from './songChartLogic'
import type {SongChart} from './songChartLogic'
import type {RecognitionDraft} from './notationRecognition'
import {validRecoveredDraft} from './passageRecovery'
import {newChartReview} from './chartReviewLogic'
function draftReferences(d:RecognitionDraft){return (d.bars??[d.bar]).map((_,i)=>{const crops=structuredClone(d.references?.[i]),page=crops?.[0]?.page??d.pages?.[i]??d.page;return {status:'Pending' as const,page,crops,additionalPages:[...new Set(crops?.map(c=>c.page)??[])].filter(p=>p!==page),notes:'PDF draft; verify against the source.',signature:''}})}
export function createChartFromDraft(d:RecognitionDraft):SongChart {
 if(!validRecoveredDraft(d))throw new Error('Resolve draft rhythm, source references and pickup verification before creating a chart.')
 const chart={...newSongChart(),title:d.source.replace(/\.pdf$/i,'').slice(0,80)||'Reviewed PDF chart',meter:d.bar.beats===2?'2/4' as const:'4/4' as const,bars:structuredClone(d.bars??[d.bar]),pickupOffset:d.pickup?.offset,review:{source:d.source,bars:draftReferences(d)}}
 if(!isSongChart(chart))throw new Error('Invalid reviewed chart.')
 return chart
}
export function appendReviewedDraft(chart:SongChart,d:RecognitionDraft):SongChart {
 if(!validRecoveredDraft(d,true))throw new Error('Invalid reviewed draft.')
 const bars=d.bars??[d.bar]
 if(chart.review?.source&&chart.review.source!==d.source)throw new Error('Draft source differs from the current chart.')
 const next={...chart,bars:[...chart.bars,...structuredClone(bars)],barLabels:[...chart.bars.map((_,i)=>chart.barLabels?.[i]??''),...bars.map(()=>bars.length>1?'PDF passage':'PDF draft')],section:undefined,review:{...(chart.review??newChartReview(chart)),source:d.source,bars:[...(chart.review??newChartReview(chart)).bars,...draftReferences(d)]}}
 if(!isSongChart(next))throw new Error('Draft meter, ties or chart capacity do not match.')
 // A later appended passage never changes the chart's first-bar pickup.
 return next
}
