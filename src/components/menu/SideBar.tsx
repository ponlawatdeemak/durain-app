import React from 'react'
import {
	Button,
	IconButton,
	styled,
	ToggleButton,
	ToggleButtonGroup,
	toggleButtonGroupClasses,
	toggleButtonClasses,
} from '@mui/material'
import { useRouter } from 'next/router'
import { AppPath } from '@/config/app.config'
import OverviewIcon from '@/components/svg/OverviewIcon'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
	[`& .${toggleButtonGroupClasses.grouped}`]: {
		border: 0,
	},
	[`& .${toggleButtonClasses.root} svg`]: {
		fill: '#D5E2DC', // สีเริ่มต้นของ SVG
	},
	[`& .${toggleButtonClasses.root}:hover svg`]: {
		fill: '#8DB9AA', // สีเมื่อ hover
	},
	[`& .${toggleButtonClasses.selected} svg`]: {
		fill: '#0C5D52 !important', // สีเมื่อ active
	},
}))

// const MenuToggleButton = styled(ToggleButton)(({ theme }) => ({
// 	'& svg': {
// 		fill: '#D5E2DC', // สีเริ่มต้นของ SVG
// 	},
// 	'&:hover svg': {
// 		fill: '#8DB9AA', // สีเมื่อ hover
// 	},
// 	'&.Mui-selected svg': {
// 		fill: '#0C5D52', // สีเมื่อ active
// 	},
// }))

const SideBar = () => {
	const router = useRouter()

	const [view, setView] = React.useState('list')

	const handleChange = (event: React.MouseEvent<HTMLElement>, nextView: string) => {
		console.log('nextView', nextView)
		setView(nextView || view)
	}

	return (
		<div className='flex w-full max-w-[90px] flex-1 flex-col bg-white'>
			<Button onClick={() => router.push(AppPath.Overview)}>Overview</Button>
			<Button onClick={() => router.push(AppPath.UserManagement)}>UM</Button>
			<StyledToggleButtonGroup orientation='vertical' value={view} exclusive onChange={handleChange}>
				<ToggleButton value='list' aria-label='list' disableRipple>
					<OverviewIcon />
				</ToggleButton>
				<ToggleButton value='module' aria-label='module' disableRipple>
					<OverviewIcon />
				</ToggleButton>
				<ToggleButton value='quilt' aria-label='quilt' disableRipple>
					<OverviewIcon />
				</ToggleButton>
			</StyledToggleButtonGroup>
		</div>
	)
}

export default SideBar
