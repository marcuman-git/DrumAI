export interface MidiHit {note:number;velocity:number;timestamp:number;device:string}
export async function connectMidi(onHit:(hit:MidiHit)=>void):Promise<()=>void>{
 if(!('requestMIDIAccess' in navigator))throw Error('MIDI is not supported in this browser.')
 const access=await navigator.requestMIDIAccess({sysex:false})
 const handlers=new Map<MIDIInput,(event:MIDIMessageEvent)=>void>();let closed=false,last=0
 function reconcile(){if(closed)return;for(const [input,handler] of handlers)if(input.state==='disconnected'||!Array.from(access.inputs.values()).includes(input)){input.removeEventListener('midimessage',handler);handlers.delete(input)}
 for(const input of access.inputs.values()){if(input.state==='disconnected'||handlers.has(input))continue;const handler=(event:MIDIMessageEvent)=>{if(closed||!event.data||event.data.length<3)return;const [status,note,velocity]=event.data;if((status&0xf0)!==0x90||velocity===0)return;last=Math.max(last,Number.isFinite(event.timeStamp)?event.timeStamp:performance.now());onHit({note,velocity,timestamp:last,device:input.name??'Generic MIDI Device'})};input.addEventListener('midimessage',handler);handlers.set(input,handler)}}
 reconcile();if(!handlers.size)throw Error('No MIDI inputs detected.')
 access.addEventListener('statechange',reconcile)
 return()=>{closed=true;access.removeEventListener('statechange',reconcile);for(const [input,handler] of handlers)input.removeEventListener('midimessage',handler);handlers.clear()}
}
