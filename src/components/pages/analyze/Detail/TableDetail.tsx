import { Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import React, { useState } from 'react'
import SummaryTable from '../Table/SummaryTable'
import CompareTable from '../Table/CompareTable'

const TableDetail = () => {
	const [orderBy, setOrderBy] = useState('age')

	const handleOrderByChange = (event: SelectChangeEvent) => {
		setOrderBy(event.target.value as string)
	}

	return (
		<div className='flex flex-col gap-4'>
			<Box className='flex items-start justify-between'>
				<Typography>พื้นที่ปลูกทุเรียน</Typography>
				<Box className='flex items-center gap-4'>
					<span>เลือกดูข้อมูลพื้นที่ปลูกทุเรียนตาม :</span>
					<Box sx={{ minWidth: 120 }}>
						<FormControl fullWidth>
							<Select id='orderBy' value={orderBy} onChange={handleOrderByChange}>
								<MenuItem value='age'>อายุต้นทุเรียน</MenuItem>
								<MenuItem value='changes'>การเปลี่ยนแปลง</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Box>
			</Box>
			<SummaryTable orderBy={orderBy} />
			<CompareTable orderBy={orderBy} />
		</div>
	)
}

export default TableDetail
