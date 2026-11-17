import type { ChartInstrument } from './chartKit'
/** sourceCandidateId is temporary review provenance; reviewedBar strips it from saved charts. */
export interface RhythmEvent { sourceCandidateId?: number; instrument: ChartInstrument; step: number; tieFromPrevious?: boolean; duration: 1 | 2 | 3 | 4 | 6; kind: 'note' | 'rest'; dynamic: 1 | 2 | 3 }
