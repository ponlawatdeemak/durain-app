import useAreaUnit from '@/store/area-unit'
import { Box, FormControl, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import useSearchAnalyze from '../Main/context'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'
import { ExpandMore } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import CompareTable from '../Table/CompareTable'
import { AreaUnitText } from '@/enum'

interface CompareFilterProps {
	orderBy: string
}

const CompareFilter: React.FC<CompareFilterProps> = ({ orderBy }) => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const [yearStart, setYearStart] = useState<number>(new Date().getFullYear())
	const [yearEnd, setYearEnd] = useState<number>(new Date().getFullYear())

	const { data: durianAvailabilityData, isLoading: isDurianAvailabilityDataLoading } = useQuery({
		queryKey: ['getDurianAvailabilityCompare'],
		queryFn: () => service.analyze.getDurianAvailability(),
	})

	const { data: compareProvinceData, isLoading: isCompareProvinceDataLoading } = useQuery({
		queryKey: ['getCompareProvince', queryParams.yearStart, queryParams.yearEnd],
		queryFn: () =>
			service.analyze.getCompareOverview({
				year1: queryParams.yearStart || yearStart,
				year2: queryParams.yearEnd || yearEnd,
			}),
		enabled: !!queryParams.yearStart && !!queryParams.yearEnd,
	})

	const { data: compareDistrictData, isLoading: isCompareDistrictDataLoading } = useQuery({
		queryKey: ['getCompareDistrict', queryParams.yearStart, queryParams.yearEnd, queryParams.provinceId],
		queryFn: () =>
			service.analyze.getCompareOverview({
				year1: queryParams.yearStart || yearStart,
				year2: queryParams.yearEnd || yearEnd,
				admCode: queryParams.provinceId,
			}),
		enabled: !!queryParams.yearStart && !!queryParams.yearEnd && !!queryParams.provinceId,
	})

	const { data: compareSubDistrictData, isLoading: isCompareSubDistrictDataLoading } = useQuery({
		queryKey: ['getCompareSubDistrict', queryParams.yearStart, queryParams.yearEnd, queryParams.districtId],
		queryFn: () =>
			service.analyze.getCompareOverview({
				year1: queryParams.yearStart || yearStart,
				year2: queryParams.yearEnd || yearEnd,
				admCode: queryParams.districtId,
			}),
		enabled: !!queryParams.yearStart && !!queryParams.yearEnd && !!queryParams.districtId,
	})

	useEffect(() => {
		const initYearEnd = durianAvailabilityData?.data
			?.sort((a, b) => b.year - a.year)
			.find((item) => item.year < new Date().getFullYear())

		setQueryParams({ ...queryParams, yearStart: new Date().getFullYear(), yearEnd: initYearEnd?.year })
		setYearStart(new Date().getFullYear())
		setYearEnd(initYearEnd?.year ? initYearEnd.year : new Date().getFullYear())
	}, [durianAvailabilityData])

	const handleYearStartChange = (event: SelectChangeEvent<number>) => {
		if (event.target.value) {
			setQueryParams({ ...queryParams, yearStart: event.target.value as number })
			setYearStart(event.target.value as number)
		}
	}

	const handleYearEndChange = (event: SelectChangeEvent<number>) => {
		if (event.target.value) {
			setQueryParams({ ...queryParams, yearEnd: event.target.value as number })
			setYearEnd(event.target.value as number)
		}
	}

	return (
		<Paper
			className={classNames('flex flex-col items-center gap-4 !rounded-lg !bg-[#D5E2DC] p-4', {
				hidden: orderBy !== 'changes',
			})}
		>
			<Box className='flex flex-col items-center gap-4 py-2 sm:flex-row sm:px-6'>
				<span className='text-base font-medium text-[#333333]'>ปีที่เปรียบเทียบ</span>
				<Box className='flex items-center gap-4'>
					<Box className='w-[130px]'>
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
										'[&_.MuiMenuItem-root]:text-sm [&_.MuiMenuItem-root]:text-[#333333] [&_.MuiMenuItem-root.Mui-selected]:bg-[#EAF2EE] [&_.MuiMenuItem-root.Mui-selected]:rounded [&_.MuiMenuItem-root]:py-1 [&_.MuiMenuItem-root]:px-2 [&_.MuiList-root]:p-0 [&_.MuiPaper-root]:rounded [&_.MuiPaper-root]:p-1 [&_.MuiPaper-root]:border [&_.MuiPaper-root]:border-solid [&_.MuiPaper-root]:border-[#EBEBEB]',
								}}
								value={yearStart}
								onChange={handleYearStartChange}
							>
								{durianAvailabilityData?.data?.map((data) => {
									return (
										<MenuItem
											key={data.year}
											value={data.year}
										>{`${data.yearName[language]}`}</MenuItem>
									)
								})}
							</Select>
						</FormControl>
					</Box>
					<span className='text-base font-medium text-[#333333]'>กับ</span>
					<Box className='w-[130px]'>
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
										'[&_.MuiMenuItem-root]:text-sm [&_.MuiMenuItem-root]:text-[#333333] [&_.MuiMenuItem-root.Mui-selected]:bg-[#EAF2EE] [&_.MuiMenuItem-root.Mui-selected]:rounded [&_.MuiMenuItem-root]:py-1 [&_.MuiMenuItem-root]:px-2 [&_.MuiList-root]:p-0 [&_.MuiPaper-root]:rounded [&_.MuiPaper-root]:p-1 [&_.MuiPaper-root]:border [&_.MuiPaper-root]:border-solid [&_.MuiPaper-root]:border-[#EBEBEB]',
								}}
								value={yearEnd}
								onChange={handleYearEndChange}
							>
								{durianAvailabilityData?.data?.map((data) => {
									return (
										<MenuItem
											key={data.year}
											value={data.year}
										>{`${data.yearName[language]}`}</MenuItem>
									)
								})}
							</Select>
						</FormControl>
					</Box>
				</Box>
			</Box>
			<Box className='flex w-full items-center gap-4 max-xl:flex-col'>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					<Box className='flex flex-col gap-4'>
						<Typography className='!text-lg !font-medium !text-[#333333]'>
							{`ข้อมูลพื้นที่ปลูกทุเรียนทุกพื้นที่`}
						</Typography>
						<CompareTable compareOverviewData={compareProvinceData?.data} />
					</Box>
					<span className='text-[10px] font-medium text-[#333333]'>{`หน่วยพื้นที่ : ${t(AreaUnitText[areaUnit])}`}</span>
				</Box>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					<Box className='flex flex-col gap-4'>
						<Typography className='!text-lg !font-medium !text-[#333333]'>
							{`ข้อมูลพื้นที่ปลูกทุเรียนจังหวัด${compareProvinceData?.data?.adms.find((province) => Number(province.admCode) === queryParams.provinceId)?.admName[language] || ''}ที่เปลี่ยนแปลง`}
						</Typography>
						<CompareTable compareOverviewData={compareDistrictData?.data} />
					</Box>
					<span className='text-[10px] font-medium text-[#333333]'>{`หน่วยพื้นที่ : ${t(AreaUnitText[areaUnit])}`}</span>
				</Box>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					<Box className='flex flex-col gap-4'>
						<Typography className='!text-lg !font-medium !text-[#333333]'>
							{`ข้อมูลพื้นที่ปลูกทุเรียนอำเภอ${compareDistrictData?.data?.adms.find((district) => Number(district.admCode) === queryParams.districtId)?.admName[language] || ''}ที่เปลี่ยนแปลง`}
						</Typography>
						<CompareTable compareOverviewData={compareSubDistrictData?.data} />
					</Box>
					<span className='text-[10px] font-medium text-[#333333]'>{`หน่วยพื้นที่ : ${t(AreaUnitText[areaUnit])}`}</span>
				</Box>
			</Box>
		</Paper>
	)
}

export default CompareFilter
