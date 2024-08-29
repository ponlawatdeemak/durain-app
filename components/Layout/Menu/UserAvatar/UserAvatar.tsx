import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { Session } from 'next-auth'
import styles from './UserAvatar.module.css'

interface UserAvatarProps {
	user: Session['user']
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
	const firstName = user?.firstName ?? ''
	const lastName = user?.lastName ?? ''

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

export default UserAvatar
