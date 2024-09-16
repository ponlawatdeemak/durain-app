import FailedResetPassword from '@/components/common/reset-status/FailedResetPassword'
import SuccessResetPassword from '@/components/common/reset-status/SuccessResetPassword'
import React from 'react'

interface PasswordResetPageProps {
	isSuccess: boolean | null
	handleClickReturnProfile: () => void
}

const PasswordResetContent: React.FC<PasswordResetPageProps> = ({ isSuccess, handleClickReturnProfile }) => {
	if (isSuccess) {
		return (
			<div className='flex flex-grow items-center justify-center'>
				<SuccessResetPassword
					buttonLabel='auth.returnProfile'
					buttonHref=''
					handleClickReturnProfile={handleClickReturnProfile}
				/>
			</div>
		)
	} else {
		return (
			<div className='flex flex-grow items-center justify-center'>
				<FailedResetPassword
					buttonLabel='auth.returnProfile'
					buttonHref=''
					handleClickReturnProfile={handleClickReturnProfile}
				/>
			</div>
		)
	}
}

export default PasswordResetContent
