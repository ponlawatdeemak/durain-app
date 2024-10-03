import 'maplibre-gl/dist/maplibre-gl.css'
import React, { FC, memo, useCallback, useEffect } from 'react'
import { Map, useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import useMapStore from './store/map'
import { MapInterface } from './interface/map'
import maplibregl, { MapLibreEvent, StyleSpecification } from 'maplibre-gl'
import { googleProtocol } from '@/utils/google'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'

const DeckGLOverlay: FC = () => {
	const { layers } = useMapStore()
	const setOverlay = useMapStore((state) => state.setOverlay)
	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({ interleaved: true }))
	useEffect(() => {
		if (overlay instanceof MapboxOverlay) {
			const temp = layers.map((item) => {
				if (item instanceof IconLayer) {
					return new IconLayer({ ...item.props })
				}
				if (item instanceof MVTLayer) {
					return new MVTLayer({ ...item.props })
				}
				return item
			})
			overlay.setProps({ layers: temp })
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

interface MapLibreProps extends MapInterface {
	mapStyle: string | StyleSpecification
}

const MapLibre: FC<MapLibreProps> = ({ viewState, mapStyle, onViewStateChange }) => {
	const { setMapLibre } = useMapStore()

	// initial google basemap style
	useEffect(() => {
		maplibregl.addProtocol('google', googleProtocol)
	}, [])

	// remove map instance in context
	useEffect(() => {
		return () => {
			setMapLibre(null)
		}
	}, [setMapLibre])

	const onLoad = useCallback(
		(event: MapLibreEvent) => {
			// add reference layer for all deck.gl layer under this layer and display draw layer to top
			const map = event.target
			map.addSource('custom-referer-source', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] },
			})
			map.addLayer({
				id: 'custom-referer-layer',
				type: 'symbol',
				source: 'custom-referer-source',
				layout: { visibility: 'none' },
			})
			setMapLibre(map)
		},
		[setMapLibre],
	)

	return (
		<Map
			initialViewState={viewState}
			mapStyle={mapStyle}
			preserveDrawingBuffer={true}
			zoom={viewState?.zoom}
			onMove={(e) => onViewStateChange?.(e.viewState)}
			onLoad={onLoad}
		>
			<DeckGLOverlay />
		</Map>
	)
}

export default memo(MapLibre)
