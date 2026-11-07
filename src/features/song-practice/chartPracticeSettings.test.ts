import { describe, expect, it } from 'vitest'
import { defaultMix, defaultTraining, ladderBpm, mixLevel, validMix, validTraining } from './chartPracticeSettings'
import { isSongChart, newSongChart, parseSongChart } from './songChartLogic'
describe('chart mix and progression', () => {
  it('applies solo, mute precedence and volume independently', () => {
    const mix = defaultMix(); mix.Snare.solo = true; mix.Snare.volume = 0.5
    expect(mixLevel(mix, 'Kick')).toBe(0)
    expect(mixLevel(mix, 'Snare')).toBe(0.5)
    mix.Snare.muted = true
    expect(mixLevel(mix, 'Snare')).toBe(0)
    expect(validMix(mix)).toBe(true)
    mix.Kick.volume = NaN; expect(validMix(mix)).toBe(false)
  })
  it('bounds the ladder and validates training', () => {
    const training = { ...defaultTraining(), enabled: true, ladder: true, every: 2 }
    expect(ladderBpm(60, training, 1)).toBe(60)
    expect(ladderBpm(60, training, 2)).toBe(62)
    expect(ladderBpm(239, training, 2)).toBe(240)
    expect(validTraining({ ...training, repetitions: 0 })).toBe(false)
  })
  it('round-trips new settings while accepting older charts', () => {
    const chart = { ...newSongChart(), style: 'Funk', difficulty: 'Advanced' as const, mix: defaultMix(), training: defaultTraining() }
    const copy = parseSongChart(JSON.stringify({ app: 'DrumMaster AI Chart', schema: 1, chart }))
    expect(copy.mix).toEqual(chart.mix); expect(copy.training).toEqual(chart.training)
    expect(copy.style).toBe('Funk'); expect(isSongChart(newSongChart())).toBe(true)
    expect(isSongChart({ ...chart, style: 'x'.repeat(41) })).toBe(false)
  })
})
