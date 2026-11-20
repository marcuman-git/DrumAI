import {benchmarkSourceScales} from './sourceScaleBenchmark'
import fixtures from './realMixedEvidenceFixtures'
import baseline from './mixedEvidenceBaseline'
export function benchmarkMixedEvidence(){
 const results=benchmarkSourceScales(fixtures)
 const regressions=results.flatMap((r,i)=>r.cases.flatMap((c,id)=>{const old=baseline[i].cases[id];return old.durationCorrect&&!c.durationCorrect||old.evidenceCorrect&&!c.evidenceCorrect||old.symbolCorrect&&!c.symbolCorrect?[{source:r.source,dpi:r.dpi,reference:c.reference,previous:old,current:c}]:[]}))
 const full=results.filter(r=>!r.source.includes('deliberately clipped')),clipped=results.filter(r=>r.source.includes('deliberately clipped'))
 return {results,regressions,failures:results.flatMap(r=>r.cases.filter(c=>!c.durationCorrect||!c.evidenceCorrect||!c.symbolCorrect||!c.safetyCorrect).map(c=>({source:r.source,dpi:r.dpi,...c}))),summary:{references:full.reduce((n,r)=>n+r.summary.references,0),durationsCorrect:full.reduce((n,r)=>n+r.summary.durationsCorrect,0),evidenceCorrect:full.reduce((n,r)=>n+r.summary.evidenceCorrect,0),symbolsCorrect:full.reduce((n,r)=>n+r.summary.symbolsCorrect,0),baselineDurationsCorrect:baseline.filter(r=>!r.source.includes('deliberately clipped')).reduce((n,r)=>n+r.cases.filter(c=>c.durationCorrect).length,0),clippedReferences:clipped.reduce((n,r)=>n+r.summary.references,0),clippedUnknown:clipped.reduce((n,r)=>n+r.cases.filter(c=>c.detectedValue==='unknown'&&c.clippedStem).length,0),safetyCorrect:results.reduce((n,r)=>n+r.summary.safetyCorrect,0),regressions:regressions.length}}
}
