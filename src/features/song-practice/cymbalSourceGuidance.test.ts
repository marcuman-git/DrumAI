import {expect,it} from 'vitest'
import {cymbalSourceGuidance} from './cymbalSourceGuidance'
import type {NoteCandidate} from './notationRecognition'
const note:NoteCandidate={id:0,x:10,y:10,instrument:'Ride',shape:'cross',strength:1,stemHint:true,flagHint:false}
it('keeps ring, ledger and line-position evidence separate from identity',()=>{const value={...note,symbolHint:'circled-cross' as const,cymbalHint:'ledger-cross' as const,positionHint:'on-line' as const};const text=cymbalSourceGuidance(value).join(' ');expect(text).toContain('separate open-hi-hat circle');expect(text).toContain('labelled example');expect(text).toContain('does not establish Ride');expect(text).toContain('no matching legend');expect(value.instrument).toBe('Ride')})
