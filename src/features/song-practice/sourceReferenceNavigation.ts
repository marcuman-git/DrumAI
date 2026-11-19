import type {SourceCrop,SourceAnchor} from './sourceTrace'
export interface SourceReferenceRequest { source: string; page: number; comparePage?: number;crop?:SourceCrop;compareCrop?:SourceCrop;point?:SourceAnchor;passageSnapshot?:string;reviewSession?:string; requestId?: number }
/** Only navigate a matching user-selected local file; source text is never a URL. */
export function sourceReferencePage(request: SourceReferenceRequest, filename: string): number | null {
 return request.source.trim() === filename && Number.isInteger(request.page) && request.page >= 1 && request.page <= 999 ? request.page : null
}

export function sourceComparisonPage(request:SourceReferenceRequest,filename:string):number|null {
 return sourceReferencePage(request,filename)!==null&&Number.isInteger(request.comparePage)&&request.comparePage!>=1&&request.comparePage!<=999?request.comparePage!:null
}
