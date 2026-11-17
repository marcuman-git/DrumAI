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

it('navigates only matching local PDFs, repeats requests and retries a pending reference after choosing the file',async()=>{
 vi.spyOn(URL,'createObjectURL').mockReturnValueOnce('blob:study').mockReturnValueOnce('blob:target');vi.spyOn(URL,'revokeObjectURL').mockImplementation(()=>undefined)
 const view=render(<PdfChartReference sourceReference={{source:'target.pdf',page:3,requestId:1}}/>);expect(screen.getByRole('status')).toHaveTextContent('Choose the matching local PDF: target.pdf')
 fireEvent.change(screen.getByLabelText('Choose local PDF'),{target:{files:[file()]}});await screen.findByTitle('Local PDF chart preview');expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src','blob:study')
 fireEvent.change(screen.getByLabelText('Choose local PDF'),{target:{files:[file('target.pdf')]}});await waitFor(()=>expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src','blob:target#page=3'))
 expect(screen.getByRole('link',{name:'Open PDF locally'})).toHaveAttribute('href','blob:target#page=3')
 view.rerender(<PdfChartReference sourceReference={{source:'target.pdf',page:5,requestId:2}}/>);expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src','blob:target#page=5')
 view.rerender(<PdfChartReference sourceReference={{source:'other.pdf',page:7,requestId:3}}/>);expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src','blob:target#page=5')
})

it('shows two matching local PDF pages, keeps them on mismatched requests and clears comparison on single-page navigation',async()=>{
 vi.spyOn(URL,'createObjectURL').mockReturnValue('blob:compare');vi.spyOn(URL,'revokeObjectURL').mockImplementation(()=>undefined)
 const view=render(<PdfChartReference sourceReference={{source:'study.pdf',page:2,comparePage:3}}/>);fireEvent.change(screen.getByLabelText('Choose local PDF'),{target:{files:[file()]}})
 await waitFor(()=>expect(screen.getByTitle('Local PDF comparison preview')).toHaveAttribute('src','blob:compare#page=3'));expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src','blob:compare#page=2');expect(screen.getByRole('link',{name:'Open comparison page locally'})).toHaveAttribute('href','blob:compare#page=3')
 view.rerender(<PdfChartReference sourceReference={{source:'other.pdf',page:6,comparePage:7}}/>);expect(screen.getByTitle('Local PDF comparison preview')).toHaveAttribute('src','blob:compare#page=3')
 view.rerender(<PdfChartReference sourceReference={{source:'study.pdf',page:4}}/>);expect(screen.queryByTitle('Local PDF comparison preview')).not.toBeInTheDocument();expect(screen.getByTitle('Local PDF chart preview')).toHaveAttribute('src','blob:compare#page=4')
})
