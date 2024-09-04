export enum AppPath {
	Overview = '/overview',
	Analyze = '/analyze',
	Registration = '/registration',
	UserManagement = '/user-management',
	About = '/about',
}

export const allowGuestPages = [AppPath.Overview, AppPath.About]
