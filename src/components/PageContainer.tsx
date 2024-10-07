import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Container } from '@mui/material'
import UserAccountLoginResponse from '@/models/UserAccountLoginResponse'
import { NEXTAUTH_PROVIDER_ID } from '../../webapp.config'
import GuestLogin from '../../lib/api-client/GuestLogin'
import { useWebAppStore } from '@/store/web-app-store'

interface Props {
	requireLogin?: boolean
	children: JSX.Element | JSX.Element[]
}

export default function PageContainer(props: Props) {
	const { requireLogin, children } = props

	const { data: authSession, status } = useSession()
	const { apiToken, setApiToken } = useWebAppStore()
	const [loading, setLoading] = useState<boolean>(false)

	/** get access token for guest user */
	async function getGuestAccessToken() {
		if (loading) return

		setLoading(true)

		try {
			const tokens: UserAccountLoginResponse = await GuestLogin()
			const accessToken = tokens.tokens?.accessToken ?? ''
			setApiToken(accessToken)
		} catch (err) {
			console.error('getGuestAccessToken: ERROR!! ' + err)
		}

		setLoading(false)
	}

	useEffect(() => {
		if (authSession === undefined) {
		} else if (authSession === null) {
			getGuestAccessToken()
		}
	}, [authSession])

	if (requireLogin && !authSession && status != 'loading') {
		signIn(NEXTAUTH_PROVIDER_ID)
		return <></>
	}

	return (
		<Container
			maxWidth={false}
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: 0,
				// paddingBottom: 10,
			}}
		>
			{children}
		</Container>
	)
}
