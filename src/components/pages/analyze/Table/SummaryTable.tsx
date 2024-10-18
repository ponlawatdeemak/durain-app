import React, { useCallback } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { GetSummaryOverviewDtoOut } from '@/api/analyze/dto.out.dto'
import useAreaUnit from '@/store/area-unit'
import useSearchAnalyze from '../Main/context'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'
import classNames from 'classnames'
import { Box } from '@mui/material'
import useResponsive from '@/hook/responsive'
import { Popup } from 'maplibre-gl'

interface SummaryTableProps {
	summaryOverviewData: GetSummaryOverviewDtoOut | undefined
	popup: Popup
}

const SummaryTable: React.FC<SummaryTableProps> = ({ summaryOverviewData, popup }) => {
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const handleCodeClick = useCallback(
		(admCode: number) => {
			if (admCode.toString().length === 6) {
				const provinceId = String(admCode).substring(0, 2)
				const districtId = String(admCode).substring(0, 4)
				setQueryParams({
					...queryParams,
					provinceId: Number(provinceId),
					districtId: Number(districtId),
					subDistrictId: Number(admCode),
				})
			} else if (admCode.toString().length === 4) {
				const provinceId = String(admCode).substring(0, 2)
				setQueryParams({
					...queryParams,
					provinceId: Number(provinceId),
					districtId: Number(admCode),
					subDistrictId: undefined,
				})
			} else if (admCode.toString().length === 2) {
				setQueryParams({
					...queryParams,
					provinceId: Number(admCode),
					districtId: undefined,
					subDistrictId: undefined,
				})
			}
			popup.remove()
		},
		[queryParams, setQueryParams],
	)

	return (
		<Box className='box-border flex w-full xl:relative xl:h-[274px]'>
			<TableContainer className='h-full !w-[calc(100vw-98px)] overflow-x-auto px-[1px] sm:!w-[calc(100vw-146px)] lg:!w-[calc(100vw-236px)] xl:absolute xl:!w-[calc(100vw/3-112px)] xl:pr-2'>
				<Table className='border-separate !border-spacing-y-[6px]' stickyHeader>
					<TableHead>
						<TableRow className='[&>th:first-child]:rounded-l [&>th:last-child]:rounded-r [&>th]:border-none [&>th]:bg-[#F0F2F4] [&>th]:text-base [&>th]:text-[#333333] [&>th]:!outline [&>th]:!outline-1 [&>th]:!outline-[#F0F2F4]'>
							<TableCell className='min-w-[130px] !pr-2'>{t('area')}</TableCell>
							{summaryOverviewData?.overall?.ageClass?.map((item) => {
								return (
									<TableCell key={item.id} align='center' className='w-[21.65%] min-w-[100px] !px-2'>
										{item.name[language]}
									</TableCell>
								)
							})}
						</TableRow>
					</TableHead>
					<TableBody>
						{summaryOverviewData?.adms?.map((data) => {
							return (
								<TableRow
									key={data.admCode}
									className={classNames(
										'rounded !outline !outline-1 !outline-[#E9ECEE] hover:cursor-pointer [&>td]:border-b-0 [&>td]:text-sm [&>td]:font-medium [&>td]:text-[#333333]',
										{
											'bg-[#F2F6F0]':
												data.admCode === queryParams?.provinceId ||
												data.admCode == queryParams?.districtId ||
												data.admCode == queryParams?.subDistrictId,
										},
									)}
									onClick={() => handleCodeClick(data.admCode)}
								>
									<TableCell className='!flex min-w-[130px] grow !py-2 !pr-2'>
										{data?.admName?.[language]}
									</TableCell>
									{data.ageClass?.map((item) => {
										return (
											<TableCell
												key={item.id}
												align='center'
												className='w-[21.65%] min-w-[100px] !p-2'
											>
												{Number(item?.area?.[areaUnit]?.toFixed(2) || 0)?.toLocaleString()}
											</TableCell>
										)
									})}
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	)
}

export default SummaryTable
