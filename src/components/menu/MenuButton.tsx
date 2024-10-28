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
				className='h-20'
			>
				{icon}
			</ToggleButton>
			<Popover
				sx={{ pointerEvents: 'none' }}
				slotProps={{
					paper: { className: '!rounded-none flex items-center h-14 !rounded-r !shadow-none' },
				}}
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
				<Typography className='bg-primary-light2 flex h-14 w-[230px] items-center border-0 border-l-[3px] border-solid border-primary-light px-6 py-2 !text-[14px] !font-light !leading-[18px] text-green-light'>
					{label}
				</Typography>
			</Popover>
		</>
	)
}

export default MenuButton
