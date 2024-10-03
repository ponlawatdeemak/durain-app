import { ResponseLanguage } from '@/api/interface'
import MapView from '@/components/common/map/MapView'
import { Box, CircularProgress, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useSearchAnalyze from '../Main/context'
import { tileLayer } from '@/config/app.config'
import { apiAccessToken } from '@/api/core'
import { MapLayer } from '@/components/common/map/interface/map'
import { MVTLayer } from '@deck.gl/geo-layers'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import hexRgb from 'hex-rgb'
import useMapStore from '@/components/common/map/store/map'
import { OverviewSummaryDtoOut } from '@/api/overview/dto-out.dto'

const MapDetail = () => {
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage
	const { queryParams } = useSearchAnalyze()
	const { mapLibre, setLayers, removeLayer, getLayer } = useMapStore()
	const IsAmpherClick = String(queryParams.provinceId) === String(queryParams.districtId).substring(0, 2)
	const [overviewData, setOverviewData] = useState<OverviewSummaryDtoOut>()

	console.log(queryParams)

	useQuery({
		queryKey: ['overviewSummary', queryParams.year, queryParams.provinceId],
		queryFn: async () => {
			const res = await service.overview.overviewSummary({
				year: queryParams.year ?? new Date().getFullYear(),
				admCode: IsAmpherClick ? queryParams.districtId : queryParams.provinceId,
			})

			setOverviewData(res.data)
		},
	})

	const layers = useMemo(() => {
		return overviewData?.overall.ageClass?.map((item) => {
			return new MVTLayer({
				id: item.id,
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
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor(d) {
					if (String(queryParams.provinceId) === String(d.properties.admCode).substring(0, 2)) {
						if (item.id === d.properties.ageClass_id) {
							const array = hexRgb(item.color, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						return [0, 0, 0, 0]
					}
				},
				getLineColor(d) {
					if (String(queryParams.provinceId) === String(d.properties.admCode).substring(0, 2)) {
						if (item.id === d.properties.ageClass_id) {
							const array = hexRgb(item.color, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						return [0, 0, 0, 0]
					}
				},

				updateTriggers: {
					getFillColor: [queryParams.year, queryParams.provinceId],
					getLineColor: [queryParams.year, queryParams.provinceId],
					getLineWidth: [queryParams.year, queryParams.provinceId],
				},
			})
		})
	}, [overviewData?.overall.ageClass, language, queryParams.year, queryParams.provinceId])

	const mapLayers: MapLayer[] | undefined = useMemo(() => {
		return overviewData?.overall.ageClass?.map((item, index) => {
			return {
				id: item.id,
				label: `${t('age')} ${item.name[language]}`,
				color: item.color,
				layer: layers![index],
			}
		})
	}, [overviewData?.overall.ageClass, t, language, layers])

	const initialLayer = useMemo((): MapLayer[] => {
		const layerProvince = tileLayer.province
		const provinceLayer = new MVTLayer({
			id: 'boundary',
			name: 'boundary',
			loadOptions: {
				fetch: {
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${apiAccessToken}`,
					},
				},
			},
			data: queryParams.districtId ? tileLayer.district : layerProvince,
			filled: true,
			lineWidthUnits: 'pixels',
			pickable: true,
			getFillColor(d) {
				if (queryParams.provinceId === d.properties.provinceCode) {
					return [226, 226, 226, 100]
				} else {
					return [0, 0, 0, 0]
				}
			},
			getLineColor(d: any) {
				if (queryParams.provinceId === d.properties.provinceCode) {
					return [0, 0, 0, 255]
				} else {
					return [0, 0, 0, 0]
				}
			},
			updateTriggers: {
				getFillColor: [queryParams.year, queryParams.provinceId],
				getLineColor: [queryParams.year, queryParams.provinceId],
				getLineWidth: [queryParams.year, queryParams.provinceId],
			},
		})

		return [
			{
				id: 'boundary',
				label: '',
				color: '#000000',
				layer: provinceLayer,
				isHide: true,
			},
			...(mapLayers ?? []),
		]
	}, [mapLayers, queryParams.districtId, queryParams.provinceId, queryParams.year])

	useEffect(() => {
		if (layers && overviewData) {
			overviewData.overall.ageClass?.forEach((item) => {
				const layer = getLayer(item.id)
				if (layer) {
					removeLayer(item.id)
				}
			})

			const reload = initialLayer.map((item) => item.layer)
			setLayers(reload)
		}
	}, [initialLayer, getLayer, layers, mapLayers, overviewData, removeLayer, setLayers, queryParams])

	useEffect(() => {
		if (IsAmpherClick) {
			if (queryParams.districtId) {
				service.overview.locationExtent(queryParams.districtId).then((res) => {
					if (res.data) {
						mapLibre?.fitBounds(res.data.extent)
					}
				})
			}
		} else {
			if (queryParams.provinceId) {
				service.overview.locationExtent(queryParams.provinceId).then((res) => {
					if (res.data) {
						mapLibre?.fitBounds(res.data.extent)
					}
				})
			}
		}
	}, [IsAmpherClick, mapLibre, queryParams.districtId, queryParams.provinceId])

	return (
		<div className='flex flex-col gap-4'>
			<Typography className='!text-2xl !font-medium !text-[#2F7A59]'>
				{t('analyze:durianPlantationByAge')}
			</Typography>
			<Box className='h-[650px] overflow-hidden rounded-lg bg-white'>
				{mapLayers ? (
					<MapView
						initialLayer={initialLayer}
						legendSelectorLabel={t('analyze:ageOfDurian')}
						className='h-full w-full'
					/>
				) : (
					<div className='flex h-full w-full items-center justify-center'>
						<CircularProgress />
					</div>
				)}
			</Box>
		</div>
	)
}

export default MapDetail
