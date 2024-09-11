'use client'
import { useState } from 'react'
import { GetSearchUMDtoIn } from '@/api/um/dto-in.dto'
import { SortType } from '@/enum'
import UserManagementSearchForm from './SearchForm'
import UserManagementTable from './Table'
import useResponsive from '@/hook/responsive'
import { useTranslation } from 'next-i18next'
import { Box, Typography } from '@mui/material'
import Icon from '@mdi/react'
import { mdiAccountMultiple } from '@mdi/js'
import { UserManagementIcon } from '@/components/svg/MenuIcon'

export const UserManagementMain = () => {
	const { t, i18n } = useTranslation(['common', 'um'])
	const [searchParams, setSearchParams] = useState<GetSearchUMDtoIn>({
		keyword: '',
		firstName: '',
		sortField: 'firstName',
		sortOrder: SortType.ASC,
		limit: 10,
		offset: 0,
		respLang: i18n.language,
	})
	const [isSearch, setIsSearch] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)
	const { isDesktop } = useResponsive()
	return (
		<div
			className={`flex flex-col ${isDesktop ? 'pl-[32px] pr-[32px] pt-[16px]' : 'pl-[0px] pr-[0px] pt-[12px]'} ${isDesktop ? 'w-[calc(100vw-90px)]' : 'w-[calc(100vw-50px)]'} self-center`}
		>
			<Box className='flex flex-row'>
				<div className='[&>svg]:fill-[#0C5D52]'>
					<UserManagementIcon width={24} height={24} />
				</div>
				<Typography>การจัดการผู้ใช้งาน</Typography>
			</Box>
			<UserManagementSearchForm setSearchParams={setSearchParams} setIsSearch={setIsSearch} setPage={setPage} />
			<UserManagementTable
				searchParams={searchParams}
				setSearchParams={setSearchParams}
				isSearch={isSearch}
				setIsSearch={setIsSearch}
				page={page}
				setPage={setPage}
			/>
		</div>
	)
}
