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
import { Alert, CircularProgress, IconButton, MenuItem, Select, Snackbar } from '@mui/material'
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
import useMapStore from '@/components/common/map/store/map'
import { MVTLayer } from '@deck.gl/geo-layers'
import { thaiExtent, tileLayer } from '@/config/app.config'
import { MapLayer } from '@/components/common/map/interface/map.jsx'
import MapView from '@/components/common/map/MapView'
import hexRgb from 'hex-rgb'
import { apiAccessToken } from '@/api/core'
import { RegisterTypeColor } from '@/config/color'
import CloseIcon from '@mui/icons-material/Close'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'

import { IconLayer } from '@deck.gl/layers'
import { getPin } from '@/utils/pin'
import { PickingInfo } from '@deck.gl/core'

interface MapInfoWindowContentProp {
	provinceTH: string
	districtTH: string
	subDistrictTH: string
	provinceEN: string
	districtEN: string
	subDistrictEN: string
	status: string
}

const selectPinId = 'selected-pin'

const MapInfoWindowContent: React.FC<{ data: MapInfoWindowContentProp }> = ({ data }) => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage

	const { removeLayer, setInfoWindow } = useMapStore()

	return (
		<div className='flex h-[145px] w-[315px] flex-col items-end rounded-[8px] bg-green-light p-1'>
			<IconButton
				onClick={() => {
					setInfoWindow(null)
					removeLayer(selectPinId)
				}}
				className='self-right flex h-[25px] w-[25px]'
			>
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
							{language === Languages.TH
								? `ตำบล${data.subDistrictTH} อำเภอ${data.districtTH} จังหวัด${data.provinceTH}`
								: `${data.subDistrictEN}, ${data.districtEN}, ${data.provinceEN}`}
						</p>
					</div>
					<div className='flex w-max gap-2 rounded-[4px] bg-white px-2 py-1'>
						{data.status === RegisterType.Registered ? (
							<>
								<PopupRegistrationChecked />
								<p className='text-[16px] font-medium text-primary'>
									{t('registration:registeredArea')}
								</p>
							</>
						) : (
							<>
								<PopupRegistrationCross />
								<p className='text-[16px] font-medium text-registerType-nonRegistered'>
									{t('registration:unregisteredArea')}
								</p>
							</>
						)}
					</div>
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
	const districtCodeLength = 4
	const allprovinceCode = 0
	const initialTableAdmCode = 0
	const thailandExtent: [number, number, number, number] = [
		97.3758964376, 5.69138418215, 105.589038527, 20.4178496363,
	]

	const [year, setYear] = useState(0)
	const [admCode, setAdmCode] = useState(0)
	const [tableAdmCode, setTableAdmCode] = useState(0)
	const [showBack, setShowBack] = useState(false)
	const [district, setDistrict] = useState<ResponseLanguage>()
	const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const [subDistrictCode, setSubDistrictCode] = useState(0)

	const { setLayers, getLayer, removeLayer, addLayer, mapLibre, setInfoWindow } = useMapStore()

	const { data: availabilityData } = useQuery({
		queryKey: ['availabilityRegistered'],
		queryFn: async () => {
			try {
				const res = await service.registration.availabilityRegistered()
				if (!year) {
					setYear(res.data![0].year)
				}
				return res.data
			} catch {
				setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
			}
		},
	})

	const { data: registeredData } = useQuery({
		queryKey: ['overviewRegistered', year, admCode],
		queryFn: async () => {
			try {
				setInfoWindow(null)
				setTableAdmCode(0)
				const res = await service.registration.overviewRegistered({
					year: year,
					admCode: admCode ?? undefined,
				})
				if (admCode !== 0) {
					service.overview.locationExtent(admCode).then((res) => {
						if (res.data) {
							mapLibre?.fitBounds(res.data.extent)
						}
					})
				} else {
					mapLibre?.fitBounds(thaiExtent)
				}
				return res.data
			} catch {
				setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
			}
		},
	})

	const { data: tableInnerData } = useQuery({
		queryKey: ['overviewRegisteredTable', tableAdmCode],
		queryFn: async () => {
			try {
				setInfoWindow(null)
				const res = await service.registration.overviewRegistered({
					year: year,
					admCode: tableAdmCode ?? undefined,
				})
				return res.data
			} catch {
				setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
			}
		},
		enabled: tableAdmCode !== initialTableAdmCode,
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

	const selectedTableAdmName = useMemo(() => {
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

	const handleRowClick = (rowAdmCode: number, rowAdmName: ResponseLanguage) => {
		if (String(rowAdmCode).length <= districtCodeLength) {
			setDistrict(rowAdmName)
			setTableAdmCode(rowAdmCode)
			setShowBack(true)
		} else {
			setSubDistrictCode(rowAdmCode)
			service.overview.locationExtent(rowAdmCode).then((res) => {
				if (res.data) {
					mapLibre?.fitBounds(res.data.extent)
				}
			})
		}
	}

	const handleBackClick = () => {
		if (String(tableAdmCode).length === districtCodeLength && admCode === allprovinceCode) {
			setTableAdmCode((tableAdmCode) => Number(String(tableAdmCode).slice(0, 2)))
		} else {
			setTableAdmCode(0)
		}
	}

	const onLayerClick = useCallback(
		(info: PickingInfo) => {
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
				setInfoWindow({
					children: <MapInfoWindowContent data={data} />,
				})
			}
			if (info.coordinate) {
				const lng = info.coordinate![0]
				const lat = info.coordinate![1]

				const coordinates: [number, number] = [lng, lat]
				removeLayer(selectPinId)
				const iconLayer = new IconLayer({
					id: selectPinId,
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
					getPosition: (d) => d.coordinates,
					getSize: 40,
				})
				addLayer(iconLayer)
			}
		},
		[addLayer, removeLayer, setInfoWindow],
	)

	const layers = useMemo(() => {
		return [
			new MVTLayer({
				id: 'registered',
				name: 'registered',
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: tileLayer.registerLayer(year),

				onError(error) {
					if (error.message.startsWith('loading TileJSON')) {
						setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
					}
				},
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor(d) {
					if (admCode === allprovinceCode && tableAdmCode === initialTableAdmCode) {
						if (d.properties.status === RegisterType.Registered) {
							const array = hexRgb(RegisterTypeColor.registered, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						if (
							(String(admCode) === String(d.properties.admCode).substring(0, 2) &&
								tableAdmCode === initialTableAdmCode) ||
							String(tableAdmCode) === String(d.properties.admCode).substring(0, 2) ||
							String(tableAdmCode) === String(d.properties.admCode).substring(0, 4)
						) {
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
					if (admCode === allprovinceCode && tableAdmCode === initialTableAdmCode) {
						if (d.properties.status === RegisterType.Registered) {
							const array = hexRgb(RegisterTypeColor.registered, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						if (
							(String(admCode) === String(d.properties.admCode).substring(0, 2) &&
								tableAdmCode === initialTableAdmCode) ||
							String(tableAdmCode) === String(d.properties.admCode).substring(0, 2) ||
							String(tableAdmCode) === String(d.properties.admCode).substring(0, 4)
						) {
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
				onClick: onLayerClick,
				updateTriggers: {
					getFillColor: [admCode, year, tableAdmCode],
					getLineColor: [admCode, year, tableAdmCode],
					getLineWidth: [admCode, year, tableAdmCode],
				},
			}),
			new MVTLayer({
				id: 'unregistered',
				name: 'unregistered',
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: tileLayer.registerLayer(year),
				onError(error) {
					if (error.message.startsWith('loading TileJSON')) {
						setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
					}
				},
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor(d) {
					if (admCode === allprovinceCode && tableAdmCode === initialTableAdmCode) {
						if (d.properties.status === RegisterType.NonRegistered) {
							const array = hexRgb(RegisterTypeColor.nonRegistered, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						if (
							(String(admCode) === String(d.properties.admCode).substring(0, 2) &&
								tableAdmCode === initialTableAdmCode) ||
							String(tableAdmCode) === String(d.properties.admCode).substring(0, 2) ||
							String(tableAdmCode) === String(d.properties.admCode).substring(0, 4)
						) {
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
					if (admCode === allprovinceCode && tableAdmCode === initialTableAdmCode) {
						if (d.properties.status === RegisterType.NonRegistered) {
							const array = hexRgb(RegisterTypeColor.nonRegistered, { format: 'array' })
							array[3] = 255
							return array
						} else {
							return [0, 0, 0, 0]
						}
					} else {
						if (
							(String(admCode) === String(d.properties.admCode).substring(0, 2) &&
								tableAdmCode === initialTableAdmCode) ||
							String(tableAdmCode) === String(d.properties.admCode).substring(0, 2) ||
							String(tableAdmCode) === String(d.properties.admCode).substring(0, 4)
						) {
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
				onClick: onLayerClick,
				updateTriggers: {
					getFillColor: [admCode, year, tableAdmCode],
					getLineColor: [admCode, year, tableAdmCode],
					getLineWidth: [admCode, year, tableAdmCode],
				},
			}),
		]
	}, [year, admCode, tableAdmCode, t, onLayerClick])

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

	const initialLayer = useMemo((): MapLayer[] => {
		const layerProvince = tileLayer.province
		const layerDistrict = tileLayer.district
		const layerSubDistrict = tileLayer.subDistrict

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
			data:
				admCode !== allprovinceCode || tableAdmCode !== initialTableAdmCode
					? String(tableAdmCode).length === districtCodeLength
						? layerSubDistrict
						: layerDistrict
					: layerProvince,
			onError(error) {
				if (error.message.startsWith('loading TileJSON')) {
					setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
				}
			},
			filled: true,
			lineWidthUnits: 'pixels',
			pickable: true,
			getFillColor(d) {
				if (admCode === allprovinceCode && tableAdmCode === initialTableAdmCode) {
					if (mapBoundaryAdmCodes?.includes(d.properties.provinceCode)) {
						return [226, 226, 226, 100]
					} else {
						return [0, 0, 0, 0]
					}
				} else {
					if (
						(admCode === d.properties.provinceCode && tableAdmCode === initialTableAdmCode) ||
						tableAdmCode === d.properties.provinceCode ||
						tableAdmCode === d.properties.districtCode
					) {
						return [226, 226, 226, 100]
					} else {
						return [0, 0, 0, 0]
					}
				}
			},
			getLineColor(d) {
				if (admCode === allprovinceCode && tableAdmCode === initialTableAdmCode) {
					if (mapBoundaryAdmCodes?.includes(d.properties.provinceCode)) {
						return [0, 0, 0, 255]
					} else {
						return [0, 0, 0, 0]
					}
				} else {
					if (
						(admCode === d.properties.provinceCode && tableAdmCode === initialTableAdmCode) ||
						tableAdmCode === d.properties.provinceCode ||
						tableAdmCode === d.properties.districtCode
					) {
						return [0, 0, 0, 255]
					} else {
						return [0, 0, 0, 0]
					}
				}
			},
			updateTriggers: {
				getFillColor: [admCode, year, mapBoundaryAdmCodes, tableAdmCode],
				getLineColor: [admCode, year, mapBoundaryAdmCodes, tableAdmCode],
				getLineWidth: [admCode, year, mapBoundaryAdmCodes, tableAdmCode],
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
	}, [admCode, year, mapLayers, t, mapBoundaryAdmCodes, tableAdmCode])

	useEffect(() => {
		if (admCode === tableAdmCode || tableAdmCode === initialTableAdmCode) {
			setShowBack(false)
			if (admCode !== allprovinceCode) {
				service.overview.locationExtent(admCode).then((res) => {
					if (res.data) {
						mapLibre?.fitBounds(res.data.extent)
					}
				})
			} else {
				mapLibre?.fitBounds(thaiExtent)
			}
		} else {
			service.overview.locationExtent(tableAdmCode).then((res) => {
				if (res.data) {
					mapLibre?.fitBounds(res.data.extent)
				}
			})
		}
	}, [tableAdmCode, admCode, mapLibre])

	useEffect(() => {
		if (layers && registeredData) {
			const province = initialLayer.find((item) => item.id === 'boundary')!.layer
			setLayers([province, ...(layers as any[])])
		}
	}, [admCode, initialLayer, getLayer, layers, mapLayers, registeredData, removeLayer, setLayers, year])

	useEffect(() => {
		const layer = getLayer('subDistrict')
		if (layer) {
			removeLayer('subDistrict')
		}

		const subDistrictLayer = new MVTLayer({
			id: 'subDistrict',
			name: 'subDistrict',
			loadOptions: {
				fetch: {
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${apiAccessToken}`,
					},
				},
			},
			data: tileLayer.subDistrict,

			onError(error) {
				if (error.message.startsWith('loading TileJSON')) {
					setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
				}
			},
			filled: true,
			lineWidthUnits: 'pixels',
			pickable: false,
			getFillColor(d) {
				return [0, 0, 0, 0]
			},
			getLineColor(d) {
				if (d.properties.subDistrictCode === subDistrictCode) {
					return [255, 0, 0, 255]
				} else {
					return [0, 0, 0, 0]
				}
			},
			updateTriggers: {
				getFillColor: subDistrictCode,
				getLineColor: subDistrictCode,
				getLineWidth: subDistrictCode,
			},
		})
		addLayer(subDistrictLayer)
	}, [addLayer, getLayer, removeLayer, subDistrictCode, t])

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
						<MapView
							initialLayer={initialLayer}
							legendSelectorLabel={t('registration:farmerRegistration')}
						/>
					) : (
						<div className='flex h-full w-full items-center justify-center'>
							<CircularProgress />
						</div>
					)}
				</div>
				<div className={classNames('flex flex-col gap-[8px]', isDesktop ? 'h-full w-[350px]' : 'w-full')}>
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
									title={<p className='text-xs'>{t('registration:tooltip')}</p>}
								>
									<InfoIcon fontSize='small' className='text-tooltip hover:cursor-pointer' />
								</StyledTooltip>
							</div>
						</div>
						<p className='py-[8px] text-center text-[18px] font-medium'>
							{t('registration:plantationArea')}
							{language === Languages.EN ? ' in ' : admCode === allprovinceCode ? '' : 'จังหวัด'}
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
						<div className='flex w-full items-center text-[18px] font-medium'>
							<div className='flex h-full items-start pt-[3px]'>
								<IconButton className='w-[24px] !p-0' onClick={handleBackClick}>
									{showBack && <RegistrationTableBackIcon width={24} />}
								</IconButton>
							</div>
							<div className='flex w-full justify-center text-center'>
								{admCode === allprovinceCode && tableAdmCode === initialTableAdmCode
									? t('registration:provincialRegistrationData')
									: tableAdmCode === initialTableAdmCode
										? language === Languages.TH
											? `${t('registration:registrationData')} จ.${selectedAdm?.[language] ?? ''}`
											: `${selectedAdm?.[language] ?? ''} Province ${t('registration:registrationData')}`
										: admCode === allprovinceCode
											? String(tableAdmCode).length === districtCodeLength
												? language === Languages.TH
													? `${t('registration:registrationData')} อ.${district?.[language] ?? ''}`
													: `${district?.[language] ?? ''} District ${t('registration:registrationData')}`
												: language === Languages.TH
													? `${t('registration:registrationData')} จ.${selectedTableAdmName?.[language] ?? ''}`
													: `${selectedTableAdmName?.[language] ?? ''} Province ${t('registration:registrationData')}`
											: language === Languages.TH
												? `${t('registration:registrationData')} อ.${selectedTableAdmName?.[language] ?? ''}`
												: `${selectedTableAdmName?.[language] ?? ''} District ${t('registration:registrationData')}`}
							</div>
						</div>
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
		</div>
	)
}

export default RegistrationMain
