import type { GrooveInstrument } from './grooveLibraryLogic'
import type { ChartInstrument } from '../song-practice/chartKit'
const TOM_PITCH: Partial<Record<ChartInstrument, number>> = { 'Floor tom 2': 85, 'Floor tom 1': 105, 'Tom 3': 135, 'Tom 2': 170, 'Tom 1': 215 }
export function createGroovePlayer(context: AudioContext) {
  const noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.6), context.sampleRate)
  const samples = noise.getChannelData(0)
  for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1
  return (instrument: GrooveInstrument | ChartInstrument | 'Open hi-hat', time: number, soft: boolean, volume: number) => {
    if (volume <= 0) return
    const gain = context.createGain()
    const tom = TOM_PITCH[instrument as ChartInstrument]
    const bass = instrument === 'Kick' || instrument === 'Kick 2'
    const duration = tom ? 0.24 : instrument === 'Open hi-hat' ? 0.35 : instrument === 'Crash' ? 0.55 : instrument === 'Ride' ? 0.09 : bass ? 0.16 : instrument === 'Pedal hi-hat' ? 0.035 : instrument === 'Snare' ? 0.12 : 0.055
    const strength = volume * (soft ? 0.22 : 0.8)
    gain.gain.setValueAtTime(Math.max(0.0001, strength * (bass ? 1 : 0.5)), time)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration)
    gain.connect(context.destination)
    if (bass || tom || instrument === 'Shell') {
      const oscillator = context.createOscillator()
      oscillator.type = instrument === 'Shell' || tom ? 'triangle' : 'sine'
      const pitch = tom ?? (bass ? instrument === 'Kick 2' ? 95 : 130 : 1250)
      oscillator.frequency.setValueAtTime(pitch, time)
      if (bass || tom) oscillator.frequency.exponentialRampToValueAtTime(tom ? pitch * 0.65 : 45, time + duration)
      oscillator.connect(gain); oscillator.start(time); oscillator.stop(time + duration)
    } else {
      const source = context.createBufferSource(); source.buffer = noise
      const filter = context.createBiquadFilter()
      filter.type = instrument === 'Snare' ? 'bandpass' : 'highpass'
      filter.frequency.value = instrument === 'Snare' ? 1800 : instrument === 'Crash' ? 2200 : instrument === 'Ride' ? 9500 : 6500
      filter.Q.value = 0.7
      source.connect(filter); filter.connect(gain); source.start(time); source.stop(time + duration)
      // Ride: a short stick attack plus inharmonic metal partials, rather than crash-like wash.
      if (instrument === 'Ride') for (const frequency of [2800, 4100]) {
        const partial = context.createOscillator(); const metalGain = context.createGain()
        partial.type = 'sine'; partial.frequency.value = frequency
        metalGain.gain.setValueAtTime(Math.max(0.0001, strength * 0.16), time)
        metalGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32)
        partial.connect(metalGain); metalGain.connect(context.destination); partial.start(time); partial.stop(time + 0.33)
      }
      if (instrument === 'Snare') {
        const body = context.createOscillator(); const bodyGain = context.createGain()
        body.type = 'triangle'; body.frequency.value = 185
        bodyGain.gain.setValueAtTime(Math.max(0.0001, strength * 0.25), time)
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07)
        body.connect(bodyGain); bodyGain.connect(context.destination); body.start(time); body.stop(time + 0.08)
      }
    }
  }
}
