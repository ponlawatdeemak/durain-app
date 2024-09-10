'use client'

import { Button, FormControl, Input, InputAdornment, Paper } from '@mui/material'
import { FormMain } from '../Form'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { GetSearchUMDtoIn } from '@/api/um/dto-in.dto'
import { useTranslation } from 'react-i18next'
import useResponsive from '@/hook/responsive'
import { FormImport } from '../Import'
import { UserDialogMode } from '@/components/shared/UserDialog'

export interface UserManagementSearchFormProps {
	setSearchParams: React.Dispatch<React.SetStateAction<GetSearchUMDtoIn>>
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
	setPage: React.Dispatch<React.SetStateAction<number>>
}

const UserManagementSearchForm: React.FC<UserManagementSearchFormProps> = ({
	setSearchParams,
	setIsSearch,
	setPage,
}) => {
	const [openForm, setOpenForm] = useState<boolean>(false)
	const [openImport, setOpenImport] = useState<boolean>(false)
	const { t, i18n } = useTranslation(['default', 'um'])
	const { isDesktop } = useResponsive()
	const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
		// setSearchString(event.target.value)
		setSearchParams((prevSearch) => ({
			...prevSearch,
			offset: 0,
			keyword: event.target.value,
			respLang: i18n.language,
		}))
		setPage(1)
	}

	const handleOnBlur = (event: React.FocusEvent<HTMLInputElement> | React.FormEvent<Element>) => {
		event.preventDefault()
		setIsSearch(true)
	}

	return (
		<>
			<Paper className='flex gap-[6px] bg-[#D9E0EB] p-[4px]'>
				<form
					onSubmit={(event) => {
						handleOnBlur(event)
					}}
					className='w-full'
				>
					<FormControl fullWidth variant='standard' className='h-[40px] rounded-[8px] bg-white'>
						<Input
							className='flex h-[40px] gap-[8px] px-[12px] py-[8px] [&_.MuiInputAdornment-positionStart]:m-0'
							id='standard-search'
							placeholder={`${t('search', { ns: 'um' })} ${isDesktop ? `${t('name', { ns: 'um' })}, ${t('email')}, ${t('org')}, ${t('role')}, ${t('province')}, ${t('district')}` : ''}`}
							type='search'
							startAdornment={
								<InputAdornment position='start'>
									<SearchOutlinedIcon className='h-[24px] w-[24px] text-black' />
								</InputAdornment>
							}
							onChange={handleSearchChange}
							onBlur={handleOnBlur}
							disableUnderline={true}
						/>
					</FormControl>
				</form>
				<Button
					className={`flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0`}
					variant='contained'
					startIcon={<GroupAddOutlinedIcon className={`h-[24px] w-[24px] ${!isDesktop && 'ml-[8px]'}`} />}
					onClick={() => setOpenForm(true)}
				>
					{isDesktop && t('addUser', { ns: 'um' })}
				</Button>
				<Button
					className='flex h-[40px] shrink-0 gap-[8px] bg-white py-[8px] pl-[12px] pr-[16px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					variant='contained'
					color='primary'
					startIcon={<SystemUpdateAltIcon className={`h-[24px] w-[24px] ${!isDesktop && 'ml-[5px]'}`} />}
					onClick={() => setOpenImport(true)}
				>
					{isDesktop && t('importUser', { ns: 'um' })}
				</Button>
			</Paper>
			<FormMain
				open={openForm}
				onClose={() => setOpenForm(false)}
				userId=''
				isEdit={false}
				setOpen={setOpenForm}
				setIsSearch={setIsSearch}
				userDialogMode={UserDialogMode.UserAdd}
			/>
			<FormImport
				open={openImport}
				onClose={() => setOpenImport(false)}
				setOpen={setOpenImport}
				setIsSearch={setIsSearch}
			/>
		</>
	)
}

export default UserManagementSearchForm
