import PageContainer from '@/components/Layout/PageContainer/PageContainer'
import { GetServerSideProps, InferGetStaticPropsType } from 'next'
import { UserConfig } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../next-i18next.config.js'
import { DEFAULT_LOCALE } from '../webapp.config'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

// const HomePage: NextPage = (_props: InferGetStaticPropsType<typeof getServerSideProps>) => {
export default function HomePage(_props: InferGetStaticPropsType<typeof getServerSideProps>) {
	return (
		<PageContainer>
			<div>Main</div>
		</PageContainer>
	)
}
