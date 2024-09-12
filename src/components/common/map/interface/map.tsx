import { LayersList } from '@deck.gl/core'
import { PropsWithChildren } from 'react'

export interface MapInterface {
	layers?: LayersList
}

export interface MapViewProps extends PropsWithChildren {
	className?: string
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

export interface MapToolsProps {
	minZoom?: number
	maxZoom?: number
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
