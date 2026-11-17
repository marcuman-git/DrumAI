import { expect,it } from 'vitest'
import { describeSessionSettings,sourceSessionSettings,sourceFingerprint } from './sourceReviewSession'
const scanKey=JSON.stringify([160,'',{top:40,gap:10},'master-key',true,true,false,4.5,1.5,false,2.5,3,1,2,10,95,'4/4','eighth'])
it('shows reproducible scan settings for existing version-one sessions',()=>{
 const settings=sourceSessionSettings(JSON.stringify({version:1,sourceKey:'source',scanKey}),'source')
 expect(settings.staff).toEqual({top:40,gap:10});expect(settings.profile).toBe('master-key')
 expect(describeSessionSettings(settings)).toContain('threshold 160');expect(describeSessionSettings(settings)).toContain('eighth guides 10%–95%')
})
it('rejects unrelated source pixels and malformed scan settings before applying them',()=>{
 const pixels=new Uint8ClampedArray([255,255,255,255]);const key=sourceFingerprint(pixels,1,1,'original',1)
 const saved=JSON.stringify({version:1,sourceKey:key,scanKey})
 expect(()=>sourceSessionSettings(saved,sourceFingerprint(pixels,1,1,'other',1))).toThrow('matching original source')
 const values=JSON.parse(scanKey);values[0]=999
 expect(()=>sourceSessionSettings(JSON.stringify({version:1,sourceKey:key,scanKey:JSON.stringify(values)}),key)).toThrow('Invalid saved')
 expect(()=>sourceSessionSettings('null',key)).toThrow('matching original')
})
