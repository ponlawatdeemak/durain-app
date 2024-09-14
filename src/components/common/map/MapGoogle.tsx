'use client'
import React, { useMemo, useEffect, useRef } from 'react'
import { APIProvider, Map, useMap as useMapGoogle } from '@vis.gl/react-google-maps'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import useLayerStore from './store/map'
import { useMap } from './context/map'
import { MapInterface } from './interface/map'

const DeckGLOverlay = () => {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	const map = useMapGoogle()
	const overlay = useMemo(() => new GoogleMapsOverlay({}), [])
	useEffect(() => {
		overlay.setProps({ layers })
	}, [layers, overlay])
	useEffect(() => {
		overlay.setMap(map)
		setOverlay(overlay)
	}, [map, overlay, setOverlay])
	return null
}

export default function MapGoogle({ layers, onMapClick }: MapInterface) {
	const mapRef = useRef<google.maps.Map | null>(null)
	const overlay = useLayerStore((state) => state.overlay)
	const { viewState, setViewState, setGoogleMapInstance } = useMap()

	useEffect(() => {
		if (mapRef.current) {
			setGoogleMapInstance(mapRef.current)
		}
	}, [mapRef.current, setGoogleMapInstance])

	useEffect(() => {
		return () => {
			overlay?.setProps({ layers: [] })
		}
	}, [overlay])

	return (
		<APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
			<Map
				defaultCenter={{ lat: viewState?.latitude!, lng: viewState?.longitude! }}
				defaultZoom={viewState?.zoom!}
				mapId={process.env.GOOGLE_MAPS_API_MAP_ID}
				mapTypeControl={false}
				fullscreenControl={false}
				zoomControl={false}
				zoom={viewState?.zoom}
				streetViewControl={false}
				mapTypeId='hybrid'
				onClick={(e) => onMapClick?.(e.detail.latLng)}
				onBoundsChanged={(evt) => {
					mapRef.current = evt.map
					setViewState?.({
						latitude: evt.detail.center.lat,
						longitude: evt.detail.center.lng,
						zoom: evt.detail.zoom,
					})
				}}
			>
				<DeckGLOverlay />
			</Map>
		</APIProvider>
	)
}
