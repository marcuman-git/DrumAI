import { afterEach, describe, expect, it, vi } from 'vitest'
import { inspectLocalPdf } from './pdfInspectionService'
const mock = vi.hoisted(() => ({ getDocument: vi.fn(), destroy: vi.fn(async () => undefined), page: vi.fn(), global: { workerSrc: '' } }))
vi.mock('pdfjs-dist', () => ({ GlobalWorkerOptions: mock.global, OPS: { paintImageXObject: 1, paintInlineImageXObject: 2, paintImageMaskXObject: 3 }, getDocument: mock.getDocument }))
const file = { size: 10, arrayBuffer: async () => new ArrayBuffer(10) } as File
function setup(text: string, images: number, pages = 1) {
  mock.page.mockResolvedValue({ getTextContent: async () => ({ items: [{ str: text }] }), getOperatorList: async () => ({ fnArray: Array(images).fill(1) }), cleanup: vi.fn() })
  mock.getDocument.mockReturnValue({ promise: Promise.resolve({ numPages: pages, getPage: mock.page }), destroy: mock.destroy })
}
afterEach(() => vi.clearAllMocks())
describe('local PDF structure inspection', () => {
  it('reports text presence and samples no more than ten pages', async () => {
    setup('Practice chart', 0, 15)
    const result = await inspectLocalPdf(file, new AbortController().signal)
    expect(result.pageCount).toBe(15); expect(result.pages).toHaveLength(10)
    expect(result.assessment).toContain('does not prove')
    expect(mock.destroy).toHaveBeenCalled()
    expect(mock.getDocument.mock.calls[0][0].data).toBeInstanceOf(Uint8Array)
  })
  it('distinguishes image-only and unknown structure without claiming recognition', async () => {
    setup('', 2)
    expect((await inspectLocalPdf(file, new AbortController().signal)).assessment).toContain('scanned chart is possible')
    setup('', 0)
    expect((await inspectLocalPdf(file, new AbortController().signal)).assessment).toContain('Vector notation')
  })
  it('rejects pre-cancelled and oversized files', async () => {
    const controller = new AbortController(); controller.abort()
    await expect(inspectLocalPdf(file, controller.signal)).rejects.toThrow()
    await expect(inspectLocalPdf({ ...file, size: 21 * 1024 * 1024 } as File, new AbortController().signal)).rejects.toThrow('20 MB')
  })
})
