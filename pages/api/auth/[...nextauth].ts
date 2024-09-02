import service from '@/api'
import { apiAccessToken, updateAccessToken } from '@/api/core'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CognitoProvider from 'next-auth/providers/cognito'
import { getSession } from 'next-auth/react'

async function refreshAccessToken(token: JWT): Promise<JWT> {
	try {
		const res = await service.auth.refreshToken({ refreshToken: token.refresh_token })
		return {
			...token,
			access_token: res.data?.access_token,
			expire_in: res.data?.expires_in,
		}
	} catch (error) {
		console.error(error)
		return {
			...token,
			error: 'RefreshAccessTokenError',
		}
	}
}

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,

	// Configure one or more authentication providers
	providers: [
		CognitoProvider({
			clientId: `${process.env.COGNITO_CLIENT_ID}`,
			clientSecret: `${process.env.COGNITO_CLIENT_SECRET}`,
			issuer: `${process.env.COGNITO_ISSUER}`,
			wellKnown: `${process.env.COGNITO_WELLKNOWN}`,
		}),
	],

	session: {
		// Choose how you want to save the user session.
		// The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
		// If you use an `adapter` however, we default it to `"database"` instead.
		// You can still force a JWT session by explicitly defining `"jwt"`.
		// When using `"database"`, the session cookie will only contain a `sessionToken` value,
		// which is used to look up the session in the database.
		strategy: 'jwt',

		// Seconds - How long until an idle session expires and is no longer valid.
		maxAge: 60 * 60 * 24 * 30, // 30 days

		// Seconds - Throttle how frequently to write to database to extend a session.
		// Use it to limit write operations. Set to 0 to always update the database.
		// Note: This option is ignored if using JSON Web Tokens
		updateAge: 24 * 60 * 60, // 24 hours
	},

	jwt: {
		// The maximum age of the NextAuth.js issued JWT in seconds.
		// Defaults to `session.maxAge`.
		maxAge: 60 * 60 * 24 * 30,
	},

	callbacks: {
		/*
		 * This callback is called whenever a JSON Web Token is created or updated.
		 * The returned value will be encrypted, and it is stored in a cookie.
		 */
		async jwt({ token, user, account, profile, trigger }) {
			// if the access token expired, recheck token (user info) again
			if (token.expire_at ?? 0 < Date.now()) {
				console.log('nextauth: jwt: accessToken Expired, check refresh token')

				// Access token has expired, try to update it
				const newToken = await refreshAccessToken(token)
				token.access_token = newToken.access_token

				if (newToken.expire_in) {
					token.expire_at = Date.now() + newToken.expire_in
				}
			}

			// Persist the OAuth access_token to the token right after signin
			if (account) {
				token.access_token = account.access_token
				token.refresh_token = account.refresh_token
				token.expire_at = account.expires_at
			}

			const isSignIn = trigger == 'signIn'
			if (isSignIn) {
				// NOTE: workaround, for cogito provider
				if (profile) {
					profile.username = profile?.['cognito:username'] ?? ''
				}

				token.uid = user.id
				token.username = profile?.username
				token.given_name = profile?.given_name
				token.family_name = profile?.family_name
				token.phone_number = profile?.phone_number

				// TODO - if support user role or other extra user's field
				token.role = user.role
				token.orgCode = user.orgCode
			}

			return token
		},

		/*
		 * The session callback is called whenever a session is checked.
		 * By default, only a subset of the token is returned for increased security.
		 * If you want to make something available (you added to the token through the jwt() callback), you have to explicitly forward it here to make it available to the client.
		 */
		async session({ session, token }) {
			// Send properties to the client, like an access_token from a provider.

			let profile
			if (!apiAccessToken || apiAccessToken !== token.access_token) {
				updateAccessToken({
					accessToken: token.access_token ?? undefined,
					refreshToken: token.refresh_token ?? undefined,
				})
				const res = await service.um.getProfile().catch((error) => console.error(error))
				profile = res?.data
			}

			session.user.id = profile?.id ?? token.sub
			session.user.username = profile?.username ?? token.username
			session.user.firstName = profile?.firstName ?? token.given_name
			session.user.lastName = profile?.lastName ?? token.family_name
			session.user.email = profile?.email ?? token.email
			session.user.image = profile?.image
			session.user.orgCode = profile?.orgCode
			session.user.role = profile?.role
			session.user.responsibleProvinceCode = profile?.responsibleProvinceCode
			session.user.responsibleDistrictCode = profile?.responsibleDistrictCode
			session.user.accessToken = token.access_token ?? ''
			session.user.refreshToken = token.refresh_token ?? ''

			return session
		},

		/* Use the signIn() callback to control if a user is allowed to sign in. */
		async signIn({ user, account, profile, email, credentials }) {
			const isAllowedToSignIn = true
			if (isAllowedToSignIn) {
				return true
			} else {
				// Return false to display a default error message
				return false
				// Or you can return a URL to redirect to:
				// return '/unauthorized'
			}
		},

		/* The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout). */
		async redirect({ url, baseUrl }) {
			// NOTE: workaround fix, required when use custom signin page
			var session = null
			try {
				session = await getSession()
			} catch {}

			if (!session) return baseUrl

			// Allows relative callback URLs
			if (url.startsWith('/')) return new URL(url, baseUrl).toString()
			// Allows callback URLs on the same origin
			else if (new URL(url).origin === baseUrl) return url

			return baseUrl
		},
	},
}

export default NextAuth(authOptions)
