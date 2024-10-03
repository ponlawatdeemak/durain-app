import { LngLatBoundsLike } from 'maplibre-gl'

export enum AppPath {
	Overview = '/overview',
	Analyze = '/analyze',
	Registration = '/registration',
	UserManagement = '/user-management',
	About = '/about',
	Playground = '/playground',
}

export const allowGuestPages = [AppPath.Overview, AppPath.About, AppPath.Playground]

export const tileLayer = {
	boundaryYear: (year: string | number) =>
		`https://tileserver.cropinsurance-dev.thaicom.io/boundary_${year}/tiles.json`,

	province: `${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/province/tiles.json`,
	district: `${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/district/tiles.json`,
	subDistrict: `${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/subdistrict/tiles.json`,
	registerLayer: (year: string | number) =>
		`${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/registered_${year}/tiles.json`,
	durianLayer: (year: string | number) => `${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/durian_${year}/tiles.json`,
}

export const layerIdConfig = {
	toolCurrentLocation: 'tool-current-layer',
	toolMeasurement: 'tool-measurement-layer',
}

export const thaiExtent: LngLatBoundsLike = [97.3758964376, 5.69138418215, 105.589038527, 20.4178496363]
