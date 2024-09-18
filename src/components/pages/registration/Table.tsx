import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'
import useResponsive from '@/hook/responsive'
import useAreaUnit from '@/store/area-unit'
import { overviewRegisteredDtoOut } from '@/api/registration/dto-out.dto'
import classNames from 'classnames'

export default function RegistrationTable({
	data,
	handleRowClick,
}: {
	data?: overviewRegisteredDtoOut
	handleRowClick: (rowAdmCode: number, admName: ResponseLanguage) => void
}) {
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()

	return (
		<TableContainer
			className={classNames(
				'h-full [&&::-webkit-scrollbar-thumb]:rounded [&&::-webkit-scrollbar-thumb]:bg-[#2F7A59] [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-[#EAF2EE] [&::-webkit-scrollbar]:w-[5px] [&_.MuiTable-root]:border-separate [&_.MuiTable-root]:border-spacing-y-[4px]',
				isDesktop ? 'absolute px-[3px]' : '',
			)}
		>
			<Table stickyHeader>
				<TableHead className='[&_.MuiTableCell-root]:border-none [&_.MuiTableCell-root]:px-[16px] [&_.MuiTableCell-root]:py-[16px]'>
					<TableRow className='[&>th]:bg-[#F0F2F4] [&>th]:text-[16px]'>
						<TableCell className='rounded-l-[4px]'>{t('registration:area')}</TableCell>
						<TableCell align='right'>{t('registration:GS02')}</TableCell>
						<TableCell className='rounded-r-[4px]' align='right'>
							{t('registration:nonGS02')}
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className='[&_.MuiTableCell-root]:px-[16px] [&_.MuiTableCell-root]:py-[12px]'>
					{data?.adms.map((row) => (
						<TableRow
							className='hover:!bg-[#F2F6F0] [&>td]:font-medium'
							hover
							tabIndex={-1}
							key={row.admCode}
							onClick={() => handleRowClick(row.admCode, row.admName)}
						>
							<TableCell className='rounded-l-[4px] border-l-[1px] border-t-[1px]'>
								{row.admName[language] ?? '-'}
							</TableCell>
							<TableCell sx={{ borderWidth: '1px 0px' }} align='right'>
								{row.registeredArea[areaUnit] ?? '-'}
							</TableCell>
							<TableCell className='rounded-r-[4px] border-r-[1px] border-t-[1px]' align='right'>
								{row.nonRegisteredArea[areaUnit] ?? '-'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
