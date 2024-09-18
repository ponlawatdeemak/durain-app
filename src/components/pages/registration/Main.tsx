import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import service from '@/api/index'
import {
	CheckedIcon,
	CrossIcon,
	OverviewIcon,
	RegisteredIcon,
	RegistrationIcon,
	RegistrationTableBackIcon,
} from '@/components/svg/MenuIcon'
import { IconButton, MenuItem, Select } from '@mui/material'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import InfoIcon from '@mui/icons-material/Info'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import useResponsive from '@/hook/responsive'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { Languages } from '@/enum'
import RegistrationTable from './Table'

const RegistrationMain: React.FC = () => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const [year, setYear] = useState(0)
	const [admCode, setAdmCode] = useState(0)
	const [tableAdmCode, setTableAdmCode] = useState(0)
	const [showBack, setShowBack] = useState(false)

	const {
		data: availabilityData,
		isLoading: isAvailabilityDataLoading,
		error: availabilityDataError,
	} = useQuery({
		queryKey: ['availabilityRegistered'],
		queryFn: async () => {
			const res = await service.registration.availabilityRegistered()
			if (!year) {
				setYear(res.data![res.data!.length - 1].year)
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
			return res.data
		},
	})

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

	const handleRowClick = (rowAdmCode: number) => {
		if (String(rowAdmCode).length <= 4) {
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

	useEffect(() => {
		if (admCode === tableAdmCode || tableAdmCode === 0) {
			setShowBack(false)
		}
	}, [tableAdmCode, admCode])

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
					className={classNames(
						'flex rounded-[8px] bg-green-100',
						isDesktop ? 'h-full flex-grow' : 'h-[500px]',
					)}
				></div>
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
									className='ml-1 w-max hover:text-[#9FC2B3]'
									title={
										<p className='text-xs'>
											{language === 'th'
												? 'ข้อมูลการขึ้นทะเบียนพื้นที่ปลูกทุเรียนจากกรมส่งเสริมการเกษตร'
												: 'Durian Planting Area Registration Data from the Department of Agricultural Extension'}
										</p>
									}
								>
									<InfoIcon fontSize='small' className='text-[#FFE25D]' />
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
							<div className={classNames('[&>svg]:fill-[#9FC2B3]', 'flex h-full items-end pb-[4px]')}>
								<OverviewIcon />
							</div>
							<p className='text-[36px] font-bold leading-none'>
								{registeredData?.overall.totalArea[areaUnit] ?? '-'}
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
									<p className='text-[18px] font-normal text-[#2F7A59]'>
										{t('registration:registered')}
									</p>
								</div>
								<p className='pt-[8px] text-base font-medium'>{t(`registration:${areaUnit}`)}</p>
								<p className='text-[24px] font-medium leading-none text-[#2F7A59]'>
									{registeredData?.overall.nonRegisteredArea[areaUnit] ?? '-'}
								</p>
							</div>
							<hr className={classNames('ml-[24px] mr-[16px] h-full border-l-[1px] border-t-0')} />
							<div className='flex w-1/2 flex-col items-end'>
								<p className='text-[18px] font-normal'>{t('registration:area')}</p>
								<div className='flex flex-row items-end gap-[6px]'>
									<div className='flex pb-[6px]'>
										<CrossIcon />
									</div>
									<p className='text-[18px] font-normal text-[#EF5A56]'>
										{t('registration:unregistered')}
									</p>
								</div>
								<p className='pt-[8px] text-base font-medium'>{t(`registration:${areaUnit}`)}</p>
								<p className='text-[24px] font-medium leading-none text-[#EF5A56]'>
									{registeredData?.overall.registeredArea[areaUnit] ?? '-'}
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
								{t('registration:provincialRegistrationData')}
							</div>
						</p>
						<div
							className={classNames(
								'my-[16px] box-border flex w-full flex-grow',
								isDesktop ? 'relative' : '',
								// isDesktop
								// 	? language === Languages.TH
								// 		? 'max-h-[calc(100vh-762px)]'
								// 		: areaUnit === AreaUnit.Rai
								// 			? 'max-h-[calc(100vh-762px)]'
								// 			: 'max-h-[calc(100vh-789px)]'
								// 	: '',
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
