import {getMany,setMany,delMany} from 'idb-keyval'
import {createPracticeBackup} from './backupService'
import {parsePracticeBackup,mergePracticeBackup,MAX_BACKUP_BYTES,type PracticeBackup} from './backupLogic'
import {PRACTICE_EVENTS_KEY,PRACTICE_EVENTS_FALLBACK_KEY,withPracticeStorageLock,readPracticeEventsSnapshot} from '../../core/services/storage/practiceEvents'
import {JOURNAL_STORAGE_KEY,loadJournal} from '../journal/journalStorage'
import {isSongChart} from '../song-practice/songChartLogic'
const STORES=[
 ['drummaster-ai-state-v1','drummaster-ai-state-v1'],
 ['drummaster-ai-user-profile-v1','drummaster-ai-user-profile-fallback-v1'],
 ['drummaster-ai-adaptive-plan-v1','drummaster-ai-adaptive-plan-fallback-v1'],
 [null,'drummaster-song-charts-v1'],[null,'drummaster-independence-library-v1'],
 [null,'drummaster-independence-v1'],[null,'drummaster-stickings-v1'],
 [null,'drummaster-snare-studies-v1'],
 [null,'drummaster-speed-records-v1'],[null,'drummaster-groove-playlist-v1'],
] as const
export interface FullBackup{app:'DrumMaster AI Full Backup';schema:1;createdAt:string;history:PracticeBackup;data:Record<string,unknown>}
function safeJson(value:unknown,depth=0):boolean{if(depth>30)return false;if(value===null||typeof value==='boolean'||typeof value==='string')return true;if(typeof value==='number')return Number.isFinite(value);if(Array.isArray(value))return value.every(v=>safeJson(v,depth+1));return !!value&&typeof value==='object'&&Object.entries(value).every(([key,v])=>!['__proto__','constructor','prototype'].includes(key)&&safeJson(v,depth+1))}
export function parseFullBackup(raw:string):FullBackup{
 if(new Blob([raw]).size>MAX_BACKUP_BYTES)throw Error('Backup exceeds20 MB.')
 const value=JSON.parse(raw) as FullBackup
 if(!value||value.app!=='DrumMaster AI Full Backup'||value.schema!==1||!Number.isFinite(Date.parse(value.createdAt))||!value.data||Array.isArray(value.data)||!safeJson(value.data))throw Error('Invalid full backup.')
 parsePracticeBackup(JSON.stringify(value.history))
 for(const [key,data] of Object.entries(value.data)){if(!STORES.some(([,local])=>local===key))throw Error('Backup contains unsupported settings.');if(!data||typeof data!=='object')throw Error('Invalid saved data.');if(key==='drummaster-song-charts-v1'&&(!Array.isArray(data)||!data.every(isSongChart)))throw Error('Invalid chart in backup.')}
 return value
}
export async function createFullBackup():Promise<FullBackup>{const data:Record<string,unknown>={};const keys=STORES.flatMap(([db])=>db?[db]:[]);let values:unknown[]=[];try{values=await getMany(keys)}catch{/* local fallback */}let index=0;for(const [db,local] of STORES){let value=db?values[index++]:undefined;if(value===undefined||value===null){const raw=localStorage.getItem(local);if(raw!==null)value=JSON.parse(raw)}if(value!==undefined&&value!==null)data[local]=value}return parseFullBackup(JSON.stringify({app:'DrumMaster AI Full Backup',schema:1,createdAt:new Date().toISOString(),history:await createPracticeBackup(),data}))}
/** Settings are explicitly restored; history merges by ID. Caller presents a preview and safety backup. */
export async function restoreFullBackup(incoming:FullBackup):Promise<PracticeBackup>{parseFullBackup(JSON.stringify(incoming));return withPracticeStorageLock(async()=>{
 const current:PracticeBackup={app:'DrumMaster AI',schema:1,createdAt:new Date().toISOString(),events:await readPracticeEventsSnapshot(),journal:await loadJournal()}
 const history=mergePracticeBackup(current,incoming.history)
 const localPairs:[string,unknown][]=[[PRACTICE_EVENTS_FALLBACK_KEY,history.events],[JOURNAL_STORAGE_KEY,history.journal],...Object.entries(incoming.data)]
 const dbPairs:[string,unknown][]=[[PRACTICE_EVENTS_KEY,history.events],[JOURNAL_STORAGE_KEY,history.journal]]
 for(const [db,local] of STORES)if(db&&Object.hasOwn(incoming.data,local))dbPairs.push([db,incoming.data[local]])
 const previousLocal=localPairs.map(([key])=>localStorage.getItem(key));let previousDb:unknown[]|null=null;try{previousDb=await getMany(dbPairs.map(([key])=>key))}catch{/* local-only restore */}
 try{for(const [key,value] of localPairs)localStorage.setItem(key,JSON.stringify(value));if(previousDb)await setMany(dbPairs)}catch{for(let i=0;i<localPairs.length;i++){try{if(previousLocal[i]===null)localStorage.removeItem(localPairs[i][0]);else localStorage.setItem(localPairs[i][0],previousLocal[i]!)}catch{/* safety backup remains downloadable */}}if(previousDb){try{await setMany(dbPairs.flatMap(([key],i)=>previousDb![i]===undefined?[]:[[key,previousDb![i]] as [string,unknown]]));await delMany(dbPairs.flatMap(([key],i)=>previousDb![i]===undefined?[key]:[]))}catch{/* report failure and retain safety copy */}}throw Error('Restore failed. Use the safety backup to recover if storage remains unavailable.')}
 return history
 })}
