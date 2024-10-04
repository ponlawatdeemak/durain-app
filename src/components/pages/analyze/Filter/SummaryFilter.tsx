import service from '@/api'
import { ResponseLanguage } from '@/api/interface'
import useAreaUnit from '@/store/area-unit'
import { Box, CircularProgress, Paper, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import React from 'react'
import useSearchAnalyze from '../Main/context'
import SummaryTable from '../Table/SummaryTable'
import { AreaUnitText } from '@/enum'

interface SummaryFilterProps {
	orderBy: string
}

const SummaryFilter: React.FC<SummaryFilterProps> = ({ orderBy }) => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const { data: summaryProvinceData, isLoading: isSummaryProvinceDataLoading } = useQuery({
		queryKey: ['getSummaryProvince', queryParams.year],
		queryFn: () => service.analyze.getSummaryOverview({ year: queryParams.year || new Date().getFullYear() }),
	})

	const { data: summaryDistrictData, isLoading: isSummaryDistrictDataLoading } = useQuery({
		queryKey: ['getSummaryDistrict', queryParams.year, queryParams.provinceId],
		queryFn: () =>
			service.analyze.getSummaryOverview({
				year: queryParams.year || new Date().getFullYear(),
				admCode: queryParams.provinceId,
			}),
		enabled: !!queryParams.provinceId,
	})

	const { data: summarySubDistrictData, isLoading: isSummarySubDistrictDataLoading } = useQuery({
		queryKey: ['getSummarySubDistrict', queryParams.year, queryParams.districtId],
		queryFn: () =>
			service.analyze.getSummaryOverview({
				year: queryParams.year || new Date().getFullYear(),
				admCode: queryParams.districtId,
			}),
		enabled: !!queryParams.districtId,
	})

	return (
		<Paper
			className={classNames('flex gap-4 !rounded-lg !bg-[#D5E2DC] p-4 max-xl:flex-col', {
				hidden: orderBy !== 'age',
			})}
		>
			<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
				<Box className='flex flex-col gap-4'>
					<Typography className='!text-lg !font-medium text-[#333333]'>
						{t('analyze:durianPlantationAllAreas')}
					</Typography>
					{isSummaryProvinceDataLoading ? (
						<div className='flex h-[274px] flex-col items-center justify-center bg-transparent lg:bg-white'>
							<CircularProgress size={60} color='primary' />
						</div>
					) : (
						<SummaryTable summaryOverviewData={summaryProvinceData?.data} />
					)}
				</Box>
				<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
			</Box>
			<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
				<Box className='flex flex-col gap-4'>
					<Typography className='!text-lg !font-medium text-[#333333]'>
						{`${t('durianPlantationData')}${language === 'th' ? t('province') : ' '}${summaryProvinceData?.data?.adms.find((province) => Number(province.admCode) === queryParams.provinceId)?.admName[language] || ''} ${language === 'en' ? t('province') : ''}`}
					</Typography>
					{isSummaryDistrictDataLoading ? (
						<div className='flex h-[274px] flex-col items-center justify-center bg-transparent lg:bg-white'>
							<CircularProgress size={60} color='primary' />
						</div>
					) : (
						<SummaryTable summaryOverviewData={summaryDistrictData?.data} />
					)}
				</Box>
				<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
			</Box>
			<Box className='shadow-[0_3px_8px_0_rgba(212, 220, 230, 1)] flex w-full flex-col gap-6 rounded-lg border border-solid border-[#E9ECEE] bg-white px-4 py-6'>
				<Box className='flex flex-col gap-4'>
					<Typography className='!text-lg !font-medium text-[#333333]'>
						{`${t('durianPlantationData')}${language === 'th' ? t('district') : ' '}${summaryDistrictData?.data?.adms.find((district) => Number(district.admCode) === queryParams.districtId)?.admName[language] || ''} ${language === 'en' ? t('district') : ' '}`}
					</Typography>
					{isSummarySubDistrictDataLoading ? (
						<div className='flex h-[274px] flex-col items-center justify-center bg-transparent lg:bg-white'>
							<CircularProgress size={60} color='primary' />
						</div>
					) : (
						<SummaryTable summaryOverviewData={summarySubDistrictData?.data} />
					)}
				</Box>
				<span className='text-[10px] font-medium text-[#333333]'>{`${t('areaUnit')} : ${t(AreaUnitText[areaUnit])}`}</span>
			</Box>
		</Paper>
	)
}

export default SummaryFilter
