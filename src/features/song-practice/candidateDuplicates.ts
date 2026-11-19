import type {NoteCandidate} from './notationRecognition'
/** Possible overlap, not proof of a false head; source review decides whether both are real. */
export function possibleDuplicateHeads(note:NoteCandidate,notes:readonly NoteCandidate[],gap=10):NoteCandidate[]{return notes.filter(other=>other.id!==note.id&&other.shape===note.shape&&Math.abs(other.x-note.x)<gap*1.1&&Math.abs(other.y-note.y)<gap*0.8)}
