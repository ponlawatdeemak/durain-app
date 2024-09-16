import useAreaUnit from '@/store/area-unit'
import { Box, FormControl, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import useSearchAnalyze from '../Main/context'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'
import { AddCircleOutline, ArrowDropDown, ArrowDropUp, ExpandMore, RemoveCircleOutline } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'

interface CompareTableProps {
	orderBy: string
}

const CompareTable: React.FC<CompareTableProps> = ({ orderBy }) => {
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
		queryKey: ['getCompareProvince'],
		queryFn: () => service.analyze.getCompareOverview({ year1: 2024, year2: 2022 }),
	})

	const { data: compareDistrictData, isLoading: isCompareDistrictDataLoading } = useQuery({
		queryKey: ['getCompareDistrict'],
		queryFn: () => service.analyze.getCompareOverview({ year1: 2024, year2: 2022, admCode: 22 }),
	})

	const { data: compareSubDistrictData, isLoading: isCompareSubDistrictDataLoading } = useQuery({
		queryKey: ['getCompareSubDistrict'],
		queryFn: () => service.analyze.getCompareOverview({ year1: 2024, year2: 2022, admCode: 2202 }),
	})

	console.log('compareProvince', compareProvinceData)
	console.log('compareDistrict', compareDistrictData)
	console.log('compareSubDistrict', compareSubDistrictData)

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
			<Box className='flex items-center gap-4 px-6 py-2'>
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
										>{`${t('year')} ${data.yearName[language]}`}</MenuItem>
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
										>{`${t('year')} ${data.yearName[language]}`}</MenuItem>
									)
								})}
							</Select>
						</FormControl>
					</Box>
				</Box>
			</Box>
			<Box className='flex w-full items-center gap-4'>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex h-[400px] w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					<Box className='flex flex-col gap-4'>
						<Typography className='text-lg font-medium text-[#333333]'>
							ข้อมูลพื้นที่ปลูกทุเรียนทุกพื้นที่
						</Typography>
						<Box className='flex h-[274px] flex-col gap-1'>
							<Box className='flex items-center rounded bg-[#F0F2F4]'>
								<span className='w-[27%] p-4 pr-2 text-sm font-medium text-[#333333]'>พื้นที่</span>
								<span className='flex w-[27%] items-center justify-center px-2 py-4 text-sm font-medium text-[#333333]'>
									{`พื้นที่ปลูก (${compareProvinceData?.data?.year1[language].substring(2, 4)})`}
								</span>
								<span className='flex w-[46%] items-center justify-center px-2 py-4 text-sm font-medium text-[#333333]'>
									{`พื้นที่เปลี่ยนแปลง (${compareProvinceData?.data?.year1[language].substring(2, 4)}/${compareProvinceData?.data?.year2[language].substring(2, 4)})`}
								</span>
							</Box>
							<Box className='flex flex-col gap-1 overflow-auto'>
								{compareProvinceData?.data?.adms.map((province) => {
									return (
										<Box
											key={province.admCode}
											className='flex items-center rounded border border-solid border-[#E9ECEE]'
										>
											<span className='w-[27%] p-2 pl-4 text-sm font-medium text-[#333333]'>
												{province.admName[language]}
											</span>
											<span className='flex w-[27%] items-center justify-center p-2 text-sm font-medium text-[#333333]'>
												{province.year1Area[areaUnit]}
											</span>
											<Box className='flex w-[46%] items-center justify-center gap-2 p-2'>
												<Box className='flex items-center gap-1'>
													<Box className='flex flex-col items-center gap-0.5'>
														<div
															className={classNames(
																'h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-[#DEE2E6]',
																{
																	'!border-b-[#48B10D]':
																		Math.sign(
																			province.change.totalChange[areaUnit],
																		) === 1,
																},
															)}
														></div>
														<div
															className={classNames(
																'h-0 w-0 border-4 border-b-0 border-solid border-transparent border-t-[#DEE2E6]',
																{
																	'!border-t-[#EF5A56]':
																		Math.sign(
																			province.change.totalChange[areaUnit],
																		) === -1,
																},
															)}
														></div>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>
														{Math.abs(province.change.totalChange[areaUnit])}
													</span>
												</Box>
												<Box className='flex items-center gap-1'>
													<span className='text-sm font-medium text-[#333333]'>{'('}</span>
													<Box className='flex items-center gap-1'>
														<AddCircleOutline className='!h-3 !w-3 text-[#8DB9AA]' />
														<span className='text-sm font-medium text-[#333333]'>
															{province.change.increase[areaUnit]}
														</span>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>{'/'}</span>
													<Box className='flex items-center gap-1'>
														<RemoveCircleOutline className='!h-3 !w-3 text-[#EF5A56]' />
														<span className='text-sm font-medium text-[#333333]'>
															{province.change.decrease[areaUnit]}
														</span>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>{')'}</span>
												</Box>
											</Box>
										</Box>
									)
								})}
							</Box>
						</Box>
					</Box>
					<span className='text-[10px] font-medium text-[#333333]'>{`หน่วยพื้นที่ : ${t(areaUnit)}`}</span>
				</Box>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex h-[400px] w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					<Box className='flex flex-col gap-4'>
						<Typography className='text-lg font-medium text-[#333333]'>
							ข้อมูลพื้นที่ปลูกทุเรียนจังหวัดจันทบุรีที่เปลี่ยนแปลง
						</Typography>
						<Box className='flex h-[274px] flex-col gap-1'>
							<Box className='flex items-center rounded bg-[#F0F2F4]'>
								<span className='w-[27%] p-4 pr-2 text-sm font-medium text-[#333333]'>พื้นที่</span>
								<span className='flex w-[27%] items-center justify-center px-2 py-4 text-sm font-medium text-[#333333]'>
									{`พื้นที่ปลูก (${compareDistrictData?.data?.year1[language].substring(2, 4)})`}
								</span>
								<span className='flex w-[46%] items-center justify-center px-2 py-4 text-sm font-medium text-[#333333]'>
									{`พื้นที่เปลี่ยนแปลง (${compareDistrictData?.data?.year1[language].substring(2, 4)}/${compareDistrictData?.data?.year2[language].substring(2, 4)})`}
								</span>
							</Box>
							<Box className='flex flex-col gap-1 overflow-auto'>
								{compareDistrictData?.data?.adms.map((district) => {
									return (
										<Box
											key={district.admCode}
											className='flex items-center rounded border border-solid border-[#E9ECEE]'
										>
											<span className='w-[27%] p-2 pl-4 text-sm font-medium text-[#333333]'>
												{district.admName[language]}
											</span>
											<span className='flex w-[27%] items-center justify-center p-2 text-sm font-medium text-[#333333]'>
												{district.year1Area[areaUnit]}
											</span>
											<Box className='flex w-[46%] items-center justify-center gap-2 p-2'>
												<Box className='flex items-center gap-1'>
													<Box className='flex flex-col items-center gap-0.5'>
														<div
															className={classNames(
																'h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-[#DEE2E6]',
																{
																	'!border-b-[#48B10D]':
																		Math.sign(
																			district.change.totalChange[areaUnit],
																		) === 1,
																},
															)}
														></div>
														<div
															className={classNames(
																'h-0 w-0 border-4 border-b-0 border-solid border-transparent border-t-[#DEE2E6]',
																{
																	'!border-t-[#EF5A56]':
																		Math.sign(
																			district.change.totalChange[areaUnit],
																		) === -1,
																},
															)}
														></div>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>
														{Math.abs(district.change.totalChange[areaUnit])}
													</span>
												</Box>
												<Box className='flex items-center gap-1'>
													<span className='text-sm font-medium text-[#333333]'>{'('}</span>
													<Box className='flex items-center gap-1'>
														<AddCircleOutline className='!h-3 !w-3 text-[#8DB9AA]' />
														<span className='text-sm font-medium text-[#333333]'>
															{district.change.increase[areaUnit]}
														</span>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>{'/'}</span>
													<Box className='flex items-center gap-1'>
														<RemoveCircleOutline className='!h-3 !w-3 text-[#EF5A56]' />
														<span className='text-sm font-medium text-[#333333]'>
															{district.change.decrease[areaUnit]}
														</span>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>{')'}</span>
												</Box>
											</Box>
										</Box>
									)
								})}
							</Box>
						</Box>
					</Box>
					<span className='text-[10px] font-medium text-[#333333]'>{`หน่วยพื้นที่ : ${t(areaUnit)}`}</span>
				</Box>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex h-[400px] w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					<Box className='flex flex-col gap-4'>
						<Typography className='text-lg font-medium text-[#333333]'>
							ข้อมูลพื้นที่ปลูกทุเรียนอำเภอขลุงที่เปลี่ยนแปลง
						</Typography>
						<Box className='flex h-[274px] flex-col gap-1'>
							<Box className='flex items-center rounded bg-[#F0F2F4]'>
								<span className='w-[27%] p-4 pr-2 text-sm font-medium text-[#333333]'>พื้นที่</span>
								<span className='flex w-[27%] items-center justify-center px-2 py-4 text-sm font-medium text-[#333333]'>
									{`พื้นที่ปลูก (${compareSubDistrictData?.data?.year1[language].substring(2, 4)})`}
								</span>
								<span className='flex w-[46%] items-center justify-center px-2 py-4 text-sm font-medium text-[#333333]'>
									{`พื้นที่เปลี่ยนแปลง (${compareSubDistrictData?.data?.year1[language].substring(2, 4)}/${compareSubDistrictData?.data?.year2[language].substring(2, 4)})`}
								</span>
							</Box>
							<Box className='flex flex-col gap-1 overflow-auto'>
								{compareSubDistrictData?.data?.adms.map((subDistrict) => {
									return (
										<Box
											key={subDistrict.admCode}
											className='flex items-center rounded border border-solid border-[#E9ECEE]'
										>
											<span className='w-[27%] p-2 pl-4 text-sm font-medium text-[#333333]'>
												{subDistrict.admName[language]}
											</span>
											<span className='flex w-[27%] items-center justify-center p-2 text-sm font-medium text-[#333333]'>
												{subDistrict.year1Area[areaUnit]}
											</span>
											<Box className='flex w-[46%] items-center justify-center gap-2 p-2'>
												<Box className='flex items-center gap-1'>
													<Box className='flex flex-col items-center gap-0.5'>
														<div
															className={classNames(
																'h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-[#DEE2E6]',
																{
																	'!border-b-[#48B10D]':
																		Math.sign(
																			subDistrict.change.totalChange[areaUnit],
																		) === 1,
																},
															)}
														></div>
														<div
															className={classNames(
																'h-0 w-0 border-4 border-b-0 border-solid border-transparent border-t-[#DEE2E6]',
																{
																	'!border-t-[#EF5A56]':
																		Math.sign(
																			subDistrict.change.totalChange[areaUnit],
																		) === -1,
																},
															)}
														></div>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>
														{Math.abs(subDistrict.change.totalChange[areaUnit])}
													</span>
												</Box>
												<Box className='flex items-center gap-1'>
													<span className='text-sm font-medium text-[#333333]'>{'('}</span>
													<Box className='flex items-center gap-1'>
														<AddCircleOutline className='!h-3 !w-3 text-[#8DB9AA]' />
														<span className='text-sm font-medium text-[#333333]'>
															{subDistrict.change.increase[areaUnit]}
														</span>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>{'/'}</span>
													<Box className='flex items-center gap-1'>
														<RemoveCircleOutline className='!h-3 !w-3 text-[#EF5A56]' />
														<span className='text-sm font-medium text-[#333333]'>
															{subDistrict.change.decrease[areaUnit]}
														</span>
													</Box>
													<span className='text-sm font-medium text-[#333333]'>{')'}</span>
												</Box>
											</Box>
										</Box>
									)
								})}
							</Box>
						</Box>
					</Box>
					<span className='text-[10px] font-medium text-[#333333]'>{`หน่วยพื้นที่ : ${t(areaUnit)}`}</span>
				</Box>
			</Box>
		</Paper>
	)
}

export default CompareTable
