import {expect,it} from 'vitest'
import {splitPassage,passageDraftsReady} from './passageReviewLogic'
import {newSongChart} from './songChartLogic'
it('splits uneven bars without copying adjacent pixels or losing rows',()=>{
 const pixels=new Uint8ClampedArray(100*30*4);for(let row=0;row<30;row++)for(let x=0;x<100;x++)pixels.fill(x,(row*100+x)*4,(row*100+x+1)*4)
 const parts=splitPassage(pixels,100,30,[0,30,100]);expect(parts.map(p=>p.width)).toEqual([30,70]);expect(parts[0].pixels[29*4]).toBe(29);expect(parts[1].pixels[0]).toBe(30);expect(parts[1].pixels[70*29*4]).toBe(30);expect(parts[1].pixels.at(-1)).toBe(99);parts[0].pixels[0]=255;expect(pixels[0]).toBe(0)
})
it('rejects descending, missing, narrow and oversized boundary plans',()=>{
 for(const cuts of [[0,70,60,100],[0,100],[1,50,100],[0,1,100],Array.from({length:10},(_,i)=>i*100/9),[0,NaN,100]])expect(()=>splitPassage(new Uint8ClampedArray(100*30*4),100,30,cuts)).toThrow()
})
it('requires every staged bar and a consistent meter before passage send',()=>{
 const bar=newSongChart().bars[0],draft={bar,source:'study.pdf',page:1};expect(passageDraftsReady([draft,null])).toBe(false);expect(passageDraftsReady([draft,draft])).toBe(true);expect(passageDraftsReady([draft,{...draft,bar:{...bar,beats:2}}])).toBe(false)
})
