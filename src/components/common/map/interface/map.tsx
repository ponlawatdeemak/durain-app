import { LayersList } from '@deck.gl/core'
import { PropsWithChildren } from 'react'

export interface MapInterface {
	layers?: LayersList
	onMapClick?: (point: MapPoint | null) => void
}

export interface MapViewProps extends PropsWithChildren {
	className?: string
	onMapClick?: (point: MapPoint | null) => void
}
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

export interface MapPoint {
	lat: number
	lng: number
}

export interface MapToolsProps {
	basemapList?: BaseMap[]
	layersList?: any[]
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
