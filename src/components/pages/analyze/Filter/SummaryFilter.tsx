import service from '@/api'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useMemo } from 'react'
import useSearchAnalyze from '../Main/context'
import SummaryTable from '../Table/SummaryTable'
import { AreaUnitText } from '@/enum'
import { Popup } from 'maplibre-gl'

interface SummaryFilterProps {
	popup: Popup
}

const SummaryFilter: React.FC<SummaryFilterProps> = ({ popup }) => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	useEffect(() => {
		setQueryParams({ ...queryParams, provinceId: undefined, districtId: undefined, subDistrictId: undefined })
	}, [])

	const { data: summaryProvinceData, isLoading: isSummaryProvinceDataLoading } = useQuery({
		queryKey: ['getSummaryProvince', queryParams?.year],
		queryFn: () => service.analyze.getSummaryOverview({ year: queryParams?.year ?? new Date().getFullYear() }),
	})

	const { data: summaryDistrictData, isLoading: isSummaryDistrictDataLoading } = useQuery({
		queryKey: ['getSummaryDistrict', queryParams?.year, queryParams?.provinceId],
		queryFn: async () => {
			const provinceId = (
				await service.analyze.getSummaryOverview({
					year: queryParams?.year ?? new Date().getFullYear(),
				})
			)?.data?.adms?.[0]?.admCode

			return await service.analyze.getSummaryOverview({
				year: queryParams?.year ?? new Date().getFullYear(),
				admCode: queryParams?.provinceId ?? provinceId,
			})
		},
	})

	const { data: summarySubDistrictData, isLoading: isSummarySubDistrictDataLoading } = useQuery({
		queryKey: ['getSummarySubDistrict', queryParams?.year, queryParams?.provinceId, queryParams?.districtId],
		queryFn: async () => {
			const provinceId = (
				await service.analyze.getSummaryOverview({
					year: queryParams?.year ?? new Date().getFullYear(),
				})
			)?.data?.adms?.[0]?.admCode

			const districtId = (
				await service.analyze.getSummaryOverview({
					year: queryParams?.year ?? new Date().getFullYear(),
					admCode: queryParams?.provinceId ?? provinceId,
				})
			)?.data?.adms?.[0]?.admCode

			return await service.analyze.getSummaryOverview({
				year: queryParams?.year ?? new Date().getFullYear(),
				admCode: queryParams?.districtId ?? districtId,
			})
		},
	})

	const displayProvinceTitle = useMemo(() => {
		if (!queryParams?.provinceId) {
			if (language === 'en') {
				return `${t('durianPlantationData')} ${summaryProvinceData?.data?.adms?.[0]?.admName?.[language]} ${t('province')}`
			} else {
				return `${t('durianPlantationData')}${t('province')}${summaryProvinceData?.data?.adms?.[0]?.admName?.[language]}`
			}
		}

		if (language === 'en') {
			return `${t('durianPlantationData')} ${summaryProvinceData?.data?.adms?.find((province) => Number(province.admCode) === queryParams?.provinceId)?.admName?.[language]} ${t('province')}`
		} else {
			return `${t('durianPlantationData')}${t('province')}${summaryProvinceData?.data?.adms?.find((province) => Number(province.admCode) === queryParams?.provinceId)?.admName?.[language]}`
		}
	}, [queryParams.provinceId, language, t, summaryProvinceData])

	const displayDistrictTitle = useMemo(() => {
		if (!queryParams?.districtId) {
			if (language === 'en') {
				return `${t('durianPlantationData')} ${summaryDistrictData?.data?.adms?.[0]?.admName?.[language]} ${t('district')}`
			} else {
				return `${t('durianPlantationData')}${t('district')}${summaryDistrictData?.data?.adms?.[0]?.admName?.[language]}`
			}
		}

		if (language === 'en') {
			return `${t('durianPlantationData')} ${summaryDistrictData?.data?.adms?.find((district) => Number(district.admCode) === queryParams?.districtId)?.admName[language]} ${t('district')}`
		} else {
			return `${t('durianPlantationData')}${t('district')}${summaryDistrictData?.data?.adms?.find((district) => Number(district.admCode) === queryParams?.districtId)?.admName[language]}`
		}
	}, [queryParams.districtId, language, t, summaryDistrictData])

	return (
		<Paper className='flex gap-4 !rounded-lg !bg-[#D5E2DC] p-4 max-xl:flex-col'>
			<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
				{isSummaryProvinceDataLoading ? (
					<div className='flex h-[357px] flex-col items-center justify-center bg-transparent lg:bg-white'>
						<CircularProgress size={60} color='primary' />
					</div>
				) : (
					<>
						<Box className='box-border flex h-full flex-col justify-between'>
							<Typography className='!mb-4 !text-lg !font-medium !text-[#333333]'>
								{t('analyze:durianPlantationAllAreas')}
							</Typography>
							<SummaryTable summaryOverviewData={summaryProvinceData?.data} popup={popup} />
						</Box>
						<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
					</>
				)}
			</Box>
			<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
				{isSummaryDistrictDataLoading ? (
					<div className='flex h-[357px] flex-col items-center justify-center bg-transparent lg:bg-white'>
						<CircularProgress size={60} color='primary' />
					</div>
				) : (
					<>
						<Box className='box-border flex h-full flex-col justify-between'>
							<Typography className='!mb-4 !text-lg !font-medium !text-[#333333]'>
								{displayProvinceTitle}
							</Typography>
							<SummaryTable summaryOverviewData={summaryDistrictData?.data} popup={popup} />
						</Box>
						<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
					</>
				)}
			</Box>
			<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
				{isSummarySubDistrictDataLoading ? (
					<div className='flex h-[357px] flex-col items-center justify-center bg-transparent lg:bg-white'>
						<CircularProgress size={60} color='primary' />
					</div>
				) : (
					<>
						<Box className='box-border flex h-full flex-col justify-between'>
							<Typography className='!mb-4 !text-lg !font-medium !text-[#333333]'>
								{displayDistrictTitle}
							</Typography>
							<SummaryTable summaryOverviewData={summarySubDistrictData?.data} popup={popup} />
						</Box>
						<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
					</>
				)}
			</Box>
		</Paper>
	)
}

export default SummaryFilter
