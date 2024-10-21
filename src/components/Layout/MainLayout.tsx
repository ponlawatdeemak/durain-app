import { PropsWithChildren } from 'react'
import AppBar from '../menu/AppBar'
import SideBar from '../menu/SideBar'

interface MainLayoutProps extends PropsWithChildren {}

export default function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className='flex h-full w-full flex-col'>
			<AppBar />
			<div className='flex flex-1 flex-row overflow-hidden'>
				<SideBar />
				{children}
			</div>
		</div>
	)
}
