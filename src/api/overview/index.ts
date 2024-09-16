import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { availabilityDurianDtoOut, OverviewSummaryDtoOut } from './dto-out.dto'
import { OverviewSummaryDtoIn } from './dto-in.dto'

const overview = {
	overviewSummary: async (payload:OverviewSummaryDtoIn): Promise<ResponseDto<OverviewSummaryDtoOut>> =>
		await api.get(`/overview/summary?year=${payload.year}${payload.admCode?`&admCode=${payload.admCode}`:''}`, APIService.DataAPI),
    availabilityDurian: async(): Promise<ResponseDto<availabilityDurianDtoOut[]>>=>
        await api.get('/availability/durian', APIService.DataAPI)
}

export default overview
