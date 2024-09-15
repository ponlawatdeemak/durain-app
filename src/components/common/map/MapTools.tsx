import React, { useCallback, useMemo, useState } from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Typography, IconButton, Popover, Button } from '@mui/material'
import { mdiLayersOutline, mdiMapMarker, mdiMapMarkerOutline, mdiMinus, mdiPlus, mdiRulerSquareCompass } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { BaseMap, MapLayer, MapLegend } from './interface/map'
import { useMap } from './context/map'
import useLayerStore from './store/map'
import { layerIdConfig } from '@/config/app.config'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Layer } from '@deck.gl/core'

export interface MapToolsProps {
	basemapList?: BaseMap[]
	layerList?: MapLayer[]
	legends?: MapLegend[]
}

const MapTools: React.FC<MapToolsProps> = ({ basemapList = [], layerList, legends }) => {
	const { t } = useTranslation()
	const { viewState, basemap, getLocation, setViewState, setBasemap } = useMap()
	const [anchorBasemap, setAnchorBasemap] = useState<HTMLButtonElement | null>(null)
	const [anchorLegend, setAnchorLegend] = useState<HTMLButtonElement | null>(null)
	const { layers, getLayer, getLayers, setLayers, removeLayer } = useLayerStore()

	const currentLocationIsActive = useMemo(() => {
		return !!getLayer(layerIdConfig.toolCurrentLocation)
	}, [layers, getLayer])

	const onToggleLayer = useCallback(
		(layerId: string) => {
			const layer = getLayer(layerId)
			if (layer) {
				removeLayer(layerId)
			} else {
				const item = layerList?.find((item) => item.id === layerId)
				if (item) {
					// - จัดเรียง layer ตาม legends
					setLayers([...getLayers(), item.layer] as Layer[])
				}
			}
		},
		[layers, getLayer, setLayers, removeLayer],
	)

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
					{currentLocationIsActive ? (
						<Icon path={mdiMapMarkerOutline} size={1} />
					) : (
						<Icon path={mdiMapMarker} size={1} />
					)}
				</IconButton>
			</Box>
			{/* basemap */}
			{basemapList && (
				<Box className='absolute bottom-2 right-2 z-10'>
					<IconButton
						onClick={(event) => setAnchorBasemap(event.currentTarget)}
						className='box-shadow rounded-lg bg-white'
					>
						<Icon path={mdiLayersOutline} size={1} />
					</IconButton>
					<Popover
						open={Boolean(anchorBasemap)}
						anchorEl={anchorBasemap}
						onClose={() => setAnchorBasemap(null)}
					>
						<Box className='flex flex-col bg-white p-2 drop-shadow-md'>
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
									value !== null && setBasemap(value)
								}}
								className='flex items-start'
							>
								{basemapList.map((item, index) => {
									return (
										<ToggleButton
											key={index}
											className='flex flex-col rounded-none border-none'
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
			{legends && (
				<>
					<Box className='absolute bottom-2 left-2 z-10'>
						<IconButton
							onClick={(event) => setAnchorLegend(event.currentTarget)}
							className='box-shadow rounded-lg bg-white'
						>
							<Icon path={mdiLayersOutline} size={1} />
						</IconButton>
					</Box>
					<Popover open={Boolean(anchorLegend)} anchorEl={anchorLegend} onClose={() => setAnchorLegend(null)}>
						<Box className='bg-white p-2 drop-shadow-md'>
							{legends.map((item, index) => {
								return (
									<div key={index}>
										<div>
											id: {item.id}, color: {item.color}, label: {item.label}
										</div>
										<Button onClick={() => onToggleLayer(item.id)}>toggle</Button>
									</div>
								)
							})}
						</Box>
					</Popover>
				</>
			)}
		</>
	)
}

export default MapTools
