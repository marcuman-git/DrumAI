import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {SourceCropComparison} from './SourceCropComparison'
afterEach(()=>{cleanup();vi.restoreAllMocks()})
it('shows original pixels unchanged and zooms the source without changing a draft',()=>{const put=vi.fn();vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({createImageData:()=>({data:new Uint8ClampedArray(1600)}),putImageData:put} as unknown as CanvasRenderingContext2D);const pixels=new Uint8ClampedArray(1600).fill(127);render(<SourceCropComparison pixels={pixels} width={20} height={20} draft={null}/>);expect(put.mock.calls[0][0].data).toEqual(pixels);fireEvent.change(screen.getByLabelText('Original crop zoom'),{target:{value:'2'}});expect(screen.getByLabelText('Original unannotated notation crop')).toHaveStyle({width:'200%'});expect(pixels.every(v=>v===127)).toBe(true)})
