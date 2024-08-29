import service from '@/api'
import { updateAccessToken } from '@/api/core'
import { allowGuestPages } from '@/config/app.config'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { NEXTAUTH_PROVIDER_ID } from '../webapp.config'

interface Props {
	children: ReactNode
}

export default function IdentityProvider(props: Props) {
	const { children } = props
	const { data: session, status } = useSession()
	const [loading, setLoading] = useState<boolean>(false)
	const [token, setToken] = useState<string>()
	const router = useRouter()

	const requireLogin = useMemo(() => {
		return !allowGuestPages.some((path) => router.pathname.includes(path))
	}, [router.pathname])

	/** get access token for guest user */
	const getGuestAccessToken = useCallback(async () => {
		if (loading) return
		setLoading(true)
		try {
			const { data } = await service.auth.loginGuest()
			if (data) {
				const accessToken = data.tokens?.accessToken ?? ''
				if (accessToken) {
					updateAccessToken(accessToken)
					setToken(accessToken)
				}
			}
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		// session is undefined mean session not successfully loaded yet
		if (session?.user?.accessToken) {
			updateAccessToken(session.user.accessToken)
			setToken(session.user.accessToken)
		} else if (session === null) {
			getGuestAccessToken()
		}
	}, [getGuestAccessToken, session])

	if (requireLogin && !session && status != 'loading') {
		signIn(NEXTAUTH_PROVIDER_ID)
		return null
	}
	if (token) {
		return children
	}

	return null // loading
}
