import { afterEach, expect, it } from 'vitest'
import { completeBar, notesFor } from './chartKit'
import { completeMix, defaultMix, mixLevel, validMix } from './chartPracticeSettings'
import { cycleChartNote, isSongChart, loadSongCharts, newSongChart, parseSongChart, saveSongCharts } from './songChartLogic'
import { barSignature } from './chartReviewLogic'
afterEach(() => localStorage.removeItem('drummaster-song-charts-v1'))
it('loads and edits a legacy three-row chart without losing original notes', () => {
  const bar = { 'Hi-hat': Array(16).fill(0), Snare: Array(16).fill(0), Kick: Array(16).fill(0) }; bar.Kick[0] = 2
  const chart = { ...newSongChart(), bars: [bar] }
  expect(isSongChart(chart)).toBe(true); saveSongCharts([chart])
  const loaded = loadSongCharts()[0]
  expect(notesFor(loaded.bars[0], 'Crash')).toEqual(Array(16).fill(0))
  const edited = cycleChartNote(loaded, 0, 'Crash', 0)
  expect(edited.bars[0].Crash?.[0]).toBe(2); expect(edited.bars[0].Kick[0]).toBe(2)
  expect(loaded.bars[0].Crash).toBeUndefined()
})
it('preserves cymbal rows through saves and JSON without accepting malformed rows', () => {
  const chart = newSongChart(); chart.bars[0] = completeBar(); chart.bars[0].Crash![0] = 3; chart.bars[0].Ride![4] = 1
  saveSongCharts([chart]); expect(loadSongCharts()[0].bars).toEqual(chart.bars)
  expect(parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart })).bars).toEqual(chart.bars)
  expect(isSongChart({ ...chart, bars: [{ ...chart.bars[0], Crash: [2] }] })).toBe(false)
})
it('defaults legacy cymbal mixes and honors cymbal solo and mute', () => {
  const mix = defaultMix(); const legacy = { 'Hi-hat': mix['Hi-hat'], Snare: mix.Snare, Kick: mix.Kick }
  expect(validMix(legacy)).toBe(true); expect(completeMix(legacy).Crash.volume).toBe(1)
  mix.Crash.solo = true; expect(mixLevel(mix, 'Snare')).toBe(0); expect(mixLevel(mix, 'Crash')).toBe(1)
  mix.Crash.muted = true; expect(mixLevel(mix, 'Crash')).toBe(0)
})
it('preserves old review signatures until a cymbal is actually added', () => {
  const bar = completeBar(); const before = barSignature(bar)
  expect(before).toBe(JSON.stringify([bar['Hi-hat'], bar.Snare, bar.Kick]))
  bar.Crash[0] = 2; expect(barSignature(bar)).not.toBe(before)
})
it('retains optional tom, second-bass and pedal rows through chart JSON', () => {
  const bar = completeBar()
  for (const name of ['Kick 2', 'Floor tom 2', 'Floor tom 1', 'Tom 3', 'Tom 2', 'Tom 1', 'Pedal hi-hat'] as const) bar[name][0] = 2
  const chart = { ...newSongChart(), bars: [bar] }
  const imported = parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart }))
  expect(imported.bars).toEqual(chart.bars)
  expect(isSongChart({ ...chart, bars: [{ ...bar, 'Tom 1': [0] }] })).toBe(false)
  expect(isSongChart({ ...chart, bars: [{ ...bar, 'Pedal hi-hat': null }] })).toBe(false)
})
it('preserves open hi-hat notes while older charts omit the optional row', () => {
  const chart = newSongChart(); chart.bars[0]['Open hi-hat']![0] = 2
  expect(parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart })).bars[0]['Open hi-hat']![0]).toBe(2)
  const legacy = structuredClone(chart); delete legacy.bars[0]['Open hi-hat']
  expect(isSongChart(legacy)).toBe(true)
  expect(notesFor(legacy.bars[0], 'Open hi-hat')).toEqual(Array(16).fill(0))
})
