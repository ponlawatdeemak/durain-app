import React, { useEffect } from 'react'
import AnalyzeSummary from './Summary'
import AnalyzeDetail from './Detail'
import useSearchAnalyze from './context'
import useOrderByFilter from '../Filter/context'

export const AnalyzeMain = () => {
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { filter, setFilter } = useOrderByFilter()

	useEffect(() => {
		setQueryParams({
			...queryParams,
			provinceId: undefined,
			districtId: undefined,
			subDistrictId: undefined,
			year: new Date().getFullYear(),
		})
	}, [])

	return (
		<div className='flex h-[calc(100vh-86px)] flex-col gap-12 overflow-auto bg-[#F2F5F8] px-4 py-6 sm:px-10'>
			<AnalyzeSummary />
			<AnalyzeDetail />
		</div>
	)
}
