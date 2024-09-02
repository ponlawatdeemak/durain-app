 import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import { useEffect } from 'react'
import service from '@/api/index'

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
	useEffect(() => {
		service.um
			.umSearch()
			.then((res) => {
				console.log('um : ', res)
			})
			.catch((error) => console.log(error))
	}, [])
	return <div>UserManagementPage</div>
}

export default UserManagementPage
