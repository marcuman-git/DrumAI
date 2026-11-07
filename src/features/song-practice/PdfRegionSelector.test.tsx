import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PdfRegionSelector } from './PdfRegionSelector'
const draw = vi.hoisted(() => vi.fn())
vi.mock('./pdfPageRenderer', () => ({ renderLocalPdfPage: draw }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
describe('local PDF page controls', () => {
  it('opens rendering, switches page, and closes safely', async () => {
    draw.mockResolvedValue({ pageCount: 2, width: 600, height: 800, rotation: 0 })
    render(<PdfRegionSelector file={{} as File} />)
    fireEvent.click(screen.getByRole('button', { name: 'Render PDF page' }))
    await screen.findByText('Page 1 / 2')
    fireEvent.click(screen.getByRole('button', { name: 'Next PDF page' }))
    await screen.findByText('Page 2 / 2')
    expect(draw.mock.calls[1][1]).toBe(2)
    fireEvent.click(screen.getByRole('button', { name: 'Close page renderer' }))
    expect(screen.queryByLabelText('Rendered local PDF page')).not.toBeInTheDocument()
  })
  it('shows failures without touching the chart', async () => {
    draw.mockRejectedValue(new Error('Broken PDF'))
    render(<PdfRegionSelector file={{} as File} />)
    fireEvent.click(screen.getByRole('button', { name: 'Render PDF page' }))
    expect(await screen.findByText(/Page could not render/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Download region PNG' })).toBeDisabled()
  })
})
it('selects a region using pointer coordinates and clears it', async () => {
  draw.mockResolvedValue({ pageCount: 1, width: 600, height: 800, rotation: 0 })
  render(<PdfRegionSelector file={{} as File} />)
  fireEvent.click(screen.getByRole('button', { name: 'Render PDF page' }))
  await screen.findByText(/Page rendered/)
  fireEvent.click(screen.getByRole('button', { name: 'Select region Off' }))
  const surface = screen.getByLabelText('Rendered PDF selection surface')
  surface.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200, toJSON: () => ({}) })
  surface.setPointerCapture = vi.fn(); surface.hasPointerCapture = () => true; surface.releasePointerCapture = vi.fn()
  function pointer(type: string, x: number, y: number) {
    const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y })
    Object.defineProperty(event, 'pointerId', { value: 1 }); fireEvent(surface, event)
  }
  pointer('pointerdown', 20, 20); pointer('pointermove', 120, 120); pointer('pointerup', 120, 120)
  expect(screen.getByRole('button', { name: 'Export region JSON' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Download region PNG' })).toBeEnabled()
  fireEvent.click(screen.getByRole('button', { name: 'Clear region' }))
  expect(screen.getByRole('button', { name: 'Export region JSON' })).toBeDisabled()
})
