import React from 'react'
import MapDetail from '../Detail/MapDetail'
import FilterDetail from '../Detail/FilterDetail'

const AnalyzeDetail = () => {
	return (
		<div className='flex flex-col gap-12 bg-[#F2F5F8]'>
			<FilterDetail />
			<MapDetail />
		</div>
	)
}

export default AnalyzeDetail
