import React, { useState } from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Typography, IconButton, Popover, List } from '@mui/material'
import { mdiLayersOutline, mdiMapMarker, mdiMinus, mdiPlus, mdiRulerSquareCompass } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { MapToolsProps } from './interface/map'
import { useMap } from './context/map'

const MapTools: React.FC<MapToolsProps> = ({ basemapList = [], layersList = [] }) => {
	const { t } = useTranslation()
	const { viewState, basemap, getLocation, setViewState, setBasemap } = useMap()
	const [anchorBasemap, setAnchorBasemap] = useState<HTMLButtonElement | null>(null)
	const [anchorLegend, setAnchorLegend] = useState<HTMLButtonElement | null>(null)

	return (
		<>
			{/* zoom in/out, measurement, current location */}
			<Box className='absolute right-2 top-2 z-10 flex flex-col gap-2'>
				<IconButton
					className='box-shadow rounded-lg bg-white'
					onClick={() => setViewState({ ...viewState, zoom: viewState.zoom + 1 })}
				>
					<Icon path={mdiPlus} size={1} />
				</IconButton>
				<IconButton
					className='box-shadow rounded-lg bg-white'
					onClick={() => setViewState({ ...viewState, zoom: viewState.zoom - 1 })}
				>
					<Icon path={mdiMinus} size={1} />
				</IconButton>
				<IconButton className='box-shadow rounded-lg bg-white' onClick={() => {}}>
					<Icon path={mdiRulerSquareCompass} size={1} />
				</IconButton>
				<IconButton className='box-shadow rounded-lg bg-white' onClick={() => getLocation()}>
					<Icon path={mdiMapMarker} size={1} />
				</IconButton>
			</Box>
			{/* basemap */}
			{basemapList && (
				<Box className='absolute bottom-2 right-2 z-10'>
					<IconButton
						onClick={(event) => setAnchorBasemap(event.currentTarget)}
						className='box-shadow rounded-lg bg-white'
					>
						<Icon color={Boolean(anchorBasemap) ? '#0C626D' : ''} path={mdiLayersOutline} size={1} />
					</IconButton>
					<Popover
						open={Boolean(anchorBasemap)}
						anchorEl={anchorBasemap}
						onClose={() => setAnchorBasemap(null)}
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
								onChange={(_, value) => {
									if (value !== null) {
										setBasemap(value)
									}
								}}
								className='flex items-start'
							>
								{basemapList.map((item, index) => {
									return (
										<ToggleButton
											key={index}
											className='flex w-full flex-col rounded-none border-none'
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
				</Box>
			)}
			{/* legend */}
			{layersList && (
				<Box className='absolute bottom-2 left-2 z-10'>
					<IconButton
						onClick={(event) => setAnchorLegend(event.currentTarget)}
						className='box-shadow rounded-lg bg-white'
					>
						<Icon color={'#0C626D'} path={mdiLayersOutline} size={1} />
					</IconButton>
					<Popover open={Boolean(anchorLegend)} anchorEl={anchorLegend} onClose={() => setAnchorLegend(null)}>
						<Box className='bg-white p-2 drop-shadow-md'>layersList here.</Box>
					</Popover>
				</Box>
			)}
		</>
	)
}

export default MapTools
