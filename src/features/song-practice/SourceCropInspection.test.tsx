import {cleanup,render,screen,waitFor} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {SourceCropInspection} from './SourceCropInspection'
const mock=vi.hoisted(()=>({render:vi.fn()}))
vi.mock('./pdfPageRenderer',()=>({renderLocalPdfPage:mock.render}))
afterEach(()=>{cleanup();vi.restoreAllMocks();mock.render.mockReset()})
it('renders the saved crop and original event point only after the active request completes',async()=>{const draw=vi.fn(),outline=vi.fn();vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({drawImage:draw,strokeRect:outline} as unknown as CanvasRenderingContext2D);mock.render.mockImplementation(async(_file,_page,canvas)=>{canvas.width=100;canvas.height=200;return {pageCount:3}});render(<SourceCropInspection file={{name:'study.pdf'} as File} crop={{page:2,region:{x:.1,y:.2,width:.4,height:.2}}} point={{page:2,x:.3,y:.3}}/>);await waitFor(()=>expect(draw).toHaveBeenCalled());expect(draw.mock.calls[0].slice(1)).toEqual([10,40,40,40,0,0,40,40]);expect(outline).toHaveBeenCalled();expect(screen.getByLabelText('Saved original source crop')).not.toHaveAttribute('hidden')})
