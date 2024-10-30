import service from '@/api'
import { ResponseLanguage } from '@/api/interface'
import { AnalyzeIcon } from '@/components/svg/MenuIcon'
import {
	Box,
	CircularProgress,
	Divider,
	FormControl,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import useSearchAnalyze from './context'
import { ExpandMore } from '@mui/icons-material'
import useAreaUnit from '@/store/area-unit'
import SummaryChart from '../Chart/SummaryChart'
import HistoryChart from '../Chart/HistoryChart'
import { AreaUnitText } from '@/enum'
import { Popup } from 'maplibre-gl'

interface AnalyzeSummaryProps {
	popup: Popup
}

const AnalyzeSummary: React.FC<AnalyzeSummaryProps> = ({ popup }) => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const [year, setYear] = useState<number>(new Date().getFullYear())

	useEffect(() => {
		setYear(new Date().getFullYear())
	}, [])

	const { data: durianAvailabilityData, isLoading: _isDurianAvailabilityDataLoading } = useQuery({
		queryKey: ['getDurianAvailability'],
		queryFn: () => service.analyze.getDurianAvailability(),
	})

	const { data: summaryOverviewData, isLoading: isSummaryOverviewDataLoading } = useQuery({
		queryKey: ['getSummaryOverview', year],
		queryFn: () => service.analyze.getSummaryOverview({ year: year }),
	})

	const { data: historyOverviewData, isLoading: isHistoryOverviewDataLoading } = useQuery({
		queryKey: ['getHistoryOverview'],
		queryFn: () => service.analyze.getHistoryOverview(),
	})

	const handleYearChange = (event: SelectChangeEvent<number>) => {
		if (event.target.value) {
			setQueryParams({
				...queryParams,
				provinceId: undefined,
				districtId: undefined,
				subDistrictId: undefined,
				year: event.target.value as number,
			})
			setYear(event.target.value as number)
			popup.remove()
		}
	}

	return (
		<div className='flex flex-col gap-4'>
			<Box className='flex items-start justify-between max-sm:flex-col max-sm:gap-4'>
				<Box className='flex items-center gap-4 [&_svg]:!w-6 [&_svg]:fill-[#0C5D52]'>
					<AnalyzeIcon />
					<Typography className='!text-2xl !font-medium text-[#0C5D52]'>{t('menuAnalyze')}</Typography>
				</Box>
				<Box className='flex items-center gap-4 max-sm:w-full max-sm:justify-between'>
					<span className='text-sm font-medium text-[#333333]'>
						{t('analyze:selectDurianPlantationData')}
					</span>
					<Box className='w-[90px]'>
						<FormControl fullWidth>
							<Select
								id='year-select'
								className='h-10 bg-white [&_svg]:right-2 [&_svg]:top-[calc(50%-12px)] [&_svg]:h-6 [&_svg]:w-6 [&_svg]:font-medium [&_svg]:text-[#2B6F51]'
								IconComponent={ExpandMore}
								SelectDisplayProps={{
									className: '!p-2 !pr-9 !text-sm !font-medium !text-[#333333]',
								}}
								MenuProps={{
									className:
										'lg:[&_.MuiPaper-root]:!top-[154px] [&_.MuiMenuItem-root]:text-sm [&_.MuiMenuItem-root]:text-[#333333] [&_.MuiMenuItem-root.Mui-selected]:bg-[#EAF2EE] [&_.MuiMenuItem-root.Mui-selected]:rounded [&_.MuiMenuItem-root]:py-1 [&_.MuiMenuItem-root]:px-2 [&_.MuiList-root]:p-0 [&_.MuiPaper-root]:rounded [&_.MuiPaper-root]:p-1 [&_.MuiPaper-root]:border [&_.MuiPaper-root]:border-solid [&_.MuiPaper-root]:border-[#EBEBEB]',
								}}
								value={year}
								onChange={handleYearChange}
							>
								{durianAvailabilityData?.data?.map((data) => {
									return (
										<MenuItem
											key={data?.year}
											value={data?.year}
										>{`${data?.yearName?.[language]}`}</MenuItem>
									)
								})}
							</Select>
						</FormControl>
					</Box>
				</Box>
			</Box>
			<Box className='flex w-full flex-col items-center gap-4 xl:flex-row'>
				<Paper className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col items-center !rounded-lg border border-solid border-[#E9ECEE] py-8 lg:h-[368px] xl:w-[66.3%] xl:max-w-[950px]'>
					<Box className='flex h-full w-[86.9%] max-w-[800px] flex-col justify-between max-lg:gap-6 lg:min-w-[650px]'>
						{isSummaryOverviewDataLoading ? (
							<div className='flex h-[550px] flex-col items-center justify-center bg-transparent lg:h-full lg:bg-white'>
								<CircularProgress size={80} color='primary' />
							</div>
						) : (
							<>
								<Box className='flex w-full items-center justify-between max-lg:flex-col max-lg:gap-6'>
									<Box className='relative flex items-center justify-center'>
										<SummaryChart
											summaryOverviewData={summaryOverviewData?.data}
											year={
												durianAvailabilityData?.data?.find((data) => data?.year === year)
													?.yearName?.[language]
											}
										/>
									</Box>
									<Box className='flex w-full shrink-0 flex-col items-center gap-4 lg:w-[360px]'>
										<span className='text-lg font-medium text-[#333333]'>{`${t('analyze:durianPlantationArea')} ${t('year')} ${durianAvailabilityData?.data?.find((data) => data?.year === year)?.yearName?.[language] ?? ''}`}</span>
										<span className='text-3xl font-medium text-[#333333]'>{`${Number(summaryOverviewData?.data?.overall?.area?.[areaUnit]?.toFixed(2) ?? 0)?.toLocaleString() || '-'} ${t(AreaUnitText[areaUnit])}`}</span>
										<Box className='flex w-full items-center text-sm font-medium text-[#5C5C5C]'>
											<span className='w-[30%] pl-4'>{t('age')}</span>
											<span className='w-[30%] text-center'>{`${t('analyze:amount')}%`}</span>
											<span className='w-[50%] text-right md:w-[40%]'>{t('area')}</span>
										</Box>
										<Box className='flex w-full flex-col gap-1'>
											{summaryOverviewData?.data?.overall?.ageClass?.map((item, index) => {
												return (
													<div className='flex w-full flex-col gap-1' key={item.id}>
														{index > 0 && (
															<Divider className='!border !border-dashed !border-[#DEE2E6]' />
														)}
														<Box className='flex w-full items-center text-sm font-medium text-[#333333]'>
															<div className='flex w-[30%] items-center gap-2'>
																<Box
																	className='h-2.5 w-2.5 rounded-full'
																	sx={{ backgroundColor: item.color }}
																></Box>
																<span>{item?.name?.[language] || '-'}</span>
															</div>
															<span className='w-[30%] text-center'>
																{item?.percent ? `${item.percent?.toFixed(2)}%` : '-'}
															</span>
															<span className='w-[50%] text-right md:w-[40%]'>{`${item?.area?.[areaUnit] ? Number(item.area[areaUnit]?.toFixed(2))?.toLocaleString() : '-'} ${t(AreaUnitText[areaUnit])}`}</span>
														</Box>
													</div>
												)
											})}
										</Box>
									</Box>
								</Box>
								<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
							</>
						)}
					</Box>
				</Paper>
				<Paper className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex h-[368px] flex-auto flex-col gap-2 !rounded-lg border border-solid border-[#E9ECEE] px-8 py-6 max-xl:w-full xl:min-w-[385px]'>
					<Typography className='text-center !text-lg !font-medium !text-[#333333]'>
						{t('analyze:historicalDurianPlantation')}
					</Typography>
					<Box className='flex h-full w-full flex-col items-center justify-between'>
						{isHistoryOverviewDataLoading ? (
							<div className='flex h-full flex-col items-center justify-center bg-transparent lg:bg-white'>
								<CircularProgress size={60} color='primary' />
							</div>
						) : (
							<HistoryChart historyOverviewData={historyOverviewData?.data} />
						)}
					</Box>
				</Paper>
			</Box>
		</div>
	)
}

export default AnalyzeSummary
