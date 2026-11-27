import {expect,it,vi} from 'vitest'
import {loadPracticeView,loadPracticeWorkspace,savePracticeWorkspace,defaultPracticeView} from './songPracticeWorkspace'
import {newSongChart} from './songChartLogic'
it('restores validated charts and separate song-specific practice settings',()=>{
 const a=newSongChart(),b=newSongChart();b.title='Another song';const first={...defaultPracticeView(),countMode:'quarter' as const,bar:0,step:6,zoom:125,loop:true}
 expect(savePracticeWorkspace(a,first)).toBe(true);expect(savePracticeWorkspace(b,defaultPracticeView())).toBe(true)
 expect(loadPracticeWorkspace()?.id).toBe(b.id);expect(loadPracticeView(a.id)).toEqual(first);expect(loadPracticeView('missing')).toEqual(defaultPracticeView())
})
it('rejects malformed saved charts and handles unavailable storage without losing live editor state',()=>{
 localStorage.setItem('drummaster-song-practice-workspace-v1','{"version":1,"chart":{"bars":[]}}');expect(loadPracticeWorkspace()).toBeNull()
 const chart=newSongChart(),before=structuredClone(chart),spy=vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw Error('Quota')})
 expect(savePracticeWorkspace(chart,defaultPracticeView())).toBe(false);expect(chart).toEqual(before);spy.mockRestore()
})
