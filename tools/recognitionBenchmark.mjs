import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'
const cache = new Map()
function load(file) {
  file = path.resolve(file); if (cache.has(file)) return cache.get(file)
  const exports = {}; cache.set(file, exports)
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, require: (name) => load(path.resolve(path.dirname(file), name + '.ts')) })
  return exports
}

const sample = load('src/features/song-practice/feedback012Fixture.ts').default
const { findNoteCandidates, analyzeStaffs } = load('src/features/song-practice/notationRecognition.ts')
const { benchmarkHeads } = load('src/features/song-practice/recognitionBenchmark.ts')
const ink = new Uint8Array(sample.width * sample.height); for (const index of sample.ink) ink[index] = 1
const image = { width: sample.width, height: sample.height, ink, angle: 0, staffs: [] }
const references = [...sample.heads, { x: 21, y: 54, shape: 'cross' }, { x: 67, y: 44, shape: 'cross' }]
console.log('v0.10.15 recognition benchmark\nOne isolated source bar; 11 checked filled heads and 2 checked cymbal crosses.\nCross instrument identity and durations are not benchmarked.\n')
for (const cleanHeads of [false, true]) {
 const notes = findNoteCandidates(image, sample.staff, 'master-key', { cleanHeads, tolerance: 2, kick: 4.5, snare: 1.5 })
 const result = benchmarkHeads(notes, references)
 console.log(JSON.stringify({ cleanHeads, candidates: notes.length, checkedHeads: result.referenceHeads, recovered: result.recovered, missed: result.missed, unmatchedCandidates: result.unmatchedCandidates.length }, null, 2))
}
console.log('Unmatched candidates require review, not automatically labelled false. This is a partial head-recovery benchmark, not global accuracy, rhythm accuracy or full-song transcription. No recognition scoring changes in this release.')

const { syntheticRecognitionBar } = load('src/features/song-practice/recognitionSyntheticFixture.ts')
console.log('\nControlled synthetic bars (not real PDF accuracy):')
for (const [scale, skew] of [[1, 0], [2, 0], [1, 2], [2, -2]]) {
 const fixture = syntheticRecognitionBar(scale, skew)
 const image = analyzeStaffs(fixture.pixels, fixture.width, fixture.height)
 const notes = findNoteCandidates(image, image.staffs[0], 'master-key', { cleanHeads: true, tolerance: 2, kick: 4.5 })
 const result = benchmarkHeads(notes, fixture.heads, 4 * scale, 3 * scale)
 console.log(JSON.stringify({ scale, skew, staffs: image.staffs.length, recovered: result.recovered, referenceHeads: result.referenceHeads, missed: result.missed, unmatchedCandidates: result.unmatchedCandidates.length }, null, 2))
}
