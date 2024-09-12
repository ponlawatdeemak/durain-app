'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useRef, useEffect } from 'react'
import { Map, MapRef, useControl } from 'react-map-gl/maplibre'
import maplibregl from 'maplibre-gl'
import { MapboxOverlay } from '@deck.gl/mapbox'
import useLayerStore from './store/map'
import { BasemapType, MapInterface } from './interface/map'
import { useMap } from './context/map'
import { BASEMAP } from '@deck.gl/carto'

const DeckGLOverlay = () => {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({}))
	useEffect(() => {
		overlay.setProps({ layers })
	}, [layers, overlay])
	useEffect(() => {
		setOverlay(overlay)
	}, [overlay, setOverlay])
	return null
}

export default function MapLibre({ layers }: MapInterface) {
	const mapRef = useRef<maplibregl.Map>(null)
	const overlay = useLayerStore((state) => state.overlay)
	const { viewState, basemap, setViewState, setMapLibreInstance } = useMap()

	useEffect(() => {
		if (mapRef.current) {
			setMapLibreInstance(mapRef.current)
		}
	}, [mapRef.current, setMapLibreInstance])

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
			ref={mapRef as unknown as React.LegacyRef<MapRef>}
		>
			<DeckGLOverlay />
		</Map>
	)
}
