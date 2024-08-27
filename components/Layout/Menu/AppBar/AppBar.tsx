import React from 'react'
import styles from './AppBar.module.css'
import { signIn, signOut, useSession } from 'next-auth/react'
import UserAvatar from '@/components/UserAvatar/UserAvatar'
import { Profile } from 'next-auth'
import { useTranslation } from 'next-i18next'
import { Button, Typography } from '@mui/material'
import { NEXTAUTH_PROVIDER_ID } from '@/webapp.config'
import AppLogo from '@/components/svg/AppLogo'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

const AppBar = () => {
	const { data: session } = useSession()
	const user = session?.user
	const { t } = useTranslation('common')
	return (
		<div className={styles.main}>
			<div className={styles.leftHeader}>
				<AppLogo />
				<Typography variant='header24' className={styles.appName}>
					ระบบวิเคราะห์พื้นที่ปลูกทุเรียน
				</Typography>
			</div>
			<div className={styles.rightHeader}>
				{user ? (
					<>
						<UserAvatar user={user as Profile} />
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
