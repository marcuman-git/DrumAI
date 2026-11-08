import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { MusicXmlImportPanel } from './MusicXmlImportPanel'
afterEach(cleanup)
it('does not change a chart until preview confirmation and supports cancellation', async () => {
  const onImport = vi.fn()
  render(<MusicXmlImportPanel disabled={false} onImport={onImport} />)
  const xml = '<score-partwise><part-list/><part><measure><attributes><divisions>4</divisions><time><beats>4</beats><beat-type>4</beat-type></time></attributes><note><rest/><duration>16</duration></note></measure></part></score-partwise>'
  const file = { name: 'drums.musicxml', size: xml.length, text: async () => xml }
  fireEvent.change(screen.getByLabelText('Choose MusicXML'), { target: { files: [file] } })
  await waitFor(() => expect(screen.getByText('Confirm MusicXML import')).toBeVisible())
  expect(onImport).not.toHaveBeenCalled()
  fireEvent.click(screen.getByText('Cancel MusicXML import'))
  expect(onImport).not.toHaveBeenCalled()
  fireEvent.change(screen.getByLabelText('Choose MusicXML'), { target: { files: [file] } })
  await waitFor(() => expect(screen.getByText('Confirm MusicXML import')).toBeVisible())
  fireEvent.click(screen.getByText('Confirm MusicXML import'))
  expect(onImport).toHaveBeenCalledOnce()
})
it('uses the PDF-style cyan file picker and disables it during playback', () => {
  render(<MusicXmlImportPanel disabled={true} onImport={vi.fn()} />)
  expect(screen.getByLabelText('Choose MusicXML')).toHaveClass('file:bg-cyan-300', 'file:rounded')
  expect(screen.getByLabelText('Choose MusicXML')).toBeDisabled()
})
