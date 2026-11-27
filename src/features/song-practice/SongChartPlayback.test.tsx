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
function setup(){vi.useFakeTimers();vi.stubGlobal('AudioContext',AudioMock);vi.stubGlobal('requestAnimationFrame',(cb:FrameRequestCallback)=>window.setTimeout(()=>cb(performance.now()),16));vi.stubGlobal('cancelAnimationFrame',(id:number)=>window.clearTimeout(id));render(<SongChartEditor/>)}
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
