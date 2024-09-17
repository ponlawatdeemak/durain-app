import { ResponseLanguage } from '@/api/interface'
import MapView from '@/components/common/map/MapView'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'next-i18next'
import React from 'react'

const MapDetail = () => {
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	return (
		<div className='flex flex-col gap-4'>
			<Typography className='!text-2xl !font-medium !text-[#2F7A59]'>
				{t('analyze:durianPlantationByAge')}
			</Typography>
			<Box className='h-[650px] overflow-hidden rounded-lg bg-white'>
				{/* <MapView /> */}
				Map
			</Box>
		</div>
	)
}

export default MapDetail
