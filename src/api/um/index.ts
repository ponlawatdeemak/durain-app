import { api } from '@/api/core'
import { ResponseDto } from '@/api/interface'
import { GetProfileDtoOut } from './dto-out.dto'

const um = {
	umSearch: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.get('/um/search'),
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.get('/profile'),
}

export default um
