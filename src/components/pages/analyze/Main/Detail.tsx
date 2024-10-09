import React, { useEffect } from 'react'
import MapDetail from '../Detail/MapDetail'
import FilterDetail from '../Detail/FilterDetail'
import useOrderByFilter, { OrderBy } from '../Filter/context'

const AnalyzeDetail = () => {
	const { setFilter } = useOrderByFilter()

	useEffect(() => setFilter(OrderBy.Age), [])

	return (
		<div className='flex flex-col gap-12 bg-[#F2F5F8]'>
			<FilterDetail />
			<MapDetail />
		</div>
	)
}

export default AnalyzeDetail
