import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import { Box, Container, Paper } from '@mui/material'
import MapView, { MapViewRef } from '@/components/common/map/MapView'
import { useRef } from 'react'

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
	const mapViewRef = useRef<MapViewRef>(null)

	const handleSetExtent = () => {
		if (mapViewRef.current) {
			const bounds = [
				[100.5, 13.7],
				[100.7, 13.9],
			]
			mapViewRef.current.setMapExtent(bounds)
		}
	}
	return (
		<PageContainer>
			<Container>
				<Paper className='flex h-full flex-col overflow-hidden p-1'>
					<Box className='flex justify-end p-2'>
						<button onClick={handleSetExtent}>Set Map Extent</button>
					</Box>
					<Box display='flex' sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
						<Box p={1} flex={1} sx={{ width: { xs: '100%', lg: '50%' } }}>
							<Box height={500} className='w-full p-1'>
								<MapView ref={mapViewRef} />
							</Box>
						</Box>
						<Box p={1} flex={1} sx={{ width: { xs: '100%', lg: '50%' } }}></Box>
					</Box>
				</Paper>
			</Container>
		</PageContainer>
	)
}

export default PlaygroundPage
