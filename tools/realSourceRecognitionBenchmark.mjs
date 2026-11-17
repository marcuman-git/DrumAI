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
for(const file of ['realCymbalKeyFixture','realCymbalScoreFixture']) {
 const f=load('src/features/song-practice/'+file+'.ts').default;const {notes}=detect(f)
 const result=benchmarkHeads(notes,f.heads,5,5)
 cymbals.push({source:f.source,identityBasis:f.identityBasis??f.excluded,referenceHeads:result.referenceHeads,recovered:result.recovered,missed:result.missed,unmatchedSuggestions:result.unmatchedCandidates.length})
}
const f=load('src/features/song-practice/feedback012Fixture.ts').default;const {image,notes}=detect(f)
const durations=REAL_RHYTHM_REFERENCES.map(reference=>{
 const note=notes.find(n=>n.instrument===reference.instrument&&Math.abs(n.x-reference.x)<=4&&Math.abs(n.y-reference.y)<=3)
 const hint=note?inspectNoteValue(image,f.staff,note):null
 return {reference,detected:hint?{value:hint.value,beamBands:hint.beamBands,flagBands:hint.flagBands,possibleDot:hint.possibleDot}:null,correct:hint?.value===reference.value&&(reference.x!==67||hint.possibleDot)}
})
const report={version:'v0.10.23',scope:'Eight manually labelled real-source cymbal heads and eleven checked source duration cases. Partial local source coverage; unmatched suggestions are not automatically false. Circled/unsupported cymbal identities, ties, tuplets and full-song transcription are excluded.',cymbals,durations,summary:{cymbalReferences:cymbals.reduce((n,c)=>n+c.referenceHeads,0),cymbalsRecovered:cymbals.reduce((n,c)=>n+c.recovered,0),durationCases:durations.length,correctDurationCases:durations.filter(d=>d.correct).length}}
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify(report.summary))
if(report.summary.cymbalsRecovered!==report.summary.cymbalReferences||report.summary.correctDurationCases!==report.summary.durationCases)process.exitCode=1
