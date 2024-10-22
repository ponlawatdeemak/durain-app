import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import { availabilityRegisteredDtoOut, GetRegisteredLocationDtoOut, overviewRegisteredDtoOut } from './dto-out.dto'
import { GetRegisteredLocationDtoIn, RegistrationSummaryDtoIn } from './dto-in.dto'

const registration = {
	availabilityRegistered: async (): Promise<ResponseDto<availabilityRegisteredDtoOut[]>> =>
		await api.get('/availability/registered', APIService.DataAPI),
	overviewRegistered: async (payload: RegistrationSummaryDtoIn): Promise<ResponseDto<overviewRegisteredDtoOut>> =>
		await api.get(
			`/overview/registered?year=${payload.year}${payload.admCode ? `&admCode=${payload.admCode}` : ''}`,
			APIService.DataAPI,
		),
	getRegisteredLocation: async (
		payload: GetRegisteredLocationDtoIn,
	): Promise<ResponseDto<GetRegisteredLocationDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.lat !== undefined) params.append('lat', payload.lat.toString())
		if (payload.lon !== undefined) params.append('lon', payload.lon.toString())
		if (payload.year !== undefined) params.append('year', payload.year.toString())

		return await api.get(`/location/registered?${params}`, APIService.DataAPI)
	},
}

export default registration
