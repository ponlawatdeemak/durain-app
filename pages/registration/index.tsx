import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import RegistrationMain from '@/components/pages/registration/Main'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common', 'registration'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const RegistrationPage = () => {
	const { t } = useTranslation('common')

	return (
		<PageContainer>
			<RegistrationMain />
		</PageContainer>
	)
}

export default RegistrationPage
