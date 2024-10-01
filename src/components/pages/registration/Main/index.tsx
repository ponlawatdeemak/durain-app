import { useTranslation } from 'next-i18next'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import service from '@/api/index'
import {
	CheckedIcon,
	CrossIcon,
	OverviewIcon,
	PopupRegistrationChecked,
	PopupRegistrationCross,
	PopupRegistrationPin,
	PopupReistrationLogo,
	RegisteredIcon,
	RegistrationIcon,
	RegistrationTableBackIcon,
} from '@/components/svg/MenuIcon'
import { Button, CircularProgress, IconButton, MenuItem, Select } from '@mui/material'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import InfoIcon from '@mui/icons-material/Info'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import useResponsive from '@/hook/responsive'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { Languages, RegisterType } from '@/enum'
import RegistrationTable from './Table'
import { useMap } from '@/components/common/map/context/map'
import useLayerStore from '@/components/common/map/store/map'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer, MVTLayerPickingInfo } from '@deck.gl/geo-layers'
import { tileLayer } from '@/config/app.config'
import { MapLayer } from '@/components/common/map/interface/map.jsx'
import MapView from '@/components/common/map/MapView'
import type { Feature, Geometry } from 'geojson'
import { Deck } from '@deck.gl/core'
import hexRgb from 'hex-rgb'
import { apiAccessToken } from '@/api/core'
import { RegisterTypeColor } from '@/config/color'
import CloseIcon from '@mui/icons-material/Close'

interface MapInfoWindowContentProp {
	provinceTH: string
	districtTH: string
	subDistrictTH: string
	provinceEN: string
	districtEN: string
	subDistrictEN: string
	status: string
}

