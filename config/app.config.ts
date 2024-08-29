export enum AppPath {
	Overview = '/overview',
	Analyze = '/analyze',
	RegisterData = '/register-data',
	UserManagement = '/user-management',
	AboutUs = '/about-us',
}

export const allowGuestPages = [AppPath.Overview, AppPath.AboutUs]

export enum Languages {
	TH = 'th',
	EN = 'en',
}
