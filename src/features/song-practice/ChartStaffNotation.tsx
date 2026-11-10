import { CHART_INSTRUMENTS, notesFor } from './songChartLogic'
import type { ChartBar } from './songChartLogic'
const HEAD_Y = { 'Hi-hat': 50, Snare: 70, Kick: 90, Crash: 35, Ride: 45, 'Kick 2': 95, 'Floor tom 2': 85, 'Floor tom 1': 80, 'Tom 3': 75, 'Tom 2': 65, 'Tom 1': 60, 'Pedal hi-hat': 100, 'Open hi-hat': 50 }

/** Simultaneous sixteenth-note strikes share one stem on a percussion staff. */
export function ChartStaffNotation({ bar, barNumber, activeStep, instruments = CHART_INSTRUMENTS }: { bar: ChartBar; barNumber: number; activeStep: number; instruments?: readonly typeof CHART_INSTRUMENTS[number][] }) {
  const width = 1080; const start = 140; const spacing = 56
  return <section className="min-w-0 space-y-2" aria-label="Drum staff notation">
    <h4 className="font-semibold">Musical Staff - Bar {barNumber}</h4>
    <p className="text-xs text-zinc-400">One 4/4 percussion staff. Reviewed bars show quarter/eighth/sixteenth durations and rests; ordinary grid bars show sixteenth slots. Source PDFs may use different positions. Parentheses mean ghost notes.</p>
    <div className="overflow-hidden rounded-lg border border-white/20 bg-zinc-100 p-2">
      <svg role="img" aria-label={`Bar ${barNumber} drum notation`} viewBox={`0 -25 ${width} 190`} className="block h-auto w-full max-w-full" style={{ color: '#18181b' }}>
        <title>One percussion staff for the supported drum kit</title>
        {[55, 65, 75, 85, 95].map((y) => <line key={y} x1={108} y1={y} x2={width - 12} y2={y} stroke="currentColor" strokeWidth={0.7} />)}
        <line x1={108} y1={55} x2={108} y2={95} stroke="currentColor" /><line x1={width - 12} y1={55} x2={width - 12} y2={95} stroke="currentColor" />
        <path d="M 116 64 v 22 M 120 64 v 22" stroke="currentColor" strokeWidth={2} />
        <text x={126} y={71} fontSize={15} fill="currentColor">4</text><text x={126} y={88} fontSize={15} fill="currentColor">4</text>
        {Array.from({ length: 16 }, (_, step) => {
          const x = start + step * spacing + 20; const color = activeStep === step ? '#b45309' : '#18181b'
          const hits = instruments.filter((instrument) => notesFor(bar, instrument)[step] !== 0)
          const headOffsets = new Map<string, number>()
          const ordered = [...hits].sort((a, b) => HEAD_Y[a] - HEAD_Y[b])
          ordered.forEach((instrument, index) => {
            const previous = ordered[index - 1]
            headOffsets.set(instrument, previous && HEAD_Y[instrument] - HEAD_Y[previous] <= 8 && headOffsets.get(previous) === 0 ? -11 : 0)
          })
          const stemTop = hits.length ? Math.min(...hits.map((instrument) => HEAD_Y[instrument])) - 32 : 0
          return <g key={step}>
            {activeStep === step && <rect x={x - 18} y={5} width={spacing - 5} height={140} rx={5} fill="#fbbf24" opacity={0.25} />}
            {!bar.rhythmEvents && !hits.length && <g stroke={color} fill={color} strokeWidth={1.5}>
              <path d={`M ${x + 7} 62 l -9 30 M ${x + 6} 64 q -6 9 -12 1 M ${x + 3} 74 q -6 9 -12 1`} fill="none" /><circle cx={x - 7} cy={63} r={2.3} /><circle cx={x - 10} cy={73} r={2.3} />
            </g>}
            {instruments.map((instrument) => {
              const note = notesFor(bar, instrument)[step]; const y = HEAD_Y[instrument]
              const event = bar.rhythmEvents?.find((item) => item.instrument === instrument && item.step === step)
              const value = event?.duration === 4 ? 'quarter' : event?.duration === 2 ? 'eighth' : 'sixteenth'
              return <g key={instrument} data-testid={`staff-${instrument}-${step}`} data-active={activeStep === step} aria-label={`${instrument} slot ${step + 1}: ${event ? value + ' ' + event.kind : bar.rhythmEvents ? 'continuation or inactive voice' : ['sixteenth rest', 'ghost sixteenth note', 'sixteenth note', 'accented sixteenth note'][note]}`} stroke={color} fill={color}>
                <title>{instrument} slot {step + 1}: {['rest', 'ghost', 'note', 'accent'][note]}</title>
                {event?.kind === 'rest' && <g data-testid={`review-rest-${instrument}-${step}`}>
                  {event.duration === 4 ? <path d={`M ${x} ${y - 12} l -5 7 8 7 -6 7 5 7`} fill="none" strokeWidth={2} /> : <><path d={`M ${x + 4} ${y - 10} l -8 24`} fill="none" strokeWidth={2} /><circle cx={x} cy={y - 8} r={3} />{event.duration === 1 && <circle cx={x - 3} cy={y + 1} r={3} />}</>}
                </g>}
                {bar.rhythmEvents && note > 0 && event?.kind === 'note' && <path data-testid={`review-stem-${instrument}-${step}`} d={`M ${x + 5} ${y} V ${y - 32}${event.duration <= 2 ? ` M ${x + 5} ${y - 32} q 15 8 8 18` : ''}${event.duration === 1 ? ` M ${x + 5} ${y - 25} q 15 8 8 18` : ''}`} fill="none" strokeWidth={1.5} />}
                {note > 0 && headOffsets.get(instrument) === -11 && <path d={`M ${x - 5} ${y} H ${x + 5}`} fill="none" strokeWidth={1} />}
                {note > 0 && <g transform={`translate(${headOffsets.get(instrument) ?? 0},0)`}>
                  {['Hi-hat', 'Crash', 'Ride', 'Pedal hi-hat', 'Open hi-hat'].includes(instrument) ? <><path d={`M ${x - 5} ${y - 4} l 10 8 M ${x - 5} ${y + 4} l 10 -8`} strokeWidth={2} fill="none" />{instrument === 'Open hi-hat' && <circle cx={x} cy={y - 13} r={4} fill="none" strokeWidth={1.2} />}{instrument === 'Crash' && <circle cx={x} cy={y} r={8} fill="none" strokeWidth={1} />}</> : <ellipse cx={x} cy={y} rx={6} ry={4} transform={`rotate(-18 ${x} ${y})`} />}
                  {note === 1 && <><text x={x - 13} y={y + 5} fontSize={18} stroke="none">(</text><text x={x + 8} y={y + 5} fontSize={18} stroke="none">)</text></>}
                </g>}
              </g>
            })}
            {!bar.rhythmEvents && hits.length > 0 && <g stroke={color} fill="none" strokeWidth={1.5}>
              <path d={`M ${x + 5} ${Math.max(...hits.map((instrument) => HEAD_Y[instrument]))} V ${stemTop} M ${x + 5} ${stemTop} q 15 8 8 18 M ${x + 5} ${stemTop + 7} q 15 8 8 18`} />
              {hits.some((instrument) => notesFor(bar, instrument)[step] === 3) && <path d={`M ${x - 6} ${stemTop - 12} l 12 4 -12 4`} strokeWidth={1.8} />}
            </g>}
            <text x={x} y={133} textAnchor="middle" fontSize={11} fill={color}>{step % 4 === 0 ? step / 4 + 1 : ['e', '&', 'a'][step % 4 - 1]}</text>
          </g>
        })}
      </svg>
    </div>
    <p className="text-xs text-zinc-400">Reviewed rests are shown per instrument; continuing durations have no new strike. Playback triggers note onsets only. Grid editing discards reviewed durations for that bar and returns it to sixteenth-slot notation.</p>
  </section>
}
