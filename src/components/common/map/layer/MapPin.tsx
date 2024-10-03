import { IconLayer } from '@deck.gl/layers'
import { useCallback, useEffect } from 'react'
import useLayerStore from '../store/map'
import { Layer } from '@deck.gl/core'
import { layerIdConfig } from '@/config/app.config'
import { LatLng } from '../interface/map'
import { getPin } from '@/utils/pin'

interface MapPinProps {
	coords: LatLng
}

export default function MapPin({ coords }: MapPinProps) {
	const { getLayer, addLayer, removeLayer } = useLayerStore()

	const getIconLayer = useCallback((coords: LatLng) => {
		const iconLayer = new IconLayer({
			id: layerIdConfig.toolCurrentLocation,
			data: [{ coordinates: [coords.longitude, coords.latitude] }],
			pickable: true,
			getIcon: () => {
				return {
					url: getPin('#3fb0ff'),
					anchorY: 69,
					width: 58,
					height: 69,
					mask: false,
				}
			},
			getPosition: (d: any) => d.coordinates,
			getSize: 40,
			getColor: [255, 0, 0],
		})
		return iconLayer
	}, [])

	useEffect(() => {
		const iconLayer = getIconLayer(coords)
		addLayer(iconLayer as Layer)
		return () => {
			removeLayer(layerIdConfig.toolCurrentLocation)
		}
	}, [coords, getLayer, addLayer, removeLayer])

	return null
}
