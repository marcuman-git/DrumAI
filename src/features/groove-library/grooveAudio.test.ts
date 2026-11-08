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