const MapInfoWindowContent: React.FC<{ data: MapInfoWindowContentProp }> = ({ data }) => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage
	const { setMapInfoWindow } = useMap()

	return language === Languages.TH ? (
		<div className='flex h-[145px] w-[315px] flex-col items-end rounded-[8px] bg-green-light p-1'>
			<IconButton onClick={() => setMapInfoWindow(null)} className='self-right flex h-[25px] w-[25px]'>
				<CloseIcon fontSize='small' className='text-white' />
			</IconButton>
			<div className={`flex h-full w-full gap-2 px-4 py-1 text-[14px] font-medium`}>
				<div className='flex h-full'>
					<PopupReistrationLogo />
				</div>
				<div className='flex flex-col gap-2'>
					<div className='flex gap-2'>
						<div className='pt-[1px]'>
							<PopupRegistrationPin />
						</div>
						<p className='flex text-white'>
							ตำบล {data.subDistrictTH} อำเภอ {data.districtTH} จังหวัด {data.provinceTH}
						</p>
					</div>
					{data.status !== RegisterType.Registered ? (
						<div className='flex w-max gap-2 rounded-[4px] bg-white px-2 py-1'>
							<PopupRegistrationChecked />
							<p className='text-[16px] font-medium text-primary'>{t('registration:registeredArea')}</p>
						</div>
					) : (
						<div className='flex w-max gap-2 rounded-[4px] bg-white px-2 py-1'>
							<PopupRegistrationCross />
							<p className='text-[16px] font-medium text-registerType-nonRegistered'>
								{t('registration:unregisteredArea')}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	) : (
		<div className='flex h-[145px] w-[315px] flex-col items-end rounded-[8px] bg-green-light p-1'>
			<IconButton onClick={() => setMapInfoWindow(null)} className='self-right flex h-[25px] w-[25px]'>
				<CloseIcon fontSize='small' className='text-white' />
			</IconButton>
			<div className={`flex h-full w-full gap-2 px-4 py-1 text-[14px] font-medium`}>
				<div className='flex h-full'>
					<PopupReistrationLogo />
				</div>
				<div className='flex flex-col gap-2'>
					<div className='flex gap-2'>
						<div className='pt-[1px]'>
							<PopupRegistrationPin />
						</div>
						<p className='flex text-white'>
							{data.subDistrictEN}, {data.districtEN}, {data.provinceEN}
						</p>
					</div>
					{data.status === RegisterType.Registered ? (
						<div className='flex w-max gap-2 rounded-[4px] bg-white px-2 py-1'>
							<PopupRegistrationChecked />
							<p className='text-[16px] font-medium text-registerType-registered'>
								{t('registration:registeredArea')}
							</p>
						</div>
					) : (
						<div className='flex w-max gap-2 rounded-[4px] bg-white px-2 py-1'>
							<PopupRegistrationCross />
							<p className='text-[16px] font-medium text-registerType-nonRegistered'>
								{t('registration:unregisteredArea')}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
const RegistrationMain: React.FC = () => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const [year, setYear] = useState(0)
	const [admCode, setAdmCode] = useState(0)
	const [tableAdmCode, setTableAdmCode] = useState(0)
	const [showBack, setShowBack] = useState(false)
	const [district, setDistrict] = useState<ResponseLanguage>()

	const { setExtent, setMapInfoWindow } = useMap()
	const { setLayers, addLayer, getLayer, removeLayer } = useLayerStore()

	const {
		data: availabilityData,
		isLoading: isAvailabilityDataLoading,
		error: availabilityDataError,
	} = useQuery({
		queryKey: ['availabilityRegistered'],
		queryFn: async () => {
			const res = await service.registration.availabilityRegistered()
			if (!year) {
				setYear(res.data![0].year)
			}
			return res.data
		},
	})

	const {
		data: registeredData,
		isLoading: isRegisteredDataLoading,
		error: registeredDataError,
	} = useQuery({
		queryKey: ['overviewRegistered', year, admCode],
		queryFn: async () => {
			setTableAdmCode(0)
			const res = await service.registration.overviewRegistered({ year: year, admCode: admCode ?? undefined })
			if (admCode !== 0) {
				service.overview.locationExtent(admCode).then((res) => {
					if (res.data) {
						setExtent(res.data.extent)
					}
				})
			} else {
				setExtent([97.3758964376, 5.69138418215, 105.589038527, 20.4178496363])
			}
			return res.data
		},
	})
	console.log(registeredData)
	const {
		data: tableInnerData,
		isLoading: isTableInnerDataLoading,
		error: tableInnerDataError,
	} = useQuery({
		queryKey: ['overviewRegisteredTable', tableAdmCode],
		queryFn: async () => {
			const res = await service.registration.overviewRegistered({
				year: year,
				admCode: tableAdmCode ?? undefined,
			})
			return res.data
		},
		enabled: tableAdmCode !== 0,
	})

	const availableAdm = useMemo(() => {
		return availabilityData?.find((item: any) => item.year === year)?.availableAdm
	}, [availabilityData, year])

	const selectedYearObj = useMemo(() => {
		return availabilityData?.find((item: any) => item.year === year)
	}, [availabilityData, year])

	const selectedAdm = useMemo(() => {
		return selectedYearObj?.availableAdm.find((item: any) => item.admCode === admCode)?.admName
	}, [selectedYearObj?.availableAdm, admCode])

	const selectedTableAdm = useMemo(() => {
		if (registeredData) {
			return registeredData?.adms.find((item: any) => item.admCode === tableAdmCode)?.admName
		}
		return selectedYearObj?.availableAdm.find((item: any) => item.admCode === tableAdmCode)?.admName
	}, [selectedYearObj, tableAdmCode, registeredData])

	const mapBoundaryAdmCodes = useMemo(() => {
		return registeredData?.adms.map((item) => item.admCode)
	}, [registeredData])

	const StyledTooltip = styled(
		({ className, title, children, ...props }: { className?: any; title: any; children: any }) => (
			<Tooltip
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
	)(({ theme }) => ({
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

	const handleRowClick = (rowAdmCode: number, rowAdmName: ResponseLanguage) => {
		if (String(rowAdmCode).length <= 4) {
			setDistrict(rowAdmName)
			setTableAdmCode(rowAdmCode)
			setShowBack(true)
		} else {
			return
		}
	}

	const handleBackClick = () => {
		if (String(tableAdmCode).length === 4 && admCode === 0) {
			setTableAdmCode((tableAdmCode) => Number(String(tableAdmCode).slice(0, 2)))
		} else {
			setTableAdmCode(0)
		}
	}

	const layers = useMemo(() => {
		return [
			new MVTLayer({
				id: 'registered',
				name: 'registered',
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							//Authorization: `Bearer ${MOCK_TOKEN}`,
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: `${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/registered_${year}/tiles.json`,
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor(d) {
					if (admCode === 0) {
						if (d.properties.status === RegisterType.Registered) {
							const array = hexRgb(RegisterTypeColor.registered, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						if (String(admCode) === String(d.properties.admCode).substring(0, 2)) {
							if (d.properties.status === RegisterType.Registered) {
								const array = hexRgb(RegisterTypeColor.registered, { format: 'array' })
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
				getLineColor(d) {
					if (admCode === 0) {
						if (d.properties.status === RegisterType.Registered) {
							const array = hexRgb(RegisterTypeColor.registered, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						if (String(admCode) === String(d.properties.admCode).substring(0, 2)) {
							if (d.properties.status === RegisterType.Registered) {
								const array = hexRgb(RegisterTypeColor.registered, { format: 'array' })
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
				onClick: (info) => {
					if (info.object) {
						const data = {
							provinceTH: info.object.properties.ADM1_TH,
							districtTH: info.object.properties.ADM2_TH,
							subDistrictTH: info.object.properties.ADM3_TH,
							provinceEN: info.object.properties.ADM1_EN,
							districtEN: info.object.properties.ADM2_EN,
							subDistrictEN: info.object.properties.ADM3_EN,
							status: info.object.properties.status,
						}
						setMapInfoWindow({
							positon: {
								x: info.x,
								y: info.y,
							},
							children: <MapInfoWindowContent data={data} />,
						})
					}
				},
				updateTriggers: {
					getFillColor: [admCode, year],
					getLineColor: [admCode, year],
					getLineWidth: [admCode, year],
				},
			}),
			new MVTLayer({
				id: 'unregistered',
				name: 'unregistered',
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							//Authorization: `Bearer ${MOCK_TOKEN}`,
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: `${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/registered_${year}/tiles.json`,
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor(d) {
					if (admCode === 0) {
						if (d.properties.status === RegisterType.NonRegistered) {
							const array = hexRgb(RegisterTypeColor.nonRegistered, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						if (String(admCode) === String(d.properties.admCode).substring(0, 2)) {
							if (d.properties.status === RegisterType.NonRegistered) {
								const array = hexRgb(RegisterTypeColor.nonRegistered, { format: 'array' })
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
				getLineColor(d) {
					if (admCode === 0) {
						if (d.properties.status === RegisterType.NonRegistered) {
							const array = hexRgb(RegisterTypeColor.nonRegistered, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						if (String(admCode) === String(d.properties.admCode).substring(0, 2)) {
							if (d.properties.status === RegisterType.NonRegistered) {
								const array = hexRgb(RegisterTypeColor.nonRegistered, { format: 'array' })
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
				onClick: (info) => {
					if (info.object) {
						const data = {
							provinceTH: info.object.properties.ADM1_TH,
							districtTH: info.object.properties.ADM2_TH,
							subDistrictTH: info.object.properties.ADM3_TH,
							provinceEN: info.object.properties.ADM1_EN,
							districtEN: info.object.properties.ADM2_EN,
							subDistrictEN: info.object.properties.ADM3_EN,
							status: info.object.properties.status,
						}
						setMapInfoWindow({
							positon: {
								x: info.x,
								y: info.y,
							},
							children: <MapInfoWindowContent data={data} />,
						})
					}
				},
				updateTriggers: {
					getFillColor: [admCode, year],
					getLineColor: [admCode, year],
					getLineWidth: [admCode, year],
				},
			}),
		]
	}, [setMapInfoWindow, year, admCode])

	const mapLayers: MapLayer[] | undefined = useMemo(() => {
		return [
			{
				id: 'registered',
				label: t('registration:registeredArea'),
				color: RegisterTypeColor.registered,
				layer: layers[0],
			},
			{
				id: 'unregistered',
				label: t('registration:unregisteredArea'),
				color: RegisterTypeColor.nonRegistered,
				layer: layers[1],
			},
		]
	}, [layers, t])

	const getInitialLayer = useCallback((): MapLayer[] => {
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
			data: layerProvince,
			filled: true,
			lineWidthUnits: 'pixels',
			pickable: true,
			getFillColor(d: any) {
				if (admCode === 0) {
					if (mapBoundaryAdmCodes?.includes(d.properties.provinceCode)) {
						return [226, 226, 226, 100]
					} else {
						return [0, 0, 0, 0]
					}
				} else {
					if (admCode === d.properties.provinceCode) {
						return [226, 226, 226, 100]
					} else {
						return [0, 0, 0, 0]
					}
				}
			},
			getLineColor(d) {
				if (admCode === 0) {
					if (mapBoundaryAdmCodes?.includes(d.properties.provinceCode)) {
						return [0, 0, 0, 255]
					} else {
						return [0, 0, 0, 0]
					}
				} else {
					if (admCode === d.properties.provinceCode) {
						return [0, 0, 0, 255]
					} else {
						return [0, 0, 0, 0]
					}
				}
			},
			updateTriggers: {
				getFillColor: [admCode, year, mapBoundaryAdmCodes],
				getLineColor: [admCode, year, mapBoundaryAdmCodes],
				getLineWidth: [admCode, year, mapBoundaryAdmCodes],
			},
		})

		return [
			{
				id: 'boundary',
				label: t('registration:farmerRegistration'),
				color: '#000000',
				layer: provinceLayer,
			},
			...(mapLayers ?? []),
		]
	}, [admCode, year, mapLayers, t, mapBoundaryAdmCodes])

	useEffect(() => {
		if (admCode === tableAdmCode || tableAdmCode === 0) {
			setShowBack(false)
			if (admCode !== 0) {
				service.overview.locationExtent(admCode).then((res) => {
					if (res.data) {
						setExtent(res.data.extent)
					}
				})
			} else {
				setExtent([97.3758964376, 5.69138418215, 105.589038527, 20.4178496363])
			}
		} else {
			service.overview.locationExtent(tableAdmCode).then((res) => {
				if (res.data) {
					setExtent(res.data.extent)
				}
			})
		}
	}, [tableAdmCode, admCode, setExtent])

	useEffect(() => {
		// initTileLayer()
	}, [])

	useEffect(() => {
		if (layers && registeredData) {
			mapLayers.forEach((item) => {
				const layer = getLayer(item.id)
				if (layer) {
					removeLayer(item.id)
				}
			})

			const province = getInitialLayer().find((item) => item.id === 'boundary')!.layer
			setLayers([province, ...(layers as any[])])
		}
	}, [admCode, getInitialLayer, getLayer, layers, mapLayers, registeredData, removeLayer, setLayers, year])

	return (
		<div
			className={classNames(
				'flex w-full flex-1 flex-col',
				isDesktop ? 'h-full p-[32px] pt-[24px]' : 'box-border p-4',
			)}
		>
			<div
				className={classNames(
					'flex w-full flex-row items-center gap-2',
					isDesktop ? 'pb-[16px]' : 'justify-center pb-4',
				)}
			>
				<div className={classNames('[&>svg]:fill-primary')}>
					<RegistrationIcon />
				</div>
				<p className='text-2xl font-medium text-primary'>{t('registration:registrationData')}</p>
			</div>
			<div className={classNames('flex h-full w-full gap-[24px]', isDesktop ? 'flex-row' : 'flex-col-reverse')}>
				<div
					className={classNames('flex rounded-[8px] bg-white', isDesktop ? 'h-full flex-grow' : 'h-[500px]')}
				>
					{year !== 0 ? (
						<MapView initialLayer={getInitialLayer()} />
					) : (
						<div className='flex h-full w-full items-center justify-center'>
							<CircularProgress />
						</div>
					)}
				</div>
				<div className={classNames('flex flex-col gap-[24px]', isDesktop ? 'h-full w-[350px]' : 'w-full')}>
					<div className='flex w-full flex-col items-center justify-center gap-[16px] rounded-[8px] bg-white p-[24px] shadow'>
						<p className='text-xl font-medium'>{t('registration:farmerRegistration')}</p>
						<div className='flex w-full flex-row gap-3'>
							<Select
								size='small'
								className='w-5/12'
								value={year || ''}
								disabled={!year}
								onChange={(e) => {
									setYear(Number(e.target.value))
									setAdmCode(0)
								}}
							>
								{availabilityData?.map((item: any, index: number) => (
									<MenuItem key={index} value={item.year} className=''>
										{`${t('registration:year')} ${item.yearName[language]}`}
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
								<MenuItem value=''>{t('registration:allProvinces')}</MenuItem>
								{availableAdm?.map((item: any, index: number) => (
									<MenuItem key={index} value={item.admCode}>
										{`${item.admName[language]}`}
									</MenuItem>
								))}
							</Select>
						</div>
					</div>
					<div className='flex w-full flex-col items-center justify-center rounded-[8px] bg-white px-[16px] py-[24px] shadow'>
						<div className='flex w-full items-center justify-between text-sm font-medium'>
							<RegisteredIcon />
							<div className='flex items-center'>
								{`${t('registration:durianPlantationRegistration')} ${t('registration:year')} ${selectedYearObj?.yearName[language] ?? ''}`}
								<StyledTooltip
									className='ml-1 w-max hover:text-tooltip-hover'
									title={
										<p className='text-xs'>
											{language === 'th'
												? 'ข้อมูลการขึ้นทะเบียนพื้นที่ปลูกทุเรียนจากกรมส่งเสริมการเกษตร'
												: 'Durian Planting Area Registration Data from the Department of Agricultural Extension'}
										</p>
									}
								>
									<InfoIcon fontSize='small' className='text-tooltip' />
								</StyledTooltip>
							</div>
						</div>
						<p className='py-[8px] text-center text-[18px] font-medium'>
							{t('registration:plantationArea')}
							{language === Languages.EN ? ' in ' : admCode === 0 ? '' : 'จังหวัด'}
							{selectedAdm?.[language] ?? t('registration:allProvinces')} ({t(`registration:${areaUnit}`)}
							)
						</p>
						<div className='flex items-center justify-center gap-[8px]'>
							<div className={classNames('[&>svg]:fill-green-dark2', 'flex h-full items-end pb-[4px]')}>
								<OverviewIcon />
							</div>
							<p className='text-[36px] font-bold leading-none'>
								{registeredData?.overall.totalArea
									? Math.round(registeredData?.overall.totalArea?.[areaUnit]).toLocaleString()
									: '-'}
							</p>
						</div>
						<hr className={classNames('my-[16px] w-full')} />
						<div className='flex w-full'>
							<div className='flex w-1/2 flex-col items-end'>
								<p className='text-[18px] font-normal'>{t('registration:area')}</p>
								<div className='flex flex-row items-end gap-[6px]'>
									<div className='flex pb-[6px]'>
										<CheckedIcon />
									</div>
									<p className='text-[18px] font-normal text-registerType-registered'>
										{t('registration:registered')}
									</p>
								</div>
								<p className='pt-[8px] text-base font-medium'>{t(`registration:${areaUnit}`)}</p>
								<p className='text-[24px] font-medium leading-none text-registerType-registered'>
									{registeredData?.overall.nonRegisteredArea
										? Math.round(
												registeredData?.overall.registeredArea?.[areaUnit],
											).toLocaleString()
										: '-'}
								</p>
							</div>
							<hr className={classNames('ml-[24px] mr-[16px] h-full border-l-[1px] border-t-0')} />
							<div className='flex w-1/2 flex-col items-end'>
								<p className='text-[18px] font-normal'>{t('registration:area')}</p>
								<div className='flex flex-row items-end gap-[6px]'>
									<div className='flex pb-[6px]'>
										<CrossIcon />
									</div>
									<p className='text-[18px] font-normal text-registerType-nonRegistered'>
										{t('registration:unregistered')}
									</p>
								</div>
								<p className='pt-[8px] text-base font-medium'>{t(`registration:${areaUnit}`)}</p>
								<p className='text-[24px] font-medium leading-none text-registerType-nonRegistered'>
									{registeredData?.overall.registeredArea
										? Math.round(
												registeredData?.overall.nonRegisteredArea?.[areaUnit],
											).toLocaleString()
										: '-'}
								</p>
							</div>
						</div>
					</div>
					<div
						className={classNames(
							'flex w-full flex-col items-center rounded-[8px] bg-white shadow',
							isDesktop ? 'flex-grow p-[24px]' : 'px-[16px] py-[24px]',
						)}
					>
						<p className='flex w-full items-center text-[18px] font-medium'>
							<div className='flex h-full items-start pt-[3px]'>
								<IconButton className='w-[24px] !p-0' onClick={handleBackClick}>
									{showBack && <RegistrationTableBackIcon width={24} />}
								</IconButton>
							</div>
							<div className='flex w-full justify-center text-center'>
								{admCode === 0 && tableAdmCode === 0
									? t('registration:provincialRegistrationData')
									: tableAdmCode === 0
										? language === Languages.TH
											? `${t('registration:registrationData')}จ.${selectedAdm?.[language] ?? ''}`
											: `${selectedAdm?.[language] ?? ''} Province ${t('registration:registrationData')}`
										: admCode === 0
											? String(tableAdmCode).length === 4
												? language === Languages.TH
													? `${t('registration:registrationData')}อ.${district?.[language] ?? ''}`
													: `${district?.[language] ?? ''} District ${t('registration:registrationData')}`
												: language === Languages.TH
													? `${t('registration:registrationData')}จ.${selectedTableAdm?.[language] ?? ''}`
													: `${selectedTableAdm?.[language] ?? ''} Province ${t('registration:registrationData')}`
											: language === Languages.TH
												? `${t('registration:registrationData')}อ.${selectedTableAdm?.[language] ?? ''}`
												: `${selectedTableAdm?.[language] ?? ''} District ${t('registration:registrationData')}`}
							</div>
						</p>
						<div
							className={classNames(
								'my-[16px] box-border flex w-full flex-grow',
								isDesktop ? 'relative' : '',
							)}
						>
							<RegistrationTable
								data={tableAdmCode ? tableInnerData : registeredData}
								handleRowClick={handleRowClick}
							/>
						</div>
						<p className='item-start flex w-full text-[10px] font-medium'>
							{t('unitArea')} : {t(`registration:${areaUnit}`)}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RegistrationMain
