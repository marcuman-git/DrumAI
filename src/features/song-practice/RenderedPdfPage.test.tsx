import {cleanup,fireEvent,render,screen,waitFor} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {RenderedPdfPage} from './RenderedPdfPage'
const mock=vi.hoisted(()=>({render:vi.fn()}))
vi.mock('./pdfPageRenderer',()=>({PdfPageRangeError:class extends Error{pageCount=3},renderLocalPdfPage:mock.render}))
afterEach(()=>{cleanup();vi.restoreAllMocks();mock.render.mockReset()})
const file={name:'study.pdf'} as File
function setup(){vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({drawImage:vi.fn()} as unknown as CanvasRenderingContext2D);mock.render.mockImplementation(async(_file,page,canvas)=>{canvas.width=100;canvas.height=200;return {pageCount:3,page}})}
it('renders bounded page controls, redraws zoom and rejects pages beyond the loaded document',async()=>{
 setup();render(<RenderedPdfPage file={file} initialPage={1} title="Source"/>);await screen.findByText('Page 1 of 3; zoom 100%.');expect(screen.getByRole('button',{name:'Previous page'})).toBeDisabled()
 fireEvent.click(screen.getByRole('button',{name:'Next page'}));await screen.findByText('Page 2 of 3; zoom 100%.');fireEvent.change(screen.getByLabelText('Source zoom'),{target:{value:'1.5'}});await screen.findByText('Page 2 of 3; zoom 150%.');expect(mock.render.mock.calls.at(-1)?.[4]).toBe(1.5)
 fireEvent.change(screen.getByLabelText('Source page'),{target:{value:'4'}});expect(screen.getByLabelText('Source page')).toHaveValue(2);fireEvent.change(screen.getByLabelText('Source page'),{target:{value:'2'}});expect(screen.getByLabelText('Source canvas')).not.toHaveAttribute('hidden')
 fireEvent.change(screen.getByLabelText('Source page'),{target:{value:'3'}});await screen.findByText('Page 3 of 3; zoom 150%.');expect(screen.getByRole('button',{name:'Next page'})).toBeDisabled()
})
it('does not commit stale renders when navigation changes or after unmount',async()=>{
 setup();const pending:{signal:AbortSignal;resolve:(value:unknown)=>void}[]=[];mock.render.mockImplementation((_f,_p,_c,signal)=>new Promise(resolve=>pending.push({signal,resolve})))
 const view=render(<RenderedPdfPage file={file} initialPage={1} title="Source"/>);fireEvent.change(screen.getByLabelText('Source page'),{target:{value:'2'}});expect(pending[0].signal.aborted).toBe(true);pending[0].resolve({pageCount:3});await waitFor(()=>expect(screen.queryByText('Page 1 of 3; zoom 100%.')).not.toBeInTheDocument());view.unmount();expect(pending[1].signal.aborted).toBe(true);pending[1].resolve({pageCount:3})
})
