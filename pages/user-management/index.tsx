import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import { UserManagementMain } from '@/components/pages/user-management/'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common', 'um'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const UserManagementPage = () => {
	return (
		<PageContainer>
			<UserManagementMain />
		</PageContainer>
	)
}

export default UserManagementPage
