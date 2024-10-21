import { PropsWithChildren } from 'react'
import AppBar from '../menu/AppBar'
import SideBar from '../menu/SideBar'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import { useSession } from 'next-auth/react'

interface MainLayoutProps extends PropsWithChildren {}

export default function MainLayout({ children }: MainLayoutProps) {
	const { data: session } = useSession()

	const { data: userProfileData, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ['getProfileMain'],
		queryFn: () => service.um.getProfile(),
		enabled: !!session?.user?.id,
	})

	return (
		<div className='flex h-full w-full flex-col'>
			<AppBar flagStatus={userProfileData?.data?.flagStatus} />
			<div className='flex flex-1 flex-row overflow-hidden'>
				<SideBar flagStatus={userProfileData?.data?.flagStatus} />
				{children}
			</div>
		</div>
	)
}
