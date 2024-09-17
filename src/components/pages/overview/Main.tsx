import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo, useState } from 'react'
import service from '@/api/index'
import { OverviewIcon, OverviewYearDataIcon, OverviewTooltipIcon } from '@/components/svg/MenuIcon'
import { Box, MenuItem, Select } from '@mui/material'
import { availabilityDurianDtoOut, OverviewSummaryDtoOut } from '@/api/overview/dto-out.dto'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import InfoIcon from '@mui/icons-material/Info'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import useResponsive from '@/hook/responsive'
import classNames from 'classnames'
import Chart from './Chart'
import { Language } from '@mui/icons-material'
import { Languages } from '@/enum'

const OverviewMain: React.FC = () => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const [year, setYear] = useState(0)
	const [admCode, setAdmCode] = useState(0)
	const [availabilityData, setAvailabilityData] = useState<availabilityDurianDtoOut[]>()
	const [overviewData, setOverviewData] = useState<OverviewSummaryDtoOut>()

	const availableAdm = useMemo(() => {
		return availabilityData?.find((item: availabilityDurianDtoOut) => item.year === year)?.availableAdm
	}, [availabilityData, year])

	const selectedYearObj = useMemo(() => {
		return availabilityData?.find((item: availabilityDurianDtoOut) => item.year === year)
	}, [availabilityData, year])

	const selectedAdm = useMemo(() => {
		return selectedYearObj?.availableAdm.find((item) => item.admCode === admCode)?.admName
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

	useEffect(() => {
		service.overview
			.availabilityDurian()
			.then((res) => {
				setAvailabilityData(res.data)
				if (!year) {
					setYear(res.data![res.data!.length - 1].year)
				}
			})
			.catch((error) => console.log(error))
	}, [year])

	useEffect(() => {
		service.overview
			.overviewSummary({ year: year, admCode: admCode === 0 ? undefined : admCode })
			.then((res) => {
				console.log('overview : ', res.data)
				setOverviewData(res.data)
			})
			.catch((error) => console.log(error))
	}, [year, admCode])

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
					<OverviewIcon />
				</div>
				<p className='text-primary text-2xl font-semibold'>{t('overview:overviewOfDurianPlantation')}</p>
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
								{availabilityData?.map((item: any, index) => (
									<MenuItem key={index} value={item.year} className=''>
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
								{availableAdm?.map((item: any, index: number) => (
									<MenuItem key={index} value={item.admCode}>
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
									className='ml-1 hover:text-[#9FC2B3]'
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
									<InfoIcon fontSize='small' className='text-[#FFE25D]' />
								</StyledTooltip>
							</div>
							<p className='pt-[8px] text-[22px] font-semibold'>
								{selectedAdm?.[language] ?? t('overview:allProvinces')}
							</p>
							<div className='flex h-full w-full flex-col items-end pt-[4px]'>
								<p className='text-base font-medium'>{t(`overview:${areaUnit}`)}</p>
								<p className='text-top text-primary text-[36px] font-bold leading-7'>
									{overviewData?.overall.area[areaUnit] ?? '-'}
								</p>
							</div>
						</div>
					</div>
					<div
						className={classNames(
							'flex w-full flex-col items-center rounded-[8px] bg-white shadow',
							isDesktop ? 'flex-grow p-[24px]' : 'p-0 py-4',
						)}
					>
						<p className='text-center text-lg font-semibold'>
							{t('overview:ageRangeOfDurianPlantationAreas')}
						</p>
						<p className='text-center text-lg font-semibold'>
							{selectedAdm?.[language] ?? t('overview:allProvinces')}
						</p>
						<div
							className={classNames(
								'box-border w-full',
								isDesktop
									? 'overflow-y-auto overflow-x-hidden [&&::-webkit-scrollbar-thumb]:rounded [&&::-webkit-scrollbar-thumb]:bg-[#2F7A59] [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-[#EAF2EE] [&::-webkit-scrollbar]:w-[5px]' +
											(language === Languages.TH
												? ' max-h-[calc(100vh-650px)]'
												: ' max-h-[calc(100vh-680px)]')
									: '',
							)}
						>
							<div className={classNames('flex min-h-[250px]', isDesktop ? 'flex-grow' : '')}>
								<Chart data={overviewData}></Chart>
							</div>
							<hr className={classNames('w-full', isDesktop ? 'mb-4' : 'my-4')} />
							<div className='mb-2 flex w-full text-sm font-medium text-[#5C5C5C]'>
								<div
									className={classNames('flex w-1/2 flex-row items-center', isDesktop ? '' : 'ml-5')}
								>
									<Box marginRight={1} width='10px' />
									{t('overview:age')}
								</div>
								<div className='flex w-1/2 justify-center'>
									{t('overview:area')} ({t(`overview:${areaUnit}`)})
								</div>
							</div>
							{overviewData?.overall.ageClass.map((item, index, array) => (
								<React.Fragment key={index}>
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
										<div className='flex w-1/2 justify-center'>{item.area[areaUnit]}</div>
									</div>
									{index === array.length - 1 ? null : <hr className='my-1 w-full border-dashed' />}
								</React.Fragment>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default OverviewMain
