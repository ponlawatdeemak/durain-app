import { createContext, useState, ReactNode, useContext, useCallback, useEffect } from 'react'
import maplibregl from 'maplibre-gl'
import { LatLng, MapInfoWindow } from '../interface/map'
import useLayerStore from '../store/map'
import { googleProtocol } from '@/utils/google'

interface MapContextProps {
	setExtent: (extent: [number, number, number, number]) => void

	setMapLibreInstance: (mapInstance: maplibregl.Map | null) => void
	setCenter: (coords: LatLng) => void
	setMapInfoWindow: (infoWindow: MapInfoWindow | null) => void
	mapLibreInstance: maplibregl.Map | null
	mapInfoWindow: MapInfoWindow | null
}

const MapContext = createContext<MapContextProps>({
	setExtent: () => {},
	setMapLibreInstance: () => {},
	setCenter: () => {},
	setMapInfoWindow: () => {},
	mapLibreInstance: null,
	mapInfoWindow: null,
})

export const MapProvider = ({ children }: { children: ReactNode }) => {
	const { getLayer, removeLayer } = useLayerStore()

	const [mapLibreInstance, setMapLibreInstance] = useState<maplibregl.Map | null>(null)
	const [mapInfoWindow, setMapInfoWindow] = useState<MapInfoWindow | null>(null)

	useEffect(() => {
		maplibregl.addProtocol('google', googleProtocol)
	}, [])

	const setExtent = useCallback(
		(extent: [number, number, number, number]) => {
			if (mapLibreInstance) {
				mapLibreInstance.fitBounds([
					[extent[0], extent[1]],
					[extent[2], extent[3]],
				])
			}
		},
		[mapLibreInstance],
	)

	const setCenter = useCallback(
		(coords: LatLng) => {
			if (mapLibreInstance) {
				mapLibreInstance.setCenter({ lat: coords.latitude, lng: coords.longitude })
			}
		},
		[mapLibreInstance],
	)

	return (
		<MapContext.Provider
			value={{
				setExtent,
				setMapLibreInstance,
				setCenter,
				setMapInfoWindow,
				mapLibreInstance,
				mapInfoWindow,
			}}
		>
			{children}
		</MapContext.Provider>
	)
}

export function useMap() {
	return useContext(MapContext)
}
