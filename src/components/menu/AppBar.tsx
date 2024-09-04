import AppLogo from '@/components/svg/AppLogo'
import { NEXTAUTH_PROVIDER_ID } from '@/../webapp.config'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Button, Typography } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import UserAvatar from './UserAvatar'

const AppBar = () => {
	const { data: session } = useSession()
	const { t } = useTranslation('common')

	return (
		<div className='flex h-[86px] flex-row items-center justify-between border-0 border-b border-solid border-[#e9ecee] bg-white px-[30px]'>
			<div className='flex items-center gap-4'>
				<AppLogo />
				<Typography variant='header24' className='ml-5 text-center'>
					{t('appName')}
				</Typography>
			</div>
			<div className='flex items-center gap-4'>
				{session?.user ? (
					<>
						<UserAvatar user={session.user} />
						<Button variant='contained' startIcon={<ExitToAppIcon />} onClick={() => signOut()}>
							{t('logout')}
						</Button>
					</>
				) : (
					<Button
						variant='contained'
						startIcon={<LockOpenIcon />}
						onClick={() => signIn(NEXTAUTH_PROVIDER_ID)}
					>
						{t('login')}
					</Button>
				)}
			</div>
		</div>
	)
}

export default AppBar
