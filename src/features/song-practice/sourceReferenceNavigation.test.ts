import {expect,it} from 'vitest'
import {sourceReferencePage} from './sourceReferenceNavigation'
it('requires an exact local filename and a supported integer page',()=>{
 expect(sourceReferencePage({source:' study.pdf ',page:999},'study.pdf')).toBe(999)
 for(const page of [0,-1,1.5,1000,NaN])expect(sourceReferencePage({source:'study.pdf',page},'study.pdf')).toBeNull()
 expect(sourceReferencePage({source:'https://example.com/study.pdf',page:1},'study.pdf')).toBeNull()
 expect(sourceReferencePage({source:'other.pdf',page:1},'study.pdf')).toBeNull()
})
