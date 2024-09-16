import { PropsWithChildren } from 'react'
import AppBar from '../menu/AppBar'
import SideBar from '../menu/SideBar'

interface MainLayoutProps extends PropsWithChildren {}

export default function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className='flex flex-1 flex-col'>
			<AppBar />
			<div className='flex flex-1 flex-row'>
				<SideBar />
				<div className='flex flex-1 flex-row'>{children}</div>
			</div>
		</div>
	)
}
