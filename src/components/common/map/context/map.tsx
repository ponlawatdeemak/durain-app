import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { BasemapType, LatLng, MapInfoWindow, MapType, MapViewState } from '../interface/map'
import useLayerStore from '../store/map'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Layer } from '@deck.gl/core'
import { layerIdConfig } from '@/config/app.config'

interface MapContextProps {
	setViewState: (viewState: MapViewState) => void
	setMapType: (type: MapType) => void
	setBasemap: (type: BasemapType) => void
	setExtent: (extent: [number, number, number, number]) => void
	setGoogleMapInstance: (mapInstance: google.maps.Map | null) => void
	setMapLibreInstance: (mapInstance: maplibregl.Map | null) => void
	getLocation: () => void
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
	mapType: MapType.Google,
	basemap: BasemapType.Google,
}

const MapContext = createContext<MapContextProps>({
	setViewState: () => {},
	setMapType: () => {},
	setBasemap: () => {},
	setExtent: () => {},
	setGoogleMapInstance: () => {},
	setMapLibreInstance: () => {},
	getLocation: () => {},
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
	const { getLayer, getLayers, setLayers, addLayer, removeLayer } = useLayerStore()
	const [mapType, setMapType] = useState<MapType>(DEFAULT.mapType)
	const [basemap, setBasemap] = useState(DEFAULT.basemap)
	const [viewState, setViewState] = useState<MapViewState>(DEFAULT.viewState)
	const [googleMapInstance, setGoogleMapInstance] = useState<google.maps.Map | null>(null)
	const [mapLibreInstance, setMapLibreInstance] = useState<maplibregl.Map | null>(null)
	const [mapInfoWindow, setMapInfoWindow] = useState<MapInfoWindow | null>(null)

	useEffect(() => {
		console.log('mapLibreInstance', mapLibreInstance)
		console.log('googleMapInstance', googleMapInstance)
	}, [mapLibreInstance, googleMapInstance])

	useEffect(() => {
		if (basemap === BasemapType.Google) {
			setMapType(MapType.Google)
			setMapLibreInstance(null)
		} else {
			setMapType(MapType.Libre)
			setGoogleMapInstance(null)
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

	const getLocation = useCallback(() => {
		const layer = getLayer(layerIdConfig.toolCurrentLocation)
		if (layer) {
			removeLayer(layerIdConfig.toolCurrentLocation)
		} else {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					async (position) => {
						const { longitude: lng, latitude: lat } = position.coords
						if (mapType === MapType.Libre && mapLibreInstance) {
							mapLibreInstance.setCenter({ lat, lng })
						} else if (mapType === MapType.Google && googleMapInstance) {
							googleMapInstance.setCenter({ lat, lng })
							googleMapInstance.setZoom(14)
						}
						setViewState({ longitude: lng, latitude: lat, zoom: 14 })
						addCurrentLocationPin({ lat, lng })
					},
					(error) => {
						console.error('Error fetching location:', error)
					},
				)
			} else {
				console.log('Geolocation is not supported by this browser.')
			}
		}
	}, [mapType, googleMapInstance, mapLibreInstance, setViewState, getLayer, removeLayer])

	const addCurrentLocationPin = useCallback(
		(latlnt: LatLng) => {
			const layer = getLayer(layerIdConfig.toolCurrentLocation)
			if (!layer) {
				addLayer(
					new IconLayer({
						id: layerIdConfig.toolCurrentLocation,
						data: [{ coordinates: [latlnt.lng, latlnt.lat] }],
						iconAtlas: '/images/map/icon-atlas.png',
						iconMapping: {
							marker: {
								x: 0,
								y: 0,
								width: 128,
								height: 128,
								anchorX: 64,
								anchorY: 64,
								mask: true,
							},
						},
						getIcon: () => 'marker',
						getPosition: (d: any) => {
							console.log('getPosition', d)
							return d.coordinates
						},
						getSize: 40,
						getColor: [255, 0, 0],
						pickable: true,
					}),
				)
			}
		},
		[getLayer, addLayer],
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
				getLocation,
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
