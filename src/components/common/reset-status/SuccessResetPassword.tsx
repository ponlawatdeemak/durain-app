import { mdiCheckBold } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'next-i18next'
interface SuccessResetPasswordProps {
	buttonLabel: string
	buttonHref: string
}

const SuccessResetPassword: React.FC<SuccessResetPasswordProps> = ({ buttonLabel, buttonHref }) => {
	const { t } = useTranslation('appbar')
	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='relative flex size-24 items-center justify-center overflow-hidden rounded-full'>
				<div className='bg-success-light absolute h-full w-full' />
				<Icon path={mdiCheckBold} size={2} className='text-success z-10' />
			</div>
			<Typography className='text-2xl font-bold'>{t('auth.headerResetPasswordSuccess')}</Typography>
			<Typography className='text-center'>{t('auth.subHeaderResetPasswordSuccess')}</Typography>
			<Button variant='contained' className='mt-8' href={buttonHref}>
				{t(buttonLabel)}
			</Button>
		</div>
	)
}

export default SuccessResetPassword
