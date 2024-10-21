import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import { AnalyzeMain } from '@/components/pages/analyze'
import { getSession } from 'next-auth/react'
import { FlagStatus } from '../../src/enum/um.enum'
import { AppPath } from '@/config/app.config'

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context)

	if (session?.user?.flagStatus === FlagStatus.Inactive) {
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
				['common', 'um', 'analyze'],
				nextI18NextConfig as UserConfig,
			)),
		},
	}
}

const AnalyzePage = () => {
	const { t } = useTranslation('common')

	return (
		<PageContainer>
			<AnalyzeMain />
		</PageContainer>
	)
}

export default AnalyzePage
