import AppLogo from '@/components/svg/AppLogo'
import { NEXTAUTH_PROVIDER_ID } from '@/../webapp.config'
import { CloseOutlined, ExitToApp, LockOpen, MenuOutlined } from '@mui/icons-material'
import { Button, IconButton, Typography } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import UserAvatar from './UserAvatar'
import useResponsive from '@/hook/responsive'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import MenuList from './MenuList'
import ThaicomLogo from '../svg/ThaicomLogo'

interface AppBarProps {
	className?: string
}

const AppBar: React.FC<AppBarProps> = ({ className = '' }) => {
	const { data: session } = useSession()
	const { t } = useTranslation('common')
	const { isDesktop } = useResponsive()

	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

	useEffect(() => {
		if (!isDesktop && isMenuOpen) {
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.body.style.overflow = ''
		}
	}, [isDesktop, isMenuOpen])

	if (!isDesktop) {
		return (
			<div>
				<div
					className={classNames(
						'flex h-[64px] flex-row items-center justify-between border-0 border-b border-solid border-[#e9ecee] bg-white px-[30px]',
						className,
					)}
				>
					<AppLogo />
					<IconButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
						{isMenuOpen ? <CloseOutlined className='!h-8 !w-8' /> : <MenuOutlined className='!h-8 !w-8' />}
					</IconButton>
				</div>
				{isMenuOpen && (
					<div className='flex h-[calc(100vh-64px)] flex-col justify-between rounded-none bg-[#f2f5f8] lg:hidden'>
						<MenuList setIsMenuOpen={setIsMenuOpen} />
						<div
							className={classNames('m-4 flex items-center justify-between rounded bg-white p-3', {
								'!justify-end': !session?.user,
							})}
						>
							{session?.user && <UserAvatar user={session.user} />}
							<div className='flex items-center'>
								{session?.user ? (
									<IconButton onClick={() => signOut()}>
										<ExitToApp className='!h-9 !w-9 font-light text-[#d13438]' />
									</IconButton>
								) : (
									<IconButton onClick={() => signIn(NEXTAUTH_PROVIDER_ID)}>
										<LockOpen className='!h-9 !w-9 font-light text-[#0c626d]' />
									</IconButton>
								)}
								<div className='flex flex-col px-2 py-1'>
									<span className='text-2xs font-medium leading-3'>Powered by</span>
									<ThaicomLogo width={70} height={19.02} />
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		)
	}

	return (
		<div className='flex h-[86px] flex-row items-center justify-between border-0 border-b border-solid border-[#e9ecee] bg-white px-[30px]'>
			<div className='flex items-center gap-4'>
				<AppLogo />
				<Typography variant='header24' className='ml-5 text-center'>
					{t('appName')}
				</Typography>
			</div>
			<div className='flex items-center gap-4'>
				{session?.user ? (
					<>
						<UserAvatar user={session.user} />
						<Button variant='contained' startIcon={<ExitToApp />} onClick={() => signOut()}>
							{t('logout')}
						</Button>
					</>
				) : (
					<Button variant='contained' startIcon={<LockOpen />} onClick={() => signIn(NEXTAUTH_PROVIDER_ID)}>
						{t('login')}
					</Button>
				)}
			</div>
		</div>
	)
}

export default AppBar
