import {expect,it} from 'vitest'
import {connectedStemRecovery} from './connectedStemRecovery'
it('does not borrow a nearby stem through a staff line',()=>{const width=80,height=120,ink=new Uint8Array(width*height);for(const y of [60,70,80,90,100])for(let x=0;x<width;x++)ink[y*width+x]=1;for(let y=68;y<=72;y++)for(let x=38;x<=42;x++)ink[y*width+x]=1;for(let y=30;y<=70;y++)ink[y*width+49]=1;expect(connectedStemRecovery({width,height,ink,angle:0,staffs:[]},{top:60,gap:10},{id:0,x:40,y:70,instrument:'Snare',shape:'oval',strength:1,stemHint:true,flagHint:false})).toBeUndefined()})
