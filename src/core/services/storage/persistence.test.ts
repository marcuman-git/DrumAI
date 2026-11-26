import {beforeEach,expect,it,vi} from 'vitest'
vi.mock('idb-keyval',()=>({get:vi.fn(),set:vi.fn()}))
import {get,set} from 'idb-keyval'
import {loadState,saveState} from './persistence'
beforeEach(()=>{localStorage.clear();vi.mocked(get).mockReset();vi.mocked(set).mockReset()})
it('falls back to local storage when IndexedDB fails and ignores malformed saved JSON',async()=>{
 vi.mocked(get).mockRejectedValue(Error('unavailable'));await saveState({hits:[]});expect(await loadState()).toEqual({hits:[]});localStorage.setItem('drummaster-ai-state-v1','broken');expect(await loadState()).toBeNull()
})
it('serializes writes so the latest state wins',async()=>{
 const values:unknown[]=[];vi.mocked(set).mockImplementation(async(_key,value)=>{values.push(value)});await Promise.all([saveState({hits:[1]}),saveState({hits:[2]})]);expect(values).toEqual([{hits:[1]},{hits:[2]}]);expect(JSON.parse(localStorage.getItem('drummaster-ai-state-v1')!)).toEqual({hits:[2]})
})
