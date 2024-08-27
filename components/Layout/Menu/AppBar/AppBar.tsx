import React from 'react'
import styles from './AppBar.module.css'
import { signIn, signOut, useSession } from 'next-auth/react'
import UserAvatar from '@/components/UserAvatar'
import { Profile } from 'next-auth'
import { useTranslation } from 'next-i18next'
import { Button, Typography } from '@mui/material'
import { NEXTAUTH_PROVIDER_ID } from '@/webapp.config'

const AppBar = () => {
	const { data: session } = useSession()
	const user = session?.user
	const { t } = useTranslation('common')
	return (
		<div className={styles.main}>
			<div>
				<div>icon</div>
				<Typography>ระบบวิเคราะห์พื้นที่ปลูกทุเรียน</Typography>
			</div>
			{user ? (
				<div>
					{/* <UserAvatar user={user as Profile} size='large' />{' '} */}
					<Button variant='contained' onClick={() => signOut()}>
						{t('LOGOUT')}
					</Button>
				</div>
			) : (
				<Button variant='contained' onClick={() => signIn(NEXTAUTH_PROVIDER_ID)}>
					{t('LOGIN')}
				</Button>
			)}
		</div>
	)
}

export default AppBar
