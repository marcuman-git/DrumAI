import { CHART_INSTRUMENTS, notesFor } from './songChartLogic'
import type { ChartBar } from './songChartLogic'
const HEAD_Y = { 'Hi-hat': 50, Snare: 70, Kick: 90, Crash: 35, Ride: 45 }

/** Simultaneous sixteenth-note strikes share one stem on a percussion staff. */
export function ChartStaffNotation({ bar, barNumber, activeStep }: { bar: ChartBar; barNumber: number; activeStep: number }) {
  const width = 1080; const start = 140; const spacing = 56
  return <section className="min-w-0 space-y-2" aria-label="Drum staff notation">
    <h4 className="font-semibold">Musical Staff - Bar {barNumber}</h4>
    <p className="text-xs text-zinc-400">One 4/4 percussion staff: Crash and Ride above Hi-hat, Snare upper space, Kick lower space. Source PDFs may use different positions. Simultaneous strokes align vertically; parentheses mean ghost notes.</p>
    <div className="overflow-hidden rounded-lg border border-white/20 bg-zinc-100 p-2">
      <svg role="img" aria-label={`Bar ${barNumber} drum notation`} viewBox={`0 -25 ${width} 190`} className="block h-auto w-full max-w-full" style={{ color: '#18181b' }}>
        <title>One percussion staff with aligned Hi-hat, Snare, Kick, Crash and Ride strokes</title>
        {[55, 65, 75, 85, 95].map((y) => <line key={y} x1={108} y1={y} x2={width - 12} y2={y} stroke="currentColor" strokeWidth={0.7} />)}
        <line x1={108} y1={55} x2={108} y2={95} stroke="currentColor" /><line x1={width - 12} y1={55} x2={width - 12} y2={95} stroke="currentColor" />
        <path d="M 116 64 v 22 M 120 64 v 22" stroke="currentColor" strokeWidth={2} />
        <text x={126} y={71} fontSize={15} fill="currentColor">4</text><text x={126} y={88} fontSize={15} fill="currentColor">4</text>
        {Array.from({ length: 16 }, (_, step) => {
          const x = start + step * spacing + 20; const color = activeStep === step ? '#b45309' : '#18181b'
          const hits = CHART_INSTRUMENTS.filter((instrument) => notesFor(bar, instrument)[step] !== 0)
          const stemTop = hits.length ? Math.min(...hits.map((instrument) => HEAD_Y[instrument])) - 32 : 0
          return <g key={step}>
            {activeStep === step && <rect x={x - 18} y={5} width={spacing - 5} height={140} rx={5} fill="#fbbf24" opacity={0.25} />}
            {!hits.length && <g stroke={color} fill={color} strokeWidth={1.5}>
              <path d={`M ${x + 7} 62 l -9 30 M ${x + 6} 64 q -6 9 -12 1 M ${x + 3} 74 q -6 9 -12 1`} fill="none" /><circle cx={x - 7} cy={63} r={2.3} /><circle cx={x - 10} cy={73} r={2.3} />
            </g>}
            {CHART_INSTRUMENTS.map((instrument) => {
              const note = notesFor(bar, instrument)[step]; const y = HEAD_Y[instrument]
              return <g key={instrument} data-testid={`staff-${instrument}-${step}`} data-active={activeStep === step} aria-label={`${instrument} slot ${step + 1}: ${['sixteenth rest', 'ghost sixteenth note', 'sixteenth note', 'accented sixteenth note'][note]}`} stroke={color} fill={color}>
                <title>{instrument} slot {step + 1}: {['rest', 'ghost', 'note', 'accent'][note]}</title>
                {note > 0 && <>
                  {['Hi-hat', 'Crash', 'Ride'].includes(instrument) ? <><path d={`M ${x - 5} ${y - 4} l 10 8 M ${x - 5} ${y + 4} l 10 -8`} strokeWidth={2} fill="none" />{instrument === 'Crash' && <circle cx={x} cy={y} r={8} fill="none" strokeWidth={1} />}</> : <ellipse cx={x} cy={y} rx={6} ry={4} transform={`rotate(-18 ${x} ${y})`} />}
                  {note === 1 && <><text x={x - 13} y={y + 5} fontSize={18} stroke="none">(</text><text x={x + 8} y={y + 5} fontSize={18} stroke="none">)</text></>}
                </>}
              </g>
            })}
            {hits.length > 0 && <g stroke={color} fill="none" strokeWidth={1.5}>
              <path d={`M ${x + 5} ${Math.max(...hits.map((instrument) => HEAD_Y[instrument]))} V ${stemTop} M ${x + 5} ${stemTop} q 15 8 8 18 M ${x + 5} ${stemTop + 7} q 15 8 8 18`} />
              {hits.some((instrument) => notesFor(bar, instrument)[step] === 3) && <path d={`M ${x - 6} ${stemTop - 12} l 12 4 -12 4`} strokeWidth={1.8} />}
            </g>}
            <text x={x} y={133} textAnchor="middle" fontSize={11} fill={color}>{step % 4 === 0 ? step / 4 + 1 : ['e', '&', 'a'][step % 4 - 1]}</text>
          </g>
        })}
      </svg>
    </div>
    <p className="text-xs text-zinc-400">A rest symbol appears only when all instruments are silent. The editable grid still shows each instrument's individual rests.</p>
  </section>
}
