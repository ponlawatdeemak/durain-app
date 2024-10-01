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
    district:`${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/district/tiles.json`,
    subDistrict:`${process.env.NEXT_PUBLIC_API_HOSTNAME_TILE}/subdistrict/tiles.json`
}

export const layerIdConfig = {
	toolCurrentLocation: 'tool-current-layer',
	toolMeasurement: 'tool-measurement-layer',
}
