import {musicXmlPartChoices} from './musicXmlParts'
import type {MusicXmlPartChoice} from './musicXmlParts'
import { useRef, useState } from 'react'
import { importMusicXml } from './musicXmlImport'
import type { SongChart } from './songChartLogic'
export function MusicXmlImportPanel({ disabled, onImport }: { disabled: boolean; onImport: (chart: SongChart) => void }) {
  const [sourceXml,setSourceXml]=useState(''),[parts,setParts]=useState<MusicXmlPartChoice[]>([]),[partId,setPartId]=useState('')
  const [draft, setDraft] = useState<SongChart | null>(null)
  const [message, setMessage] = useState('Local import: choose a percussion track from MusicXML, complete 2/4 or 4/4 bars (one meter per chart), fine reviewed timing, supported GM kit voices, adjacent ties,3:2 triplets, flam/drag and bounded repeats/endings. Compressed .mxl, other tuplets, nested repeats, mixed meters and tempo changes require manual preparation.')
  const generation = useRef(0)
  return <section className="space-y-2 rounded border border-cyan-300/40 p-3" aria-label="MusicXML import">
    <h4 className="font-semibold">Import MusicXML</h4>
    <p className="text-sm text-amber-100" role="status">{message}</p>
    <label className="block rounded-lg border border-cyan-200/50 bg-cyan-950/40 p-3 text-sm text-cyan-100">Choose local MusicXML (max 8 MB)
    <input aria-label="Choose MusicXML" type="file" disabled={disabled} className="mt-2 block w-full text-sm file:mr-2 file:rounded file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:text-slate-950 disabled:opacity-50" onChange={async (event) => {
      const file = event.target.files?.[0]; event.target.value = ''; const token = ++generation.current; setDraft(null)
      setSourceXml('');setParts([]);setPartId('');if (!file) return
      try {
        if (!/\.(musicxml|xml)$/i.test(file.name) || file.size > 8*1024*1024) throw new Error('Choose an uncompressed .musicxml or .xml file below 8 MB.')
        const xml=await file.text(),choices=musicXmlPartChoices(xml)
        if(token!==generation.current)return
        if(choices.length>1){setSourceXml(xml);setParts(choices);setPartId(choices.find(part=>part.percussion)?.id??'');setMessage('Choose the drum/percussion track, then preview. Other tracks will not be imported.');return}
        const result = importMusicXml(xml)
        if (token !== generation.current) return
        setDraft(result); setMessage(`Preview: ${result.title}, ${result.bars.length} bars, ${result.bpm} BPM. Confirm to replace the current unsaved chart. Saved charts remain unchanged. Notes stay editable.`)
      } catch (error) { if (token === generation.current) setMessage(`File not loaded: ${error instanceof Error ? error.message : 'Invalid document.'}`) }
    }} /></label>
    {parts.length>1&&<div className="flex flex-wrap items-center gap-2"><label>Drum track <select aria-label="MusicXML drum track" disabled={disabled} value={partId} onChange={e=>{setPartId(e.target.value);setDraft(null)}} className="rounded bg-zinc-900 p-2"><option value="">Select a track</option>{parts.map(part=><option key={part.id} value={part.id}>{part.name}{part.percussion?' · percussion':''}</option>)}</select></label><button disabled={disabled||!partId} onClick={()=>{try{const result=importMusicXml(sourceXml,partId);setDraft(result);setMessage(`Preview: ${result.title}, ${result.bars.length} bars, ${result.bpm} BPM. Timing validated; compare with your source before confirming.`)}catch(error){setDraft(null);setMessage(error instanceof Error?error.message:'Selected track could not be imported.')}}} className="rounded border px-3 py-2">Preview selected drum track</button></div>}
    {draft && <div className="flex gap-2"><button disabled={disabled} onClick={() => { onImport(draft); setDraft(null); setMessage('Imported into editable chart. Verify against the source, then Save as new.') }} className="rounded bg-cyan-800 px-3 py-2">Confirm MusicXML import</button><button onClick={() => { generation.current++; setDraft(null); setMessage('Import canceled; chart unchanged.') }} className="rounded border border-white/30 px-3 py-2">Cancel MusicXML import</button></div>}
  </section>
}
