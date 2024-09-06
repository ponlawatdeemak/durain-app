'use client'
import { useState } from 'react'
import { GetSearchUMDtoIn } from '@/api/um/dto-in.dto'
import { SortType } from '@/enum'
import UserManagementSearchForm from './SearchForm'
import UserManagementTable from './Table'
import useResponsive from '@/hook/responsive'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import Icon from '@mdi/react'
import { mdiAccountMultiple } from '@mdi/js'
import { UserManagementIcon } from '@/components/svg/MenuIcon'

export const UserManagementMain = () => {
	const { t, i18n } = useTranslation(['default', 'um'])
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
			className={`flex flex-col ${isDesktop ? 'pl-[32px] pr-[32px]' : 'pl-[8px] pr-[8px]'} w-[calc(100vw-90px)]`}
		>
			<Box className='flex flex-row'>
				<svg width={24} height={24} viewBox='0 0 25 24' fill='#0C5D52' xmlns='http://www.w3.org/2000/svg'>
					<path d='M15.7338 17.1647L11.7013 14.1929C13.0455 13.1527 13.9416 11.6668 13.9416 9.88369V8.69495C13.9416 5.8717 11.8506 3.34563 9.01299 3.19704C6.02597 3.04844 3.48701 5.42592 3.48701 8.39776V9.88369C3.48701 11.6668 4.38312 13.1527 5.72727 14.1929L1.69481 17.3133C0.948052 17.9077 0.5 18.7992 0.5 19.6908V22.514C0.5 23.4056 1.0974 24 1.99351 24H15.4351C16.3312 24 16.9286 23.4056 16.9286 22.514V19.5422C16.9286 18.6506 16.4805 17.7591 15.7338 17.1647Z' />
					<path d='M23.2908 10.2218L20.6816 8.50198C21.2614 7.92869 21.6963 7.06876 21.6963 6.06551V4.77561C21.6963 3.05575 20.3916 1.33589 18.6521 1.04925C16.9127 0.762605 15.4631 1.76586 14.7383 3.05575C16.3328 4.48897 17.3475 6.49547 17.3475 8.78862V10.2218C17.3475 11.5117 17.0576 12.8016 16.4778 13.8049C16.4778 13.8049 18.2173 15.0948 18.2173 15.2381H23.1458C24.0156 15.2381 24.5954 14.6648 24.5954 13.8049V12.6583C24.5954 11.6551 24.1606 10.7951 23.2908 10.2218Z' />
				</svg>
				{/* <UserManagementIcon width={24} height={24} /> */}
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
