import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {newSongChart} from './songChartLogic'
import {ChartReviewChecklist} from './ChartReviewChecklist'
afterEach(cleanup)
it('navigates to a review without marking data reviewed or changing chart notes',()=>{const chart=newSongChart(),onSelectBar=vi.fn(),before=JSON.stringify(chart);render(<ChartReviewChecklist chart={chart} onSelectBar={onSelectBar}/>);fireEvent.click(screen.getByText('Final chart review checklist'));fireEvent.click(screen.getByRole('button',{name:'Review checklist bar 1'}));expect(onSelectBar).toHaveBeenCalledWith(0);expect(JSON.stringify(chart)).toBe(before)})
