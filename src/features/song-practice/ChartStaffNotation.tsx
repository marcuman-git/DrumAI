import { CHART_INSTRUMENTS } from './songChartLogic'
import type { ChartBar } from './songChartLogic'
const HEAD_Y = { 'Hi-hat': -5, Snare: 15, Kick: 35 }

/** One staff per instrument keeps independent sixteenth-note rests explicit. */
export function ChartStaffNotation({ bar, barNumber, activeStep }: { bar: ChartBar; barNumber: number; activeStep: number }) {
  const width = 1080; const start = 140; const spacing = 56
  return <section className="min-w-0 space-y-2" aria-label="Drum staff notation">
    <h4 className="font-semibold">Musical Staff - Bar {barNumber}</h4>
    <p className="text-xs text-zinc-400">4/4 percussion notation, one staff per instrument. Each symbol lasts a sixteenth note. Parentheses indicate ghost notes; accents appear above the note. The grid below remains editable.</p>
    <div className="overflow-hidden rounded-lg border border-white/20 bg-zinc-100 p-2">
      <svg role="img" aria-label={`Bar ${barNumber} drum notation`} viewBox={`0 0 ${width} 390`} className="block h-auto w-full max-w-full" style={{ color: '#18181b' }}>
        <title>Three aligned percussion staves with sixteenth notes and rests</title>
        {CHART_INSTRUMENTS.map((instrument, row) => {
          const top = 55 + row * 120
          return <g key={instrument}>
            <text x={8} y={top + 22} fontSize={16} fill="currentColor">{instrument}</text>
            {[0, 10, 20, 30, 40].map((offset) => <line key={offset} x1={108} y1={top + offset} x2={width - 12} y2={top + offset} stroke="currentColor" strokeWidth={0.7} />)}
            <line x1={108} y1={top} x2={108} y2={top + 40} stroke="currentColor" />
            <line x1={width - 12} y1={top} x2={width - 12} y2={top + 40} stroke="currentColor" />
            <path d={`M 116 ${top + 9} v 22 M 120 ${top + 9} v 22`} stroke="currentColor" strokeWidth={2} />
            <text x={126} y={top + 16} fontSize={15} fill="currentColor">4</text><text x={126} y={top + 33} fontSize={15} fill="currentColor">4</text>
            {bar[instrument].map((note, step) => {
              const x = start + step * spacing + 20; const y = top + HEAD_Y[instrument]; const color = activeStep === step ? '#b45309' : '#18181b'
              return <g key={step} data-testid={`staff-${instrument}-${step}`} data-active={activeStep === step} aria-label={`${instrument} slot ${step + 1}: ${['sixteenth rest', 'ghost sixteenth note', 'sixteenth note', 'accented sixteenth note'][note]}`}>
                <title>{instrument} slot {step + 1}: {['rest', 'ghost', 'note', 'accent'][note]}</title>
                {activeStep === step && <rect x={x - 18} y={top - 44} width={spacing - 5} height={101} rx={5} fill="#fbbf24" opacity={0.25} />}
                {note === 0 ? <g stroke={color} fill={color} strokeWidth={1.5}>
                  <path d={`M ${x + 7} ${top + 7} l -9 30 M ${x + 6} ${top + 9} q -6 9 -12 1 M ${x + 3} ${top + 19} q -6 9 -12 1`} fill="none" />
                  <circle cx={x - 7} cy={top + 8} r={2.3} /><circle cx={x - 10} cy={top + 18} r={2.3} />
                </g> : <g stroke={color} fill={color}>
                  {instrument === 'Hi-hat' ? <path d={`M ${x - 5} ${y - 4} l 10 8 M ${x - 5} ${y + 4} l 10 -8`} strokeWidth={2} fill="none" /> : <ellipse cx={x} cy={y} rx={6} ry={4} transform={`rotate(-18 ${x} ${y})`} />}
                  <path d={`M ${x + 5} ${y} v -32 M ${x + 5} ${y - 32} q 15 8 8 18 M ${x + 5} ${y - 25} q 15 8 8 18`} strokeWidth={1.5} fill="none" />
                  {note === 1 && <><text x={x - 13} y={y + 5} fontSize={18} stroke="none">(</text><text x={x + 8} y={y + 5} fontSize={18} stroke="none">)</text></>}
                  {note === 3 && <path d={`M ${x - 6} ${y - 43} l 12 4 -12 4`} strokeWidth={1.8} fill="none" />}
                </g>}
                <text x={x} y={top + 70} textAnchor="middle" fontSize={11} fill={color}>{step % 4 === 0 ? step / 4 + 1 : ['e', '&', 'a'][step % 4 - 1]}</text>
              </g>
            })}
          </g>
        })}
      </svg>
    </div>
  </section>
}
