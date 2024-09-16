import React from 'react'
import MapDetail from '../Detail/MapDetail'
import TableDetail from '../Detail/TableDetail'

const AnalyzeDetail = () => {
	return (
		<div className='flex flex-col gap-12 bg-[#F2F5F8]'>
			<TableDetail />
			<MapDetail />
		</div>
	)
}

export default AnalyzeDetail
