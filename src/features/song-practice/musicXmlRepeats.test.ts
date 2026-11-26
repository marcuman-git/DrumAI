import {expect,it} from 'vitest'
import {expandedMusicXmlMeasures} from './musicXmlRepeats'
const part=(content:string)=>new DOMParser().parseFromString(`<part>${content}</part>`,'application/xml').documentElement
const measures=(content:string)=>expandedMusicXmlMeasures(part(content)).map(m=>m.getAttribute('number'))
it('preserves explicit first/second ending order',()=>{expect(measures('<measure number="A"><repeat direction="forward"/></measure><measure number="B"><ending type="start" number="1"/><ending type="stop" number="1"/><repeat direction="backward"/></measure><measure number="C"><ending type="start" number="2"/><ending type="stop" number="2"/></measure><measure number="D"/>')).toEqual(['A','B','A','C','D'])})
it('starts a later implicit repeat after the previous repeat instead of replaying the whole song',()=>{expect(measures('<measure number="A"><repeat direction="backward"/></measure><measure number="B"><repeat direction="backward"/></measure>')).toEqual(['A','A','B','B'])})
it('rejects nested or unbounded repeats',()=>{expect(()=>measures('<measure><repeat direction="forward"/></measure><measure><repeat direction="forward"/></measure>')).toThrow('Nested');expect(()=>measures('<measure><repeat direction="backward" times="100"/></measure>')).toThrow('Repeat count')})
