import { api } from '@/api/core'
import { ResponseDto } from '@/api/interface'
import { GetProfileDtoOut, GetSearchUMDtoOut, GetUmDtoOut } from './dto-out.dto'
import { GetSearchUMDtoIn, GetUmDtoIn } from './dto-in.dto'

const um = {
	umSearch: async (payload: GetSearchUMDtoIn): Promise<ResponseDto<GetSearchUMDtoOut[]>> =>
		await api.get(
			`/um/search?keyword=${payload.keyword}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&limit=${payload.limit}&offset=${payload.offset}&respLang=${payload.respLang}`,
		),
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.get('/profile'),
	getUM: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.get(`/um/${payload.userId}`),
}

export default um
