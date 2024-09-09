import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, ToggleButtonGroup, toggleButtonGroupClasses, toggleButtonClasses } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { OverviewIcon, AnalyzeIcon, RegistrationIcon, UserManagementIcon, AbountIcon } from '@/components/svg/MenuIcon'
import MenuButton from '@/components/menu/MenuButton'
import SettingDialog from '@/components/menu/SettingDialog'
import { AppPath } from '@/config/app.config'
import { useTranslation } from 'react-i18next'
import useResponsive from '@/hook/responsive'
import { UserRole } from '@/enum'
import { useSession } from 'next-auth/react'

interface MenuConfigType {
	id: string
	path: string
	label: string
	icon: React.JSX.Element
	access?: string[]
}

const SideBar = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const [menu, setMenu] = useState('')
	const { t } = useTranslation('common')
	const [openSettingDialog, setOpenSettingDialog] = useState<boolean>(false)
	const { isDesktop } = useResponsive()

	const menuConfig: MenuConfigType[] = [
		{
			id: 'Overview',
			path: AppPath.Overview,
			label: t('menuOverview'),
			icon: <OverviewIcon />,
		},
		{
			id: 'Analyze',
			path: AppPath.Analyze,
			label: t('menuAnalyze'),
			icon: <AnalyzeIcon />,
			access: [UserRole.Root, UserRole.Admin, UserRole.Analyst],
		},
		{
			id: 'Registration',
			path: AppPath.Registration,
			label: t('menuRegistration'),
			icon: <RegistrationIcon />,
			access: [UserRole.Root, UserRole.Admin, UserRole.Analyst],
		},
		{
			id: 'UserManagement',
			path: AppPath.UserManagement,
			label: t('menuUserManagement'),
			icon: <UserManagementIcon />,
			access: [UserRole.Root, UserRole.Admin],
		},
		{
			id: 'Setting',
			path: '/',
			label: t('menuSetting'),
			icon: <SettingsIcon />,
		},
		{
			id: 'About',
			path: AppPath.About,
			label: t('menuAbout'),
			icon: <AbountIcon />,
		},
	]

	useEffect(() => {
		const item = menuConfig.find((item) => item.path === router.pathname)
		if (item) setMenu(item.id)
	}, [router.pathname])

	const handleMenuChange = (_: React.MouseEvent<HTMLElement>, value: string) => {
		const item = menuConfig.find((item) => item.id === value)
		if (item?.path === '/' && value !== null) setMenu(value)
	}

	const handleCloseDialog = useCallback(() => {
		setOpenSettingDialog(false)
		const item = menuConfig.find((item) => item.path === router.pathname)
		if (item) setMenu(item.id)
	}, [router.pathname])

	const MenuButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
		[`& .${toggleButtonGroupClasses.grouped}`]: {
			border: 0,
		},
		[`& .${toggleButtonClasses.root} svg`]: {
			fill: '#D5E2DC',
		},
		[`& .${toggleButtonClasses.root}:hover svg`]: {
			fill: '#8DB9AA',
		},
		[`& .${toggleButtonClasses.selected} svg`]: {
			fill: '#0C5D52 !important',
		},
	}))

	return (
		isDesktop && (
			<div className='flex w-full max-w-[90px] flex-1 flex-col bg-white'>
				<MenuButtonGroup orientation='vertical' value={menu} exclusive onChange={handleMenuChange}>
					{menuConfig.map((item, index) =>
						(item.access?.length || 0) > 0 ? (
							item.access?.includes(session?.user.role || '') && (
								<MenuButton
									key={index}
									value={item.id}
									label={item.label}
									icon={item.icon}
									onClick={() => {
										if (item.id === 'Setting') {
											setOpenSettingDialog(true)
										} else {
											router.push(item.path)
										}
									}}
								/>
							)
						) : (
							<MenuButton
								key={index}
								value={item.id}
								label={item.label}
								icon={item.icon}
								onClick={() => {
									if (item.id === 'Setting') {
										setOpenSettingDialog(true)
									} else {
										router.push(item.path)
									}
								}}
							/>
						),
					)}
				</MenuButtonGroup>
				<SettingDialog open={openSettingDialog} onClose={() => handleCloseDialog()}></SettingDialog>
			</div>
		)
	)
}

export default SideBar
