import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'next-i18next'

export enum UserDialogMode {
	UserProfile,
	UserAdd,
	UserEdit,
}

interface UserDialogProps {
	open: boolean
	mode: UserDialogMode
	userId?: string
	onClose?: () => void
}

const UserDialog: React.FC<UserDialogProps> = ({
	open,
	mode = UserDialogMode.UserProfile,
	userId,
	onClose = () => {},
}) => {
	const { t } = useTranslation()

	const userData = useMemo(() => {
		if (mode === UserDialogMode.UserAdd || !userId) {
			return undefined
		} else {
			// query data using userId
			return { id: userId, name: 'Tim', age: 18 }
		}
	}, [mode, userId])

	const onDelete = useCallback(() => {
		onClose()
	}, [userId])

	const onSubmit = useCallback(() => {
		onClose()
	}, [mode])

	return (
		<Dialog
			open={open}
			onClose={(event, reason) => {
				if (reason !== 'backdropClick') {
					onClose()
				}
			}}
		>
			<DialogTitle>{t('PROFILE')}</DialogTitle>
			<DialogContent>
				{mode === UserDialogMode.UserProfile && <DialogContentText>Profile Form</DialogContentText>}
				{mode === UserDialogMode.UserAdd && <DialogContentText>UM Edit Form</DialogContentText>}
				{mode === UserDialogMode.UserEdit && <DialogContentText>UM Add Form</DialogContentText>}
				<TextField autoFocus name='txt1' label='Text1' fullWidth />
				<TextField autoFocus name='txt2' label='Text2' fullWidth />
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={() => onDelete()}>Delete</Button>
				<Button onClick={() => onSubmit()}>onSubmit</Button>
			</DialogActions>
		</Dialog>
	)
}

export default UserDialog
