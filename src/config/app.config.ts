export enum AppPath {
	Overview = '/overview',
	Analyze = '/analyze',
	Registration = '/registration',
	UserManagement = '/user-management',
	About = '/about',
	Playground = '/playground',
}

export const allowGuestPages = [AppPath.Overview, AppPath.About]
