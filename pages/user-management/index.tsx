import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import { UserManagementMain } from '@/components/pages/user-management/'
import { getSession } from 'next-auth/react'
import { FlagStatus, UserRole } from '../../src/enum/um.enum'
import { AppPath } from '@/config/app.config'

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context)

	if (session?.user?.flagStatus === FlagStatus.Inactive || session?.user?.role === UserRole.Analyst) {
		return {
			redirect: {
				destination: AppPath.Overview,
				permanent: false,
			},
		}
	}

	return {
		props: {
			...(await serverSideTranslations(
				context.locale ?? DEFAULT_LOCALE,
				['common', 'um'],
				nextI18NextConfig as UserConfig,
			)),
		},
	}
}

const UserManagementPage = () => {
	return (
		<PageContainer>
			<UserManagementMain />
		</PageContainer>
	)
}

export default UserManagementPage
