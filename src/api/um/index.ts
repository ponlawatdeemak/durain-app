import { api } from '@/api/core'
import { ResponseDto } from '@/api/interface'
import { UmSearchDtoOut } from './dto-out.dto'

const um = {
	umSearch: async (): Promise<ResponseDto<UmSearchDtoOut>> => await api.get('/um/search'),
	getProfile: async (): Promise<ResponseDto<UmSearchDtoOut>> => await api.get('/profile'),
}

export default um
