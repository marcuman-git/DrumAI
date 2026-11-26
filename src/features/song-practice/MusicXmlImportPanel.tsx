import { useRef, useState } from 'react'
import { importMusicXml } from './musicXmlImport'
import type { SongChart } from './songChartLogic'
export function MusicXmlImportPanel({ disabled, onImport }: { disabled: boolean; onImport: (chart: SongChart) => void }) {
  const [draft, setDraft] = useState<SongChart | null>(null)
  const [message, setMessage] = useState('Local import: one percussion part, complete 2/4 or 4/4 bars (one meter per chart), fine reviewed timing, supported GM kit voices, adjacent ties,3:2 triplets, flam/drag and bounded repeats/endings. Compressed .mxl, other tuplets, nested repeats, mixed meters and tempo changes require manual preparation.')
  const generation = useRef(0)
  return <section className="space-y-2 rounded border border-cyan-300/40 p-3" aria-label="MusicXML import">
    <h4 className="font-semibold">Import MusicXML</h4>
    <p className="text-sm text-amber-100" role="status">{message}</p>
    <label className="block rounded-lg border border-cyan-200/50 bg-cyan-950/40 p-3 text-sm text-cyan-100">Choose local MusicXML (max 8 MB)
    <input aria-label="Choose MusicXML" type="file" disabled={disabled} className="mt-2 block w-full text-sm file:mr-2 file:rounded file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:text-slate-950 disabled:opacity-50" onChange={async (event) => {
      const file = event.target.files?.[0]; event.target.value = ''; const token = ++generation.current; setDraft(null)
      if (!file) return
      try {
        if (!/\.(musicxml|xml)$/i.test(file.name) || file.size > 8*1024*1024) throw new Error('Choose an uncompressed .musicxml or .xml file below 8 MB.')
        const result = importMusicXml(await file.text())
        if (token !== generation.current) return
        setDraft(result); setMessage(`Preview: ${result.title}, ${result.bars.length} bars, ${result.bpm} BPM. Confirm to replace the current unsaved chart. Saved charts remain unchanged. Notes stay editable.`)
      } catch (error) { if (token === generation.current) setMessage(`File not loaded: ${error instanceof Error ? error.message : 'Invalid document.'}`) }
    }} /></label>
    {draft && <div className="flex gap-2"><button disabled={disabled} onClick={() => { onImport(draft); setDraft(null); setMessage('Imported into editable chart. Verify against the source, then Save as new.') }} className="rounded bg-cyan-800 px-3 py-2">Confirm MusicXML import</button><button onClick={() => { generation.current++; setDraft(null); setMessage('Import canceled; chart unchanged.') }} className="rounded border border-white/30 px-3 py-2">Cancel MusicXML import</button></div>}
  </section>
}
