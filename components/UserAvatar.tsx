/**
 * File: UserAvatar.tsx
 * Desc: Custom User Avatar based on current login auth session
 * Created By: anirutn@thaicom.net
 * Date: 2021/03/24
 * Last Update: 2024/07/08
 *
 * NOTE:
 *   - modified to get info from OAuth2 profile
 *
 */
import React from 'react'
import { Profile } from 'next-auth'
import Avatar from '@mui/material/Avatar'
import ProfileIcon from '@mui/icons-material/AccountCircle'

interface Props {
	user?: Profile
	size?: string
}

/** Show user avatar based on login status, and email,name info */
export default function UserAvatar(props: Props) {
	const { user, size } = props

	// const firstName = user?.name?.split(" ")[0] ?? "";
	const firstName = user?.given_name ?? ''
	const lastName = user?.family_name ?? ''

	//const avatarTextName = (firstName && firstName!="ผู้ใช้ใหม่") ? firstName[0] : (user?.email ? user.email[0].toUpperCase() : ""); // OLD
	//const avatarTextName = user?.username?.toUpperCase().substring(0, 2); // username is primary login name
	var avatarTextName = (firstName.at(0)?.toUpperCase() ?? '') + (lastName.at(0)?.toUpperCase() ?? '')
	if (avatarTextName.length == 0) {
		avatarTextName = user?.email?.substring(0, 2) ?? 'NA'
	}

	const sizeClass =
		size == 'large'
			? { fontSize: 48, color: 'white', width: 96, height: 96, m: 0 }
			: size == 'small'
				? { fontSize: 14, color: 'white', width: 24, height: 24, m: 0 }
				: { fontSize: 20, color: 'white', width: 32, height: 32, m: 0 }

	return (
		<>
			{!user && <ProfileIcon sx={sizeClass} />}
			{user?.image ? (
				<Avatar src={user?.image} alt={firstName} sx={sizeClass} />
			) : user ? (
				<Avatar alt={firstName} sx={sizeClass}>
					{avatarTextName}
				</Avatar>
			) : (
				<></>
			)}
		</>
	)
}
