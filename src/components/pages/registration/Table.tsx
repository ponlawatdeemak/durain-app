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
				'h-full [&&::-webkit-scrollbar-thumb]:rounded [&&::-webkit-scrollbar-thumb]:bg-[#2F7A59] [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-[#EAF2EE] [&::-webkit-scrollbar]:w-[5px]',
				isDesktop ? 'absolute' : '',
			)}
		>
			<Table stickyHeader>
				<TableHead>
					<TableRow className='[&>th]:bg-[#F0F2F4] [&>th]:text-[16px]'>
						<TableCell>{t('registration:area')}</TableCell>
						<TableCell align='right'>{t('registration:GS02')}</TableCell>
						<TableCell align='right'>{t('registration:nonGS02')}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.adms.map((row) => (
						<TableRow
							className='[&>td]:font-medium'
							hover
							tabIndex={-1}
							key={row.admCode}
							onClick={() => handleRowClick(row.admCode, row.admName)}
						>
							<TableCell>{row.admName[language] ?? '-'}</TableCell>
							<TableCell align='right'>{row.registeredArea[areaUnit] ?? '-'}</TableCell>
							<TableCell align='right'>{row.nonRegisteredArea[areaUnit] ?? '-'}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
