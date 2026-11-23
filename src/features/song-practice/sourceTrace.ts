import type {PdfRegion} from './pdfRegionLogic'
import type {ChartBar} from './chartKit'
import type {RecognitionImage,NoteCandidate} from './notationRecognition'
import type {RhythmEvent} from './rhythmTypes'
export interface SourceAnchor {page:number;x:number;y:number}
export interface SourceCrop {page:number;region:PdfRegion;renderZoom?:1|2}
export function validSourceAnchor(value:unknown):value is SourceAnchor{const p=value as SourceAnchor;return !!p&&Number.isInteger(p.page)&&p.page>=1&&p.page<=999&&Number.isFinite(p.x)&&p.x>=0&&p.x<=1&&Number.isFinite(p.y)&&p.y>=0&&p.y<=1}
export function validSourceCrop(value:unknown):value is SourceCrop{const p=value as SourceCrop,r=p?.region;return !!p&&Number.isInteger(p.page)&&p.page>=1&&p.page<=999&&(p.renderZoom===undefined||p.renderZoom===1||p.renderZoom===2)&&!!r&&[r.x,r.y,r.width,r.height].every(Number.isFinite)&&r.x>=0&&r.y>=0&&r.width>0&&r.height>0&&r.x+r.width<=1.000001&&r.y+r.height<=1.000001}
/** Preserve original physical head locations even when reviewed timing/voice changes later. */
export function attachSourceAnchors(bar:ChartBar,events:readonly RhythmEvent[],notes:readonly NoteCandidate[],image:Pick<RecognitionImage,'width'|'height'|'angle'>,crop:SourceCrop):ChartBar{
 if(!bar.rhythmEvents)return bar
 const clamp=(n:number)=>Math.max(0,Math.min(1,n))
 return {...bar,rhythmEvents:bar.rhythmEvents.map(event=>{const original=events.find(e=>e.instrument===event.instrument&&e.step===event.step&&e.kind===event.kind);const note=notes.find(n=>n.id===original?.sourceCandidateId);if(!note)return event;const y=note.y+Math.tan(image.angle*Math.PI/180)*(note.x-image.width/2);return {...event,sourceAnchor:{page:crop.page,x:clamp(crop.region.x+note.x/image.width*crop.region.width),y:clamp(crop.region.y+y/image.height*crop.region.height)}}})}
}
export function cropContainingAnchor(crops:readonly SourceCrop[],point?:SourceAnchor):SourceCrop|undefined{return point?crops.find(c=>c.page===point.page&&point.x>=c.region.x&&point.x<=c.region.x+c.region.width&&point.y>=c.region.y&&point.y<=c.region.y+c.region.height):crops[0]}
