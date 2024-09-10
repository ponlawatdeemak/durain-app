import { api } from '@/api/core'
import { APIService, ResponseDto } from '@/api/interface'
import {
	DeleteProfileDtoOut,
	GetProfileDtoOut,
	GetSearchUMDtoOut,
	GetUmDtoOut,
	PatchStatusDtoOut,
	PostImportCSVUMDtoOut,
	PostImportXLSXUMDtoOut,
	PostProfileUMDtoOut,
	PutProfileUMDtoOut,
} from './dto-out.dto'
import {
	DeleteProfileDtoIn,
	GetSearchUMDtoIn,
	GetUmDtoIn,
	PatchStatusDtoIn,
	PostImportCSVUMDtoIn,
	PostImportXLSXUMDtoIn,
	PostProfileUMDtoIn,
	PutProfileUMDtoIn,
} from './dto-in.dto'

const um = {
	umSearch: async (payload: GetSearchUMDtoIn): Promise<ResponseDto<GetSearchUMDtoOut[]>> =>
		await api.get(
			`/um/search?keyword=${payload.keyword}&sortField=${payload.sortField}&sortOrder=${payload.sortOrder}&limit=${payload.limit}&offset=${payload.offset}&respLang=${payload.respLang}`,
		),
	getProfile: async (): Promise<ResponseDto<GetProfileDtoOut>> => await api.get('/profile'),
	getUM: async (payload: GetUmDtoIn): Promise<ResponseDto<GetUmDtoOut>> => await api.get(`/um/${payload.userId}`),
	deleteProfile: async (payload: DeleteProfileDtoIn): Promise<ResponseDto<DeleteProfileDtoOut>> =>
		await api.delete(`/um/${payload.id}`),
	putProfileUM: async (payload: PutProfileUMDtoIn): Promise<ResponseDto<PutProfileUMDtoOut>> =>
		await api.put(`/um/${payload.id}`, payload),
	postProfileUM: async (payload: PostProfileUMDtoIn): Promise<ResponseDto<PostProfileUMDtoOut>> =>
		await api.post('/um', payload),
	patchStatus: async (payload: PatchStatusDtoIn): Promise<ResponseDto<PatchStatusDtoOut>> =>
		await api.patch(`/um/${payload.id}`, payload),
	// change type res : blob
	getTemplateCSVUM: async (): Promise<any> =>
		await api.get('/um/import/template/csv', APIService.WebAPI, { responseType: 'blob' }),
	// change type res : blob
	getTemplateXLSXUM: async (): Promise<any> =>
		await api.get('/um/import/template/xlsx', APIService.WebAPI, { responseType: 'blob' }),
	postImportCSVUM: async (payload: PostImportCSVUMDtoIn): Promise<ResponseDto<PostImportCSVUMDtoOut[]>> =>
		await api.post('/um/import/csv', payload.data),
	postImportXLSXUM: async (payload: PostImportXLSXUMDtoIn): Promise<ResponseDto<PostImportXLSXUMDtoOut>> =>
		await api.post('/um/import/xlsx', payload.data),
}

export default um
