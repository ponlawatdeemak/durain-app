import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { BasemapType, LatLng, MapInfoWindow, MapType, MapViewState } from '../interface/map'
import useLayerStore from '../store/map'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Layer } from '@deck.gl/core'

interface MapContextProps {
	setViewState: (viewState: MapViewState) => void
	setMapType: (type: MapType) => void
	setBasemap: (type: BasemapType) => void
	setExtent: (extent: [number, number, number, number]) => void
	setGoogleMapInstance: (mapInstance: google.maps.Map | null) => void
	setMapLibreInstance: (mapInstance: maplibregl.Map | null) => void
	setCenterAndZoom: (coords: any, zoom: number) => void
	showMapInfoWindow: (infoWindow: MapInfoWindow) => void
	hideMapInfoWindow: () => void
	viewState: MapViewState
	mapType: MapType
	basemap: BasemapType
	googleMapInstance: google.maps.Map | null
	mapLibreInstance: maplibregl.Map | null
	mapInfoWindow: MapInfoWindow | null
}

const DEFAULT = {
	viewState: {
		longitude: 100,
		latitude: 13,
		zoom: 5,
	},
	mapType: MapType.Libre,
	basemap: BasemapType.CartoLight,
}

const MapContext = createContext<MapContextProps>({
	setViewState: () => {},
	setMapType: () => {},
	setBasemap: () => {},
	setExtent: () => {},
	setGoogleMapInstance: () => {},
	setMapLibreInstance: () => {},
	setCenterAndZoom: () => {},
	showMapInfoWindow: () => {},
	hideMapInfoWindow: () => {},
	viewState: DEFAULT.viewState,
	mapType: DEFAULT.mapType,
	basemap: DEFAULT.basemap,
	googleMapInstance: null,
	mapLibreInstance: null,
	mapInfoWindow: null,
})

export const MapProvider = ({ children }: { children: ReactNode }) => {
	const { getLayer, getLayers, setLayers, removeLayer } = useLayerStore()
	const [mapType, setMapType] = useState<MapType>(DEFAULT.mapType)
	const [basemap, setBasemap] = useState(DEFAULT.basemap)
	const [viewState, setViewState] = useState<MapViewState>(DEFAULT.viewState)
	const [googleMapInstance, setGoogleMapInstance] = useState<google.maps.Map | null>(null)
	const [mapLibreInstance, setMapLibreInstance] = useState<maplibregl.Map | null>(null)
	const [mapInfoWindow, setMapInfoWindow] = useState<MapInfoWindow | null>(null)

	useEffect(() => {
		if (basemap === BasemapType.Google) {
			setMapType(MapType.Google)
		} else {
			setMapType(MapType.Libre)
		}
	}, [basemap])

	useEffect(() => {
		const recreateLayers = () => {
			const layers = getLayers()
			const newLayers = layers.map((layer) => {
				if (layer instanceof IconLayer) {
					return new IconLayer({ ...layer.props })
				}
				if (layer instanceof MVTLayer) {
					return new MVTLayer({ ...layer.props })
				}
				return layer
			})
			setLayers(newLayers as Layer[])
		}
		recreateLayers()
	}, [mapType, setLayers, getLayers])

	const setExtent = useCallback(
		(extent: [number, number, number, number]) => {
			if (mapType === MapType.Google && googleMapInstance) {
				googleMapInstance.fitBounds(
					new window.google.maps.LatLngBounds(
						{ lat: extent[1], lng: extent[0] },
						{ lat: extent[3], lng: extent[2] },
					),
				)
			} else if (mapType === MapType.Libre && mapLibreInstance) {
				mapLibreInstance.fitBounds([
					[extent[0], extent[1]],
					[extent[2], extent[3]],
				])
			}
		},
		[mapType, googleMapInstance, mapLibreInstance],
	)

	const setCenterAndZoom = useCallback(
		(coords: LatLng, zoom: number) => {
			const { longitude: lng, latitude: lat } = coords
			if (mapType === MapType.Libre && mapLibreInstance) {
				mapLibreInstance.setCenter({ lat: coords.latitude, lng: coords.longitude })
			} else if (mapType === MapType.Google && googleMapInstance) {
				googleMapInstance.setCenter({ lat: coords.latitude, lng: coords.longitude })
				googleMapInstance.setZoom(14)
			}
			setViewState({ longitude: lng, latitude: lat, zoom })
		},
		[mapType, googleMapInstance, mapLibreInstance, setViewState, getLayer, removeLayer],
	)

	const showMapInfoWindow = (infoWindow: MapInfoWindow) => {
		setMapInfoWindow(infoWindow)
	}

	const hideMapInfoWindow = () => {
		setMapInfoWindow(null)
	}

	return (
		<MapContext.Provider
			value={{
				setMapType,
				setBasemap,
				setViewState,
				setExtent,
				setGoogleMapInstance,
				setMapLibreInstance,
				setCenterAndZoom,
				showMapInfoWindow,
				hideMapInfoWindow,
				mapType,
				basemap,
				viewState,
				googleMapInstance,
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
