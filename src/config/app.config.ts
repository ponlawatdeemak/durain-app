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
	province: 'https://tileserver.cropinsurance-dev.thaicom.io/province/tiles.json',
	boundaryYear: (year: string | number) =>
		`https://tileserver.cropinsurance-dev.thaicom.io/boundary_${year}/tiles.json`,
}

export const layerIdConfig = {
	toolCurrentLocation: 'tool-current-layer',
	toolMeasurement: 'tool-measurement-layer',
}
