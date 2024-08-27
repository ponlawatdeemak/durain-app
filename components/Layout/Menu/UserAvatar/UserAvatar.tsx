import Avatar from '@mui/material/Avatar'
import { Profile } from 'next-auth'
import styles from './UserAvatar.module.css'
import { Typography } from '@mui/material'

interface UserAvatarProps {
	user?: Profile
}

export default function UserAvatar({ user }: UserAvatarProps) {
	const firstName = user?.given_name ?? ''
	const lastName = user?.family_name ?? ''

	let avatarTextName = (firstName.at(0)?.toUpperCase() ?? '') + (lastName.at(0)?.toUpperCase() ?? '')
	if (avatarTextName.length == 0) {
		avatarTextName = user?.email?.substring(0, 2) ?? 'NA'
	}

	if (user?.image) {
		return (
			<>
				<Typography>{`${firstName}.${lastName.charAt(0)}`}</Typography>
				<Avatar src={user?.image} alt={firstName} className={styles.main} />
			</>
		)
	} else if (user) {
		return (
			<>
				<Typography>{`${firstName}.${lastName.charAt(0)}`}</Typography>
				<Avatar alt={firstName} className={styles.main}>
					{avatarTextName}
				</Avatar>
			</>
		)
	}
	return null
}
