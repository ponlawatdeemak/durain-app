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
			<Table stickyHeader aria-label='sticky table'>
				<TableHead>
					<TableRow className='!flex items-center overflow-hidden rounded !bg-[#F0F2F4]'>
						<TableCell className='w-[27%] min-w-[130px] !border-0 !bg-transparent !pr-2 !text-sm !text-[#333333]'>
							พื้นที่
						</TableCell>
						<TableCell
							align='center'
							className='w-[27%] min-w-[100px] !border-0 !bg-transparent !px-2 !text-sm !text-[#333333]'
						>
							{`พื้นที่ปลูก (${compareOverviewData?.year1[language].substring(2, 4)})`}
						</TableCell>
						<TableCell
							align='center'
							className='flex min-w-[220px] grow !border-0 !bg-transparent !px-2 !text-sm !text-[#333333]'
						>
							{`พื้นที่เปลี่ยนแปลง (${compareOverviewData?.year1[language].substring(2, 4)}/${compareOverviewData?.year2[language].substring(2, 4)})`}
						</TableCell>
					</TableRow>
				</TableHead>
				{/* <Box className='h-full overflow-y-auto xl:h-[218px]'> */}
				<TableBody className='mt-1 !flex flex-col gap-1'>
					{compareOverviewData?.adms.map((data) => {
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
								<TableCell className='w-[27%] min-w-[130px] !border-0 !py-2 !pr-2 text-sm !font-medium !text-[#333333]'>
									{data.admName[language]}
								</TableCell>
								<TableCell
									align='center'
									className='w-[27%] min-w-[100px] !border-0 !p-2 text-sm !font-medium !text-[#333333]'
								>
									{data.year1Area[areaUnit]}
								</TableCell>
								<TableCell
									align='center'
									className='!flex min-w-[220px] grow items-center justify-center gap-2 !border-0 !p-2'
								>
									<Box className='flex items-center gap-1'>
										<Box className='flex flex-col items-center gap-0.5'>
											<div
												className={classNames(
													'h-0 w-0 border-4 border-t-0 border-solid border-transparent border-b-[#DEE2E6]',
													{
														'!border-b-[#48B10D]':
															Math.sign(data.change.totalChange[areaUnit]) === 1,
													},
												)}
											></div>
											<div
												className={classNames(
													'h-0 w-0 border-4 border-b-0 border-solid border-transparent border-t-[#DEE2E6]',
													{
														'!border-t-[#EF5A56]':
															Math.sign(data.change.totalChange[areaUnit]) === -1,
													},
												)}
											></div>
										</Box>
										<span className='text-sm font-medium text-[#333333]'>
											{Math.abs(data.change.totalChange[areaUnit])}
										</span>
									</Box>
									<Box className='flex items-center gap-1'>
										<span className='text-sm font-medium text-[#333333]'>{'('}</span>
										<Box className='flex items-center gap-1'>
											<AddCircleOutline className='!h-3 !w-3 text-[#8DB9AA]' />
											<span className='text-sm font-medium text-[#333333]'>
												{data.change.increase[areaUnit]}
											</span>
										</Box>
										<span className='text-sm font-medium text-[#333333]'>{'/'}</span>
										<Box className='flex items-center gap-1'>
											<RemoveCircleOutline className='!h-3 !w-3 text-[#EF5A56]' />
											<span className='text-sm font-medium text-[#333333]'>
												{data.change.decrease[areaUnit]}
											</span>
										</Box>
										<span className='text-sm font-medium text-[#333333]'>{')'}</span>
									</Box>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
				{/* </Box> */}
			</Table>
		</TableContainer>
	)
}

export default CompareTable
