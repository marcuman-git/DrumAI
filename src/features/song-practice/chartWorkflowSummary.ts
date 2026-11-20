import {chartSection} from './songChartLogic'
import type {SongChart} from './songChartLogic'
import {chartSlots} from './chartMeter'
import {playbackStart,validPickup} from './chartPickup'
import {reviewStatus} from './chartReviewLogic'
export function chartTimingSummary(chart:SongChart){const section=chartSection(chart),slots=chartSlots(chart),start=playbackStart(chart,section.start),count=(section.end+1)*slots-start;return {startBar:section.start,endBar:section.end,startStep:start%slots,slots:count,beats:count/4,seconds:count*15/chart.bpm,countInSeconds:chart.countIn?240/chart.bpm:0,pickupConflict:!validPickup(chart)}}
export function chartCorrectionSummary(chart:SongChart){return chart.bars.map((bar,index)=>({index,review:reviewStatus(chart,index),durationMode:bar.rhythmEvents?'reviewed':'grid',sourcePage:chart.review?.bars[index]?.page,sourceCrops:chart.review?.bars[index]?.crops?.length??0} as const))}
