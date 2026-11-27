import {beforeEach,expect,it,vi} from 'vitest'
const db=vi.hoisted(()=>new Map<string,unknown>())
vi.mock('idb-keyval',()=>({get:vi.fn(async(key:string)=>db.get(key)),set:vi.fn(async(key:string,value:unknown)=>{db.set(key,value)}),getMany:vi.fn(async(keys:string[])=>keys.map(key=>db.get(key))),setMany:vi.fn(async(pairs:[string,unknown][])=>{for(const [key,value] of pairs)db.set(key,value)}),delMany:vi.fn(async(keys:string[])=>{for(const key of keys)db.delete(key)})}))
import {createFullBackup,parseFullBackup,restoreFullBackup} from './fullBackupService'
import {newSongChart} from '../song-practice/songChartLogic'
beforeEach(()=>{db.clear();localStorage.clear()})
it('exports allowlisted charts and settings and restores them without unrelated storage',async()=>{
 const chart=newSongChart();localStorage.setItem('drummaster-song-charts-v1',JSON.stringify([chart]));localStorage.setItem('unrelated-private-data','excluded')
 const backup=await createFullBackup();expect(Object.keys(backup.data)).toEqual(['drummaster-song-charts-v1']);localStorage.removeItem('drummaster-song-charts-v1');await restoreFullBackup(backup);expect(JSON.parse(localStorage.getItem('drummaster-song-charts-v1')!)[0].id).toBe(chart.id);expect(localStorage.getItem('unrelated-private-data')).toBe('excluded')
})
it('rejects unknown stores and malformed charts before writing',async()=>{
 const backup=await createFullBackup();expect(()=>parseFullBackup(JSON.stringify({...backup,data:{unknown:[]}}))).toThrow();expect(()=>parseFullBackup(JSON.stringify({...backup,data:{'drummaster-song-charts-v1':[{}]}}))).toThrow();expect(localStorage.length).toBe(0)
})
it('rolls local writes back if the database transaction fails',async()=>{
 const backup=await createFullBackup();backup.data['drummaster-speed-records-v1']={best:100};localStorage.setItem('drummaster-speed-records-v1','{"best":80}');const {setMany}=await import('idb-keyval');vi.mocked(setMany).mockRejectedValueOnce(Error('storage unavailable'));await expect(restoreFullBackup(backup)).rejects.toThrow('Restore failed');expect(localStorage.getItem('drummaster-speed-records-v1')).toBe('{"best":80}')
})
it('includes snare study preferences and tempo-specific confirmed rounds in the full backup',async()=>{
 const progress={id:'four-strokes',bpm:60,clean:{'four-strokes@60@R':3}}
 localStorage.setItem('drummaster-snare-studies-v1',JSON.stringify(progress));const backup=await createFullBackup()
 expect(backup.data['drummaster-snare-studies-v1']).toEqual(progress);localStorage.removeItem('drummaster-snare-studies-v1')
 await restoreFullBackup(backup);expect(JSON.parse(localStorage.getItem('drummaster-snare-studies-v1')!)).toEqual(progress)
})
