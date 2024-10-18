import React, { useEffect, useMemo, useState } from 'react'
import useMapStore from '@/components/common/map/store/map'
import AnalyzeSummary from './Summary'
import AnalyzeDetail from './Detail'
import useSearchAnalyze from './context'
import { Popup } from 'maplibre-gl'
import classNames from 'classnames'

export enum OrderBy {
	Age = 'age',
	Changes = 'changes',
}

export const registerPinLayerId = 'register-pin'

export const AnalyzeMain = () => {
	const { removeLayer } = useMapStore()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const [orderBy, setOrderBy] = useState<OrderBy>(OrderBy.Age)

	const popup = useMemo(
		() =>
			new Popup({
				closeButton: true,
				closeOnClick: false,
				closeOnMove: false,
				className: classNames(
					'!max-w-[315px] md:!max-w-[350px] [&_.maplibregl-popup-content]:rounded-lg [&_.maplibregl-popup-content]:p-0 [&_.maplibregl-popup-close-button]:text-[24px] [&_.maplibregl-popup-close-button]:right-2 [&_.maplibregl-popup-close-button]:top-2',
					{
						'[&_.maplibregl-popup-close-button]:text-green-dark1': orderBy === OrderBy.Age,
						'[&_.maplibregl-popup-close-button]:!text-white': orderBy === OrderBy.Changes,
					},
				),
			}),
		[orderBy],
	)

	useEffect(() => {
		const handlePopupClose = () => {
			removeLayer(registerPinLayerId)
		}

		popup.on('close', handlePopupClose)

		return () => {
			popup.off('close', handlePopupClose)
		}
	}, [popup])

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
			<AnalyzeSummary popup={popup} />
			<AnalyzeDetail orderBy={orderBy} setOrderBy={setOrderBy} popup={popup} />
		</div>
	)
}
