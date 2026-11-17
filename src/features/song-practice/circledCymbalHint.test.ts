import {expect,it} from 'vitest'
import {hasCircledCymbalHead} from './circledCymbalHint'
import {findNoteCandidates} from './notationRecognition'
import china from './realCircledCymbalFixture'
import feedback from './feedback012Fixture'
const imageFor=(f:{width:number;height:number;ink:number[]})=>{const ink=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1;return {width:f.width,height:f.height,ink,angle:0,staffs:[]}}
it('flags the labelled real China symbol without claiming a supported voice identity',()=>{
 const image=imageFor(china)
 expect(hasCircledCymbalHead(image,china.staff,128,70)).toBe(true)
 const notes=findNoteCandidates(image,china.staff,'master-key',{cleanHeads:true,tolerance:2})
 expect(notes.some(n=>Math.abs(n.x-128)<=5&&Math.abs(n.y-70)<=5&&n.symbolHint==='circled-cross')).toBe(true)
})
it('separates a ring around a source head from an ordinary crossed ledger',()=>{
 const image=imageFor(feedback)
 expect(hasCircledCymbalHead(image,feedback.staff,21,54)).toBe(true)
 expect(hasCircledCymbalHead(image,feedback.staff,67,44)).toBe(false)
})
it('does not flag solid disks or plain crosses as circled heads',()=>{
 const image={width:100,height:100,ink:new Uint8Array(10000),angle:0,staffs:[]}
 for(let dy=-9;dy<=9;dy++)for(let dx=-9;dx<=9;dx++)if(dx*dx+dy*dy<=81)image.ink[(40+dy)*100+40+dx]=1
 expect(hasCircledCymbalHead(image,{top:60,gap:12},40,40)).toBe(false)
 image.ink.fill(0);for(let dx=-6;dx<=6;dx++)for(const sign of [-1,1])image.ink[(40+Math.round(sign*dx*0.6))*100+40+dx]=1
 expect(hasCircledCymbalHead(image,{top:60,gap:12},40,40)).toBe(false)
})
