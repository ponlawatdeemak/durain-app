import React, { useCallback, useMemo, useState } from 'react'
import { Box, ToggleButton, ToggleButtonGroup, Typography, IconButton, Popover, Button } from '@mui/material'
import { mdiLayersOutline, mdiMapMarker, mdiMapMarkerOutline, mdiMinus, mdiPlus, mdiRulerSquareCompass } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'next-i18next'
import { BaseMap, BasemapType, MapLayer } from './interface/map'
import useLayerStore from './store/map'
import { layerIdConfig } from '@/config/app.config'
import { Layer } from '@deck.gl/core'

const basemapList: BaseMap[] = [
	{ value: BasemapType.CartoLight, image: '/images/map/basemap_bright.png', label: 'map.street' },
	{ value: BasemapType.CartoDark, image: '/images/map/basemap_satellite.png', label: 'map.satellite' },
	{ value: BasemapType.Google, image: '/images/map/basemap_satellite_hybrid.png', label: 'map.hybrid' },
]

interface MapToolsProps {
	layerList?: MapLayer[]
	onBasemapChanged?: (basemap: BasemapType) => void
	onZoomIn?: () => void
	onZoomOut?: () => void
	onGetLocation?: (coords: GeolocationCoordinates) => void
}

const MapTools: React.FC<MapToolsProps> = ({ layerList, onBasemapChanged, onZoomIn, onZoomOut, onGetLocation }) => {
	const { t } = useTranslation()
	const { layers, getLayer, getLayers, setLayers, removeLayer } = useLayerStore()
	const [basemap, setBasemap] = useState<BasemapType | null>(null)
	const [anchorBasemap, setAnchorBasemap] = useState<HTMLButtonElement | null>(null)
	const [anchorLegend, setAnchorLegend] = useState<HTMLButtonElement | null>(null)

	const currentLocationIsActive = useMemo(() => !!getLayer(layerIdConfig.toolCurrentLocation), [layers, getLayer])

	const onToggleLayer = useCallback(
		(layerId: string) => {
			const layer = getLayer(layerId)
			if (layer) {
				removeLayer(layerId)
			} else {
				const item = layerList?.find((item) => item.id === layerId)
				if (item) {
					const updatedLayers = [...getLayers(), item.layer]
					setLayers(updatedLayers as Layer[])
				}
			}
		},
		[layerList, getLayer, getLayers, setLayers, removeLayer],
	)

	const handleBasemapChanged = useCallback(
		(basemap: BasemapType) => {
			if (basemap !== null) {
				setBasemap(basemap)
				onBasemapChanged?.(basemap)
			}
		},
		[onBasemapChanged],
	)

	const handleGetLocation = useCallback(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					onGetLocation?.(position.coords)
				},
				(error) => {
					console.error('Error fetching location:', error)
				},
			)
		} else {
			console.log('Geolocation is not supported by this browser.')
		}
	}, [onGetLocation])

	return (
		<>
			{/* Zoom Controls */}
			<Box className='absolute right-2 top-2 z-10 flex flex-col gap-2'>
				<IconButton className='box-shadow rounded-lg bg-white' onClick={onZoomIn}>
					<Icon path={mdiPlus} size={1} />
				</IconButton>
				<IconButton className='box-shadow rounded-lg bg-white' onClick={onZoomOut}>
					<Icon path={mdiMinus} size={1} />
				</IconButton>
				<IconButton className='box-shadow rounded-lg bg-white'>
					<Icon path={mdiRulerSquareCompass} size={1} />
				</IconButton>
				<IconButton className='box-shadow rounded-lg bg-white' onClick={handleGetLocation}>
					<Icon path={currentLocationIsActive ? mdiMapMarkerOutline : mdiMapMarker} size={1} />
				</IconButton>
			</Box>

			{/* Basemap Selector */}
			<Box className='absolute bottom-2 right-2 z-10'>
				<IconButton
					onClick={(event) => setAnchorBasemap(event.currentTarget)}
					className='box-shadow rounded-lg bg-white'
				>
					<Icon path={mdiLayersOutline} size={1} />
				</IconButton>
				<Popover open={Boolean(anchorBasemap)} anchorEl={anchorBasemap} onClose={() => setAnchorBasemap(null)}>
					<Box className='flex flex-col bg-white p-2 drop-shadow-md'>
						<Typography
							sx={{ display: { xs: 'none', md: 'inline-block' } }}
							mb={1}
							variant='body2'
							className='font-bold'
						>
							{t('map.mapType')}
						</Typography>
						<ToggleButtonGroup
							size='small'
							exclusive
							color='primary'
							value={basemap}
							onChange={(_, value) => handleBasemapChanged(value)}
						>
							{basemapList.map((item, index) => (
								<ToggleButton
									key={index}
									className='flex flex-col rounded-none border-none'
									value={item.value}
								>
									<img src={item.image} className='h-[60px] w-[60px]' alt={`${item.label}`} />
									<Typography variant='body2' align='center' className='text-sm'>
										{t(`${item.label}`)}
									</Typography>
								</ToggleButton>
							))}
						</ToggleButtonGroup>
					</Box>
				</Popover>
			</Box>

			{/* Layer Legend */}
			{layerList && (
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
							{layerList.map((item, index) => (
								<div key={index}>
									<div>
										id: {item.id}, color: {item.color}, label: {item.label}
									</div>
									<Button onClick={() => onToggleLayer(item.id)}>Toggle</Button>
								</div>
							))}
						</Box>
					</Popover>
				</>
			)}
		</>
	)
}

export default MapTools
