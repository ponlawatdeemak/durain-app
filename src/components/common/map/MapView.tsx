import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { BaseMap, BasemapType, MapType, MapInfoWindow, MapLayer, LatLng } from './interface/map'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import MapTools from './MapTools'
import { useMap } from './context/map'
import { Button, Paper } from '@mui/material'
import { PropsWithChildren, useEffect } from 'react'
import useLayerStore from './store/map'
import MapPin from './layer/MapPin'
import { layerIdConfig } from '@/config/app.config'

const CURRENT_LOCATION_ZOOM = 14
const basemapList: BaseMap[] = [
	{
		value: BasemapType.CartoLight,
		image: '/images/map/basemap_bright.png',
		label: 'map.street',
	},
	{
		value: BasemapType.CartoDark,
		image: '/images/map/basemap_satellite.png',
		label: 'map.satellite',
	},
	{
		value: BasemapType.Google,
		image: '/images/map/basemap_satellite_hybrid.png',
		label: 'map.hybrid',
	},
]

export interface MapViewProps extends PropsWithChildren {
	className?: string
	initialLayer?: MapLayer[]
}

export default function MapView({ className = '', initialLayer }: MapViewProps) {
	const { mapType, mapInfoWindow, hideMapInfoWindow, setCenterAndZoom } = useMap()
	const { getLayer, setLayers } = useLayerStore()
	const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null)

	useEffect(() => {
		if (initialLayer && initialLayer.length) {
			const layers = initialLayer.map((item) => item.layer)
			setLayers(layers)
		}
	}, [setLayers])

	const onGetLocation = useCallback(
		(coords: GeolocationCoordinates) => {
			const layer = getLayer(layerIdConfig.toolCurrentLocation)
			if (layer) {
				setCurrentLocation(null)
			} else {
				const { latitude, longitude } = coords
				setCurrentLocation({ latitude, longitude })
				setCenterAndZoom({ latitude, longitude }, CURRENT_LOCATION_ZOOM)
			}
		},
		[getLayer, setCurrentLocation, setCenterAndZoom],
	)

	return (
		<div className={classNames('relative flex flex-1 overflow-hidden', className)}>
			<MapTools basemapList={basemapList} layerList={initialLayer} onGetLocation={onGetLocation} />
			{mapType === MapType.Libre ? <MapLibre /> : <MapGoogle />}
			{mapInfoWindow && (
				<InfoWindow positon={mapInfoWindow.positon} onClose={hideMapInfoWindow}>
					{mapInfoWindow.children}
				</InfoWindow>
			)}
			{currentLocation && mapType === MapType.Libre && <MapPin coords={currentLocation} />}
			{currentLocation && mapType === MapType.Google && <MapPin coords={currentLocation} />}
		</div>
	)
}

export interface InfoWindowProps extends MapInfoWindow, PropsWithChildren {
	onClose?: () => void
}

const InfoWindow: React.FC<InfoWindowProps> = ({ positon, children, onClose }) => {
	if (!positon) return null
	return (
		<Paper className='absolute z-10 bg-white p-2' style={{ left: positon.x, top: positon.y }}>
			{children}
			<Button onClick={onClose}>close</Button>
		</Paper>
	)
}
