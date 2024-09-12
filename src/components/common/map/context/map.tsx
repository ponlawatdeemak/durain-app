import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { BasemapType, MapType, MapViewState } from '../interface/map'

interface MapContextProps {
	setViewState: (viewState: MapViewState) => void
	setMapType: (type: MapType) => void
	setBasemap: (type: BasemapType) => void
	setExtent: (extent: [number, number, number, number]) => void
	setGoogleMapInstance: (mapInstance: google.maps.Map | null) => void
	setMapLibreInstance: (mapInstance: maplibregl.Map | null) => void
	getLocation: () => void
	viewState: MapViewState
	mapType: MapType
	basemap: BasemapType
	googleMapInstance: google.maps.Map | null
	mapLibreInstance: maplibregl.Map | null
	currentLocation: { lat: number; lng: number } | null
}

const MapContext = createContext<MapContextProps>({
	setViewState: () => {},
	setMapType: () => {},
	setBasemap: () => {},
	setExtent: () => {},
	setGoogleMapInstance: () => {},
	setMapLibreInstance: () => {},
	getLocation: () => {},
	viewState: {
		longitude: 100,
		latitude: 13,
		zoom: 5,
	},
	mapType: MapType.Libre,
	basemap: BasemapType.CartoLight,
	googleMapInstance: null,
	mapLibreInstance: null,
	currentLocation: null,
})

export const MapProvider = ({ children }: { children: ReactNode }) => {
	const [mapType, setMapType] = useState<MapType>(MapType.Libre)
	const [viewState, setViewState] = useState<MapViewState>({
		longitude: 100,
		latitude: 13,
		zoom: 5,
	})
	const [googleMapInstance, setGoogleMapInstance] = useState<google.maps.Map | null>(null)
	const [mapLibreInstance, setMapLibreInstance] = useState<maplibregl.Map | null>(null)
	const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
	const [basemap, setBasemap] = useState(BasemapType.CartoLight)

	useEffect(() => {
		console.log('mapLibreInstance', mapLibreInstance)
		console.log('googleMapInstance', googleMapInstance)
		// window['mapLibreInstance'] = mapLibreInstance
		// window['googleMapInstance'] = googleMapInstance
	}, [mapLibreInstance, googleMapInstance])

	useEffect(() => {
		if (basemap === BasemapType.Google) setMapType(MapType.Google)
		else setMapType(MapType.Libre)
	}, [basemap])

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
		// if (currentLocation) {
		// 	setCurrentLocation(null)
		// } else
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords
					setCurrentLocation({ lat: latitude, lng: longitude })
					setViewState({ longitude, latitude, zoom: 14 })
					if (mapType === MapType.Google && googleMapInstance) {
						// googleMapInstance.setCenter(new google.maps.LatLng(latitude, longitude))
						// googleMapInstance.setZoom(14)
					} else if (mapType === MapType.Libre && mapLibreInstance) {
						// mapLibreInstance.setCenter([longitude, latitude])
						// mapLibreInstance.setZoom(14)
						// const image = await mapLibreInstance.loadImage(
						// 	'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
						// )
						// mapLibreInstance.addImage('cat', image.data)
						// mapLibreInstance.getImage('cat')
						// mapLibreInstance.addLayer({
						// 	id: 'points',
						// 	type: 'symbol',
						// 	source: 'point',
						// 	layout: {
						// 		'icon-image': 'cat',
						// 		'icon-size': 0.25,
						// 	},
						// })
						// const marker = new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(mapLibreInstanc)
					}
				},
				(error) => {
					console.error('Error fetching location:', error)
				},
			)
		} else {
			console.log('Geolocation is not supported by this browser.')
		}
	}, [mapType, googleMapInstance, mapLibreInstance, currentLocation])

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
				mapType,
				basemap,
				viewState,
				googleMapInstance,
				mapLibreInstance,
				currentLocation,
			}}
		>
			{children}
		</MapContext.Provider>
	)
}

export function useMap() {
	return useContext(MapContext)
}
