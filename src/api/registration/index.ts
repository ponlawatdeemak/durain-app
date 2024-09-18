import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { availabilityRegisteredDtoOut, overviewRegisteredDtoOut } from './dto-out.dto'
import { RegistrationSummaryDtoIn } from './dto-in.dto'

const registration = {
    availabilityRegistered: async(): Promise<ResponseDto<availabilityRegisteredDtoOut[]>>=>
        await api.get('/availability/registered', APIService.DataAPI),
    overviewRegistered: async (payload:RegistrationSummaryDtoIn): Promise<ResponseDto<overviewRegisteredDtoOut>> =>
		await api.get(`/overview/registered?year=${payload.year}${payload.admCode?`&admCode=${payload.admCode}`:''}`, APIService.DataAPI),
}

export default registration
