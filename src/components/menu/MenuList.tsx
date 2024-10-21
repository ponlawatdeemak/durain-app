import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { AppPath } from '@/config/app.config'
import { List, ListItem, ListItemText } from '@mui/material'
import SettingDialog from './SettingDialog'
import { FlagStatus, UserRole } from '@/enum'
import { useSession } from 'next-auth/react'

interface MenuConfigType {
	id: string
	path: string
	label: string
	access?: string[]
}

interface MenuListProps {
	setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuList: React.FC<MenuListProps> = ({ setIsMenuOpen }) => {
	const router = useRouter()
	const { data: session } = useSession()
	const { t } = useTranslation('common')

	const [openSettingDialog, setOpenSettingDialog] = useState<boolean>(false)

	const menuConfig: MenuConfigType[] = [
		{
			id: 'Overview',
			path: AppPath.Overview,
			label: t('menuOverview'),
		},
		{
			id: 'Analyze',
			path: AppPath.Analyze,
			label: t('menuAnalyze'),
			access: [UserRole.Root, UserRole.Admin, UserRole.Analyst],
		},
		{
			id: 'Registration',
			path: AppPath.Registration,
			label: t('menuRegistration'),
			access: [UserRole.Root, UserRole.Admin, UserRole.Analyst],
		},
		{
			id: 'UserManagement',
			path: AppPath.UserManagement,
			label: t('menuUserManagement'),
			access: [UserRole.Root, UserRole.Admin],
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
				{menuConfig.map((menu) =>
					(menu.access?.length || 0) > 0 ? (
						session?.user?.flagStatus === FlagStatus.Active &&
						menu.access?.includes(session?.user.role || '') && (
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
					) : (
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
					),
				)}
			</List>
			<SettingDialog open={openSettingDialog} onClose={() => handleCloseDialog()} />
		</div>
	)
}

export default MenuList
