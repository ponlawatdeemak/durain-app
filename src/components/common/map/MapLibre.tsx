import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect } from 'react'
import { Map, useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import useLayerStore from './store/map'
import { BasemapType } from './interface/map'
import { useMap } from './context/map'
import { BASEMAP } from '@deck.gl/carto'

const DeckGLOverlay = () => {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({}))
	useEffect(() => {
		if (overlay instanceof MapboxOverlay) {
			overlay.setProps({ layers })
		}
	}, [layers, overlay])
	useEffect(() => {
		if (overlay instanceof MapboxOverlay) {
			setOverlay(overlay)
		}
		return () => {
			overlay.finalize()
		}
	}, [overlay, setOverlay])
	return null
}

export default function MapLibre() {
	const overlay = useLayerStore((state) => state.overlay)
	const { viewState, basemap, setViewState, setMapLibreInstance, mapType } = useMap()

	useEffect(() => {
		return () => {
			overlay?.setProps({ layers: [] })
		}
	}, [overlay])

	return (
		<Map
			initialViewState={viewState}
			mapStyle={basemap === BasemapType.CartoLight ? BASEMAP.VOYAGER : BASEMAP.DARK_MATTER}
			preserveDrawingBuffer={true}
			zoom={viewState?.zoom}
			onMove={(e) => setViewState?.(e.viewState)}
			ref={(ref) => setMapLibreInstance(ref?.getMap() || null)}
		>
			<DeckGLOverlay />
		</Map>
	)
}
