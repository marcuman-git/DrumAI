import {expect,it} from 'vitest'
import {refineCrossHeadCenter} from './crossCenter'
import intro from './realIntroGrooveFixtures'
it('refines a real displaced low-resolution cross by bilateral diagonal support',()=>{const f=intro.find(f=>f.dpi===108)!,ink=new Uint8Array(f.width*f.height);for(const i of f.ink)ink[i]=1;const result=refineCrossHeadCenter({width:f.width,height:f.height,ink,angle:0,staffs:[f.staff]},f.staff,45,36);expect(Math.abs(result.x-41)).toBeLessThanOrEqual(1);expect(Math.abs(result.y-33)).toBeLessThanOrEqual(1)})
it('does not move a candidate to a detached stem or a plain staff line',()=>{const width=100,height=80,ink=new Uint8Array(width*height);for(let x=0;x<width;x++)ink[40*width+x]=1;for(let y=10;y<=60;y++)ink[y*width+53]=1;expect(refineCrossHeadCenter({width,height,ink,angle:0,staffs:[]},{top:40,gap:10},50,35)).toEqual({x:50,y:35})})
