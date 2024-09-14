'use client'
import classNames from 'classnames'
import { BaseMap, BasemapType, MapType, MapViewProps } from './interface/map'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import MapTools from './MapTool'
import { useMap } from './context/map'

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

export default function MapView({ className = '', onMapClick }: MapViewProps) {
	const { mapType } = useMap()
	return (
		<div className={classNames('relative flex h-full flex-1 flex-col overflow-hidden', className)}>
			<MapTools basemapList={basemapList}></MapTools>
			{mapType === MapType.Libre ? <MapLibre onMapClick={onMapClick} /> : <MapGoogle onMapClick={onMapClick} />}
		</div>
	)
}
