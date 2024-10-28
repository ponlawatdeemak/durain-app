import React from 'react'
import MapDetail from '../Detail/MapDetail'
import FilterDetail from '../Detail/FilterDetail'
import { OrderBy } from '.'
import { Popup } from 'maplibre-gl'

interface AnalyzeDetailProps {
	orderBy: OrderBy
	setOrderBy: React.Dispatch<React.SetStateAction<OrderBy>>
	popup: Popup
}

const AnalyzeDetail: React.FC<AnalyzeDetailProps> = ({ orderBy, setOrderBy, popup }) => {
	return (
		<div className='flex flex-col gap-12 bg-[#F2F5F8]'>
			<FilterDetail orderBy={orderBy} setOrderBy={setOrderBy} popup={popup} />
			<MapDetail orderBy={orderBy} popup={popup} />
		</div>
	)
}

export default AnalyzeDetail
