import { api } from '@/api/core'
import { ResponseDto } from '@/api/interface'
import { GetProfileDtoOut, GetSearchUMDtoOut } from './dto-out.dto'
import { GetSearchUMDtoIn } from './dto-in.dto'

const um = {
	umSearch: async (payload: GetSearchUMDtoIn): Promise<ResponseDto<GetSearchUMDtoOut[]>> =>
		await api.get(
			`/um/search?keyword=${payload.keyword}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&limit=${payload.limit}&offset=${payload.offset}&respLang=${payload.respLang}`,
		),
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.get('/profile'),
}

export default um
