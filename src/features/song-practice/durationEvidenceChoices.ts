import type {NoteValueHint} from './noteValueHints'
import {durationNotation,supportedDuration} from './rhythmTime'
/** Review alternatives, never automatic duration assignments. Ink can hide branches. */
export function durationEvidenceChoices(hint?:NoteValueHint){
 if(!hint||hint.manualReviewed)return []
 const bands=new Set([hint.beamBands,hint.flagBands??0,hint.evidenceComparison?.shortFlagBands??0,hint.evidenceComparison?.curveFlagBands??0].filter(n=>n>0&&n<=4))
 if(!bands.size&&hint.stemDirection!=='unknown')bands.add(0)
 const choices=new Set<number>()
 for(const count of bands){const value=4/2**count;choices.add(value);if(hint.possibleDot)choices.add(value*1.5)}
 return [...choices].filter(supportedDuration).sort((a,b)=>b-a).map(value=>({value,label:durationNotation(value).label,reason:hint.possibleDot?'Compare dot and flag/beam count; dot evidence is tentative.':hint.clippedStem?'Crop clips the stem; visible bands may be incomplete.':'Compare visible bands and branches; select only after source review.'}))
}
