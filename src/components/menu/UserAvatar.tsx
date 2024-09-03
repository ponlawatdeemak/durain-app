import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { Session } from 'next-auth'
import { useState } from 'react'
import ProfileDialog from '../profile'

interface UserAvatarProps {
	user: Session['user']
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
	const [openForm, setOpenForm] = useState<boolean>(false)
	const firstName = user?.firstName ?? ''
	const lastName = user?.lastName ?? ''

	const getLetterAvatar = () => {
		let letter = (firstName.at(0)?.toUpperCase() ?? '') + (lastName.at(0)?.toUpperCase() ?? '')
		return letter.length == 0 ? (user?.email?.substring(0, 2) ?? 'NA') : letter
	}

	return (
		<>
			{user ? (
				<div onClick={() => setOpenForm(true)} className='flex cursor-pointer items-center'>
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
			<ProfileDialog open={openForm} onClose={() => setOpenForm(false)}></ProfileDialog>
		</>
	)
}

export default UserAvatar
