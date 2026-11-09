import { expect, it } from 'vitest'
import { detectRestHints, REST_TEMPLATES } from './restRecognition'
import type { RecognitionImage } from './notationRecognition'
it('detects controlled isolated rest templates and does not invent rests in blank images', () => {
  for (const template of REST_TEMPLATES) {
    const image: RecognitionImage = { width: 80, height: 70, ink: new Uint8Array(5600), angle: 0, staffs: [] }
    template.rows.forEach((row, dy) => [...row].forEach((value, dx) => { if (value === '1') image.ink[(12 + dy * 2) * 80 + 25 + dx * 2] = 1 }))
    const found = detectRestHints(image, { top: 20, gap: 10 })
    expect(found.some((item) => item.duration === template.duration && Math.abs(item.x - 31) < 3)).toBe(true)
    image.ink.fill(0)
    expect(detectRestHints(image, { top: 20, gap: 10 })).toEqual([])
  }
})
