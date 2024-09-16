import React from 'react'
import AnalyzeSummary from './Summary'
import AnalyzeDetail from './Detail'

export const AnalyzeMain = () => {
	return (
		<div className='flex h-[calc(100vh-86px)] flex-col gap-12 overflow-auto bg-[#F2F5F8] px-4 py-6 sm:px-10'>
			<AnalyzeSummary />
			<AnalyzeDetail />
		</div>
	)
}
