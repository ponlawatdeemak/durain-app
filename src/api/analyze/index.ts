import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import {
	GetAgeclassLocationDtoOut,
	GetCompareLocationDtoOut,
	GetCompareOverviewDtoOut,
	GetDurianAvailabilityDtoOut,
	GetHistoryOverviewDtoOut,
	GetSummaryOverviewDtoOut,
} from './dto.out.dto'
import {
	GetAgeclassLocationDtoIn,
	GetCompareLocationDtoIn,
	GetCompareOverviewDtoIn,
	GetSummaryOverviewDtoIn,
} from './dto-in.dto'

const analyze = {
	getDurianAvailability: async (): Promise<ResponseDto<GetDurianAvailabilityDtoOut[]>> =>
		await api.get(`/availability/durian`, APIService.DataAPI),
	getSummaryOverview: async (payload: GetSummaryOverviewDtoIn): Promise<ResponseDto<GetSummaryOverviewDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.year !== undefined) params.append('year', payload.year.toString())
		if (payload.admCode !== undefined) params.append('admCode', payload.admCode.toString())

		return await api.get(`/overview/summary?${params}`, APIService.DataAPI)
	},
	getHistoryOverview: async (): Promise<ResponseDto<GetHistoryOverviewDtoOut[]>> =>
		await api.get(`/overview/history`, APIService.DataAPI),
	getCompareOverview: async (payload: GetCompareOverviewDtoIn): Promise<ResponseDto<GetCompareOverviewDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.year1 !== undefined) params.append('year1', payload.year1.toString())
		if (payload.year2 !== undefined) params.append('year2', payload.year2.toString())
		if (payload.admCode !== undefined) params.append('admCode', payload.admCode.toString())

		return await api.get(`/overview/compare?${params}`, APIService.DataAPI)
	},
	getAgeclassLocation: async (payload: GetAgeclassLocationDtoIn): Promise<ResponseDto<GetAgeclassLocationDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.lat !== undefined) params.append('lat', payload.lat.toString())
		if (payload.lon !== undefined) params.append('lon', payload.lon.toString())
		if (payload.year !== undefined) params.append('year', payload.year.toString())

		return await api.get(`/location/ageclass?${params}`, APIService.DataAPI)
	},
	getCompareLocation: async (payload: GetCompareLocationDtoIn): Promise<ResponseDto<GetCompareLocationDtoOut>> => {
		const params = new URLSearchParams()

		if (payload.lat !== undefined) params.append('lat', payload.lat.toString())
		if (payload.lon !== undefined) params.append('lon', payload.lon.toString())
		if (payload.year1 !== undefined) params.append('year1', payload.year1.toString())
		if (payload.year2 !== undefined) params.append('year2', payload.year2.toString())

		return await api.get(`/location/compare?${params}`, APIService.DataAPI)
	},
}

export default analyze
