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
for(const file of ['realCymbalKeyFixture','realCymbalScoreFixture','realSecondBarFixture']) {
 const f=load('src/features/song-practice/'+file+'.ts').default;const {notes}=detect(f)
 const result=benchmarkHeads(notes,f.heads,5,5)
 cymbals.push({source:f.source,identityBasis:f.identityBasis??f.excluded,referenceHeads:result.referenceHeads,recovered:result.recovered,missed:result.missed,unmatchedSuggestions:result.unmatchedCandidates.length})
}
const durations=[]
for(const [file,references,toleranceX,toleranceY] of [['feedback012Fixture',REAL_RHYTHM_REFERENCES,4,3],['realSecondBarFixture',null,6,4]]) {
 const f=load('src/features/song-practice/'+file+'.ts').default;const {image,notes}=detect(f)
 for(const reference of references??f.durations) {
  const note=notes.find(n=>n.instrument===reference.instrument&&Math.abs(n.x-reference.x)<=toleranceX&&Math.abs(n.y-reference.y)<=toleranceY)
  const hint=note?inspectNoteValue(image,f.staff,note):null
  durations.push({source:f.source??'Original third feedback score bar',reference,detected:hint?{value:hint.value,beamBands:hint.beamBands,flagBands:hint.flagBands,possibleDot:hint.possibleDot}:null,correct:hint?.value===reference.value&&(reference.value!=='unknown'||hint.possibleDot)})
 }
}
const symbols=[]
for(const [file,x,y,identity] of [['realCircledCymbalFixture',128,70,'China: distinct playback voice unsupported'],['feedback012Fixture',21,54,'Source-specific circled cymbal: identity unverified']]) {
 const f=load('src/features/song-practice/'+file+'.ts').default;const {notes}=detect(f)
 const nearby=notes.filter(n=>Math.abs(n.x-x)<=5&&Math.abs(n.y-y)<=5)
 symbols.push({source:f.source??'Original third feedback score bar',reference:{x,y,symbol:'circled-cross',identity},flagged:nearby.some(n=>n.symbolHint==='circled-cross'),openHiHatNotInferred:nearby.every(n=>n.articulationHint!=='open')})
}
const report={version:'v0.10.24',scope:'Ten checked real-source supported cymbal heads, fourteen duration cases, and two circled-symbol references requiring manual identity review. Partial local source coverage, not general recognition accuracy. Unmatched suggestions are not automatically false; unsupported voices, ties, tuplets and full-song transcription remain excluded.',cymbals,durations,symbols,summary:{cymbalReferences:cymbals.reduce((n,c)=>n+c.referenceHeads,0),cymbalsRecovered:cymbals.reduce((n,c)=>n+c.recovered,0),durationCases:durations.length,correctDurationCases:durations.filter(d=>d.correct).length,circledSymbolReferences:symbols.length,circledSymbolsFlagged:symbols.filter(s=>s.flagged&&s.openHiHatNotInferred).length}}
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report.summary))
if(report.summary.cymbalsRecovered!==report.summary.cymbalReferences||report.summary.correctDurationCases!==report.summary.durationCases||report.summary.circledSymbolsFlagged!==report.summary.circledSymbolReferences)process.exitCode=1
