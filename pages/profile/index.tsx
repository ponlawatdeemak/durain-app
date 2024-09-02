import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useRouter } from 'next/router.js'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

export default function FormDialog() {
	const router = useRouter()
	const [open, setOpen] = React.useState(true)

	const handleClose = () => {
		setOpen(false)
		router.back()
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				component: 'form',
				onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault()
					const formData = new FormData(event.currentTarget)
					const formJson = Object.fromEntries((formData as any).entries())
					const email = formJson.email
					console.log(email)
					handleClose()
				},
			}}
		>
			<DialogTitle>Subscribe</DialogTitle>
			<DialogContent>
				<DialogContentText>
					To subscribe to this website, please enter your email address here. We will send updates
					occasionally.
				</DialogContentText>
				<TextField
					autoFocus
					required
					margin='dense'
					id='name'
					name='email'
					label='Email Address'
					type='email'
					fullWidth
					variant='standard'
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button type='submit'>Subscribe</Button>
			</DialogActions>
		</Dialog>
	)
}
