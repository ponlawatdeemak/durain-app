import service from '@/api'
import { ResponseLanguage } from '@/api/interface'
import { AnalyzeIcon } from '@/components/svg/MenuIcon'
import { Box, Divider, FormControl, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import useSearchAnalyze from './context'
import { ExpandMore } from '@mui/icons-material'
import useAreaUnit from '@/store/area-unit'
import SummaryChart from '../Chart/SummaryChart'
import HistoryChart from '../Chart/HistoryChart'

const AnalyzeSummary = () => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const [year, setYear] = useState<number>(new Date().getFullYear())

	useEffect(() => {
		setQueryParams({ ...queryParams, year: new Date().getFullYear() })
		setYear(new Date().getFullYear())
	}, [])

	const { data: durianAvailabilityData, isLoading: isDurianAvailabilityDataLoading } = useQuery({
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
			setQueryParams({ ...queryParams, year: event.target.value as number })
			setYear(event.target.value as number)
		}
	}

	console.log('data', durianAvailabilityData)

	return (
		<div className='flex flex-col gap-4'>
			<Box className='flex items-start justify-between max-sm:flex-col max-sm:gap-4'>
				<Box className='flex items-center gap-4 [&_svg]:!w-6 [&_svg]:fill-[#0C5D52]'>
					<AnalyzeIcon />
					<Typography className='!text-2xl !font-medium text-[#0C5D52]'>
						วิเคราะห์พื้นที่ปลูกทุเรียน
					</Typography>
				</Box>
				<Box className='flex items-center gap-4 max-sm:w-full max-sm:justify-between'>
					<span className='text-sm font-medium text-[#333333]'>เลือกข้อมูลพื้นที่ปลูกทุเรียน</span>
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
											key={data.year}
											value={data.year}
										>{`${t('year')} ${data.yearName[language]}`}</MenuItem>
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
						<Box className='flex w-full items-center justify-between max-lg:flex-col max-lg:gap-6'>
							<Box className='relative flex items-center justify-center'>
								<SummaryChart summaryOverviewData={summaryOverviewData?.data} />
							</Box>
							<Box className='flex w-full shrink-0 flex-col items-center gap-4 lg:w-[360px]'>
								<span className='text-lg font-medium text-[#333333]'>{`พื้นที่ปลูกทุเรียน ${t('year')} ${durianAvailabilityData?.data?.find((data) => data.year === year)?.yearName[language]}`}</span>
								<span className='text-3xl font-medium text-[#333333]'>{`${summaryOverviewData?.data?.overall.area[areaUnit]} ${t(areaUnit)}`}</span>
								<Box className='flex w-full items-center text-sm font-medium text-[#5C5C5C]'>
									<span className='w-full pl-4'>อายุ</span>
									<span className='w-full text-center'>จำนวน%</span>
									<span className='w-full text-right'>พื้นที่</span>
								</Box>
								<Box className='flex w-full flex-col gap-1'>
									{summaryOverviewData?.data?.overall.ageClass.map((item, index) => {
										return (
											<div className='flex w-full flex-col gap-1' key={index}>
												{index > 0 && (
													<Divider className='!border !border-dashed !border-[#DEE2E6]' />
												)}
												<Box className='flex w-full items-center text-sm font-medium text-[#333333]'>
													<div className='flex w-full items-center gap-2'>
														<Box
															className='h-2.5 w-2.5 rounded-full'
															sx={{ backgroundColor: item.color }}
														></Box>
														<span>{item.name[language]}</span>
													</div>
													<span className='w-full text-center'>{`${item.percent}%`}</span>
													<span className='w-full text-right'>{`${item.area[areaUnit]} ${t(areaUnit)}`}</span>
												</Box>
											</div>
										)
									})}
								</Box>
							</Box>
						</Box>
						<span className='text-[10px] font-medium text-[#333333]'>หน่วยพื้นที่ : ไร่</span>
					</Box>
				</Paper>
				<Paper className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex h-[368px] flex-auto flex-col gap-2 !rounded-lg border border-solid border-[#E9ECEE] px-8 py-6 max-xl:w-full xl:min-w-[385px]'>
					<Typography className='text-center !text-lg !font-medium !text-[#333333]'>
						พื้นที่ปลูกรายปีย้อนหลัง
					</Typography>
					<Box className='flex h-full w-full flex-col items-center justify-between'>
						<HistoryChart historyOverviewData={historyOverviewData?.data} />
					</Box>
				</Paper>
			</Box>
		</div>
	)
}

export default AnalyzeSummary
