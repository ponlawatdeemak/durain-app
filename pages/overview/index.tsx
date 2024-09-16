import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect } from 'react'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import service from '@/api/index'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common', 'um'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const OverviewPage = () => {
	const { t } = useTranslation('common')

	useEffect(() => {
		service.overview
			.overviewSummary()
			.then((res) => {
				console.log('overview : ', res)
			})
			.catch((error) => console.log(error))
	}, [])

	return (
		<PageContainer>
			<div>OverviewPage</div>
			<div>test</div>
		</PageContainer>
	)
}

export default OverviewPage
