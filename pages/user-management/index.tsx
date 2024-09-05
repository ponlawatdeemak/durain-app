import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import { useEffect, useState } from 'react'
import service from '@/api/index'
import PageContainer from '@/components/Layout/PageContainer'
import { Button } from '@mui/material'
import UserDialog, { UserDialogMode } from '@/components/shared/UserDialog'
import { UserManagementMain } from '@/components/pages/user-management/'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const UserManagementPage = () => {
	// const [openUserDialog, setOpenUserDialog] = useState<boolean>(false)
	// const [modeUserDialog, setModeUserDialog] = useState<UserDialogMode>(UserDialogMode.UserAdd)

	// useEffect(() => {
	// 	service.um
	// 		.umSearch()
	// 		.then((res) => {
	// 			console.log('um : ', res)
	// 		})
	// 		.catch((error) => console.log(error))
	// }, [])

	// const handleOpenAdd = () => {
	// 	setOpenUserDialog(true)
	// 	setModeUserDialog(UserDialogMode.UserAdd)
	// }

	// const handleOpenEdit = () => {
	// 	setOpenUserDialog(true)
	// 	setModeUserDialog(UserDialogMode.UserEdit)
	// }

	return (
		<PageContainer>
			{/* <div>UserManagementPage</div>
			<Button onClick={handleOpenEdit}>add</Button>
			<Button onClick={handleOpenAdd}>edit</Button>
			<UserDialog open={openUserDialog} mode={modeUserDialog} onClose={() => setOpenUserDialog(false)} /> */}
			<UserManagementMain />
		</PageContainer>
	)
}

export default UserManagementPage
