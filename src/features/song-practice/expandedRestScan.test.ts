import {expect,it} from 'vitest'
import fixtures from './realRestHoldoutFixtures'
import {detectRestHints} from './restRecognition'
it('offers expanded suggestions for known low-resolution rest cases without changing conservative defaults',()=>{
 let recovered=0,unmatched=0
 for(const f of fixtures){const ink=new Uint8Array(f.width*f.height);for(const index of f.ink)ink[index]=1;const image={width:f.width,height:f.height,ink,angle:0,staffs:[f.staff]},candidates=detectRestHints(image,f.staff,f.heads,'expanded');for(const reference of f.rests)if(candidates.some(c=>c.duration===reference.duration&&c.x>=reference.left&&c.x<=reference.right&&c.y>=reference.top&&c.y<=reference.bottom))recovered++;unmatched+=candidates.filter(c=>!f.rests.some(r=>c.x>=r.left&&c.x<=r.right&&c.y>=r.top&&c.y<=r.bottom)).length;expect(candidates.some(c=>c.duration===2&&c.x>=f.quarter.left&&c.x<=f.quarter.right&&c.y>=f.quarter.top&&c.y<=f.quarter.bottom)).toBe(false);expect(detectRestHints(image,f.staff,f.heads)).toEqual(detectRestHints(image,f.staff,f.heads,'conservative'))}
 expect(recovered).toBe(12);expect(unmatched).toBe(0)
})
