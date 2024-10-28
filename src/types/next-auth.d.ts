/**
 * File: next-auth.d.ts
 * Desc: Custom NextAuth.js TypeScript Type
 * Created By: anirutn@thaicom.net
 * Date: 2022/04/16
 * Last Update: 2024/01/08
 *
 */
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			id?: string | null
			username?: string | null
			firstName?: string | null
			lastName?: string | null
			email?: string | null
			image?: string | null
			role?: string | null
			orgCode?: string | null
			responsibleProvinceCode?: string | null
			responsibleDistrictCode?: string | null
			flagStatus?: string | null
			accessToken?: string | null
			refreshToken?: string | null
			expireAt?: number | null
		} & DefaultSession['user']
	}

	/** The profile returned from your (OAuth/Credentials) provider */
	interface Profile extends DefaultProfile {
		id?: string | null
		username?: string // for cognito provider, must copy from 'cognito:username'
		'cognito:username'?: string // cognito provider
		email?: string | null
		phone_number?: string | null
		role?: string
		orgCode?: string
		given_name?: string
		family_name?: string
		access_token?: string | null
		refresh_token?: string | null
		auth_time?: number | null
		exp?: number | null
	}

	/* User object returned in the OAuth providers' `profile` callback, or the second parameter of the `session` callback, when using a database. */
	interface User extends DefaultUser {
		// _id?: string | null;
		uid?: string | null
		username?: string | null
		phone_number?: string | null
		role?: string | null
		orgCode?: string | null
		given_name?: string
		family_name?: string
		access_token?: string | null
		refresh_token?: string | null
		expire_at?: Date | null
	}
}

declare module 'next-auth/jwt' {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT extends DefaultJWT {
		id?: string | null
		username?: string | null
		email?: string | null
		phone_number?: string | null
		role?: string | null
		orgCode?: string | null
		given_name?: string
		family_name?: string
		image?: string | null
		authTime?: number | null
		access_token?: string | null
		refresh_token?: string | null

		auth_time?: number | null
		expire_at?: number | null
		expire_in?: number | null // for refresh cognito token
	}
}
