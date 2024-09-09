import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { AppPath } from '@/config/app.config'
import { List, ListItem, ListItemText } from '@mui/material'
import SettingDialog from './SettingDialog'

interface MenuListProps {
	setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuList: React.FC<MenuListProps> = ({ setIsMenuOpen }) => {
	const router = useRouter()
	const { t } = useTranslation('common')
	const [openSettingDialog, setOpenSettingDialog] = useState<boolean>(false)

	const menuConfig = [
		{
			id: 'Overview',
			path: AppPath.Overview,
			label: t('menuOverview'),
		},
		{
			id: 'Analyze',
			path: AppPath.Analyze,
			label: t('menuAnalyze'),
		},
		{
			id: 'Registration',
			path: AppPath.Registration,
			label: t('menuRegistration'),
		},
		{
			id: 'UserManagement',
			path: AppPath.UserManagement,
			label: t('menuUserManagement'),
		},
		{
			id: 'Setting',
			path: '/',
			label: t('menuSetting'),
		},
		{
			id: 'About',
			path: AppPath.About,
			label: t('menuAbout'),
		},
	]

	const handleCloseDialog = useCallback(() => {
		setOpenSettingDialog(false)
	}, [])

	return (
		<div className='flex flex-col overflow-auto p-4'>
			<List className='h-full p-0'>
				{menuConfig.map((menu) => {
					return (
						<ListItem
							key={menu.id}
							className='cursor-pointer border-0 border-b border-solid border-[#d6d6d6] px-3 hover:!bg-[#e9ecee]'
							onClick={() => {
								if (menu.id === 'Setting') {
									setOpenSettingDialog(true)
								} else {
									router.push(menu.path)
									setIsMenuOpen(false)
								}
							}}
						>
							<ListItemText className='[&_.MuiTypography-root]:font-medium' primary={menu.label} />
						</ListItem>
					)
				})}
			</List>
			<SettingDialog open={openSettingDialog} onClose={() => handleCloseDialog()} />
		</div>
	)
}

export default MenuList
