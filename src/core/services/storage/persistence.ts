import { get, set } from 'idb-keyval'
const KEY = 'drummaster-ai-state-v1'
let writes:Promise<void>=Promise.resolve()
export function saveState<T>(value:T):Promise<void>{
 const copy=JSON.stringify(value)
 writes=writes.catch(()=>{}).then(async()=>{let saved=false;try{await set(KEY,JSON.parse(copy));saved=true}catch{/* local fallback */}try{localStorage.setItem(KEY,copy);saved=true}catch{/* database may still have committed */}if(!saved)window.dispatchEvent(new Event('drummaster-storage-unavailable'))})
 return writes
}
export async function loadState<T>():Promise<T|null>{
 try{const value=await get<T>(KEY);if(value&&typeof value==='object')return value}catch{/* local fallback */}
 try{const raw=localStorage.getItem(KEY),value=raw?JSON.parse(raw):null;return value&&typeof value==='object'?value:null}catch{return null}
}
