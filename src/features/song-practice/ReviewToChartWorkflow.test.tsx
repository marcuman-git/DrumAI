import {useState} from 'react'
import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {SourceCollection} from './SourceCollection'
import {SongChartEditor} from './SongChartEditor'
import {reviewedBar} from './reviewedRhythm'
import type {RecognitionDraft} from './notationRecognition'
vi.mock('../../core/services/storage/practiceEvents',()=>({startPracticeSession:vi.fn(),stopPracticeSession:vi.fn(),trackPracticeEvent:vi.fn(async()=>undefined)}))
afterEach(()=>{cleanup();localStorage.removeItem('drummaster-song-charts-v1')})
it('transfers a source-checked pickup from collection to new chart, Undo/Redo and save',()=>{
 const crop={page:2,region:{x:.1,y:.2,width:.5,height:.2}},bar=reviewedBar([{instrument:'Snare',step:0,duration:4,kind:'rest',dynamic:2},{instrument:'Snare',step:4,duration:4,kind:'rest',dynamic:2},{instrument:'Snare',step:8,duration:4,kind:'rest',dynamic:2},{instrument:'Snare',step:12,duration:4,kind:'note',dynamic:2,sourceAnchor:{page:2,x:.3,y:.3}}],16),incoming={bar,source:'study.pdf',page:2,references:[[crop]]},file={name:'study.pdf'} as File
 function Flow(){const [draft,setDraft]=useState<RecognitionDraft|null>(null);return <><SourceCollection file={file} incoming={incoming} onSend={setDraft} onInspect={vi.fn()}/><SongChartEditor initialWorkspaceMode="edit" recognitionDraft={draft} onDraftConsumed={()=>setDraft(null)}/></>}
 render(<Flow/>);fireEvent.click(screen.getByRole('button',{name:'Add incoming reviewed section'}));fireEvent.click(screen.getByText('Compare first-bar pickup timing'));fireEvent.click(screen.getByLabelText('Verify pickup source'));fireEvent.change(screen.getByLabelText('Pickup comparison offset'),{target:{value:'12'}});fireEvent.click(screen.getByLabelText('Verify ordered collection'));fireEvent.click(screen.getByRole('button',{name:'Send ordered collection to editor'}));fireEvent.click(screen.getByRole('button',{name:'Create new chart from reviewed draft'}));expect(screen.getByLabelText('First-bar pickup timing')).toHaveValue('12');expect(screen.getByLabelText('Selected section timing')).toHaveTextContent('1.00 seconds');fireEvent.click(screen.getByRole('button',{name:'Undo'}));expect(screen.getByLabelText('First-bar pickup timing')).toHaveValue('0');fireEvent.click(screen.getByRole('button',{name:'Redo'}));fireEvent.click(screen.getByRole('button',{name:'Save as new'}));const saved=JSON.parse(localStorage.getItem('drummaster-song-charts-v1')!).at(-1);expect(saved.pickupOffset).toBe(12);expect(saved.review.bars[0].crops[0]).toEqual(crop);expect(saved.bars[0].rhythmEvents.at(-1).sourceAnchor.page).toBe(2)
})
