import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { signOut } from 'next-auth/react'
import React, { useCallback } from 'react'

interface TokenExpiredDialogProps {}

const TokenExpiredDialog: React.FC<TokenExpiredDialogProps> = () => {
	// const onClose = useCallback(() => signOut(), [])
	// const { t, i18n } = useTranslation(['default', 'appbar'])

	// return (
	// 	<Dialog open={true}>
	// 		<DialogTitle>{t('auth.tokenExpire', { ns: 'appbar' })}</DialogTitle>
	// 		<DialogContent>
	// 			<DialogContentText>{t('auth.loginAgain', { ns: 'appbar' })}</DialogContentText>
	// 		</DialogContent>
	// 		<DialogActions>
	// 			<Button variant='contained' onClick={onClose}>
	// 				{t('ok')}
	// 			</Button>
	// 		</DialogActions>
	// 	</Dialog>
	// )
	return <></>
}

export default TokenExpiredDialog
