import { Layer } from '@deck.gl/core'

export interface MapViewState {
	longitude: number
	latitude: number
	zoom: number
}

export interface BaseMap {
	value: BasemapType
	image: string
	label: string
}

export interface LatLng {
	lat: number
	lng: number
}

export interface MapInfoWindow {
	positon?: {
		x: number
		y: number
	}
	children?: React.ReactNode
}

export interface MapLayer {
	id: string
	label: string
	color: string
	layer: Layer
}

export interface MapLegend {
	id: string
	label: string
	color: string
}

export enum MapType {
	Google,
	Libre,
}

export enum BasemapType {
	CartoLight,
	CartoDark,
	Google,
}
