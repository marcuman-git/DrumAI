import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PdfInspectionPanel } from './PdfInspectionPanel'
const inspect = vi.hoisted(() => vi.fn())
vi.mock('./pdfInspectionService', () => ({ inspectLocalPdf: inspect }))
afterEach(() => { cleanup(); vi.clearAllMocks() })
describe('PDF inspection controls', () => {
  it('shows counts without generating notes', async () => {
    inspect.mockResolvedValue({ pageCount: 2, pages: [{ page: 1, textCharacters: 5, images: 0 }], assessment: 'Text layer detected.' })
    render(<PdfInspectionPanel file={{} as File} />)
    fireEvent.click(screen.getByRole('button', { name: 'Inspect PDF locally' }))
    expect(await screen.findByText('Document pages: 2. Sampled pages: 1.')).toBeInTheDocument()
    expect(screen.getByText(/No notes were generated/)).toBeInTheDocument()
  })
  it('reports inspection failure without replacing the reference', async () => {
    inspect.mockRejectedValue(new Error('Invalid PDF'))
    render(<PdfInspectionPanel file={{} as File} />)
    fireEvent.click(screen.getByRole('button', { name: 'Inspect PDF locally' }))
    expect(await screen.findByText(/Inspection failed/)).toBeInTheDocument()
  })
})
