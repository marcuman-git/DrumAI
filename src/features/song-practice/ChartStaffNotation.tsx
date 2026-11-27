import {reviewedNotationBeams} from './reviewedNotationBeams'
import {durationNotation,sameTime} from './rhythmTime'
import { barSlots } from './chartMeter'
import { groupedGridNotation } from './gridNotationGrouping'
import { useState } from 'react'
import { staffCountLabel } from './staffCountLabels'
import type { StaffCountMode } from './staffCountLabels'
import { CHART_INSTRUMENTS, notesFor } from './songChartLogic'
import type { ChartBar } from './songChartLogic'
const HEAD_Y = { 'Hi-hat': 50, Snare: 70, Kick: 90, Crash: 35, Ride: 45, 'Kick 2': 95, 'Floor tom 2': 85, 'Floor tom 1': 80, 'Tom 3': 75, 'Tom 2': 65, 'Tom 1': 60, 'Pedal hi-hat': 100, 'Open hi-hat': 50, China: 30, Splash: 40, 'Ride bell': 45 }

/** Simultaneous sixteenth-note strikes share one stem on a percussion staff. */
export function ChartStaffNotation({ bar, barNumber, activeStep, initialCountMode = 'eighth', countMode: controlledCountMode, onCountModeChange, instruments = CHART_INSTRUMENTS, nextBar }: { nextBar?:ChartBar; bar: ChartBar; barNumber: number; activeStep: number; initialCountMode?: StaffCountMode; countMode?: StaffCountMode; onCountModeChange?: (mode: StaffCountMode) => void; instruments?: readonly typeof CHART_INSTRUMENTS[number][] }) {
  const [localCountMode, setCountMode] = useState<StaffCountMode>(initialCountMode)
  const countMode = controlledCountMode ?? localCountMode
  const [crashStyle, setCrashStyle] = useState<'ledger' | 'circle'>('ledger')
  const displayBar = groupedGridNotation(bar, countMode)
  const beams=reviewedNotationBeams(displayBar.rhythmEvents??[])
  const slots = barSlots(bar)
  const displaySteps=[...new Set([...Array.from({length:slots},(_,i)=>i),...(displayBar.rhythmEvents?.map(e=>e.step)??[])])].sort((a,b)=>a-b)
  const tuplets= instruments.flatMap(instrument=>{const events=(displayBar.rhythmEvents??[]).filter(e=>e.instrument===instrument).sort((a,b)=>a.step-b.step),groups:{instrument:typeof instrument;start:number;end:number}[]=[];for(let i=0;i<events.length;i++){const a=events[i],c=events[i+1],d=events[i+2];if(durationNotation(a.duration).triplet&&c&&d&&sameTime(a.duration,c.duration)&&sameTime(a.duration,d.duration)&&sameTime(a.step+a.duration,c.step)&&sameTime(c.step+c.duration,d.step)){groups.push({instrument,start:a.step,end:d.step});i+=2}}return groups})
  const width = 1080; const start = 140; const spacing = 896 / slots
  return <section className="min-w-0 space-y-2" aria-label="Drum staff notation">
    <h4 className="font-semibold">Musical Staff - Bar {barNumber}</h4>
    <p className="text-xs text-zinc-400">One {slots / 4}/4 percussion staff. Reviewed bars show straight/dotted durations, within-bar ties and rests; grid symbols follow the selected count mode where onsets allow grouping. Source PDFs may use different positions. Parentheses mean ghost notes.</p>
    <div className="flex flex-wrap gap-3"><label className="text-sm">Count labels<select aria-label="Staff count labels" value={countMode} onChange={(event) => { const mode = event.target.value as StaffCountMode; setCountMode(mode); onCountModeChange?.(mode) }} className="ml-2 rounded bg-zinc-900 p-2"><option value="quarter">Quarter: 1 2 3 4</option><option value="eighth">Eighth: 1 & 2 &</option><option value="sixteenth">Sixteenth: 1 e & a</option></select></label><label className="text-sm">Crash head style<select aria-label="Crash head style" value={crashStyle} onChange={(event) => setCrashStyle(event.target.value as 'ledger' | 'circle')} className="ml-2 rounded bg-zinc-900 p-2"><option value="ledger">Cross with ledger line</option><option value="circle">Circled cross</option></select></label></div>
    <p className="text-xs text-zinc-400">Count mode also groups grid symbols where no stroke is lost. This is a display assumption, not PDF rhythm recognition. Reviewed durations remain authoritative. Playback onsets are unchanged. Cymbal legends vary by publisher.</p>
    <div className="overflow-auto rounded-lg border border-white/20 bg-zinc-100 p-2">
      <svg role="img" aria-label={`Bar ${barNumber} drum notation`} viewBox={`0 -25 ${width} 190`} className="block h-auto w-full max-w-full" style={{ color: '#18181b',minWidth:displaySteps.length>32?displaySteps.length*24:undefined }}>
        <title>One percussion staff for the supported drum kit</title>
        {[55, 65, 75, 85, 95].map((y) => <line key={y} x1={108} y1={y} x2={width - 12} y2={y} stroke="currentColor" strokeWidth={0.7} />)}
        <line x1={108} y1={55} x2={108} y2={95} stroke="currentColor" /><line x1={width - 12} y1={55} x2={width - 12} y2={95} stroke="currentColor" />
        <path d="M 116 64 v 22 M 120 64 v 22" stroke="currentColor" strokeWidth={2} />
        <text x={126} y={71} fontSize={15} fill="currentColor">{slots / 4}</text><text x={126} y={88} fontSize={15} fill="currentColor">4</text>
        {beams.filter(b=>instruments.includes(b.instrument)).map((beam,i)=>{const x=start+beam.from*spacing+25,end=beam.stub?x+(beam.stub==='right'?1:-1)*Math.min(18,spacing*.5):start+beam.to*spacing+25,y=HEAD_Y[beam.instrument]-32+(beam.level-1)*7;return <path key={i} aria-label={`${beam.instrument} beam level ${beam.level}${beam.stub?' partial':''}`} d={`M ${x} ${y} H ${end}`} stroke="currentColor" strokeWidth={3} fill="none"/>})}
        {tuplets.map((group,i)=>{const x=start+group.start*spacing+20,end=start+group.end*spacing+20,y=HEAD_Y[group.instrument]-50;return <g key={i} aria-label={`${group.instrument} triplet group`} stroke="currentColor"><path d={`M ${x-7} ${y+4} v -4 H ${end+7} v 4`} fill="none"/><text x={(x+end)/2} y={y-3} textAnchor="middle" fontSize={11} stroke="none" fill="currentColor">3</text></g>})}
        {displaySteps.map((step) => {
          const x = start + step * spacing + 20; const color = activeStep === step ? '#b45309' : '#18181b'
          const hits = instruments.filter((instrument) => displayBar.rhythmEvents?displayBar.rhythmEvents.some(e=>e.instrument===instrument&&sameTime(e.step,step)&&e.kind==='note'):notesFor(bar, instrument)[step] !== 0)
          const headOffsets = new Map<string, number>()
          const ordered = [...hits].sort((a, b) => HEAD_Y[a] - HEAD_Y[b])
          ordered.forEach((instrument, index) => {
            const previous = ordered[index - 1]
            headOffsets.set(instrument, previous && HEAD_Y[instrument] - HEAD_Y[previous] <= 8 && headOffsets.get(previous) === 0 ? -11 : 0)
          })
          const stemTop = hits.length ? Math.min(...hits.map((instrument) => HEAD_Y[instrument])) - 32 : 0
          return <g key={step}>
            {activeStep === step && <rect x={x - 18} y={5} width={spacing - 5} height={140} rx={5} fill="#fbbf24" opacity={0.25} />}
            {!displayBar.rhythmEvents && !hits.length && <g stroke={color} fill={color} strokeWidth={1.5}>
              <path d={`M ${x + 7} 62 l -9 30 M ${x + 6} 64 q -6 9 -12 1 M ${x + 3} 74 q -6 9 -12 1`} fill="none" /><circle cx={x - 7} cy={63} r={2.3} /><circle cx={x - 10} cy={73} r={2.3} />
            </g>}
            {instruments.map((instrument) => {
              const y = HEAD_Y[instrument]
              const event = displayBar.rhythmEvents?.find((item) => item.instrument === instrument && sameTime(item.step,step))
              const note=displayBar.rhythmEvents?(event?.kind==='note'?event.dynamic:0):notesFor(bar,instrument)[step];const spec=durationNotation(event?.duration??1);const value=spec.label.toLowerCase()
              return <g key={instrument} data-testid={`staff-${instrument}-${step}`} data-active={activeStep === step} aria-label={`${instrument} slot ${step + 1}: ${event ? value + ' ' + event.kind : displayBar.rhythmEvents ? 'continuation or inactive voice' : ['sixteenth rest', 'ghost sixteenth note', 'sixteenth note', 'accented sixteenth note'][note]}`} stroke={color} fill={color}>
                <title>{`${instrument} slot ${step + 1}: ${event ? (event.tieFromPrevious ? 'tied continuation' : event.kind) : ['rest', 'ghost', 'note', 'accent'][note]}`}</title>
                {event?.kind === 'rest' && <g data-testid={`review-rest-${instrument}-${step}`}>
                  {['whole','half'].includes(spec.type)?<rect x={x-6} y={y-4} width={12} height={4}/>:spec.type==='quarter' ? <path d={`M ${x} ${y - 12} l -5 7 8 7 -6 7 5 7`} fill="none" strokeWidth={2} /> : <><path d={`M ${x + 4} ${y - 10} l -8 24`} fill="none" strokeWidth={2} /><circle cx={x} cy={y - 8} r={3} />{Array.from({length:Math.max(0,spec.flags-1)},(_,i)=><circle key={i} cx={x-3-i*3} cy={y+1+i*7} r={3}/>)}</>}
                </g>}
                {displayBar.rhythmEvents && event?.kind === 'note' && spec.type!=='whole' && <path data-testid={`review-stem-${instrument}-${step}`} d={`M ${x + 5} ${y} V ${y - 32}${Array.from({length:beams.some(b=>b.instrument===instrument&&(sameTime(b.from,step)||sameTime(b.to,step)))?0:spec.flags},(_,i)=>` M ${x+5} ${y-32+i*7} q 15 8 8 18`).join('')}`} fill="none" strokeWidth={1.5} />}
                {note > 0 && headOffsets.get(instrument) === -11 && <path d={`M ${x - 5} ${y} H ${x + 5}`} fill="none" strokeWidth={1} />}
                {event && spec.dot && <circle cx={x+13} cy={y-2} r={2} />}
                {event?.kind==='note' && sameTime(event.step+event.duration,slots) && nextBar?.rhythmEvents?.some(item=>item.instrument===instrument&&item.step===0&&item.tieFromPrevious) && <path aria-label="Tie to next bar" d={`M ${x+7} ${y+9} Q ${width-50} ${y+25} ${width-12} ${y+9}`} fill="none" />}
                {event?.tieFromPrevious && <path aria-label={step===0?"Tie from previous bar":"Tied continuation"} d={`M ${step===0?108:x-spacing+7} ${y+9} Q ${step===0?120:x-spacing/2} ${y+25} ${x-7} ${y+9}`} fill="none" />}
                {(note > 0 || event?.kind === 'note') && <g transform={`translate(${headOffsets.get(instrument) ?? 0},0)`}>
                  {instrument === 'Ride bell' ? <path d={`M ${x} ${y-6} l 6 6 -6 6 -6 -6 Z`} /> : ['Hi-hat', 'Crash', 'Ride', 'Pedal hi-hat', 'Open hi-hat', 'China', 'Splash', 'Ride bell'].includes(instrument) ? <><path d={`M ${x - 5} ${y - 4} l 10 8 M ${x - 5} ${y + 4} l 10 -8`} strokeWidth={2} fill="none" />{instrument === 'Open hi-hat' && <circle cx={x} cy={y - 13} r={4} fill="none" strokeWidth={1.2} />}{instrument === 'China' && <circle cx={x} cy={y} r={8} fill="none" strokeWidth={1} />}{instrument === 'Splash' && <path d={`M ${x-10} ${y} H ${x+10} M ${x-10} ${y+10} H ${x+10}`} fill="none" strokeWidth={1}/>} {instrument === 'Crash' && (crashStyle === 'circle' ? <circle cx={x} cy={y} r={8} fill="none" strokeWidth={1} /> : <path data-testid={`crash-ledger-${step}`} d={`M ${x - 12} ${y} H ${x + 12}`} strokeWidth={1.2} fill="none" />)}</> : <ellipse cx={x} cy={y} rx={6} ry={4} transform={`rotate(-18 ${x} ${y})`} fill={event&&['half','whole'].includes(spec.type)?'none':undefined} strokeWidth={1.5} />}
                  {event?.grace&&Array.from({length:event.grace},(_,i)=><g key={i}><ellipse cx={x-18-i*10} cy={y+3} rx={3.5} ry={2.5}/><path d={`M ${x-15-i*10} ${y+3} v -19 l 6 4 M ${x-19-i*10} ${y-4} l 8 -5`} fill="none"/></g>)}{event?.articulation&&<text x={x} y={y-40} fontSize={9} stroke="none">{event.articulation}</text>}{note === 1 && <><text x={x - 13} y={y + 5} fontSize={18} stroke="none">(</text><text x={x + 8} y={y + 5} fontSize={18} stroke="none">)</text></>}
                </g>}
              </g>
            })}
            {!displayBar.rhythmEvents && hits.length > 0 && <g stroke={color} fill="none" strokeWidth={1.5}>
              <path d={`M ${x + 5} ${Math.max(...hits.map((instrument) => HEAD_Y[instrument]))} V ${stemTop} M ${x + 5} ${stemTop} q 15 8 8 18 M ${x + 5} ${stemTop + 7} q 15 8 8 18`} />
              {hits.some((instrument) => notesFor(bar, instrument)[step] === 3) && <path d={`M ${x - 6} ${stemTop - 12} l 12 4 -12 4`} strokeWidth={1.8} />}
            </g>}
            <text data-testid={`staff-count-${step}`} x={x} y={133} textAnchor="middle" fontSize={11} fill={color}>{staffCountLabel(step, countMode)}</text>
          </g>
        })}
      </svg>
    </div>
    <p className="text-xs text-zinc-400">Reviewed rests are shown per instrument; continuing durations have no new strike. Playback triggers note onsets only. Grid editing discards duration review and turns tied heads into separate grid strikes. Recheck ties before confirming again.</p>
  </section>
}
