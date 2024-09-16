import React, { forwardRef, useImperativeHandle, useMemo, useEffect, useRef } from 'react'
import { APIProvider, Map, useMap as useMapGoogle } from '@vis.gl/react-google-maps'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import useLayerStore from './store/map'
import { useMap } from './context/map'

const DeckGLOverlay = () => {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	const map = useMapGoogle()
	const overlay = useMemo(() => new GoogleMapsOverlay({}), [])
	useEffect(() => {
		if (overlay instanceof GoogleMapsOverlay) {
			overlay.setProps({ layers })
		}
	}, [layers, overlay])
	useEffect(() => {
		if (overlay instanceof GoogleMapsOverlay) {
			overlay.setMap(map)
			setOverlay(overlay)
		}
		return () => {
			overlay.finalize()
		}
	}, [map, overlay, setOverlay])
	return null
}

export default function MapGoogle() {
	const overlay = useLayerStore((state) => state.overlay)
	const { viewState, setViewState, setGoogleMapInstance, mapType } = useMap()

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
				onBoundsChanged={(evt) => {
					setGoogleMapInstance(evt.map)
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
