import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { Session } from 'next-auth'
import { useRouter } from 'next/router'

interface UserAvatarProps {
	user: Session['user']
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
	const router = useRouter()
	const firstName = user?.firstName ?? ''
	const lastName = user?.lastName ?? ''

	const getLetterAvatar = () => {
		let letter = (firstName.at(0)?.toUpperCase() ?? '') + (lastName.at(0)?.toUpperCase() ?? '')
		return letter.length == 0 ? (user?.email?.substring(0, 2) ?? 'NA') : letter
	}

	const onHandleClick = () => {
		router.push('/profile')
	}

	return (
		<>
			{user ? (
				<div onClick={onHandleClick} className='flex cursor-pointer items-center'>
					<Typography className='pr-2'>{`${firstName}.${lastName.charAt(0)}`}</Typography>
					{user.image ? (
						<Avatar src={user.image} alt={firstName} className='w-[35px]' />
					) : (
						<Avatar alt={firstName} className='w-[35px]'>
							{getLetterAvatar()}
						</Avatar>
					)}
				</div>
			) : null}
		</>
	)
}

export default UserAvatar
