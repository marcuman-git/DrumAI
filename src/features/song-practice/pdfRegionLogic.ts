export interface PdfRegion { x: number; y: number; width: number; height: number }
const clamp = (value: number) => Math.max(0, Math.min(1, value))
export function selectRegion(start: { x: number; y: number }, end: { x: number; y: number }): PdfRegion {
  const x1 = clamp(start.x); const x2 = clamp(end.x); const y1 = clamp(start.y); const y2 = clamp(end.y)
  return { x: Math.min(x1, x2), y: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) }
}
export function usableRegion(region: PdfRegion | null): region is PdfRegion { return !!region && region.width >= 0.01 && region.height >= 0.01 }

/** Add scan context without changing the user's selected export region. */
export function analysisRegion(region: PdfRegion, pageWidth: number, pageHeight: number): PdfRegion {
 const horizontal = Math.max(8 / pageWidth, region.width * 0.02)
 const vertical = Math.max(16 / pageHeight, region.height * 0.35)
 return selectRegion({ x: region.x - horizontal, y: region.y - vertical }, { x: region.x + region.width + horizontal, y: region.y + region.height + vertical })
}

