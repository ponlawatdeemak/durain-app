import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { styled, ToggleButtonGroup, toggleButtonGroupClasses, toggleButtonClasses } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import {
	OverviewIcon,
	AnalyzeIcon,
	RegisterInfoIcon,
	UserManagementIcon,
	AbountUsIcon,
} from '@/components/svg/MenuIcon'
import MenuButton from '@/components/menu/MenuButton'
import SettingDialog from '@/components/SettingDialog'
import { AppPath } from '@/config/app.config'

const menuConfig = [
	{
		id: 'Overview',
		path: AppPath.Overview,
		label: 'ภาพรวมการปลูกทุเรียน',
		icon: <OverviewIcon />,
	},
	{
		id: 'Analyze',
		path: AppPath.Analyze,
		label: 'วิเคราะห์พื้นที่ปลูกทุเรียน',
		icon: <AnalyzeIcon />,
	},
	{
		id: 'RegistrationInfo',
		path: AppPath.RegistrationInfo,
		label: 'ข้อมูลการขึ้นทะเบียนปลูกทุเรียน',
		icon: <RegisterInfoIcon />,
	},
	{
		id: 'UserManagement',
		path: AppPath.UserManagement,
		label: 'การจัดการผู้ใช้งาน',
		icon: <UserManagementIcon />,
	},
	{
		id: 'Setting',
		path: '/',
		label: 'การตั้งค่า',
		icon: <SettingsIcon />,
	},
	{
		id: 'AboutUs',
		path: AppPath.AboutUs,
		label: 'เกี่ยวกับเรา',
		icon: <AbountUsIcon />,
	},
]

const SideBar = () => {
	const router = useRouter()
	const [menu, setMenu] = useState('')
	const [openSettingDialog, setOpenSettingDialog] = useState<boolean>(false)

	useEffect(() => {
		const item = menuConfig.find((item) => item.path === router.pathname)
		if (item) setMenu(item.id)
	}, [router.pathname])

	const handleMenuChange = (_: React.MouseEvent<HTMLElement>, value: string) => {
		const item = menuConfig.find((item) => item.id === value)
		if (item?.path === '/') setMenu(value || menu)
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
			fill: '#D5E2DC !important',
		},
		[`& .${toggleButtonClasses.root}:hover svg`]: {
			fill: '#8DB9AA !important',
		},
		[`& .${toggleButtonClasses.selected} svg`]: {
			fill: '#0C5D52 !important',
		},
	}))

	return (
		<div className='flex w-full max-w-[90px] flex-1 flex-col bg-white'>
			<MenuButtonGroup orientation='vertical' value={menu} exclusive onChange={handleMenuChange}>
				{menuConfig.map((item, index) => {
					return (
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
				})}
			</MenuButtonGroup>
			<SettingDialog open={openSettingDialog} onClose={() => handleCloseDialog()}></SettingDialog>
		</div>
	)
}

export default SideBar
