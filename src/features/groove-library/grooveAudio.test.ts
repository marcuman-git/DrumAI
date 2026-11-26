import { expect, it, vi } from 'vitest'
import { createGroovePlayer } from './grooveAudio'
it('gives Crash a noise wash and Ride a short attack with distinct metallic partials', () => {
  const stops: number[]=[]; const frequencies: {value:number}[]=[]
  const gain = () => ({gain:{setValueAtTime:vi.fn(),exponentialRampToValueAtTime:vi.fn()},connect:vi.fn()})
  const context={sampleRate:1000,destination:{},createBuffer:()=>({getChannelData:()=>new Float32Array(600)}),createGain:gain,createBufferSource:()=>({buffer:null,connect:vi.fn(),start:vi.fn(),stop:(time:number)=>stops.push(time)}),createBiquadFilter:()=>({type:'',frequency:{value:0},Q:{value:0},connect:vi.fn()}),createOscillator:()=>{const frequency={value:0};frequencies.push(frequency);return{type:'',frequency,connect:vi.fn(),start:vi.fn(),stop:vi.fn()}}} as unknown as AudioContext
  const play=createGroovePlayer(context)
  play('Crash',10,false,0.3); expect(stops).toEqual([10.55]); expect(frequencies).toHaveLength(0)
  play('Ride',20,false,0.3); expect(stops).toEqual([10.55,20.09]); expect(frequencies.map((item)=>item.value)).toEqual([2800,4100])
})
it('uses descending tom pitches and separate bass attack pitches', () => {
  const pitches:number[]=[]
  const gain=()=>({gain:{setValueAtTime:vi.fn(),exponentialRampToValueAtTime:vi.fn()},connect:vi.fn()})
  const context={sampleRate:1000,destination:{},createBuffer:()=>({getChannelData:()=>new Float32Array(600)}),createGain:gain,createOscillator:()=>({type:'',frequency:{setValueAtTime:(value:number)=>pitches.push(value),exponentialRampToValueAtTime:vi.fn()},connect:vi.fn(),start:vi.fn(),stop:vi.fn()})} as unknown as AudioContext
  const play=createGroovePlayer(context)
  for(const name of ['Floor tom 2','Floor tom 1','Tom 3','Tom 2','Tom 1','Kick','Kick 2'] as const)play(name,0,false,0.3)
  expect(pitches).toEqual([85,105,135,170,215,130,95])
})
it('gives open hi-hat a longer tail than closed hi-hat', () => {
  const stops: number[] = []
  const context = { sampleRate: 1000, destination: {}, createBuffer: () => ({ getChannelData: () => new Float32Array(600) }), createGain: () => ({ gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }, connect: vi.fn() }), createBufferSource: () => ({ connect: vi.fn(), start: vi.fn(), stop: (time: number) => stops.push(time) }), createBiquadFilter: () => ({ frequency: { value: 0 }, Q: { value: 0 }, connect: vi.fn() }) } as unknown as AudioContext
  const play = createGroovePlayer(context)
  play('Hi-hat', 0, false, 0.3); play('Open hi-hat', 0, false, 0.3)
  expect(stops).toEqual([0.055, 0.35])
})
it('chokes existing cymbal attack and metal tails without cancelling future scheduled hits',()=>{
 const gains:{gain:{setValueAtTime:ReturnType<typeof vi.fn>;exponentialRampToValueAtTime:ReturnType<typeof vi.fn>;cancelScheduledValues:ReturnType<typeof vi.fn>};connect:ReturnType<typeof vi.fn>}[]=[]
 const context={sampleRate:1000,destination:{},createBuffer:()=>({getChannelData:()=>new Float32Array(600)}),createGain:()=>{const gain={gain:{setValueAtTime:vi.fn(),exponentialRampToValueAtTime:vi.fn(),cancelScheduledValues:vi.fn()},connect:vi.fn()};gains.push(gain);return gain},createBufferSource:()=>({connect:vi.fn(),start:vi.fn(),stop:vi.fn()}),createBiquadFilter:()=>({frequency:{value:0},Q:{value:0},connect:vi.fn()}),createOscillator:()=>({frequency:{value:0},connect:vi.fn(),start:vi.fn(),stop:vi.fn()})} as unknown as AudioContext
 const play=createGroovePlayer(context);play('Ride',0,false,.3);play('Ride',.2,false,.3);play('Ride',.1,false,.3,'choke');expect(gains[0].gain.cancelScheduledValues).not.toHaveBeenCalled();for(const gain of gains.slice(1,3))expect(gain.gain.cancelScheduledValues).toHaveBeenCalledWith(.1);for(const gain of gains.slice(3,6))expect(gain.gain.cancelScheduledValues).not.toHaveBeenCalled()
})
