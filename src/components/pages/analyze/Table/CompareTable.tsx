import React, { useCallback } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { GetCompareOverviewDtoOut } from '@/api/analyze/dto.out.dto'
import useAreaUnit from '@/store/area-unit'
import useSearchAnalyze from '../Main/context'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'
import classNames from 'classnames'
import { Box } from '@mui/material'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'

interface CompareTableProps {
	compareOverviewData: GetCompareOverviewDtoOut | undefined
}

const CompareTable: React.FC<CompareTableProps> = ({ compareOverviewData }) => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const handleCodeClick = useCallback(
		(admCode: number) => {
			if (admCode.toString().length === 6) {
				setQueryParams({ ...queryParams, subDistrictId: Number(admCode) })
			} else if (admCode.toString().length === 4) {
				setQueryParams({ ...queryParams, districtId: Number(admCode), subDistrictId: undefined })
			} else if (admCode.toString().length === 2) {
				setQueryParams({
					...queryParams,
					provinceId: Number(admCode),
					districtId: undefined,
					subDistrictId: undefined,
				})
			}
		},
		[queryParams, setQueryParams],
	)

	return (
		<Box className='box-border flex w-full xl:relative xl:h-[274px]'>
			<TableContainer className='h-full !w-[calc(100vw-98px)] overflow-x-auto px-[1px] sm:!w-[calc(100vw-146px)] lg:!w-[calc(100vw-236px)] xl:absolute xl:!w-[calc(100vw/3-112px)] xl:pr-2'>
				<Table className='border-separate !border-spacing-y-[6px]' stickyHeader>
					<TableHead>
						<TableRow className='[&>th:first-child]:rounded-l [&>th:last-child]:rounded-r [&>th]:border-none [&>th]:bg-[#F0F2F4] [&>th]:text-sm [&>th]:text-[#333333] [&>th]:!outline [&>th]:!outline-1 [&>th]:!outline-[#F0F2F4]'>
							<TableCell className='w-[27%] min-w-[130px] !pr-2'>{t('area')}</TableCell>
							<TableCell align='center' className='w-[27%] min-w-[100px] !px-2'>
								{`${t('plantationArea')} (${compareOverviewData?.year1[language].substring(2, 4)})`}
							</TableCell>
							<TableCell align='center' className='min-w-[220px] !px-2'>
								{`${t('analyze:areaChanges')} (${compareOverviewData?.year1[language].substring(2, 4)}/${compareOverviewData?.year2[language].substring(2, 4)})`}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{compareOverviewData?.adms?.map((data) => {
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
									<TableCell className='w-[27%] min-w-[130px] !py-2 !pr-2'>
										{data?.admName?.[language]}
									</TableCell>
									<TableCell align='center' className='w-[27%] min-w-[100px] !p-2'>
										{Number(data?.year1Area?.[areaUnit]?.toFixed(2) || 0)?.toLocaleString()}
									</TableCell>
									<TableCell
										align='center'
										className='!flex min-w-[220px] grow items-center justify-center gap-2 !p-2'
									>
										<Box className='flex items-center gap-1'>
											<Box className='flex flex-col items-center gap-0.5'>
												<div
													className={classNames(
														'h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-[#DEE2E6]',
														{
															'!border-b-[#48B10D]':
																Math.sign(data?.change?.totalChange?.[areaUnit]) === 1,
														},
													)}
												></div>
												<div
													className={classNames(
														'h-0 w-0 border-4 border-b-0 border-solid border-transparent border-t-[#DEE2E6]',
														{
															'!border-t-[#EF5A56]':
																Math.sign(data?.change?.totalChange?.[areaUnit]) === -1,
														},
													)}
												></div>
											</Box>
											<span className='text-sm font-medium text-[#333333]'>
												{Number(
													Math.abs(data?.change?.totalChange?.[areaUnit])?.toFixed(2) || 0,
												)?.toLocaleString()}
											</span>
										</Box>
										<Box className='flex items-center gap-1'>
											<span className='text-sm font-medium text-[#333333]'>{'('}</span>
											<Box className='flex items-center gap-1'>
												<AddCircleOutline className='!h-3 !w-3 text-[#8DB9AA]' />
												<span className='text-sm font-medium text-[#333333]'>
													{Number(
														data?.change?.increase?.[areaUnit]?.toFixed(2) || 0,
													)?.toLocaleString()}
												</span>
											</Box>
											<span className='text-sm font-medium text-[#333333]'>{'/'}</span>
											<Box className='flex items-center gap-1'>
												<RemoveCircleOutline className='!h-3 !w-3 text-[#EF5A56]' />
												<span className='text-sm font-medium text-[#333333]'>
													{Number(
														data?.change?.decrease?.[areaUnit]?.toFixed(2) || 0,
													)?.toLocaleString()}
												</span>
											</Box>
											<span className='text-sm font-medium text-[#333333]'>{')'}</span>
										</Box>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	)
}

export default CompareTable
