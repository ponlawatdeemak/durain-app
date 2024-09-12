import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import service from '@/api/index'
import { OverviewIcon, OverviewYearDataIcon, OverviewTooltipIcon } from '@/components/svg/MenuIcon'
import { Box, MenuItem, Select } from '@mui/material'
import { availabilityDurianDtoOut, OverviewSummaryDtoOut } from '@/api/overview/dto-out.dto'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import InfoIcon from '@mui/icons-material/Info'
import OverviewBar from './OverviewBar'
import { styled } from '@mui/material/styles'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
import useResponsive from '@/hook/responsive'
import classNames from 'classnames'

const OverviewMain: React.FC = () => {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const [year, setYear] = useState(0)
	const [admCode, setAdmCode] = useState(0)
	const [availabilityData, setAvailabilityData] = useState<availabilityDurianDtoOut[]>()
	const [overviewData, setOverviewData] = useState<OverviewSummaryDtoOut>()

	const availableAdm = availabilityData?.find((item: availabilityDurianDtoOut) => item.year === year)?.availableAdm
	const selectedYearObj = availabilityData?.find((item: availabilityDurianDtoOut) => item.year === year)
	const selectedAdm = selectedYearObj?.availableAdm.find((item) => item.admCode === admCode)?.admName
	const overviewBarXAxis = overviewData?.overall.ageClass.map((item) => item.name[language])
	const overviewBarColumns = overviewData?.overall.ageClass.map((item) => item.percent)
	const overviewBarTooltipData = overviewData?.overall.ageClass.map((item) => item.area[areaUnit])
	const overviewBarColorArr = overviewData?.overall.ageClass.map((item) => item.color)

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
			padding: 8,
			boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 10px 5px',
		},
		[`& .${tooltipClasses.arrow}`]: {
			color: 'white',
			fontSize: '18px',
		},
	}))

	useEffect(() => {
		service.overview
			.overviewSummary({ year: year, admCode: admCode === 0 ? undefined : admCode })
			.then((res) => {
				console.log('overview : ', res.data)
				setOverviewData(res.data)
			})
			.catch((error) => console.log(error))
	}, [year, admCode])

	useEffect(() => {
		service.overview
			.availabilityDurian()
			.then((res) => {
				console.log('availabilityDurian : ', res.data)
				setAvailabilityData(res.data)
				setYear(res.data![res.data!.length - 1].year)
			})
			.catch((error) => console.log(error))
	}, [year])

	useEffect(() => {
		if (availableAdm && !availableAdm.find((item) => item.admCode === admCode)) {
			setAdmCode(0)
		}
	}, [year, admCode, availableAdm])

	return (
		<div className={classNames('flex w-full flex-1 flex-col', isDesktop ? 'h-full p-6' : 'box-border p-4')}>
			<div
				className={classNames(
					'flex w-full flex-row items-center gap-2',
					isDesktop ? 'mb-3' : 'mb-4 justify-center',
				)}
			>
				<div className={classNames('[&>svg]:fill-[#0C5D52]', isDesktop ? '' : '')}>
					<OverviewIcon />
				</div>
				<p className='text-2xl font-semibold text-[#0C5D52]'>{t('overview:overviewOfDurianPlantation')}</p>
			</div>
			<div className={classNames('flex h-full w-full gap-4', isDesktop ? 'flex-row' : 'flex-col-reverse')}>
				<div className={classNames('flex bg-red-100', isDesktop ? 'h-full flex-grow' : 'h-[500px]')}></div>
				<div className={classNames('flex flex-col gap-6', isDesktop ? 'h-full w-[350px]' : 'w-full')}>
					<div className='flex w-full flex-col items-center justify-center gap-3 rounded bg-white p-4 shadow'>
						<p className='text-xl font-semibold'>{t('overview:durianPlantationData')}</p>
						<div className='flex w-full flex-row gap-3'>
							<Select
								displayEmpty
								size='small'
								className='w-5/12'
								value={year || ''}
								disabled={!year}
								onChange={(e) => setYear(Number(e.target.value))}
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
					<div className='relative flex w-full flex-row items-center justify-center rounded bg-white p-4 shadow'>
						<div className='absolute left-4 flex h-full items-center justify-center'>
							<div className='[&>svg]:fill-[#0C5D52]'>
								<OverviewYearDataIcon />
							</div>
						</div>
						<div className='absolute left-12 flex h-full items-center justify-center'>
							<div className='[&>svg]:fill-[#0C5D52]'>
								<OverviewIcon />
							</div>
						</div>
						<div className='flex h-full w-[100%] flex-col items-end gap-1'>
							<div className='flex items-center text-right text-sm font-medium'>
								{t('overview:durianPlantationData')} {t('overview:year')}{' '}
								{selectedYearObj?.yearName[language]}{' '}
								<StyledTooltip
									className='ml-1 hover:text-[#D5E2DC]'
									title={
										<div className='flex flex-row items-center'>
											<div>
												{language === 'th'
													? 'พื้นที่ปลูกทุเรียนได้จากการจำแนกภาพถ่ายจากดาวเทียมความละเอียดสูงโดยใช้ AI and Machine Learning'
													: 'Identifying durian cultivation areas through the analysis of high resolution satellite imagery, enhanced by AI and Machine Learning technologies'}
											</div>
											<div className='[&>svg]:fill-[#0C5D52]'>
												<OverviewTooltipIcon />
											</div>
										</div>
									}
								>
									<InfoIcon fontSize='small' className='text-yellow-400' />
								</StyledTooltip>
							</div>
							<p className='text-[22px] font-semibold'>
								{selectedAdm?.[language] ?? t('overview:allProvinces')}
							</p>
							<div className='flex h-full w-full flex-col items-end'>
								<p className='text-base font-medium'>{t(`overview:${areaUnit}`)}</p>
								<p className='text-top text-[36px] font-bold leading-7 text-[#0C5D52]'>
									{overviewData?.overall.area[areaUnit] ?? '-'}
								</p>
							</div>
						</div>
					</div>
					<div
						className={classNames(
							'flex w-full flex-col items-center rounded bg-white shadow',
							isDesktop ? 'flex-grow p-4' : 'p-0 py-4',
						)}
					>
						<p className='text-center text-lg font-semibold'>
							{t('overview:ageRangeOfDurianPlantationAreas')}
						</p>
						<p className='text-center text-lg font-semibold'>
							{selectedAdm?.[language] ?? t('overview:allProvinces')}
						</p>
						<div className={classNames('flex', isDesktop ? 'flex-grow' : '')}>
							{overviewBarXAxis && overviewBarColumns && overviewBarTooltipData && (
								<OverviewBar
									key={JSON.stringify(overviewBarXAxis)}
									overviewBarColorArr={overviewBarColorArr}
									overviewBarXAxis={overviewBarXAxis}
									overviewBarColumns={['data', ...overviewBarColumns]}
									overviewBarTooltipData={overviewBarTooltipData}
								/>
							)}
						</div>
						<hr className={classNames('w-full', isDesktop ? 'mb-2' : 'my-4')} />
						<div className='mb-2 flex w-full text-sm font-medium text-[#5C5C5C]'>
							<div className={classNames('flex w-1/2 flex-row items-center', isDesktop ? '' : 'ml-4')}>
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
											isDesktop ? '' : 'ml-4',
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
	)
}

export default OverviewMain
