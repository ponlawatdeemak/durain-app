import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config'
import PageContainer from '@/components/Layout/PageContainer'
import OverviewMain from '@/components/pages/overview/Main'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common', 'overview', 'um'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const OverviewPage = () => {
	return (
		<PageContainer>
			<OverviewMain />
		</PageContainer>
	)
}

export default OverviewPage
