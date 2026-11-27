import type {SourceAnchor} from './sourceTrace'
import type { ChartInstrument } from './chartKit'
/** sourceCandidateId is temporary review provenance; reviewedBar strips it from saved charts. */
export interface RhythmEvent { restOrigin?:'gap'|'explicit'; sourceAnchor?:SourceAnchor;sourceCandidateId?: number; instrument: ChartInstrument; step: number; tieFromPrevious?: boolean; duration: number;grace?:1|2;articulation?:'rimshot'|'cross-stick'|'marcato'|'choke'|'let-ring'|'open'|'closed'|'half-open'; kind: 'note' | 'rest'; dynamic: 1 | 2 | 3 }
