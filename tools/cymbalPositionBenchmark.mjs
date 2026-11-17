import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
const cache = new Map()
function load(file) {
 file = path.resolve(file); if (cache.has(file)) return cache.get(file)
 const exports = {}; cache.set(file, exports)
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, require: name => load(path.resolve(path.dirname(file), name + '.ts')) })
 return exports
}
const { cymbalPositionFixture } = load('src/features/song-practice/cymbalPositionBenchmark.ts')
const { analyzeStaffs, findNoteCandidates } = load('src/features/song-practice/notationRecognition.ts')

const { benchmarkHeads } = load('src/features/song-practice/recognitionBenchmark.ts')
const cases = []
for (const scale of [1,2]) for (const skew of [0,2,-2]) for (const hatOffset of [-0.5,-0.25]) {
 const f = cymbalPositionFixture(scale,skew,hatOffset); const image = analyzeStaffs(f.pixels,f.width,f.height)
 const notes = findNoteCandidates(image,image.staffs[0],'master-key',{cleanHeads:true,tolerance:Math.min(4,2*scale)})
 const result = benchmarkHeads(notes,f.heads,4*scale,4*scale)
 cases.push({scale,skew,hatOffset,labelledHeads:result.referenceHeads,recovered:result.recovered,missed:result.missed,unmatchedSuggestions:result.unmatchedCandidates.length})
}
const report = {version:'v0.10.22', scope:'Controlled synthetic cymbal identity benchmark, not real PDF accuracy. Four labelled crosses per case: Crash, Hi-hat, Ride and Pedal hi-hat. Supplied Master Drum Key profile.',cases,totalLabelledHeads:cases.reduce((n,c)=>n+c.labelledHeads,0),totalRecovered:cases.reduce((n,c)=>n+c.recovered,0)}
const destination = process.argv[2]
if (destination) fs.writeFileSync(destination,JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({cases:cases.length,labelledHeads:report.totalLabelledHeads,recovered:report.totalRecovered}))
