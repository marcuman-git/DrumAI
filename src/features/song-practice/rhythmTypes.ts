import type { ChartInstrument } from './chartKit'
export interface RhythmEvent { instrument: ChartInstrument; step: number; duration: 1 | 2 | 4; kind: 'note' | 'rest'; dynamic: 1 | 2 | 3 }
