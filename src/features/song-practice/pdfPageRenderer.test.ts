import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderLocalPdfPage } from './pdfPageRenderer'
const mock = vi.hoisted(() => ({ getDocument: vi.fn(), destroy: vi.fn(async () => undefined), render: vi.fn(() => ({ promise: Promise.resolve(), cancel: vi.fn() })) }))
vi.mock('pdfjs-dist', () => ({ GlobalWorkerOptions: { workerSrc: '' }, getDocument: mock.getDocument }))
afterEach(() => vi.clearAllMocks())
describe('bounded local PDF page rendering', () => {
  it('renders only requested page with bounded canvas size and releases resources', async () => {
    const page = { getViewport: ({ scale }: { scale: number }) => ({ width: 1000 * scale, height: 2000 * scale, rotation: 0 }), render: mock.render }
    const getPage = vi.fn(async () => page)
    mock.getDocument.mockReturnValue({ promise: Promise.resolve({ numPages: 2, getPage }), destroy: mock.destroy })
    const canvas = { getContext: () => ({}), width: 0, height: 0 } as unknown as HTMLCanvasElement
    const result = await renderLocalPdfPage({ size: 10, arrayBuffer: async () => new ArrayBuffer(10) } as File, 2, canvas, new AbortController().signal)
    expect(result.pageCount).toBe(2); expect(getPage).toHaveBeenCalledWith(2)
    expect(canvas.width * canvas.height).toBeLessThanOrEqual(4_005_000)
    expect(mock.destroy).toHaveBeenCalled()
  })
})

it('reports real page bounds without requesting an invalid page and always destroys the PDF',async()=>{
 const getPage=vi.fn();mock.getDocument.mockReturnValue({promise:Promise.resolve({numPages:3,getPage}),destroy:mock.destroy})
 const canvas={getContext:()=>({})} as unknown as HTMLCanvasElement
 await expect(renderLocalPdfPage({size:10,arrayBuffer:async()=>new ArrayBuffer(10)} as File,4,canvas,new AbortController().signal)).rejects.toMatchObject({pageCount:3});expect(getPage).not.toHaveBeenCalled();expect(mock.destroy).toHaveBeenCalled()
})
it('bounds zoom rendering and cancels an active render when aborted',async()=>{
 let rejectRender:(error:Error)=>void=()=>undefined;const cancel=vi.fn(()=>rejectRender(new Error('cancelled')))
 const render=vi.fn(()=>({promise:new Promise((_resolve,reject)=>{rejectRender=reject}),cancel}));mock.getDocument.mockReturnValue({promise:Promise.resolve({numPages:1,getPage:async()=>({getViewport:({scale}:{scale:number})=>({width:1000*scale,height:2000*scale}),render})}),destroy:mock.destroy})
 const controller=new AbortController(),canvas={getContext:()=>({}),width:0,height:0} as unknown as HTMLCanvasElement
 const pending=renderLocalPdfPage({size:10,arrayBuffer:async()=>new ArrayBuffer(10)} as File,1,canvas,controller.signal,2);const assertion=expect(pending).rejects.toThrow();await vi.waitFor(()=>expect(render).toHaveBeenCalled());expect(canvas.width*canvas.height).toBeLessThanOrEqual(4_005_000);controller.abort();await assertion;expect(cancel).toHaveBeenCalled();expect(mock.destroy).toHaveBeenCalled()
})
