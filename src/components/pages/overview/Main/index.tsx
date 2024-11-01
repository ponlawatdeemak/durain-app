import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import service from '@/api/index'
import { OverviewIcon, OverviewYearDataIcon, OverviewTooltipIcon } from '@/components/svg/MenuIcon'
import { Box, CircularProgress, MenuItem, Select } from '@mui/material'
import { availabilityDurianDtoOut, OverviewSummaryDtoOut } from '@/api/overview/dto-out.dto'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import InfoIcon from '@mui/icons-material/Info'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import useResponsive from '@/hook/responsive'
import classNames from 'classnames'
import Chart from './Chart'
import { Languages } from '@/enum'
import MapView from '@/components/common/map/MapView'
import { MVTLayer } from '@deck.gl/geo-layers'
import { thaiExtent, tileLayer } from '@/config/app.config'
import { MapLayer } from '@/components/common/map/interface/map.jsx'
import useMapStore from '@/components/common/map/store/map'
import { getApiAccessToken } from '@/api/core'
import hexRgb from 'hex-rgb'

const OverviewMain: React.FC = () => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const [year, setYear] = useState(0)
	const [admCode, setAdmCode] = useState(0)
	const [availabilityData, setAvailabilityData] = useState<availabilityDurianDtoOut[]>()
	const [overviewData, setOverviewData] = useState<OverviewSummaryDtoOut>()
	const { setLayers, mapLibre, switchState } = useMapStore()
	const apiAccessToken = getApiAccessToken()

	const availableAdm = useMemo(() => {
		return availabilityData?.find((item: availabilityDurianDtoOut) => item.year === year)?.availableAdm
	}, [availabilityData, year])

	const selectedYearObj = useMemo(() => {
		return availabilityData?.find((item: availabilityDurianDtoOut) => item.year === year)
	}, [availabilityData, year])

	const selectedAdm = useMemo(() => {
		return selectedYearObj?.availableAdm.find((item) => item.admCode === admCode)?.admName
	}, [selectedYearObj?.availableAdm, admCode])

	const mapBoundaryAdmCodes = useMemo(() => {
		return overviewData?.adms.map((item) => item.admCode)
	}, [overviewData])

	const StyledTooltip = styled(
		({ className, title, children, ...props }: { className?: any; title: any; children: any }) => (
			<Tooltip
				leaveTouchDelay={3000}
				enterTouchDelay={50}
				placement='top'
				arrow
				title={title}
				{...props}
				classes={{ popper: className }}
				className={className}
			>
				{children}
			</Tooltip>
		),
	)(() => ({
		[`& .MuiTooltip-tooltip`]: {
			backgroundColor: 'white',
			color: 'black',
			margin: isDesktop ? 35 : 10,
			padding: 14,
			boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 10px 5px',
		},
		[`& .${tooltipClasses.arrow}`]: {
			color: 'white',
			fontSize: '18px',
		},
	}))

	const layers = useMemo(() => {
		return overviewData?.overall.ageClass?.map((item) => {
			return new MVTLayer({
				id: item.id + `-${new Date().getTime()}`,
				name: item.name[language],
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							//Authorization: `Bearer ${MOCK_TOKEN}`,
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: tileLayer.durianLayer(year),
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor(d) {
					if (admCode === 0) {
						if (item.id === d.properties.ageClass_id) {
							const array = hexRgb(item.color, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					}

					if (String(admCode) === String(d.properties.admCode).substring(0, 2)) {
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
					if (admCode === 0) {
						if (item.id === d.properties.ageClass_id) {
							const array = hexRgb(item.color, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						const strAdmCode = String(d.properties.admCode).substring(0, 2)
						if (String(admCode) === strAdmCode) {
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
					}
				},

				updateTriggers: {
					getFillColor: [admCode, year],
					getLineColor: [admCode, year],
					getLineWidth: [admCode, year],
				},
			})
		})
	}, [overviewData, language, year, admCode])

	const mapLayers: MapLayer[] | undefined = useMemo(() => {
		return overviewData?.overall.ageClass?.map((item, index) => {
			return {
				id: item.id,
				label: `${t('overview:ageOfDurianTrees')} ${item.name[language]}`,
				color: item.color,
				layer: layers![index],
			}
		})
	}, [overviewData?.overall.ageClass, t, language, layers])

	const initialLayer = useMemo((): MapLayer[] => {
		const layerProvince = tileLayer.province
		const provinceLayer = new MVTLayer({
			id: 'province' + `-${new Date().getTime()}`,
			name: 'province',
			loadOptions: {
				fetch: {
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${apiAccessToken}`,
					},
				},
			},
			data: layerProvince,
			filled: true,
			lineWidthUnits: 'pixels',
			pickable: true,
			getFillColor(d) {
				if (admCode === 0) {
					if (mapBoundaryAdmCodes?.includes(d.properties.provinceCode)) {
						return [226, 226, 226, 100]
					} else {
						return [0, 0, 0, 0]
					}
				}

				if (admCode === d.properties.provinceCode) {
					return [226, 226, 226, 100]
				} else {
					return [0, 0, 0, 0]
				}
			},
			getLineColor(d: any) {
				if (admCode === 0) {
					if (mapBoundaryAdmCodes?.includes(d.properties.provinceCode)) {
						return [0, 0, 0, 255]
					} else {
						return [0, 0, 0, 0]
					}
				}

				if (admCode === d.properties.provinceCode) {
					return [0, 0, 0, 255]
				} else {
					return [0, 0, 0, 0]
				}
			},
			updateTriggers: {
				getFillColor: [admCode, year],
				getLineColor: [admCode, year],
				getLineWidth: [admCode, year],
			},
		})

		return [
			{
				id: 'province',
				label: '',
				color: '#000000',
				layer: provinceLayer,
				isHide: true,
			},
			...(mapLayers ?? []),
		]
	}, [admCode, year, mapLayers, mapBoundaryAdmCodes])

	useEffect(() => {
		service.overview
			.availabilityDurian()
			.then((res) => {
				setAvailabilityData(res.data)
				if (!year && res.data) {
					setYear(res.data[0].year)
				}
			})
			.catch((error) => console.error(error))
	}, [year])

	useEffect(() => {
		service.overview
			.overviewSummary({ year: year, admCode: admCode === 0 ? undefined : admCode })
			.then((res) => {
				setOverviewData(res.data)
			})
			.catch((error) => console.error(error))

		if (admCode !== 0) {
			service.overview.locationExtent(admCode).then((res) => {
				if (res.data) {
					mapLibre?.fitBounds(res.data.extent)
				}
			})
		} else {
			mapLibre?.fitBounds(thaiExtent)
		}
	}, [year, admCode, mapLibre])

	useEffect(() => {
		if (layers && overviewData) {
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
	}, [initialLayer, layers, overviewData, setLayers])

	return (
		<div
			className={classNames('flex w-full flex-1 flex-col', {
				'h-full p-[32px] pt-[24px]': isDesktop,
				'box-border p-4': !isDesktop,
			})}
		>
			<div
				className={classNames('flex w-full flex-row items-center gap-2', {
					'pb-[16px]': isDesktop,
					'justify-center pb-4': !isDesktop,
				})}
			>
				<div className={classNames('[&>svg]:fill-primary')}>
					<OverviewIcon />
				</div>
				<p className='text-2xl font-semibold text-primary'>{t('overview:overviewOfDurianPlantation')}</p>
			</div>
			<div
				className={classNames('flex h-full w-full gap-[24px]', {
					'flex-row': isDesktop,
					'flex-col-reverse': !isDesktop,
				})}
			>
				<div
					className={classNames('flex rounded-[8px] bg-white', {
						'h-full flex-grow': isDesktop,
						'h-[500px]': !isDesktop,
					})}
				>
					{mapLayers && year !== 0 ? (
						<MapView
							initialLayer={initialLayer}
							legendSelectorLabel={t('overview:ageRangeOfDurianPlantationAreas')}
						/>
					) : (
						<div className='flex h-full w-full items-center justify-center'>
							<CircularProgress />
						</div>
					)}
				</div>
				<div
					className={classNames('flex flex-col gap-[24px]', {
						'h-full w-[350px]': isDesktop,
						'w-full': !isDesktop,
					})}
				>
					<div className='flex w-full flex-col items-center justify-center gap-[16px] rounded-[8px] bg-white p-[24px] shadow'>
						<p className='text-xl font-semibold'>{t('overview:durianPlantationData')}</p>
						<div className='flex w-full flex-row gap-3'>
							<Select
								displayEmpty
								size='small'
								className='w-5/12'
								value={year || ''}
								disabled={!year}
								onChange={(e) => {
									setYear(Number(e.target.value))
									setAdmCode(0)
								}}
							>
								{availabilityData?.map((item) => (
									<MenuItem key={item.year} value={item.year} className=''>
										{`${t('overview:year')} ${item.yearName[language]}`}
									</MenuItem>
								))}
							</Select>
							<Select
								size='small'
								className='w-7/12'
								value={admCode || ''}
								disabled={!availableAdm}
								onChange={(e) => setAdmCode(Number(e.target.value))}
								displayEmpty
							>
								<MenuItem value=''>{t('overview:allProvinces')}</MenuItem>
								{availableAdm?.map((item) => (
									<MenuItem key={item.admCode} value={item.admCode}>
										{`${item.admName[language]}`}
									</MenuItem>
								))}
							</Select>
						</div>
					</div>
					<div className='flex w-full flex-row items-center justify-center rounded-[8px] bg-white px-[16px] py-[24px] shadow'>
						<div className='flex h-full items-center justify-center'>
							<OverviewYearDataIcon />
						</div>
						<div className='flex h-full w-[100%] flex-col items-end'>
							<div className='flex items-center text-right text-sm font-medium'>
								{t('overview:durianPlantationData')} {t('overview:year')}{' '}
								{selectedYearObj?.yearName[language]}
								<StyledTooltip
									className='ml-1'
									title={
										<div className='flex flex-row items-center gap-2'>
											<p className='text-xs'>
												{language === 'th'
													? 'พื้นที่ปลูกทุเรียนได้จากการจำแนกภาพถ่ายจากดาวเทียมความละเอียดสูงโดยใช้ AI and Machine Learning'
													: 'Identifying durian cultivation areas through the analysis of high resolution satellite imagery, enhanced by AI and Machine Learning technologies'}
											</p>
											<div>
												<OverviewTooltipIcon />
											</div>
										</div>
									}
								>
									<InfoIcon
										fontSize='small'
										className='text-tooltip hover:cursor-pointer hover:text-tooltip-hover'
									/>
								</StyledTooltip>
							</div>
							<p className='pt-[8px] text-[22px] font-semibold'>
								{selectedAdm?.[language] ?? t('overview:allProvinces')}
							</p>
							<div className='flex h-full w-full flex-col items-end pt-[4px]'>
								<p className='text-base font-medium'>{t(`overview:${areaUnit}`)}</p>
								<p className='text-top text-[36px] font-bold leading-7 text-primary'>
									{overviewData?.overall?.area
										? Math.round(overviewData?.overall?.area?.[areaUnit]).toLocaleString()
										: '-'}
								</p>
							</div>
						</div>
					</div>
					<div
						className={classNames('flex w-full flex-col items-center rounded-[8px] bg-white shadow', {
							'flex-grow p-[24px]': isDesktop,
							'p-0 py-4': !isDesktop,
						})}
					>
						<p className='text-center text-lg font-semibold'>
							{t('overview:ageRangeOfDurianPlantationAreas')}
						</p>
						<p className='text-center text-lg font-semibold'>
							{selectedAdm?.[language] ?? t('overview:allProvinces')}
						</p>
						{overviewData?.adms.length ? (
							<div
								className={classNames('box-border w-full', {
									'overflow-y-auto overflow-x-hidden [&&::-webkit-scrollbar-thumb]:rounded [&&::-webkit-scrollbar-thumb]:bg-green-light [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-green-dark3 [&::-webkit-scrollbar]:w-[5px]':
										isDesktop,
									'max-h-[calc(100vh-650px)]': isDesktop && language === Languages.TH,
									'max-h-[calc(100vh-680px)]': isDesktop && language === Languages.EN,
								})}
							>
								<div
									className={classNames('relative flex min-h-[250px]', {
										'flex-grow': isDesktop,
									})}
								>
									<span
										className={classNames('absolute bottom-[10px] text-[10px] font-normal', {
											'left-[15px]': language === Languages.TH,
											'left-[10px]': !isDesktop && language === Languages.EN,
											'left-[5.5%]': !isDesktop && language === Languages.TH,
										})}
									>
										{t('overview:ageRange')}
									</span>
									<span
										className={classNames('absolute top-[2px] text-[10px] font-normal', {
											'left-[4px]': language === Languages.TH,
											'left-[10px]': !isDesktop && language === Languages.EN,
											'left-[3%]': !isDesktop && language === Languages.TH,
										})}
									>
										% {t('overview:plantationArea')}
									</span>
									<Chart data={overviewData}></Chart>
								</div>
								<hr
									className={classNames('w-full', {
										'mb-4': isDesktop,
										'my-4': !isDesktop,
									})}
								/>
								<div className='mb-2 flex w-full text-sm font-medium text-gray-light1'>
									<div
										className={classNames('flex w-1/2 flex-row items-center', {
											'ml-5': !isDesktop,
										})}
									>
										<Box marginRight={1} width='10px' />
										{t('overview:age')}
									</div>
									<div className='flex w-1/2 justify-center text-center'>
										{t('overview:area')} ({t(`overview:${areaUnit}`)})
									</div>
								</div>
								{overviewData?.overall?.ageClass?.map((item, index, array) => (
									<React.Fragment key={item.id}>
										<div className='flex w-full text-sm font-medium'>
											<div
												className={classNames(
													'flex w-1/2 flex-row items-center',
													isDesktop ? '' : 'ml-5',
												)}
											>
												<Box
													marginRight={1}
													height='10px'
													width='10px'
													borderRadius='50%'
													bgcolor={item.color}
												/>
												{item.name[language]}
											</div>
											<div className='flex w-1/2 justify-center'>
												{Math.round(item.area[areaUnit]).toLocaleString()}
											</div>
										</div>
										{index === array.length - 1 ? null : (
											<hr className='my-1 w-full border-dashed' />
										)}
									</React.Fragment>
								))}
							</div>
						) : (
							<div className='flex h-full w-full items-center justify-center'>
								<CircularProgress />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default OverviewMain
