import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PdfChartReference, validatePdfReference, MAX_REFERENCE_BYTES } from './PdfChartReference'
const file = (name = 'study.pdf', header = '%PDF-1.7', size = 10) => ({ name, size, slice: () => ({ text: async () => header.slice(0, 5) }) }) as File
afterEach(() => { cleanup(); vi.restoreAllMocks() })
describe('local PDF reference', () => {
  it('validates extension, size, and header without uploading', async () => {
    await expect(validatePdfReference(file())).resolves.toBeUndefined()
    await expect(validatePdfReference(file('study.json'))).rejects.toThrow('Choose a PDF')
    await expect(validatePdfReference(file('study.pdf', 'not a PDF'))).rejects.toThrow('valid PDF header')
    await expect(validatePdfReference(file('study.pdf', '%PDF-', MAX_REFERENCE_BYTES + 1))).rejects.toThrow('20 MB')
  })
  it('opens, replaces and removes references, revoking every local URL', async () => {
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValueOnce('blob:first').mockReturnValueOnce('blob:second')
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const view = render(<PdfChartReference />)
    fireEvent.change(screen.getByLabelText('Choose local PDF'), { target: { files: [file()] } })
    await waitFor(() => expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src', 'blob:first'))
    fireEvent.change(screen.getByLabelText('Choose local PDF'), { target: { files: [file('new.pdf')] } })
    await waitFor(() => expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src', 'blob:second'))
    expect(revoke).toHaveBeenCalledWith('blob:first')
    fireEvent.click(screen.getByRole('button', { name: 'Remove PDF' }))
    expect(revoke).toHaveBeenCalledWith('blob:second')
    expect(screen.queryByTitle('Local PDF chart preview')).not.toBeInTheDocument()
    view.unmount()
    expect(create).toHaveBeenCalledTimes(2)
  })
  it('rejects invalid selections while keeping the previous reference', async () => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:valid')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    render(<PdfChartReference />)
    fireEvent.change(screen.getByLabelText('Choose local PDF'), { target: { files: [file()] } })
    await screen.findByTitle('Local PDF chart preview')
    fireEvent.change(screen.getByLabelText('Choose local PDF'), { target: { files: [file('bad.pdf', 'hello')] } })
    expect(await screen.findByRole('alert')).toHaveTextContent('File not loaded: This file does not have a valid PDF header.')
    expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src', 'blob:valid')
  })
})
