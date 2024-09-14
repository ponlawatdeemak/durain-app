import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { BasemapType, MapPoint, MapType, MapViewState } from '../interface/map'

interface MapContextProps {
	setViewState: (viewState: MapViewState) => void
	setMapType: (type: MapType) => void
	setBasemap: (type: BasemapType) => void
	setExtent: (extent: [number, number, number, number]) => void
	setGoogleMapInstance: (mapInstance: google.maps.Map | null) => void
	setMapLibreInstance: (mapInstance: maplibregl.Map | null) => void
	getLocation: () => void
	getPopup: (point: MapPoint, node: any) => void
	viewState: MapViewState
	mapType: MapType
	basemap: BasemapType
	googleMapInstance: google.maps.Map | null
	mapLibreInstance: maplibregl.Map | null
}

const MapContext = createContext<MapContextProps>({
	setViewState: () => {},
	setMapType: () => {},
	setBasemap: () => {},
	setExtent: () => {},
	setGoogleMapInstance: () => {},
	setMapLibreInstance: () => {},
	getLocation: () => {},
	getPopup: () => {},
	viewState: {
		longitude: 100,
		latitude: 13,
		zoom: 5,
	},
	mapType: MapType.Libre,
	basemap: BasemapType.CartoLight,
	googleMapInstance: null,
	mapLibreInstance: null,
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
	// const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
	const [basemap, setBasemap] = useState(BasemapType.CartoLight)

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
		// add toggle marker
		// if (currentLocation) {
		// 	// remove marker pin current location
		// 	setCurrentLocation(null)
		// re
		// }
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { longitude, latitude } = position.coords
					if (mapType === MapType.Libre && mapLibreInstance) {
						mapLibreInstance.setCenter({ lat: latitude, lng: longitude })
						setViewState({ longitude, latitude, zoom: 14 })
						// add marker pin current location
					} else if (mapType === MapType.Google && googleMapInstance) {
						console.log(googleMapInstance.setCenter)
						googleMapInstance.setCenter({ lat: latitude, lng: longitude })
						googleMapInstance.setZoom(14)
						setViewState({ longitude, latitude, zoom: 14 })
						// add marker pin current location
					}
				},
				(error) => {
					console.error('Error fetching location:', error)
				},
			)
		} else {
			console.log('Geolocation is not supported by this browser.')
		}
	}, [mapType, googleMapInstance, mapLibreInstance, setViewState])

	const getPopup = useCallback(
		(point: MapPoint, _: any) => {
			// point: จุดที่ต้องการให้ popup แสดง
			// element: Html ที่ต้องการแสดงใน popup
			// console.log('getPopup', point)
			// const element = `<div>Hello</div>`
			// if (mapType === MapType.Libre && mapLibreInstance) {
			// 	new maplibregl.Popup().setLngLat(point).setHTML(element).addTo(mapLibreInstance)
			// 	// add marker
			// } else if (mapType === MapType.Google && googleMapInstance) {
			// 	new google.maps.InfoWindow({
			// 		content: element,
			// 	}).open(
			// 		googleMapInstance,
			// 		new google.maps.Marker({
			// 			position: point,
			// 			map: googleMapInstance,
			// 		}),
			// 	)
			// }
		},
		[mapType, googleMapInstance, mapLibreInstance],
	)

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
				getPopup,
				mapType,
				basemap,
				viewState,
				googleMapInstance,
				mapLibreInstance,
			}}
		>
			{children}
		</MapContext.Provider>
	)
}

export function useMap() {
	return useContext(MapContext)
}
