export interface MusicXmlPartChoice {id:string;name:string;percussion:boolean}
export function musicXmlPartChoices(xml:string):MusicXmlPartChoice[]{
 if(xml.length>8*1024*1024||/<!DOCTYPE|<!ENTITY/i.test(xml))throw Error('Choose uncompressed MusicXML without a DTD, below8 MB.')
 const doc=new DOMParser().parseFromString(xml,'application/xml')
 if(doc.querySelector('parsererror')||doc.documentElement.localName!=='score-partwise')throw Error('Expected score-partwise MusicXML.')
 return Array.from(doc.querySelectorAll('score-partwise > part')).map(part=>{const id=part.getAttribute('id')??'',definition=Array.from(doc.querySelectorAll('part-list > score-part')).find(item=>item.getAttribute('id')===id);return {id,name:definition?.querySelector('part-name')?.textContent?.trim()||id||'Unnamed part',percussion:!!part.querySelector('unpitched')||!!definition?.querySelector('midi-unpitched')}})
}
