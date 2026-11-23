// Local-only benchmark against manually checked source labels.
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
const cache=new Map()
function load(file) {
 file=path.resolve(file); if(cache.has(file)) return cache.get(file)
 const exports={}; cache.set(file,exports)
 const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText
 new Function('exports','require',compiled)(exports,name=>load(path.resolve(path.dirname(file),name+'.ts')))
 return exports
}
const {findNoteCandidates}=load('src/features/song-practice/notationRecognition.ts')
const {inspectNoteValue}=load('src/features/song-practice/noteValueHints.ts')
const {benchmarkHeads}=load('src/features/song-practice/recognitionBenchmark.ts')
const {REAL_RHYTHM_REFERENCES}=load('src/features/song-practice/realRhythmReferences.ts')
function detect(f) {
 const ink=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1
 const image={width:f.width,height:f.height,ink,angle:0,staffs:[f.staff]}
 return {image,notes:findNoteCandidates(image,f.staff,'master-key',{cleanHeads:true,tolerance:2,kick:4.5})}
}
const cymbals=[]
for(const file of ['realCymbalKeyFixture','realCymbalScoreFixture','realSecondBarFixture','realFourthBarFixture']) {
 const f=load('src/features/song-practice/'+file+'.ts').default;const {notes}=detect(f)
 const result=benchmarkHeads(notes,f.heads,5,5)
 cymbals.push({source:f.source,identityBasis:f.identityBasis??f.excluded,referenceHeads:result.referenceHeads,recovered:result.recovered,missed:result.missed,unmatchedSuggestions:result.unmatchedCandidates.length})
}
const durations=[]
for(const [file,references,toleranceX,toleranceY] of [['feedback012Fixture',REAL_RHYTHM_REFERENCES,4,3],['realSecondBarFixture',null,6,4],['realFourthBarFixture',null,6,4]]) {
 const f=load('src/features/song-practice/'+file+'.ts').default;const {image,notes}=detect(f)
 for(const reference of references??f.durations) {
  const note=notes.find(n=>n.instrument===reference.instrument&&Math.abs(n.x-reference.x)<=toleranceX&&Math.abs(n.y-reference.y)<=toleranceY)
  const hint=note?inspectNoteValue(image,f.staff,note):null
  durations.push({source:f.source??'Original third feedback score bar',reference,detected:hint?{value:hint.value,beamBands:hint.beamBands,flagBands:hint.flagBands,possibleDot:hint.possibleDot}:null,correct:hint?.value===reference.value&&(reference.value!=='unknown'||hint.possibleDot)})
 }
}
const symbols=[]
for(const [file,x,y,identity] of [['realCircledCymbalFixture',128,70,'China: supported manual voice, identity not inferred'],['feedback012Fixture',21,54,'Source-specific circled cymbal: identity unverified']]) {
 const f=load('src/features/song-practice/'+file+'.ts').default;const {notes}=detect(f)
 const nearby=notes.filter(n=>Math.abs(n.x-x)<=5&&Math.abs(n.y-y)<=5)
 symbols.push({source:f.source??'Original third feedback score bar',reference:{x,y,symbol:'circled-cross',identity},flagged:nearby.some(n=>n.symbolHint==='circled-cross'),openHiHatNotInferred:nearby.every(n=>n.articulationHint!=='open')})
}
const {hasCircledCymbalHead}=load('src/features/song-practice/circledCymbalHint.ts')
const lower=load('src/features/song-practice/realLowerScoreFixture.ts').default
const lowerInk=new Uint8Array(lower.width*lower.height);for(const i of lower.ink)lowerInk[i]=1
const lowerImage={width:lower.width,height:lower.height,ink:lowerInk,angle:0,staffs:[lower.staff]}
const focusedSourceEvidence={source:lower.source,symbols:lower.symbols.map(reference=>({reference,correct:hasCircledCymbalHead(lowerImage,lower.staff,reference.x,reference.y)===(reference.symbol==='circled-cross')})),durations:lower.durations.map(reference=>({reference,correct:inspectNoteValue(lowerImage,lower.staff,{...reference,id:0,shape:'oval',instrument:'Snare'}).value===reference.value}))}
const manualIdentityCases=load('src/features/song-practice/realExtraCymbalFixture.ts').default.map(({source,instrument,symbol,x,y})=>({source,instrument,symbol,x,y,basis:'Visually read key label. Dedicated voice round-trip and verification policies tested; no automatic identity accuracy claimed.'}))
const highway=load('src/features/song-practice/realHighwaySourceFixture.ts').default
const highwayInk=new Uint8Array(highway.width*highway.height);for(const i of highway.ink)highwayInk[i]=1
const highwayImage={width:highway.width,height:highway.height,ink:highwayInk,angle:0,staffs:[highway.staff]}
const additionalSourceEvidence={source:highway.source,cases:highway.cases.map(reference=>({reference,durationCorrect:inspectNoteValue(highwayImage,highway.staff,{...reference,id:0,instrument:'Hi-hat',strength:1,stemHint:true,flagHint:false}).value===reference.value,plainCrossCorrect:!hasCircledCymbalHead(highwayImage,highway.staff,reference.x,reference.y)})),scope:'Head coordinates, plain-cross shapes and single-beam eighth values are visually labelled. No cymbal instrument identity is asserted without an accompanying source legend.'}
const {benchmarkSourceScales}=load('src/features/song-practice/sourceScaleBenchmark.ts')
const scaleBenchmark=benchmarkSourceScales(load('src/features/song-practice/realSourceScaleFixtures.ts').default)
const mixedScaleBenchmark=benchmarkSourceScales(load('src/features/song-practice/realMixedDurationScaleFixtures.ts').default)
const {benchmarkSourceHeads}=load('src/features/song-practice/sourceHeadScaleBenchmark.ts')
const firstGrooveHeads=benchmarkSourceHeads(load('src/features/song-practice/realFirstGrooveScaleFixtures.ts').default)
const publisherScales=benchmarkSourceScales(load('src/features/song-practice/realPublisherScaleFixtures.ts').default)
const smallScales=benchmarkSourceScales(load('src/features/song-practice/realSmallScaleFixtures.ts').default)
const denseScales=load('src/features/song-practice/denseSourceBenchmark.ts').benchmarkDenseSource(load('src/features/song-practice/realDenseSourceFixtures.ts').default)
const sharedStemScales=load('src/features/song-practice/sharedStemSourceBenchmark.ts').benchmarkSharedStemSource(load('src/features/song-practice/realSmallScaleFixtures.ts').default)
const mixedEvidence=load('src/features/song-practice/mixedEvidenceBenchmark.ts').benchmarkMixedEvidence()
const headFixtures=[...load('src/features/song-practice/realDenseSourceFixtures.ts').default,...load('src/features/song-practice/realMixedEvidenceFixtures.ts').default.filter(f=>!f.source.includes('clipped')),...load('src/features/song-practice/realPublisherScaleFixtures.ts').default]
const headScan=load('src/features/song-practice/denseHeadBenchmark.ts').benchmarkDenseHeads
const headScanComparison={standard:headScan(headFixtures),dense:headScan(headFixtures,true)}
const introFixtures=load('src/features/song-practice/realIntroGrooveFixtures.ts').default
const independentIntroHeads=headScan(introFixtures,true),independentIntroValues=benchmarkSourceScales(introFixtures)
const recoveredIntroValues=load('src/features/song-practice/recoveredHeadValueBenchmark.ts').benchmarkRecoveredHeadValues(introFixtures)
const mixedGrooveFixtures=load('src/features/song-practice/realMixedGrooveFixtures.ts').default
const independentMixedGrooveValues=benchmarkSourceScales(mixedGrooveFixtures),recoveredMixedGrooveValues=load('src/features/song-practice/recoveredHeadValueBenchmark.ts').benchmarkRecoveredHeadValues(mixedGrooveFixtures)
const report={independentMixedGrooveValues,recoveredMixedGrooveValues,recoveredIntroValues,version:'v0.10.44',headScanComparison,independentIntroHeads,independentIntroValues,mixedEvidence,denseScales,sharedStemScales,scope:'Local labelled head, duration, evidence and symbol checks across supplied score styles and rendering scales. Known-coordinate tests do not establish general recognition accuracy or full-song transcription. Instrument identities are checked only where a source key supplies labels; other identities remain withheld. Passage splitting, expressive durations and ties require manual source review.',cymbals,durations,symbols,manualIdentityCases,focusedSourceEvidence,additionalSourceEvidence,scaleBenchmark,mixedScaleBenchmark,publisherScales,smallScales,smallScaleFailures:smallScales.flatMap(r=>r.cases.filter(c=>!c.durationCorrect||!c.evidenceCorrect).map(c=>({dpi:r.dpi,source:r.source,...c}))),firstGrooveHeads,mixedScaleFailures:mixedScaleBenchmark.flatMap(result=>result.cases.filter(c=>!c.durationCorrect||!c.evidenceCorrect||!c.symbolCorrect).map(c=>({source:result.source,dpi:result.dpi,...c}))),summary:{recoveredIntroDurationsCorrect:recoveredIntroValues.reduce((n,r)=>n+r.summary.durationsCorrect,0),independentMixedGrooveReferences:36,independentMixedGrooveDurationsCorrect:independentMixedGrooveValues.reduce((n,r)=>n+r.summary.durationsCorrect,0),recoveredMixedGrooveHeads:recoveredMixedGrooveValues.reduce((n,r)=>n+r.summary.recovered,0),recoveredMixedGrooveDurationsCorrect:recoveredMixedGrooveValues.reduce((n,r)=>n+r.summary.durationsCorrect,0),headReferences:headScanComparison.dense.reduce((n,r)=>n+r.summary.references,0),standardHeadsRecovered:headScanComparison.standard.reduce((n,r)=>n+r.summary.recovered,0),denseHeadsRecovered:headScanComparison.dense.reduce((n,r)=>n+r.summary.recovered,0),denseUnmatched:headScanComparison.dense.reduce((n,r)=>n+r.summary.unmatched,0),introHeadsRecovered:independentIntroHeads.reduce((n,r)=>n+r.summary.recovered,0),introHeadReferences:independentIntroHeads.reduce((n,r)=>n+r.summary.references,0),introValuesCorrect:independentIntroValues.reduce((n,r)=>n+r.summary.durationsCorrect,0),newMixedReferences:mixedEvidence.summary.references,newMixedDurationsCorrect:mixedEvidence.summary.durationsCorrect,newMixedBaselineCorrect:mixedEvidence.summary.baselineDurationsCorrect,newMixedSymbolsCorrect:mixedEvidence.summary.symbolsCorrect,clippedReferences:mixedEvidence.summary.clippedReferences,clippedUnknown:mixedEvidence.summary.clippedUnknown,newMixedRegressions:mixedEvidence.summary.regressions,denseReferences:denseScales.reduce((n,r)=>n+r.summary.references,0),denseDurationsCorrect:denseScales.reduce((n,r)=>n+r.summary.durationsCorrect,0),denseContextLinked:denseScales.reduce((n,r)=>n+r.contextSummary.linked,0),denseCrossGroupLinks:denseScales.reduce((n,r)=>n+r.contextSummary.crossGroupLinks,0),sharedStemReferences:sharedStemScales.reduce((n,r)=>n+r.summary.references,0),sharedStemLinked:sharedStemScales.reduce((n,r)=>n+r.summary.linked,0),smallScaleReferences:smallScales.reduce((n,r)=>n+r.summary.references,0),smallScaleDurationsCorrect:smallScales.reduce((n,r)=>n+r.summary.durationsCorrect,0),smallScaleEvidenceCorrect:smallScales.reduce((n,r)=>n+r.summary.evidenceCorrect,0),publisherReferences:publisherScales.reduce((n,r)=>n+r.summary.references,0),publisherDurationsCorrect:publisherScales.reduce((n,r)=>n+r.summary.durationsCorrect,0),publisherEvidenceCorrect:publisherScales.reduce((n,r)=>n+r.summary.evidenceCorrect,0),firstGrooveReferences:firstGrooveHeads.reduce((n,r)=>n+r.summary.references,0),firstGrooveRecovered:firstGrooveHeads.reduce((n,r)=>n+r.summary.recovered,0),firstGrooveUnmatched:firstGrooveHeads.reduce((n,r)=>n+r.summary.unmatched,0),mixedScaleReferences:mixedScaleBenchmark.reduce((n,r)=>n+r.summary.references,0),mixedScaleDurationsCorrect:mixedScaleBenchmark.reduce((n,r)=>n+r.summary.durationsCorrect,0),mixedScaleEvidenceCorrect:mixedScaleBenchmark.reduce((n,r)=>n+r.summary.evidenceCorrect,0),cymbalReferences:cymbals.reduce((n,c)=>n+c.referenceHeads,0),cymbalsRecovered:cymbals.reduce((n,c)=>n+c.recovered,0),durationCases:durations.length,correctDurationCases:durations.filter(d=>d.correct).length,scaleDurationCases:scaleBenchmark.reduce((count,result)=>count+result.summary.references,0),scaleDurationsCorrect:scaleBenchmark.reduce((count,result)=>count+result.summary.durationsCorrect,0),scaleSymbolsCorrect:scaleBenchmark.reduce((count,result)=>count+result.summary.symbolsCorrect,0),circledSymbolReferences:symbols.length,circledSymbolsFlagged:symbols.filter(s=>s.flagged&&s.openHiHatNotInferred).length}}
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report.summary))
// Mixed labels now require every duration, evidence and symbol check at every scale.
if(mixedScaleBenchmark.some(r=>r.summary.durationsCorrect!==r.summary.references||r.summary.evidenceCorrect!==r.summary.references||r.summary.symbolsCorrect!==r.summary.references))process.exitCode=1
if(scaleBenchmark.some(result=>result.summary.durationsCorrect!==result.summary.references||result.summary.symbolsCorrect!==result.summary.references))process.exitCode=1
if(additionalSourceEvidence.cases.some(reference=>!reference.durationCorrect||!reference.plainCrossCorrect))process.exitCode=1
if([...focusedSourceEvidence.symbols,...focusedSourceEvidence.durations].some(reference=>!reference.correct))process.exitCode=1
if(report.summary.cymbalsRecovered!==report.summary.cymbalReferences||report.summary.correctDurationCases!==report.summary.durationCases||report.summary.circledSymbolsFlagged!==report.summary.circledSymbolReferences)process.exitCode=1

