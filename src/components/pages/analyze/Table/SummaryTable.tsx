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

interface SummaryTableProps {
	summaryOverviewData: GetSummaryOverviewDtoOut | undefined
}

const SummaryTable: React.FC<SummaryTableProps> = ({ summaryOverviewData }) => {
	const { areaUnit } = useAreaUnit()
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const handleCodeClick = useCallback(
		(admCode: number) => {
			if (admCode.toString().length === 4) {
				setQueryParams({ ...queryParams, districtId: Number(admCode) })
			} else if (admCode.toString().length === 2) {
				setQueryParams({ ...queryParams, provinceId: Number(admCode) })
			}
		},
		[queryParams, setQueryParams],
	)

	return (
		<TableContainer className='h-full !w-[calc(100vw-98px)] overflow-x-auto sm:!w-[calc(100vw-146px)] lg:!w-[calc(100vw-236px)] xl:h-[274px] xl:!w-[calc(100vw/3-112px)]'>
			<Table>
				<TableHead>
					<TableRow className='!flex items-center overflow-hidden rounded !bg-[#F0F2F4]'>
						<TableCell className='flex min-w-[130px] grow !border-0 !bg-transparent !pr-2 !text-base !text-[#333333]'>
							{t('area')}
						</TableCell>
						{summaryOverviewData?.overall?.ageClass?.map((item) => {
							return (
								<TableCell
									key={item.id}
									align='center'
									className={classNames(
										'w-[21.65%] !border-0 !bg-transparent !px-2 !text-base !text-[#333333]',
										{
											'min-w-[100px]': language === 'en',
											'min-w-[80px]': language === 'th',
										},
									)}
								>
									{item.name[language]}
								</TableCell>
							)
						})}
					</TableRow>
				</TableHead>
				{/* <Box className='h-full overflow-y-auto xl:h-[218px]'> */}
				<TableBody className='mt-1 !flex flex-col gap-1'>
					{summaryOverviewData?.adms.map((data) => {
						return (
							<TableRow
								key={data.admCode}
								className={classNames(
									'!flex cursor-pointer items-center overflow-hidden rounded border border-solid border-[#E9ECEE]',
									{
										'bg-[#F2F6F0]':
											data.admCode === queryParams.provinceId ||
											data.admCode == queryParams.districtId,
									},
								)}
								onClick={() => handleCodeClick(data.admCode)}
							>
								<TableCell className='flex min-w-[130px] grow !border-0 !py-2 !pr-2 text-sm !font-medium !text-[#333333]'>
									{data.admName[language]}
								</TableCell>
								{data.ageClass.map((item) => {
									return (
										<TableCell
											key={item.id}
											align='center'
											className={classNames(
												'w-[21.65%] !border-0 !p-2 text-sm !font-medium !text-[#333333]',
												{
													'min-w-[100px]': language === 'en',
													'min-w-[80px]': language === 'th',
												},
											)}
										>
											{item.area[areaUnit]}
										</TableCell>
									)
								})}
							</TableRow>
						)
					})}
				</TableBody>
				{/* </Box> */}
			</Table>
		</TableContainer>
	)
}

export default SummaryTable
