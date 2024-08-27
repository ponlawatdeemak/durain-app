import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'

import PageContainer from '@/components/Layout/PageContainer/PageContainer'
import { UserConfig, useTranslation } from 'next-i18next'
import { DEFAULT_LOCALE } from '@/webapp.config'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const OverviewPage = () => {
	const { t } = useTranslation('common')
	return (
		<PageContainer>
			<div>OverviewPage</div>
			<div>test</div>
		</PageContainer>
	)
}

export default OverviewPage
