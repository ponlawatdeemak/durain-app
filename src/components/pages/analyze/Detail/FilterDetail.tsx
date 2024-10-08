import { Box, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SummaryFilter from '../Filter/SummaryFilter'
import CompareFilter from '../Filter/CompareFilter'
import { ExpandMore } from '@mui/icons-material'
import useSearchAnalyze from '../Main/context'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'

const FilterDetail = () => {
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const [orderBy, setOrderBy] = useState('age')

	useEffect(() => {
		setQueryParams({ ...queryParams, provinceId: undefined, districtId: undefined, subDistrictId: undefined })
	}, [])

	const handleOrderByChange = (event: SelectChangeEvent) => {
		setOrderBy(event.target.value as string)
	}

	return (
		<div className='flex flex-col gap-4'>
			<Box className='flex items-start justify-between max-sm:flex-col max-sm:gap-4'>
				<Typography className='!text-2xl !font-medium !text-[#2F7A59]'>
					{t('analyze:durianPlantationArea')}
				</Typography>
				<Box className='flex items-center gap-4'>
					<span className='text-sm font-medium text-[#333333]'>{`${t('analyze:viewDurianPlantationBy')} :`}</span>
					<Box className='w-[170px]'>
						<FormControl fullWidth>
							<Select
								id='orderBy'
								className='h-10 bg-white [&_svg]:right-2 [&_svg]:top-[calc(50%-12px)] [&_svg]:h-6 [&_svg]:w-6 [&_svg]:font-medium [&_svg]:text-[#2B6F51]'
								IconComponent={ExpandMore}
								SelectDisplayProps={{
									className: '!p-2 !pr-9 !text-sm !font-medium !text-[#333333]',
								}}
								MenuProps={{
									className:
										'[&_.MuiMenuItem-root]:text-sm [&_.MuiMenuItem-root]:text-[#333333] [&_.MuiMenuItem-root.Mui-selected]:bg-[#EAF2EE] [&_.MuiMenuItem-root.Mui-selected]:rounded [&_.MuiMenuItem-root]:py-1 [&_.MuiMenuItem-root]:px-2 [&_.MuiList-root]:p-0 [&_.MuiPaper-root]:rounded [&_.MuiPaper-root]:p-1 [&_.MuiPaper-root]:border [&_.MuiPaper-root]:border-solid [&_.MuiPaper-root]:border-[#EBEBEB]',
								}}
								value={orderBy}
								onChange={handleOrderByChange}
							>
								<MenuItem value='age'>{t('analyze:ageOfDurian')}</MenuItem>
								<MenuItem value='changes'>{t('analyze:changes')}</MenuItem>
							</Select>
						</FormControl>
					</Box>
				</Box>
			</Box>
			<SummaryFilter orderBy={orderBy} />
			<CompareFilter orderBy={orderBy} />
		</div>
	)
}

export default FilterDetail
