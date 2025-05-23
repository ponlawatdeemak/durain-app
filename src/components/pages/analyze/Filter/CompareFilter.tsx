import useAreaUnit from '@/store/area-unit'
import {
	Box,
	CircularProgress,
	FormControl,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import useSearchAnalyze from '../Main/context'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'
import { ExpandMore } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import CompareTable from '../Table/CompareTable'
import { AreaUnitText } from '@/enum'
import { Popup } from 'maplibre-gl'

interface CompareFilterProps {
	popup: Popup
}

const CompareFilter: React.FC<CompareFilterProps> = ({ popup }) => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const [yearStart, setYearStart] = useState<number>(new Date().getFullYear())
	const [yearEnd, setYearEnd] = useState<number>(new Date().getFullYear())

	const { data: durianAvailabilityData, isLoading: _isDurianAvailabilityDataLoading } = useQuery({
		queryKey: ['getDurianAvailabilityCompare'],
		queryFn: () => service.analyze.getDurianAvailability(),
	})

	const { data: compareProvinceData, isLoading: isCompareProvinceDataLoading } = useQuery({
		queryKey: ['getCompareProvince', queryParams?.yearStart, queryParams?.yearEnd],
		queryFn: () =>
			service.analyze.getCompareOverview({
				year1: queryParams?.yearStart ?? yearStart,
				year2: queryParams?.yearEnd ?? yearEnd,
			}),
		enabled: !!queryParams?.yearStart && !!queryParams?.yearEnd,
	})

	const { data: compareDistrictData, isLoading: isCompareDistrictDataLoading } = useQuery({
		queryKey: ['getCompareDistrict', queryParams?.yearStart, queryParams?.yearEnd, queryParams?.provinceId],
		queryFn: async () => {
			const provinceId = (
				await service.analyze.getCompareOverview({
					year1: queryParams?.yearStart ?? yearStart,
					year2: queryParams?.yearEnd ?? yearEnd,
				})
			)?.data?.adms?.[0]?.admCode

			return await service.analyze.getCompareOverview({
				year1: queryParams?.yearStart ?? yearStart,
				year2: queryParams?.yearEnd ?? yearEnd,
				admCode: queryParams?.provinceId ?? provinceId,
			})
		},
		enabled: !!queryParams?.yearStart && !!queryParams?.yearEnd,
	})

	const { data: compareSubDistrictData, isLoading: isCompareSubDistrictDataLoading } = useQuery({
		queryKey: [
			'getCompareSubDistrict',
			queryParams?.yearStart,
			queryParams?.yearEnd,
			queryParams?.provinceId,
			queryParams?.districtId,
		],
		queryFn: async () => {
			const provinceId = (
				await service.analyze.getCompareOverview({
					year1: queryParams?.yearStart ?? yearStart,
					year2: queryParams?.yearEnd ?? yearEnd,
				})
			)?.data?.adms?.[0]?.admCode

			const districtId = (
				await service.analyze.getCompareOverview({
					year1: queryParams?.yearStart ?? yearStart,
					year2: queryParams?.yearEnd ?? yearEnd,
					admCode: queryParams?.provinceId ?? provinceId,
				})
			)?.data?.adms?.[0]?.admCode

			return await service.analyze.getCompareOverview({
				year1: queryParams?.yearStart ?? yearStart,
				year2: queryParams?.yearEnd ?? yearEnd,
				admCode: queryParams?.districtId ?? districtId,
			})
		},
		enabled: !!queryParams?.yearStart && !!queryParams?.yearEnd,
	})

	useEffect(() => {
		const initYearEnd = durianAvailabilityData?.data
			?.sort((a, b) => b.year - a.year)
			.find((item) => item.year < new Date().getFullYear())

		setQueryParams({ ...queryParams, yearStart: new Date().getFullYear(), yearEnd: initYearEnd?.year })
		setYearStart(new Date().getFullYear())
		setYearEnd(initYearEnd?.year ? initYearEnd.year : new Date().getFullYear())
	}, [durianAvailabilityData])

	useEffect(() => {
		setQueryParams({ ...queryParams, provinceId: undefined, districtId: undefined, subDistrictId: undefined })
	}, [])

	const handleYearStartChange = (event: SelectChangeEvent<number>) => {
		if (event.target.value) {
			setQueryParams({ ...queryParams, yearStart: event.target.value as number })
			setYearStart(event.target.value as number)
			popup.remove()
		}
	}

	const handleYearEndChange = (event: SelectChangeEvent<number>) => {
		if (event.target.value) {
			setQueryParams({ ...queryParams, yearEnd: event.target.value as number })
			setYearEnd(event.target.value as number)
			popup.remove()
		}
	}

	const displayProvinceTitle = useMemo(() => {
		if (!queryParams?.provinceId) {
			if (language === 'en') {
				return `${t('analyze:changesIn')} ${t('durianPlantationData')} ${compareProvinceData?.data?.adms?.[0]?.admName?.[language]} ${t('province')}`
			} else {
				return `${t('durianPlantationData')}${t('province')}${compareProvinceData?.data?.adms?.[0]?.admName?.[language]}${t('analyze:changesIn')}`
			}
		}

		if (language === 'en') {
			return `${t('analyze:changesIn')} ${t('durianPlantationData')} ${compareProvinceData?.data?.adms?.find((province) => Number(province.admCode) === queryParams?.provinceId)?.admName?.[language]} ${t('province')}`
		} else {
			return `${t('durianPlantationData')}${t('province')}${compareProvinceData?.data?.adms?.find((province) => Number(province.admCode) === queryParams?.provinceId)?.admName?.[language]}${t('analyze:changesIn')}`
		}
	}, [queryParams.provinceId, language, t, compareProvinceData])

	const displayDistrictTitle = useMemo(() => {
		if (!queryParams?.districtId) {
			if (language === 'en') {
				return `${t('analyze:changesIn')} ${t('durianPlantationData')} ${compareDistrictData?.data?.adms?.[0]?.admName?.[language]} ${t('district')}`
			} else {
				return `${t('durianPlantationData')}${t('district')}${compareDistrictData?.data?.adms?.[0]?.admName?.[language]}${t('analyze:changesIn')}`
			}
		}

		if (language === 'en') {
			return `${t('analyze:changesIn')} ${t('durianPlantationData')} ${compareDistrictData?.data?.adms?.find((district) => Number(district.admCode) === queryParams?.districtId)?.admName?.[language]} ${t('district')}`
		} else {
			return `${t('durianPlantationData')}${t('district')}${compareDistrictData?.data?.adms?.find((district) => Number(district.admCode) === queryParams?.districtId)?.admName?.[language]}${t('analyze:changesIn')}`
		}
	}, [queryParams.districtId, language, t, compareDistrictData])

	return (
		<Paper className='flex flex-col items-center gap-4 !rounded-lg !bg-[#D5E2DC] p-4'>
			<Box className='flex flex-col items-center gap-4 py-2 sm:flex-row sm:px-6'>
				<span className='text-base font-medium text-[#333333]'>{t('analyze:comparisonYear')}</span>
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
					<span className='text-base font-medium text-[#333333]'>{t('analyze:with')}</span>
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
			<Box className='flex w-full gap-4 max-xl:flex-col'>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					{isCompareProvinceDataLoading ? (
						<div className='flex h-[357px] flex-col items-center justify-center bg-transparent lg:bg-white'>
							<CircularProgress size={60} color='primary' />
						</div>
					) : (
						<>
							<Box className='box-border flex h-full flex-col justify-between'>
								<Typography className='!mb-4 !text-lg !font-medium !text-[#333333]'>
									{t('analyze:durianPlantationAllAreas')}
								</Typography>
								<CompareTable compareOverviewData={compareProvinceData?.data} popup={popup} />
							</Box>
							<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
						</>
					)}
				</Box>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					{isCompareDistrictDataLoading ? (
						<div className='flex h-[357px] flex-col items-center justify-center bg-transparent lg:bg-white'>
							<CircularProgress size={60} color='primary' />
						</div>
					) : (
						<>
							<Box className='box-border flex h-full flex-col justify-between'>
								<Typography className='!mb-4 !text-lg !font-medium !text-[#333333]'>
									{displayProvinceTitle}
								</Typography>
								<CompareTable compareOverviewData={compareDistrictData?.data} popup={popup} />
							</Box>
							<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
						</>
					)}
				</Box>
				<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
					{isCompareSubDistrictDataLoading ? (
						<div className='flex h-[357px] flex-col items-center justify-center bg-transparent lg:bg-white'>
							<CircularProgress size={60} color='primary' />
						</div>
					) : (
						<>
							<Box className='box-border flex h-full flex-col justify-between'>
								<Typography className='!mb-4 !text-lg !font-medium !text-[#333333]'>
									{displayDistrictTitle}
								</Typography>
								<CompareTable compareOverviewData={compareSubDistrictData?.data} popup={popup} />
							</Box>
							<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
						</>
					)}
				</Box>
			</Box>
		</Paper>
	)
}

export default CompareFilter
