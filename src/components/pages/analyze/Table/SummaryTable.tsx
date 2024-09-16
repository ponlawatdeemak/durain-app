import service from '@/api'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import { Box, Paper, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import React from 'react'
import useSearchAnalyze from '../Main/context'

interface SummaryTableProps {
	orderBy: string
}

const SummaryTable: React.FC<SummaryTableProps> = ({ orderBy }) => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const { data: summaryProvinceData, isLoading: isSummaryProvinceDataLoading } = useQuery({
		queryKey: ['getSummaryProvince'],
		queryFn: () => service.analyze.getSummaryOverview({ year: 2024 }),
	})

	const { data: summaryDistrictData, isLoading: isSummaryDistrictDataLoading } = useQuery({
		queryKey: ['getSummaryDistrict'],
		queryFn: () => service.analyze.getSummaryOverview({ year: 2024, admCode: 22 }),
	})

	const { data: summarySubDistrictData, isLoading: isSummarySubDistrictDataLoading } = useQuery({
		queryKey: ['getSummarySubDistrict'],
		queryFn: () => service.analyze.getSummaryOverview({ year: 2024, admCode: 2202 }),
	})

	return (
		<Paper
			className={classNames('flex gap-4 !rounded-lg !bg-[#D5E2DC] p-4 max-lg:flex-col', {
				hidden: orderBy !== 'age',
			})}
		>
			<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex h-[400px] w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
				<Box className='flex flex-col gap-4'>
					<Typography className='text-lg font-medium text-[#333333]'>
						ข้อมูลพื้นที่ปลูกทุเรียนทุกพื้นที่
					</Typography>
					<Box className='flex h-[274px] flex-col gap-1'>
						<Box className='flex items-center rounded bg-[#F0F2F4]'>
							<span className='w-[130px] shrink-0 p-4 pr-2 text-base font-medium text-[#333333]'>
								พื้นที่
							</span>
							<Box className='flex w-full items-center'>
								{summaryProvinceData?.data?.overall.ageClass.map((item) => {
									return (
										<span
											key={item.id}
											className='flex w-full items-center justify-center px-2 py-4 text-base font-medium text-[#333333]'
										>
											{item.name[language]}
										</span>
									)
								})}
							</Box>
						</Box>
						<Box className='flex flex-col gap-1 overflow-auto'>
							{summaryProvinceData?.data?.adms.map((province) => {
								return (
									<Box
										key={province.admCode}
										className='flex items-center rounded border border-solid border-[#E9ECEE]'
									>
										<span className='w-[130px] shrink-0 p-2 pl-4 text-sm font-medium text-[#333333]'>
											{province.admName[language]}
										</span>
										<Box className='flex w-full items-center'>
											{province.ageClass.map((item) => {
												return (
													<span
														key={item.id}
														className='flex w-full items-center justify-center p-2 text-sm font-medium text-[#333333]'
													>
														{item.area[areaUnit]}
													</span>
												)
											})}
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
						ข้อมูลพื้นที่ปลูกทุเรียนจังหวัดจันทบุรี
					</Typography>
					<Box className='flex h-[274px] flex-col gap-1'>
						<Box className='flex items-center rounded bg-[#F0F2F4]'>
							<span className='w-[130px] shrink-0 p-4 pr-2 text-base font-medium text-[#333333]'>
								พื้นที่
							</span>
							<Box className='flex w-full items-center'>
								{summaryDistrictData?.data?.overall.ageClass.map((item) => {
									return (
										<span
											key={item.id}
											className='flex w-full items-center justify-center px-2 py-4 text-base font-medium text-[#333333]'
										>
											{item.name[language]}
										</span>
									)
								})}
							</Box>
						</Box>
						<Box className='flex flex-col gap-1 overflow-auto'>
							{summaryDistrictData?.data?.adms.map((district) => {
								return (
									<Box
										key={district.admCode}
										className='flex items-center rounded border border-solid border-[#E9ECEE]'
									>
										<span className='w-[130px] shrink-0 p-2 pl-4 text-sm font-medium text-[#333333]'>
											{district.admName[language]}
										</span>
										<Box className='flex w-full items-center'>
											{district.ageClass.map((item) => {
												return (
													<span
														key={item.id}
														className='flex w-full items-center justify-center p-2 text-sm font-medium text-[#333333]'
													>
														{item.area[areaUnit]}
													</span>
												)
											})}
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
						ข้อมูลพื้นที่ปลูกทุเรียนอำเภอขลุง
					</Typography>
					<Box className='flex h-[274px] flex-col gap-1'>
						<Box className='flex items-center rounded bg-[#F0F2F4]'>
							<span className='w-[130px] shrink-0 p-4 pr-2 text-base font-medium text-[#333333]'>
								พื้นที่
							</span>
							<Box className='flex w-full items-center'>
								{summarySubDistrictData?.data?.overall.ageClass.map((item) => {
									return (
										<span
											key={item.id}
											className='flex w-full items-center justify-center px-2 py-4 text-base font-medium text-[#333333]'
										>
											{item.name[language]}
										</span>
									)
								})}
							</Box>
						</Box>
						<Box className='flex flex-col gap-1 overflow-auto'>
							{summarySubDistrictData?.data?.adms.map((subDistrict) => {
								return (
									<Box
										key={subDistrict.admCode}
										className='flex items-center rounded border border-solid border-[#E9ECEE]'
									>
										<span className='w-[130px] shrink-0 p-2 pl-4 text-sm font-medium text-[#333333]'>
											{subDistrict.admName[language]}
										</span>
										<Box className='flex w-full items-center'>
											{subDistrict.ageClass.map((item) => {
												return (
													<span
														key={item.id}
														className='flex w-full items-center justify-center p-2 text-sm font-medium text-[#333333]'
													>
														{item.area[areaUnit]}
													</span>
												)
											})}
										</Box>
									</Box>
								)
							})}
						</Box>
					</Box>
				</Box>
				<span className='text-[10px] font-medium text-[#333333]'>{`หน่วยพื้นที่ : ${t(areaUnit)}`}</span>
			</Box>
		</Paper>
	)
}

export default SummaryTable
