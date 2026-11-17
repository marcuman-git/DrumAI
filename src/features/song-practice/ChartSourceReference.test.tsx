import {useState} from 'react'
import {cleanup,fireEvent,render,screen} from '@testing-library/react'
import {afterEach,expect,it,vi} from 'vitest'
import {ChartSourceReference} from './ChartSourceReference'
import {newSongChart} from './songChartLogic'
afterEach(cleanup)
it('saves per-bar source pages, validates input and emits navigation without altering notes',()=>{
 const onNavigate=vi.fn();function Harness(){const [chart,setChart]=useState(newSongChart);return <><ChartSourceReference chart={chart} index={0} playing={false} setChart={setChart} onNavigate={onNavigate}/><output>{JSON.stringify(chart.review)}</output></>}
 render(<Harness/>);fireEvent.click(screen.getByText('Source reference — Bar 1'))
 expect(screen.getByRole('button',{name:/Show source reference/})).toBeDisabled()
 fireEvent.change(screen.getByLabelText('Chart source PDF name'),{target:{value:'study.pdf'}});fireEvent.change(screen.getByLabelText('Chart source page'),{target:{value:'3'}})
 fireEvent.change(screen.getByLabelText('Chart source page'),{target:{value:'0'}});expect(screen.getByLabelText('Chart source page')).toHaveValue(3)
 fireEvent.click(screen.getByRole('button',{name:/Show source reference/}));expect(onNavigate).toHaveBeenCalledWith({source:'study.pdf',page:3});expect(screen.getByRole('status')).toHaveTextContent('study.pdf')
})
it('disables source fields during playback',()=>{render(<ChartSourceReference chart={newSongChart()} index={0} playing setChart={vi.fn()}/>);fireEvent.click(screen.getByText('Source reference — Bar 1'));expect(screen.getByLabelText('Chart source PDF name')).toBeDisabled();expect(screen.getByLabelText('Chart source page')).toBeDisabled()})

import {newChartReview} from './chartReviewLogic'
it('offers retained-page comparison without changing saved references and lets the user clear extra pages after review',()=>{
 const onNavigate=vi.fn();function Harness(){const [chart,setChart]=useState(()=>{const chart=newSongChart();chart.review=newChartReview(chart);chart.review.source='study.pdf';chart.review.bars[0].page=2;chart.review.bars[0].additionalPages=[3];return chart});return <ChartSourceReference chart={chart} index={0} playing={false} setChart={setChart} onNavigate={onNavigate}/>}
 render(<Harness/>);fireEvent.click(screen.getByText('Source reference — Bar 1'));expect(screen.getByLabelText('Comparison PDF page')).toHaveValue(3);fireEvent.click(screen.getByRole('button',{name:'Compare source pages'}));expect(onNavigate).toHaveBeenLastCalledWith({source:'study.pdf',page:2,comparePage:3});expect(screen.getByLabelText('Chart source page')).toHaveValue(2)
 fireEvent.change(screen.getByLabelText('Comparison PDF page'),{target:{value:'0'}});expect(screen.getByLabelText('Comparison PDF page')).toHaveValue(3);fireEvent.click(screen.getByRole('button',{name:'View retained page 3'}));expect(onNavigate).toHaveBeenLastCalledWith({source:'study.pdf',page:3});fireEvent.click(screen.getByRole('button',{name:'Return to single source page'}));expect(onNavigate).toHaveBeenLastCalledWith({source:'study.pdf',page:2})
 fireEvent.click(screen.getByRole('button',{name:'Clear additional source pages'}));expect(screen.queryByRole('button',{name:'View retained page 3'})).not.toBeInTheDocument();expect(screen.getByLabelText('Chart source page')).toHaveValue(2)
})
