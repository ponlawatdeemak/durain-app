import AppLogo from '@/components/svg/AppLogo'
import { NEXTAUTH_PROVIDER_ID } from '@/../webapp.config'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { Button, Typography } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import UserAvatar from './UserAvatar'
import { Languages } from '@/config/app.config'

const AppBar = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const { t, i18n } = useTranslation('common')

	const switchLanguage = () => {
		let locale
		if (i18n.language === Languages.EN) {
			locale = Languages.TH
		} else {
			locale = Languages.EN
		}
		i18n.changeLanguage(Languages.EN)
		router.push(
			{
				pathname: router.pathname,
				query: router.query,
			},
			router.asPath,
			{ locale },
		)
	}
	return (
		<div className='flex h-[86px] flex-row items-center justify-between border-0 border-b border-solid border-[#e9ecee] bg-white px-[30px]'>
			<div className='flex items-center'>
				<AppLogo />
				<Typography variant='header24' className='ml-5 text-center'>
					ระบบวิเคราะห์พื้นที่ปลูกทุเรียน
				</Typography>
			</div>
			<div className='flex items-center'>
				<Button variant='outlined' onClick={switchLanguage}>
					Toggle Language
				</Button>
				{session?.user ? (
					<>
						<UserAvatar user={session.user} />
						<Button variant='contained' startIcon={<ExitToAppIcon />} onClick={() => signOut()}>
							{t('LOGOUT')}
						</Button>
					</>
				) : (
					<Button
						variant='contained'
						startIcon={<LockOpenIcon />}
						onClick={() => signIn(NEXTAUTH_PROVIDER_ID)}
					>
						{t('LOGIN')}
					</Button>
				)}
			</div>
		</div>
	)
}

export default AppBar
