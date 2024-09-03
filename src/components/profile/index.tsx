import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ProfileDialogProps {
	open: boolean
	onClose: () => void
}

interface ProfileForm {
	txt1: string
	txt2: string
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ ...props }) => {
	const { t } = useTranslation()
	const { open, onClose } = props

	const onDelete = useCallback(async (userId: string) => {
		console.log('onDelete', userId)
		onClose()
	}, [])

	const onSubmit = useCallback(async (formData: ProfileForm) => {
		console.log('onSubmit', formData)
		onClose()
	}, [])

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				component: 'form',
				onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault()
					const formData = new FormData(event.currentTarget)
					const formJson = Object.fromEntries((formData as any).entries())
					onSubmit(formJson as ProfileForm)
				},
			}}
		>
			<DialogTitle>{t('PROFILE')}</DialogTitle>
			<DialogContent>
				<DialogContentText>Profile Form</DialogContentText>
				<TextField autoFocus name='txt1' label='Text1' fullWidth />
				<TextField autoFocus name='txt2' label='Text2' fullWidth />
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onDelete('')}>Delete</Button>
				<Button onClick={onClose}>Cancel</Button>
				<Button type='submit'>Submit</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ProfileDialog
