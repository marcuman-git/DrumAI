/** Expand bounded single-level repeats and numbered endings into explicit measures. */
export function expandedMusicXmlMeasures(part:Element):Element[]{const source=Array.from(part.querySelectorAll(':scope > measure')),result:Element[]=[];let index=0,start=0,pass=1,times=2,ending:number[]|null=null,finished=false,open=false,iterations=0;
 while(index<source.length){if(++iterations>2048||result.length>256)throw Error('Repeat expansion exceeds256 bars.');const measure=source[index],forward=measure.querySelector('repeat[direction="forward"]'),backward=measure.querySelector('repeat[direction="backward"]'),begin=measure.querySelector('ending[type="start"]');if(forward){if(open&&index!==start)throw Error('Nested repeats require manual expansion.');start=index;open=true;if(finished){pass=1;finished=false}}
  if(begin){ending=(begin.getAttribute('number')??'').split(',').map(Number);if(!ending.length||ending.some(n=>!Number.isInteger(n)||n<1||n>8))throw Error('Use numbered repeat endings1–8.')}else if(finished&&!ending&&!measure.querySelector('ending')){pass=1;finished=false}
  if(!ending||ending.includes(pass))result.push(measure.cloneNode(true) as Element)
  if(measure.querySelector('ending[type="stop"],ending[type="discontinue"]')){ending=null;if(finished)start=index+1}
  if(backward){times=Number(backward.getAttribute('times')??2);if(!Number.isInteger(times)||times<2||times>8)throw Error('Repeat count must be2–8.');if(pass<times){pass++;index=start;ending=null;continue}finished=true;open=false;start=index+1}
  index++
 }if(!result.length||result.length>256)throw Error('Import1–256 bars.');return result}