if(firstGrooveHeads.some(r=>r.summary.recovered!==r.summary.references||r.summary.unmatched!==0))process.exitCode=1

if(publisherScales.some(r=>r.summary.durationsCorrect!==r.summary.references||r.summary.evidenceCorrect!==r.summary.references||r.summary.symbolsCorrect!==r.summary.references))process.exitCode=1

if(report.summary.smallScaleDurationsCorrect!==report.summary.smallScaleReferences||smallScales.some(r=>r.summary.durationsCorrect!==r.summary.references||r.summary.evidenceCorrect!==r.summary.references))process.exitCode=1

if(denseScales.some(r=>r.summary.durationsCorrect!==r.summary.references||r.summary.evidenceCorrect!==r.summary.references||r.summary.symbolsCorrect!==r.summary.references||r.contextSummary.linked!==r.summary.references||r.contextSummary.crossGroupLinks!==0))process.exitCode=1
if(sharedStemScales.some(r=>r.summary.linked!==r.summary.references||r.summary.durationsRetained!==r.summary.references))process.exitCode=1

if(mixedEvidence.regressions.length||mixedEvidence.summary.durationsCorrect<=mixedEvidence.summary.baselineDurationsCorrect||mixedEvidence.summary.symbolsCorrect!==mixedEvidence.summary.references||mixedEvidence.summary.clippedUnknown!==mixedEvidence.summary.clippedReferences||mixedEvidence.results.some(r=>r.summary.safetyCorrect!==r.summary.references))process.exitCode=1

if(mixedEvidence.summary.durationsCorrect<83)process.exitCode=1

if(report.summary.denseHeadsRecovered!==report.summary.headReferences||report.summary.standardHeadsRecovered!==112||report.summary.introHeadsRecovered<47||independentIntroValues.some(r=>r.summary.durationsCorrect!==r.summary.references||r.summary.evidenceCorrect!==r.summary.references||r.summary.symbolsCorrect!==r.summary.references))process.exitCode=1

if(report.summary.recoveredIntroDurationsCorrect<47||report.summary.independentMixedGrooveDurationsCorrect!==36||report.summary.recoveredMixedGrooveDurationsCorrect<35)process.exitCode=1
