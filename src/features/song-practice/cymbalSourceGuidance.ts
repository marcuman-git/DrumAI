import type {NoteCandidate} from './notationRecognition'
/** Describe source evidence; none of these shapes establishes an instrument by itself. */
export function cymbalSourceGuidance(note:NoteCandidate):string[]{
 const guidance:string[]=[]
 if(note.symbolHint==='circled-cross')guidance.push('Match the ring around this head to the source legend. A ring around a cross differs from a separate open-hi-hat circle above it.')
 if(note.cymbalHint==='ledger-cross')guidance.push('Check whether the short horizontal stroke is part of the cymbal symbol, a ledger line or neighbouring ink. Compare a labelled example before choosing Crash or another voice.')
 if(note.positionHint==='ambiguous')guidance.push('Compare the cross center with the top staff line and a labelled Hi-hat/Ride example from the same source.')
 if(note.positionHint==='above-line'||note.positionHint==='on-line')guidance.push('The '+note.positionHint+' position is a source-profile suggestion. Compare the same symbol and staff position in this score’s legend; touching a line does not establish Ride.')
 if(note.articulationHint)guidance.push('Compare any separate '+note.articulationHint+' marker with the source’s articulation key before assigning hi-hat playback.')
 guidance.push('If the source provides no matching legend, leave the identity unreviewed or exclude it. Template strength and a duration hint do not verify the instrument.')
 return guidance
}
