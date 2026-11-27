import {savePracticeWorkspace,defaultPracticeView,loadPracticeWorkspace,loadPracticeView} from './songPracticeWorkspace'
import {act,cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {SongChartEditor} from './SongChartEditor'
import {newSongChart} from './songChartLogic'
import {reviewedBar} from './reviewedRhythm'
import {defaultMix} from './chartPracticeSettings'
const {play}=vi.hoisted(()=>({play:vi.fn()}))
vi.mock('../groove-library/grooveAudio',()=>({createGroovePlayer:()=>play}))
vi.mock('../../core/services/storage/practiceEvents',()=>({startPracticeSession:()=> 'test',stopPracticeSession:vi.fn(),trackPracticeEvent:vi.fn(async()=>{})}))
class AudioMock {get currentTime(){return performance.now()/1000}resume=async()=>{};close=async()=>{};state='running';destination={}}
function setup(mode:'practice'|'edit'='edit'){vi.useFakeTimers();vi.stubGlobal('AudioContext',AudioMock);vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>window.setTimeout(()=>cb(performance.now()),16));vi.stubGlobal('cancelAnimationFrame',(id:number)=>window.clearTimeout(id));render(<SongChartEditor initialWorkspaceMode={mode}/>)}
async function start(){await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Play chart'}));await Promise.resolve()})}
async function advance(ms:number){await act(async()=>{await vi.advanceTimersByTimeAsync(ms)})}
afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();localStorage.clear();play.mockClear()})
it('sounds only the twelve chart strokes, never highlights the screenshot empty slot, and ends at four seconds',async()=>{
 setup();await start();await advance(1370)
 expect(screen.getByRole('button',{name:'Hi-hat step 6: rest'})).not.toHaveClass('ring-2')
 expect(play.mock.calls.filter(c=>c[0]==='Hi-hat')).toHaveLength(3)
 await advance(2710)
 expect(play.mock.calls).toHaveLength(12)
 expect(play.mock.calls.filter(c=>c[0]==='Hi-hat').map(c=>Number((c[1]-play.mock.calls[0][1]).toFixed(2)))).toEqual([0,.5,1,1.5,2,2.5,3,3.5])
 expect(screen.getByRole('button',{name:'Play chart'})).toBeEnabled()
})
it('imports authoritative reviewed silence and suppresses both muted grace and main strokes',async()=>{
 setup();const chart=newSongChart();chart.mix=defaultMix();chart.mix.Snare.muted=true
 chart.bars=[reviewedBar([{instrument:'Snare',kind:'note',step:0,duration:1,dynamic:2,grace:2},{instrument:'Snare',kind:'rest',step:1,duration:3,dynamic:2},{instrument:'Snare',kind:'rest',step:4,duration:12,dynamic:2}])]
 await act(async()=>{fireEvent.change(screen.getByLabelText('Import chart JSON'),{target:{files:[{size:100,text:async()=>JSON.stringify({app:'DrumMaster AI Chart',schema:1,chart})}]}});await Promise.resolve()})
 await start();await advance(700);expect(play).not.toHaveBeenCalled()
 fireEvent.click(screen.getByRole('button',{name:'Stop chart'}));await advance(1000);expect(play).not.toHaveBeenCalled()
 expect(screen.getByRole('button',{name:'Play chart'})).toBeEnabled()
})
it('keeps a real off-count stroke visible and identifies a hidden voice',async()=>{
 setup();fireEvent.click(screen.getByRole('button',{name:'Ride step 6: rest'}))
 fireEvent.click(screen.getByRole('button',{name:'Show basic kit'}));await start();await advance(1370)
 expect(screen.getByText(/Scheduled strokes: Ride/)).toBeInTheDocument()
 expect(play.mock.calls.filter(c=>c[0]==='Ride')).toHaveLength(1)
})

it('starts at a selected fractional note without replaying an earlier note projected into the same grid cell',async()=>{
 const chart=newSongChart();chart.bars=[reviewedBar([{instrument:'Hi-hat',kind:'note',step:0,duration:.5,dynamic:2},{instrument:'Hi-hat',kind:'note',step:.5,duration:.5,dynamic:2},{instrument:'Hi-hat',kind:'rest',step:1,duration:3,dynamic:2},{instrument:'Hi-hat',kind:'rest',step:4,duration:12,dynamic:2}])]
 savePracticeWorkspace(chart,defaultPracticeView());setup('practice')
 fireEvent.click(screen.getByRole('button',{name:'Start at bar 1, slot 1.5'}))
 await act(async()=>{fireEvent.click(screen.getByRole('button',{name:'Play score'}));await Promise.resolve()})
 await advance(300);expect(play).toHaveBeenCalledTimes(1)
 fireEvent.click(screen.getByRole('button',{name:'Stop score'}));await advance(200);expect(play).toHaveBeenCalledTimes(1)
})
it('loads four source excerpt bars, selects a loop passage, and preserves song position/preferences after closing',async()=>{
 setup('practice');fireEvent.click(screen.getByRole('button',{name:'Load Back in Black excerpt'}))
 expect(screen.getAllByRole('img',{name:/Bar \d+ drum notation/})).toHaveLength(4)
 fireEvent.click(screen.getByRole('button',{name:'Select loop bars'}))
 fireEvent.click(screen.getByRole('button',{name:'3 · Groove'}));fireEvent.click(screen.getByRole('button',{name:'4 · Groove'}))
 expect(screen.getByRole('button',{name:'Loop On'})).toHaveAttribute('aria-pressed','true')
 fireEvent.change(screen.getByLabelText('Score zoom'),{target:{value:'125'}})
 fireEvent.change(screen.getByLabelText('Score count labels'),{target:{value:'quarter'}})
 fireEvent.click(screen.getByRole('button',{name:'Start at bar 3, slot 9'}));cleanup()
 const restored=loadPracticeWorkspace()!;expect(restored.section).toEqual({start:2,end:3});expect(restored.bars).toHaveLength(4)
 expect(loadPracticeView(restored.id)).toMatchObject({bar:2,step:8,countMode:'quarter',zoom:125,loop:true})
 render(<SongChartEditor/>);expect(screen.getByLabelText('Score zoom')).toHaveValue('125');expect(screen.getByText(/Start at bar 3, slot 9/)).toBeInTheDocument()
})
