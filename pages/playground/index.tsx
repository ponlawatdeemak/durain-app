import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import { Box, Button, Container, Paper } from '@mui/material'
import MapView from '@/components/common/map/MapView'
import { useCallback } from 'react'
import { useMap } from '@/components/common/map/context/map'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const PlaygroundPage = () => {
	const { t } = useTranslation('common')
	const { setExtent } = useMap()

	const handleSetExtent = useCallback(() => {
		setExtent([100.5, 13.7, 100.7, 13.9])
	}, [setExtent])

	return (
		<PageContainer>
			<Container>
				<Paper className='m-2 flex h-full flex-col overflow-hidden pt-2'>
					<Box className='flex justify-end p-2'>
						<Button variant='contained' onClick={handleSetExtent}>
							Set Extent
						</Button>
					</Box>
					<Box display='flex' sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
						<Box p={1} flex={1} sx={{ width: { xs: '100%', lg: '100%' } }}>
							<Box height={700} className='w-full p-1'>
								<MapView />
							</Box>
						</Box>
					</Box>
				</Paper>
			</Container>
		</PageContainer>
	)
}

export default PlaygroundPage
