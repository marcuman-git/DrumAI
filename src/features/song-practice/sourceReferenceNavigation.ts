export interface SourceReferenceRequest { source: string; page: number; requestId?: number }
/** Only navigate a matching user-selected local file; source text is never a URL. */
export function sourceReferencePage(request: SourceReferenceRequest, filename: string): number | null {
 return request.source.trim() === filename && Number.isInteger(request.page) && request.page >= 1 && request.page <= 999 ? request.page : null
}
