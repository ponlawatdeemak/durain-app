import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import { Box, Button, Container, Paper } from '@mui/material'
import MapView from '@/components/common/map/MapView'
import { useCallback, useRef } from 'react'
import { useMap } from '@/components/common/map/context/map'
import { MapPoint } from '@/components/common/map/interface/map.jsx'

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
	const { setExtent, getPopup } = useMap()

	const handleSetExtent = useCallback(() => {
		setExtent([100.5, 13.7, 100.7, 13.9])
	}, [setExtent])

	const popupContent = () => {
		return <div className={`m-4 flex flex-col`}>popupContent</div>
	}

	const handleMapClick = useCallback((point: MapPoint | null) => {
		const element = popupContent()
		if (point && element) getPopup(point, element)
	}, [])

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
								<MapView onMapClick={(e) => handleMapClick(e)} />
							</Box>
						</Box>
					</Box>
				</Paper>
			</Container>
		</PageContainer>
	)
}

export default PlaygroundPage
