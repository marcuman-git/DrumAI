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
