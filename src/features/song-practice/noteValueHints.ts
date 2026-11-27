import {connectedStemRecovery} from './connectedStemRecovery'
import { possibleNoteDot } from './dotEvidence'
import { inspectBeamFlags } from './beamFlagEvidence'
import type { NoteCandidate, RecognitionImage, StaffCandidate } from './notationRecognition'
export interface NoteValueHint { contextRecovered?:'beam'|'shared-stem'; attachmentRecovered?:boolean; contextNeighbours?:number[]; sharedStemNeighbours?:number[]; interruptedBeamNeighbours?:number[]; recognitionWarnings?:string[]; evidenceComparison?: import('./beamFlagEvidence').BeamFlagEvidence['comparison']; contextEvidence?:'shared-beam'|'shared-stem'|'isolated-flag'|'interrupted-beam';contextMessage?:string;value: 'quarter' | 'eighth' | 'sixteenth' | 'unknown'; stemDirection: 'up' | 'down' | 'unknown'; beamBands: number; flagBands?: number; evidence?: 'beam' | 'flag' | 'none'; clippedStem?: boolean; stemX?: number; stemEnd?: number; possibleDot?: boolean; manualReviewed?: boolean; left: number; top: number; width: number; height: number }
/** Local stem/beam evidence only. Missing flags, ties and adjacent voices can mislead it. */
export function inspectNoteValue(image: RecognitionImage, staff: StaffCandidate, note: NoteCandidate): NoteValueHint {
  const { width, height, ink } = image; const gap = staff.gap
  if (!Number.isFinite(gap) || gap < 4 || gap > 80 || !Number.isFinite(staff.top)) throw new Error('Invalid staff geometry.')
  const radius = Math.max(2, Math.round(gap * 0.48))
  // Stem attachment varies with engraving size; retain a two-pixel minimum for small scans.
  const stemTolerance = Math.max(2, Math.round(gap * 0.2))
  const at = (x: number, y: number) => x >= 0 && x < width && y >= 0 && y < height ? ink[Math.round(y) * width + Math.round(x)] ?? 0 : 0
  const faintAt=(x:number,y:number)=>x>=0&&x<width&&y>=0&&y<height?image.stemInk?.[Math.round(y)*width+Math.round(x)]??0:0
  const stemAt=(x:number,y:number)=>at(x,y)||(gap<10&&faintAt(x,y)&&!(faintAt(x-2,y)&&faintAt(x+2,y))?1:0)
  let best = { length: 0, x: note.x, end: note.y, direction: 0, support: 0 }
  let attachmentRecovered=false,expandedSearch=false
  for(const tolerance of [stemTolerance,Math.max(stemTolerance,Math.round(gap*.45))]) {
  if(tolerance!==stemTolerance&&best.length>=gap*1.6)break
  if(tolerance!==stemTolerance)expandedSearch=true
  for (const direction of [-1, 1]) for (let shift = -tolerance; shift <= tolerance; shift++) {
    const x = Math.round(note.x + (direction === -1 ? radius : -radius) + shift)
    let missing = 0; let end = note.y; let support = 0
    for (let distance = 1; distance <= gap * 9; distance++) {
      const y = Math.round(note.y + distance * direction)
      if (y < 0 || y >= height) break
      if (stemAt(x, y) || stemAt(x - 1, y) || stemAt(x + 1, y)) { missing = 0; end = y; support += stemAt(x,y) }
      // Allow a scaled attachment gap only inside the head footprint; stem continuity stays strict.
      else if (++missing > (distance <= radius ? Math.max(2, Math.round(gap * 0.25)) : note.shape==='oval'?1:2)) break
    }
    const length = Math.abs(end - note.y)
    if (length > best.length || length === best.length && support > best.support) best = { length, x, end, direction, support }
  }
  }
  attachmentRecovered=expandedSearch&&best.length>=gap*1.6
  if(best.length<gap*1.6){const connected=connectedStemRecovery(image,staff,note);if(connected){best=connected;attachmentRecovered=true}}
  const evidence = inspectBeamFlags(image, staff, best)
  const bands = evidence.beamBands || evidence.flagBands
  // Isolated ink to the right is only tentative dot evidence. Dotted
  // durations require manual review and must never be silently labelled straight.
  const possibleDot = possibleNoteDot(image, staff, note.x, note.y)
  const left = Math.max(0, Math.floor(note.x - gap * 2)); const right = Math.min(width, Math.ceil(note.x + gap * 2))
  const top = Math.max(0, Math.floor(Math.min(note.y - gap * 0.6, best.end) - 3))
  const bottom = Math.min(height, Math.ceil(Math.max(note.y + gap * 0.6, best.end) + 3))
  const recognitionWarnings:string[]=[]
  if(attachmentRecovered)recognitionWarnings.push('Stem found with a wider attachment search. Compare the head center and nearby voices before accepting its duration.')
  if(best.length<gap*1.6)recognitionWarnings.push('No continuous attached stem resolved. Check the candidate head center, crop boundaries and nearby stems before setting duration.')
  if(evidence.comparison?.curveFlagBands===2&&evidence.comparison.corroboratedFlagBands===0)recognitionWarnings.push('Two curve bands are not corroborated across adjacent columns. A single curved flag can split into two rays; compare the source before choosing sixteenth.')
  if(gap<7)recognitionWarnings.push('Low-resolution staff: thin stems and separated bands can merge or disappear. Compare a higher-resolution crop.')
  if(gap<7&&evidence.flagBands===1)recognitionWarnings.push('Only one curved flag band is resolved at this small spacing. Compare a larger source render to check whether a second branch has merged.')
  if(evidence.alternateFlagBands!==undefined)recognitionWarnings.push(evidence.alternateFlagBands?'Flag checks disagree on band count. Compare both branches against the source; the existing value remains tentative.':'Short flag ink has no confirmed attached curve. Check nearby accents, rests and ledger lines.')
  if(evidence.recoveredFlag)recognitionWarnings.push('Flag recovered from a longer connected curve. Verify its count against the source.')
  return { attachmentRecovered,evidenceComparison:evidence.comparison, recognitionWarnings, value: evidence.clipped || possibleDot || best.length < gap * 1.6 || bands > 2 ? 'unknown' : bands === 2 ? 'sixteenth' : bands === 1 ? 'eighth' : 'quarter', stemDirection: best.length < gap * 1.6 ? 'unknown' : best.direction === -1 ? 'up' : 'down', beamBands: evidence.beamBands, flagBands: evidence.flagBands, evidence: evidence.evidence, clippedStem: evidence.clipped, stemX: best.x, stemEnd: best.end, possibleDot, left, top, width: right - left, height: bottom - top }
}
