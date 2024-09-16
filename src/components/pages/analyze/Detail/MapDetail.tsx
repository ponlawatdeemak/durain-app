import MapView from '@/components/common/map/MapView'
import { Box, Typography } from '@mui/material'
import React from 'react'

const MapDetail = () => {
	return (
		<div className='flex flex-col gap-4'>
			<Typography>พื้นที่ปลูกทุเรียนตามอายุ</Typography>
			<Box className='h-[650px] overflow-hidden rounded-lg bg-white'>
				{/* <MapView /> */}
				Map
			</Box>
		</div>
	)
}

export default MapDetail
