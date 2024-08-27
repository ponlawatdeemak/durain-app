/**
 * File: version.tsx
 * Desc: Simple Version Page - for check current deployment version of web
 * Created By: anirutn@thaicom.net
 * Date: 2022/04/12
 * Last Update: 2024/08/15
 *
 */
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../next-i18next.config.js'

import { APP_TITLE, APP_VERSION } from '../webapp.config'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(context.locale ?? 'th', ['common'], nextI18NextConfig as UserConfig)),
	},
})

export default function Version() {
	const { t } = useTranslation('common')

	return (
		<Grid container direction='column' alignItems='center' sx={{ mt: 5 }}>
			<Grid item xs={12}>
				<Card elevation={3}>
					<CardContent>
						<Typography variant='h6' color='primary' style={{ textAlign: 'center' }}>
							{APP_TITLE}
						</Typography>
						<Typography variant='body2' style={{ textAlign: 'center', marginTop: 40 }}>
							{t('VERSION')} {APP_VERSION}
						</Typography>

						<div style={{ textAlign: 'start', marginTop: '80px', width: '300px' }}>
							<Typography style={{ color: '#4285f4', textDecorationLine: 'underline' }}>
								<Link href='/'>{t('BACK')}</Link>
							</Typography>
						</div>
					</CardContent>
				</Card>
			</Grid>
		</Grid>
	)
}
