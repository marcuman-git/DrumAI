import { useRef, useState } from 'react'
import { importMusicXml } from './musicXmlImport'
import type { SongChart } from './songChartLogic'
export function MusicXmlImportPanel({ disabled, onImport }: { disabled: boolean; onImport: (chart: SongChart) => void }) {
  const [draft, setDraft] = useState<SongChart | null>(null)
  const [message, setMessage] = useState('Local import: one percussion part, complete 4/4 bars, sixteenth-grid timing, GM Hi-hat/Snare/Kick. Compressed .mxl, cymbals, ties and tuplets are not supported.')
  const generation = useRef(0)
  return <section className="space-y-2 rounded border border-cyan-300/40 p-3" aria-label="MusicXML import">
    <h4 className="font-semibold">Import MusicXML</h4>
    <p className="text-sm text-amber-100" role="status">{message}</p>
    <input aria-label="Choose MusicXML" type="file" disabled={disabled} onChange={async (event) => {
      const file = event.target.files?.[0]; event.target.value = ''; const token = ++generation.current; setDraft(null)
      if (!file) return
      try {
        if (!/\.(musicxml|xml)$/i.test(file.name) || file.size > 512000) throw new Error('Choose an uncompressed .musicxml or .xml file below 500 KB.')
        const result = importMusicXml(await file.text())
        if (token !== generation.current) return
        setDraft(result); setMessage(`Preview: ${result.title}, ${result.bars.length} bars, ${result.bpm} BPM. Confirm to replace the current unsaved chart. Saved charts remain unchanged. Notes stay editable.`)
      } catch (error) { if (token === generation.current) setMessage(`File not loaded: ${error instanceof Error ? error.message : 'Invalid document.'}`) }
    }} />
    {draft && <div className="flex gap-2"><button disabled={disabled} onClick={() => { onImport(draft); setDraft(null); setMessage('Imported into editable chart. Verify against the source, then Save as new.') }} className="rounded bg-cyan-800 px-3 py-2">Confirm MusicXML import</button><button onClick={() => { generation.current++; setDraft(null); setMessage('Import canceled; chart unchanged.') }} className="rounded border border-white/30 px-3 py-2">Cancel MusicXML import</button></div>}
  </section>
}
