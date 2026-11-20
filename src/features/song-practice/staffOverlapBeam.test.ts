import {expect,it} from 'vitest'
import {inspectBeamFlags} from './beamFlagEvidence'
it('does not invent an extra beam from a single thin staff row',()=>{const width=80,height=80,ink=new Uint8Array(width*height),staff={top:30,gap:5},stem={x:20,end:20,length:35,direction:-1};for(let y=20;y<=55;y++)ink[y*width+20]=1;for(let y=20;y<=22;y++)for(let x=20;x<50;x++)ink[y*width+x]=1;for(let x=0;x<width;x++)ink[30*width+x]=1;expect(inspectBeamFlags({width,height,ink,angle:0,staffs:[staff]},staff,stem).beamBands).toBe(1)})
