import { Typography } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { Session } from 'next-auth'
import { useState } from 'react'
import UserDialog, { UserDialogMode } from '@/components/shared/UserDialog'
import { FormMain } from '../pages/user-management/Form'

interface UserAvatarProps {
	user: Session['user']
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
	const [openUserDialog, setOpenUserDialog] = useState<boolean>(false)
	const firstName = user?.firstName ?? ''
	const lastName = user?.lastName ?? ''

	const getLetterAvatar = () => {
		let letter = (firstName.at(0)?.toUpperCase() ?? '') + (lastName.at(0)?.toUpperCase() ?? '')
		return letter.length == 0 ? (user?.email?.substring(0, 2) ?? 'NA') : letter
	}

	return (
		<>
			{user ? (
				<div
					onClick={() => setOpenUserDialog(true)}
					className='flex cursor-pointer items-center gap-2 max-lg:flex-row-reverse max-lg:px-2 max-lg:py-1 lg:gap-4'
				>
					<Typography className='max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap text-[#333333] max-lg:underline max-lg:decoration-1 max-lg:underline-offset-2'>
						{`${firstName}.${lastName.charAt(0)}`}
					</Typography>
					{user.image ? (
						<Avatar src={user.image} alt={firstName} className='!h-8 !w-8 lg:!h-[35px] lg:!w-[35px]' />
					) : (
						<Avatar alt={firstName} className='!h-8 !w-8 lg:!h-[35px] lg:!w-[35px]'>
							{getLetterAvatar()}
						</Avatar>
					)}
				</div>
			) : null}
			<FormMain
				open={openUserDialog}
				onClose={() => setOpenUserDialog(false)}
				isEdit={true}
				setOpen={setOpenUserDialog}
				userDialogMode={UserDialogMode.UserProfile}
				userId=''
				setIsSearch={() => {}}
			/>
			{/* <UserDialog
				open={openUserDialog}
				mode={UserDialogMode.UserProfile}
				onClose={() => setOpenUserDialog(false)}
			/> */}
		</>
	)
}

export default UserAvatar
