import React, { useCallback, useState } from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Typography, IconButton, Popover } from '@mui/material'
import { mdiLayersOutline, mdiMinus, mdiPlus } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'next-i18next'

const basemapList = [
	{
		value: 'carto-light',
		image: '/map/basemap_bright.png',
		label: 'map.street',
	},
	{
		value: 'carto-dark',
		image: '/map/basemap_satellite.png',
		label: 'map.satellite',
	},
	{
		value: 'google',
		image: '/map/basemap_satellite_hybrid.png',
		label: 'map.hybrid',
	},
]

interface MapToolsProps {
	onBasemapChange?: (value: string) => void
	onZoomIn?: () => void
	onZoomOut?: () => void
}

const MapTools: React.FC<MapToolsProps> = ({ onBasemapChange, onZoomIn, onZoomOut }) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [basemap, setBasemap] = useState('carto-light')

	const { t, i18n } = useTranslation()

	const handleChange = useCallback((_: React.MouseEvent<HTMLElement>, newBasemap: string) => {
		setBasemap((prev) => newBasemap || prev)
		onBasemapChange?.(newBasemap)
	}, [])

	return (
		<React.Fragment>
			<IconButton
				sx={{
					border: 2,
					borderColor: Boolean(anchorEl) ? '#0C626D' : 'transparent',
				}}
				onClick={(event) => setAnchorEl(event.currentTarget)}
				className={'box-shadow mb-2 bg-white'}
			>
				<Icon color={Boolean(anchorEl) ? '#0C626D' : ''} path={mdiLayersOutline} size={1} />
			</IconButton>
			<Box className='box-shadow flex flex-col rounded-lg bg-white'>
				<IconButton className='rounded-none border-none' onClick={() => onZoomIn?.()}>
					<Icon path={mdiPlus} size={1} />
				</IconButton>
				<IconButton className='rounded-none border-none' onClick={() => onZoomOut?.()}>
					<Icon path={mdiMinus} size={1} />
				</IconButton>
			</Box>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				transformOrigin={{ vertical: 140, horizontal: -50 }}
			>
				<Box className='bg-white p-2 drop-shadow-md'>
					<Typography
						sx={{ display: { xs: 'none', md: 'inline-block' } }}
						mb={1}
						variant={'body2'}
						className='font-bold'
					>
						{t('map.mapType')}
					</Typography>
					<ToggleButtonGroup
						size='small'
						exclusive
						color='primary'
						value={basemap}
						onChange={handleChange}
						className='flex items-start'
						sx={{ flexDirection: 'row' }}
					>
						{basemapList.map((item, index) => {
							return (
								<ToggleButton
									key={index}
									className='flex w-full flex-col rounded-none border-none'
									sx={{
										maxWidth: { xs: '80px', md: 'unset' },
										'&.Mui-selected': {
											background: 'transparent',
										},
										'&.Mui-selected > img': {
											border: '1px solid',
											borderRadius: '4px',
											boxSizing: 'border-box',
										},
									}}
									value={item.value}
								>
									<img src={item.image} className='h-[60px] w-[60px]' />
									<Typography variant={'body2'} align='center' className='text-sm'>
										{t(`${item.label}`)}
									</Typography>
								</ToggleButton>
							)
						})}
					</ToggleButtonGroup>
				</Box>
			</Popover>
		</React.Fragment>
	)
}

export default MapTools
