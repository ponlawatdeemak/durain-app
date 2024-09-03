import React, { ReactNode } from 'react'
import { ToggleButton, Popover, Typography } from '@mui/material'

interface MenuButtonProps {
	value: string
	label: string
	icon: any
	onClick?: () => void
}

const MenuButton: React.FC<MenuButtonProps> = ({ ...props }) => {
	const { value, label, icon, onClick } = props
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
	const open = Boolean(anchorEl)

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handlePopoverClose = () => {
		setAnchorEl(null)
	}

	return (
		<>
			<ToggleButton
				value={value}
				onClick={onClick}
				disableRipple
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
				className='h-[80px]'
			>
				{icon}
			</ToggleButton>
			<Popover
				sx={{ pointerEvents: 'none' }}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'center',
					horizontal: 'left',
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<Typography sx={{ p: 1 }}>{label}</Typography>
			</Popover>
		</>
	)
}

export default MenuButton
