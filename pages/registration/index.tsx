import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common', 'um'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const RegistrationPage = () => {
	const { t } = useTranslation('common')

	return (
		<PageContainer>
			<div>RegistrationPage</div>
		</PageContainer>
	)
}

export default RegistrationPage
