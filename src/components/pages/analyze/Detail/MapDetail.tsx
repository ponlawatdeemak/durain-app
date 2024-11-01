import { ResponseLanguage } from '@/api/interface'
import MapView from '@/components/common/map/MapView'
import { Alert, Box, CircularProgress, Snackbar, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSearchAnalyze from '../Main/context'
import { thaiExtent, tileLayer } from '@/config/app.config'
import { getApiAccessToken } from '@/api/core'
import { MapLayer } from '@/components/common/map/interface/map'
import { MVTLayer } from '@deck.gl/geo-layers'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import hexRgb from 'hex-rgb'
import useMapStore from '@/components/common/map/store/map'
import { GetSummaryOverviewDtoIn } from '@/api/analyze/dto-in.dto'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'
import {
	GetAgeclassLocationDtoOut,
	GetCompareLocationDtoOut,
	GetSummaryOverviewDtoOut,
} from '@/api/analyze/dto.out.dto'
import { Feature, Geometry } from 'geojson'
import SummaryInfoWindow from '../Map/SummaryInfoWindow'
import { IconLayer } from '@deck.gl/layers'
import { getPin } from '@/utils/pin'
import { DurianChangeAreaColor } from '@/config/color'
import CompareInfoWindow from '../Map/CompareInfoWindow'
import { Popup } from 'maplibre-gl'
import { districtPinLayerId, OrderBy, registerPinLayerId } from '../Main'
import classNames from 'classnames'

interface CompareSameLayerType {
	ADM1_TH: string
	ADM1_EN: string
	ADM2_TH: string
	ADM2_EN: string
	ADM3_TH: string
	ADM3_EN: string
	layerName: string
	admCode: number
	area_rai: number
}

interface CompareLayerType extends CompareSameLayerType {
	year_en: number
	year_th: number
}

interface DurianLayerType extends CompareLayerType {
	ageClass_id: string
}

interface Area {
	rai: number
	sqkm: number
	hectare: number
}

interface AgeClass {
	name: ResponseLanguage
	id: string
	color: string
	area: Area
	percent: number
}

const defaultColor = [0, 0, 0, 0] as any

interface MapDetailProps {
	orderBy: OrderBy
	popup: Popup
}

const MapDetail: React.FC<MapDetailProps> = ({ orderBy, popup }) => {
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const [summaryInfoWindow, setSummaryInfoWindow] = useState<GetAgeclassLocationDtoOut | null>(null)
	const [compareInfoWindow, setCompareInfoWindow] = useState<GetCompareLocationDtoOut | null>(null)
	const { mapLibre, setLayers, removeLayer, addLayer, switchState } = useMapStore()
	const [overviewData, setOverviewData] = useState<GetSummaryOverviewDtoOut>()
	const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const apiAccessToken = getApiAccessToken()

	const popupSummaryNode = useRef<HTMLDivElement>(null)
	const popupCompareNode = useRef<HTMLDivElement>(null)

	const filterSummaryOverview = useMemo(() => {
		let admCode: number | undefined = undefined

		if (queryParams.provinceId && queryParams.districtId && queryParams.subDistrictId) {
			admCode = queryParams.subDistrictId
		} else if (queryParams.provinceId && queryParams.districtId) {
			admCode = queryParams.districtId
		} else if (queryParams.provinceId) {
			admCode = queryParams.provinceId
		}

		const filter: GetSummaryOverviewDtoIn = {
			year: queryParams?.year ?? new Date().getFullYear(),
			admCode,
		}
		return filter
	}, [queryParams.year, queryParams.provinceId, queryParams.districtId, queryParams.subDistrictId])

	const { data: _summaryOverviewData, isLoading: _isSummaryOverviewDataLoading } = useQuery({
		queryKey: ['getSummaryOverviewMap', filterSummaryOverview],
		queryFn: async () => {
			const response = await service.analyze.getSummaryOverview(filterSummaryOverview)
			if (response?.data) {
				setOverviewData(response.data)
			}
			return response
		},
	})

	const { data: durianAvailabilityData, isLoading: _isDurianAvailabilityDataLoading } = useQuery({
		queryKey: ['getDurianAvailabilityCompareMap'],
		queryFn: () => service.analyze.getDurianAvailability(),
	})

	useEffect(() => {
		const initYearEnd = durianAvailabilityData?.data
			?.sort((a, b) => b.year - a.year)
			.find((item) => item.year < new Date().getFullYear())

		setQueryParams({ ...queryParams, yearStart: new Date().getFullYear(), yearEnd: initYearEnd?.year })
	}, [durianAvailabilityData])

	const mapBoundaryAdmCodes = useMemo(() => {
		return overviewData?.adms.map((item) => Number(item?.admCode)) || []
	}, [overviewData])

	const handlePositionClick = useCallback(
		(coordinate: { lng: number; lat: number }, data: GetAgeclassLocationDtoOut | GetCompareLocationDtoOut) => {
			const lon = coordinate.lng
			const lat = coordinate.lat

			if (orderBy === OrderBy.Age) {
				setSummaryInfoWindow(data as GetAgeclassLocationDtoOut)

				if (!popup || !mapLibre || !popupSummaryNode.current) return

				popup?.setLngLat([lon, lat]).setDOMContent(popupSummaryNode.current).addTo(mapLibre)
			} else if (orderBy === OrderBy.Changes) {
				setCompareInfoWindow(data as GetCompareLocationDtoOut)

				if (!popup || !mapLibre || !popupCompareNode.current) return

				popup?.setLngLat([lon, lat]).setDOMContent(popupCompareNode.current).addTo(mapLibre)
			}

			if (orderBy === OrderBy.Changes) {
				removeLayer(districtPinLayerId)
				const districtLayer = new MVTLayer({
					id: districtPinLayerId,
					name: districtPinLayerId,
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					visible: true,
					data: tileLayer.subDistrict,
					onError(error) {
						if (error.message.startsWith('loading TileJSON')) {
							setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
						}
					},
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor(d: any) {
						if (Number(d.properties.subDistrictCode) === Number(data.admCode)) {
							return [241, 169, 11, 64]
						} else {
							return defaultColor
						}
					},
					getLineColor(d: any) {
						if (Number(d.properties.subDistrictCode) === Number(data.admCode)) {
							return [241, 169, 11, 255]
						} else {
							return defaultColor
						}
					},
					pickable: true,
					updateTriggers: {
						getFillColor: [data.admCode],
						getLineColor: [data.admCode],
						getLineWidth: [data.admCode],
					},
				})
				addLayer(districtLayer)
			}

			const coordinates: [number, number] = [lon, lat]

			removeLayer(registerPinLayerId)
			const iconLayer = new IconLayer({
				id: registerPinLayerId,
				data: [{ coordinates }],
				visible: true,
				getIcon: () => {
					return {
						url: getPin('#F03E3E'),
						anchorY: 69,
						width: 58,
						height: 69,
						mask: false,
					}
				},
				sizeScale: 1,
				getPosition: (d: any) => d.coordinates,
				getSize: 40,
			})
			addLayer(iconLayer)
		},
		[
			orderBy,
			setSummaryInfoWindow,
			setCompareInfoWindow,
			addLayer,
			removeLayer,
			mapLibre,
			popup,
			popupSummaryNode,
			popupCompareNode,
		],
	)

	const onLayerClick = useCallback(
		(coordinate: { lng: number; lat: number }, data: GetAgeclassLocationDtoOut | GetCompareLocationDtoOut) => {
			if (queryParams.subDistrictId && queryParams.subDistrictId !== Number(data?.admCode)) return popup.remove()
			if (queryParams.districtId && queryParams.districtId !== +String(data?.admCode).substring(0, 4))
				return popup.remove()
			if (queryParams.provinceId && queryParams.provinceId !== +String(data?.admCode).substring(0, 2))
				return popup.remove()
			if (!queryParams.provinceId && !mapBoundaryAdmCodes?.includes(+String(data?.admCode).substring(0, 2)))
				return popup.remove()
			return handlePositionClick(coordinate, data)
		},
		[
			queryParams.provinceId,
			queryParams.districtId,
			queryParams.subDistrictId,
			mapBoundaryAdmCodes,
			handlePositionClick,
			popup,
		],
	)

	const getSummaryColor = useCallback(
		(item: AgeClass) => {
			return (d: Feature<Geometry, DurianLayerType>): any => {
				if (queryParams.subDistrictId && queryParams.subDistrictId !== Number(d.properties.admCode))
					return defaultColor
				if (queryParams.districtId && queryParams.districtId !== +String(d.properties.admCode).substring(0, 4))
					return defaultColor
				if (queryParams.provinceId && queryParams.provinceId !== +String(d.properties.admCode).substring(0, 2))
					return defaultColor
				if (
					!queryParams.provinceId &&
					!mapBoundaryAdmCodes?.includes(+String(d.properties.admCode).substring(0, 2))
				)
					return defaultColor

				if (item.id === d.properties.ageClass_id) {
					const array = hexRgb(item.color, { format: 'array' })
					array[3] = 255
					return array
				} else {
					return defaultColor
				}
			}
		},
		[queryParams.provinceId, queryParams.districtId, queryParams.subDistrictId, mapBoundaryAdmCodes],
	)

	const getCompareColor = useCallback(
		(color: string) => {
			return (d: Feature<Geometry, CompareLayerType | CompareSameLayerType>): any => {
				if (queryParams.subDistrictId && queryParams.subDistrictId !== Number(d.properties.admCode))
					return defaultColor
				if (queryParams.districtId && queryParams.districtId !== +String(d.properties.admCode).substring(0, 4))
					return defaultColor
				if (queryParams.provinceId && queryParams.provinceId !== +String(d.properties.admCode).substring(0, 2))
					return defaultColor
				if (
					!queryParams.provinceId &&
					!mapBoundaryAdmCodes?.includes(+String(d.properties.admCode).substring(0, 2))
				)
					return defaultColor

				const array = hexRgb(color, { format: 'array' })
				array[3] = 255
				return array
			}
		},
		[queryParams.provinceId, queryParams.districtId, queryParams.subDistrictId, mapBoundaryAdmCodes],
	)

	const summaryLayers = useMemo(() => {
		return overviewData?.overall.ageClass?.map((item) => {
			return new MVTLayer({
				id: item.id + `-${new Date().getTime()}`,
				name: item.name[language],
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: tileLayer.durianLayer(queryParams.year ?? new Date().getFullYear()),
				onError(error) {
					if (error.message.startsWith('loading TileJSON')) {
						setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
					}
				},
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor: getSummaryColor(item),
				getLineColor: getSummaryColor(item),
				updateTriggers: {
					getFillColor: [getSummaryColor(item)],
					getLineColor: [getSummaryColor(item)],
					getLineWidth: [getSummaryColor(item)],
				},
			})
		})
	}, [overviewData?.overall.ageClass, language, queryParams.year, t, getSummaryColor])

	const compareLayers = useMemo(() => {
		return [
			new MVTLayer({
				id: 'increased' + `-${new Date().getTime()}`,
				name: 'increased',
				loadOptions: {
					fetch: {
						headers: { 'content-type': 'application/json', Authorization: `Bearer ${apiAccessToken}` },
					},
				},
				data: tileLayer.compareLayer(queryParams?.yearStart!, queryParams?.yearEnd!),

				onError(error) {
					if (error.message.startsWith('loading TileJSON')) {
						setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
					}
				},
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor: getCompareColor(DurianChangeAreaColor.increased),
				getLineColor: getCompareColor(DurianChangeAreaColor.increased),
				updateTriggers: {
					getFillColor: [getCompareColor],
					getLineColor: [getCompareColor],
				},
			}),
			new MVTLayer({
				id: 'decreased' + `-${new Date().getTime()}`,
				name: 'decreased',
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: tileLayer.compareLayer(queryParams?.yearEnd!, queryParams?.yearStart!),
				onError(error) {
					if (error.message.startsWith('loading TileJSON')) {
						setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
					}
				},
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor: getCompareColor(DurianChangeAreaColor.decreased),
				getLineColor: getCompareColor(DurianChangeAreaColor.decreased),
				updateTriggers: {
					getFillColor: [getCompareColor],
					getLineColor: [getCompareColor],
				},
			}),
			new MVTLayer({
				id: 'noChanged' + `-${new Date().getTime()}`,
				name: 'noChanged',
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: tileLayer.sameLayer(
					Math.max(queryParams?.yearStart!, queryParams?.yearEnd!),
					Math.min(queryParams?.yearStart!, queryParams?.yearEnd!),
				),
				onError(error) {
					if (error.message.startsWith('loading TileJSON')) {
						setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
					}
				},
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor: getCompareColor(DurianChangeAreaColor.noChanged),
				getLineColor: getCompareColor(DurianChangeAreaColor.noChanged),
				updateTriggers: {
					getFillColor: [getCompareColor],
					getLineColor: [getCompareColor],
				},
			}),
		]
	}, [language, queryParams.yearStart, queryParams.yearEnd, t, getCompareColor])

	const mapLayers: MapLayer[] | undefined = useMemo(() => {
		if (orderBy === OrderBy.Age) {
			return overviewData?.overall.ageClass?.map((item, index) => {
				return {
					id: item.id,
					label: `${t('age')} ${item.name[language]}`,
					color: item.color,
					layer: summaryLayers![index],
				}
			})
		} else {
			if (!queryParams.yearStart || !queryParams.yearEnd) return []
			if (queryParams.yearStart === queryParams.yearEnd) return []

			return [
				{
					id: 'increased',
					label: t('analyze:increasedArea'),
					color: DurianChangeAreaColor.increased,
					layer: compareLayers[0],
				},
				{
					id: 'decreased',
					label: t('analyze:decreasedArea'),
					color: DurianChangeAreaColor.decreased,
					layer: compareLayers[1],
				},
				{
					id: 'noChanged',
					label: t('analyze:noChangedArea'),
					color: DurianChangeAreaColor.noChanged,
					layer: compareLayers[2],
				},
			]
		}
	}, [
		overviewData?.overall.ageClass,
		t,
		language,
		summaryLayers,
		orderBy,
		compareLayers,
		queryParams.yearStart,
		queryParams.yearEnd,
	])

	const initialLayerId = useMemo(() => {
		if (queryParams.subDistrictId) return 'subDistrict'
		if (queryParams.districtId) return 'district'
		if (queryParams.provinceId) return 'province'

		return 'country'
	}, [queryParams.provinceId, queryParams.districtId, queryParams.subDistrictId])

	const initialLayerData = useMemo(() => {
		const layerProvince = tileLayer.province
		const layerDistrict = tileLayer.district
		const layerSubDistrict = tileLayer.subDistrict

		if (queryParams.subDistrictId) return layerSubDistrict
		if (queryParams.districtId) return layerDistrict
		if (queryParams.provinceId) return layerProvince

		return layerProvince
	}, [queryParams.provinceId, queryParams.districtId, queryParams.subDistrictId])

	const getInitialFillColor = useCallback(
		(d: any): any => {
			if (queryParams.subDistrictId && queryParams.subDistrictId !== d.properties.subDistrictCode)
				return defaultColor
			if (queryParams.districtId && queryParams.districtId !== d.properties.districtCode) return defaultColor
			if (queryParams.provinceId && queryParams.provinceId !== d.properties.provinceCode) return defaultColor
			if (!queryParams.provinceId && !mapBoundaryAdmCodes?.includes(d.properties.provinceCode))
				return defaultColor

			return [226, 226, 226, 100]
		},
		[queryParams.provinceId, queryParams.districtId, queryParams.subDistrictId, mapBoundaryAdmCodes],
	)

	const getInitialLineColor = useCallback(
		(d: any): any => {
			if (queryParams.subDistrictId && queryParams.subDistrictId !== d.properties.subDistrictCode)
				return defaultColor
			if (queryParams.districtId && queryParams.districtId !== d.properties.districtCode) return defaultColor
			if (queryParams.provinceId && queryParams.provinceId !== d.properties.provinceCode) return defaultColor
			if (!queryParams.provinceId && !mapBoundaryAdmCodes?.includes(d.properties.provinceCode))
				return defaultColor

			return [0, 0, 0, 255]
		},
		[queryParams.provinceId, queryParams.districtId, queryParams.subDistrictId, mapBoundaryAdmCodes],
	)

	const initialLayer = useMemo((): MapLayer[] => {
		const selectedLayer = new MVTLayer({
			id: initialLayerId,
			name: initialLayerId,
			loadOptions: {
				fetch: {
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${apiAccessToken}`,
					},
				},
			},
			data: initialLayerData,
			onError(error) {
				if (error.message.startsWith('loading TileJSON')) {
					setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
				}
			},
			filled: true,
			lineWidthUnits: 'pixels',
			getFillColor: getInitialFillColor,
			getLineColor: getInitialLineColor,
			pickable: true,
			updateTriggers: {
				getFillColor: [getInitialFillColor],
				getLineColor: [getInitialLineColor],
			},
		})

		return [
			{
				id: initialLayerId,
				label: '',
				color: '#000000',
				layer: selectedLayer,
				isHide: true,
			},
			...(mapLayers ?? []),
		]
	}, [mapLayers, t, initialLayerId, initialLayerData, getInitialFillColor, getInitialLineColor])

	useEffect(() => {
		if ((summaryLayers || compareLayers) && overviewData) {
			const reload = initialLayer.map((item) => item.layer)
			let tempList = reload.map((mapLayer) => {
				let tempSplit = mapLayer.id.split('-')
				tempSplit.pop()
				const tempId = tempSplit.join('-')
				const switchItem = switchState?.find((sw) => sw.id === tempId)

				let visible: boolean | undefined = true
				if (switchItem) {
					visible = switchItem?.isOn === true ? true : undefined
				}
				return mapLayer.clone({ visible })
			})

			setLayers(tempList)
		}
	}, [initialLayer, summaryLayers, overviewData, setLayers, compareLayers])

	useEffect(() => {
		let admCode: number | null = null

		if (queryParams.provinceId && queryParams.districtId && queryParams.subDistrictId) {
			admCode = queryParams.subDistrictId
		} else if (queryParams.provinceId && queryParams.districtId) {
			admCode = queryParams.districtId
		} else if (queryParams.provinceId) {
			admCode = queryParams.provinceId
		}

		if (admCode === null) {
			mapLibre?.fitBounds(thaiExtent)
		} else {
			service.overview.locationExtent(admCode).then((res) => {
				if (res.data) {
					mapLibre?.fitBounds(res.data.extent)
				}
			})
		}
	}, [mapLibre, queryParams?.provinceId, queryParams?.districtId, queryParams?.subDistrictId])

	useEffect(() => {
		if (mapLibre) {
			const handleClick = async (evt: any) => {
				const coordinate = evt.lngLat

				if (coordinate) {
					try {
						let response
						if (orderBy === OrderBy.Age) {
							response = await service.analyze.getAgeclassLocation({
								lat: coordinate.lat,
								lon: coordinate.lng,
								year: queryParams?.year!,
							})
						} else if (orderBy === OrderBy.Changes) {
							response = await service.analyze.getCompareLocation({
								lat: coordinate.lat,
								lon: coordinate.lng,
								year1: queryParams?.yearStart!,
								year2: queryParams?.yearEnd!,
							})
						}

						if (!response?.data) {
							throw new Error('Access Position failed!!')
						}

						onLayerClick(coordinate, response?.data)
					} catch (error) {
						console.error('error: ', error)
						popup.remove()
					}
				}
			}

			mapLibre.on('click', handleClick)

			return () => {
				mapLibre.off('click', handleClick)
			}
		}
	}, [mapLibre, orderBy, queryParams.year, queryParams.yearStart, queryParams.yearEnd, onLayerClick, popup])

	return (
		<React.Fragment>
			<div className='flex flex-col gap-4'>
				<Typography className='!text-2xl !font-medium !text-[#2F7A59]'>
					{t('analyze:durianPlantationByAge')}
				</Typography>
				<Box className='h-[650px] overflow-hidden rounded-lg bg-white'>
					{!!queryParams?.year && mapLayers ? (
						<MapView
							initialLayer={initialLayer}
							legendSelectorLabel={
								orderBy === OrderBy.Age
									? t('analyze:ageOfDurian')
									: t('analyze:durianPlantationAreaChanges')
							}
							className={classNames(
								'h-full w-full [&_.maplibregl-popup.maplibregl-popup-anchor-bottom]:top-[-35px]',
								{
									'[&_.maplibregl-popup-anchor-bottom-left>.maplibregl-popup-tip]:!border-t-green-light [&_.maplibregl-popup-anchor-bottom-right>.maplibregl-popup-tip]:!border-t-green-light [&_.maplibregl-popup-anchor-bottom>.maplibregl-popup-tip]:!border-t-green-light [&_.maplibregl-popup-anchor-left>.maplibregl-popup-tip]:!border-r-green-light [&_.maplibregl-popup-anchor-right>.maplibregl-popup-tip]:!border-l-green-light [&_.maplibregl-popup-anchor-top-left>.maplibregl-popup-tip]:!border-b-green-light [&_.maplibregl-popup-anchor-top-right>.maplibregl-popup-tip]:!border-b-green-light [&_.maplibregl-popup-anchor-top>.maplibregl-popup-tip]:!border-b-green-light':
										orderBy === OrderBy.Changes,
								},
							)}
						>
							<div className='hidden'>
								{orderBy === OrderBy.Age ? (
									<div ref={popupSummaryNode} className='flex h-full w-full flex-col'>
										<SummaryInfoWindow data={summaryInfoWindow} />
									</div>
								) : (
									<div ref={popupCompareNode} className='flex h-full w-full flex-col'>
										<CompareInfoWindow data={compareInfoWindow} />
									</div>
								)}
							</div>
						</MapView>
					) : (
						<div className='flex h-full w-full items-center justify-center'>
							<CircularProgress />
						</div>
					)}
				</Box>
			</div>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={alertInfo.open}
				autoHideDuration={6000}
				onClose={() => setAlertInfo({ ...alertInfo, open: false })}
				className='w-[300px]'
			>
				<Alert
					onClose={() => setAlertInfo({ ...alertInfo, open: false })}
					severity={alertInfo.severity}
					className='w-full'
				>
					{alertInfo.message}
				</Alert>
			</Snackbar>
		</React.Fragment>
	)
}

export default MapDetail
