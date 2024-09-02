import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { OverviewSummaryDtoOut } from './dto-out.dto'

const overview = {
	overviewSummary: async (): Promise<ResponseDto<OverviewSummaryDtoOut>> =>
		await api.get('/overview/summary?year=2024', APIService.DataAPI),
}

export default overview
