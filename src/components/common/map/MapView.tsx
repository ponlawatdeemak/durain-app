'use client'
import classNames from 'classnames'
import { BaseMap, BasemapType, MapType, MapInfoWindow, MapLegend, MapLayer } from './interface/map'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import MapTools from './MapTools'
import { useMap } from './context/map'
import { Button, Paper } from '@mui/material'
import { PropsWithChildren, useEffect } from 'react'
import useLayerStore from './store/map'

// Remark
// 1. iconLayer สลับ google, libre แล้วหาย
// 2. measurement ยังไม่มี solution
// 3. legend ยังไม่ได้ solution ที่แน่นอน

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
	const { mapType, mapInfoWindow, hideMapInfoWindow } = useMap()
	const { setLayers } = useLayerStore()

	const legends =
		initialLayer?.map((item) => {
			return {
				id: item.id,
				color: item.color,
				label: item.label,
			}
		}) || []

	useEffect(() => {
		console.log('Hello MapView')
		if (initialLayer && initialLayer.length) {
			const layers = initialLayer.map((item) => item.layer)
			setLayers(layers)
		}
	}, [setLayers])

	return (
		<div className={classNames('relative flex flex-1 overflow-hidden', className)}>
			<MapTools basemapList={basemapList} layerList={initialLayer} legends={legends}></MapTools>
			{mapType === MapType.Libre ? <MapLibre /> : <MapGoogle />}
			{mapInfoWindow && (
				<InfoWindow positon={mapInfoWindow.positon} onClose={hideMapInfoWindow}>
					{mapInfoWindow.children}
				</InfoWindow>
			)}
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
