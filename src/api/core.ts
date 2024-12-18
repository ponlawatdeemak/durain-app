import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { APIConfigType, APIService, AppAPI } from './interface'
import service from '@/api'
import { defaultText } from '@/utils/text'

const APIConfigs: { [key: string]: APIConfigType } = {
	[APIService.WebAPI]: {
		baseURL: process.env.NEXT_PUBLIC_API_HOSTNAME || '',
		apiKey: process.env.NEXT_PUBLIC_API_KEY || '',
	},
	[APIService.DataAPI]: {
		baseURL: process.env.NEXT_PUBLIC_API_HOSTNAME_DATA || '',
		apiKey: process.env.NEXT_PUBLIC_API_KEY_DATA || '',
	},
	[APIService.TilesAPI]: {
		baseURL: process.env.NEXT_PUBLIC_API_HOSTNAME_TILE || '',
		apiKey: process.env.NEXT_PUBLIC_API_KEY_TILE || '',
	},
}

let _apiAccessToken: string | null = null
export const getApiAccessToken = () => _apiAccessToken

let apiRefreshToken: string | null = null
let _apiAccessType: 'Guest' | 'Login' = 'Guest'
export const getApiAccessType = () => _apiAccessType

export const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_HOSTNAME,
	headers: {
		'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
	},
})

export const api: AppAPI = {
	...axiosInstance,
	get: async (url: string, service: APIService = APIService.WebAPI, config?: AxiosRequestConfig<any> | undefined) =>
		(await axiosInstance.get(url, getConfig(service, config)))?.data,
	post: async (
		url: string,
		data: any,
		service: APIService = APIService.WebAPI,
		config?: AxiosRequestConfig<any> | undefined,
	) => await axiosInstance.post(url, data, getConfig(service, config)),
	put: async (
		url: string,
		data: any,
		service: APIService = APIService.WebAPI,
		config?: AxiosRequestConfig<any> | undefined,
	) => await axiosInstance.put(url, data, getConfig(service, config)),
	delete: async (
		url: string,
		service: APIService = APIService.WebAPI,
		config?: AxiosRequestConfig<any> | undefined,
	) => await axiosInstance.delete(url, getConfig(service, config)),
	patch: async (
		url: string,
		data: any,
		service: APIService = APIService.WebAPI,
		config?: AxiosRequestConfig<any> | undefined,
	) => await axiosInstance.patch(url, data, getConfig(service, config)),
}

const getConfig = (service: APIService, config: AxiosRequestConfig<any> | undefined) => ({
	...config,
	baseURL: APIConfigs[service].baseURL,
	headers: {
		'x-api-key': APIConfigs[service].apiKey,
	},
})

axiosInstance.interceptors.response.use(
	(response) => {
		return response
	},
	async function (error) {
		const errorData = error.response.data
		if (error instanceof AxiosError && error.config && error.response?.status === 401) {
			try {
				const originalRequest = error.config as any
				if (!originalRequest?._retry) {
					originalRequest._retry = true
					let newAccessToken = ''
					if (_apiAccessType === 'Guest') {
						const { data } = await service.auth.loginGuest()
						newAccessToken = defaultText(data?.tokens?.idToken)
						updateAccessToken({ accessToken: newAccessToken, accessType: 'Guest' })
					} else {
						const res = await service.auth.refreshToken({ refreshToken: apiRefreshToken })
						newAccessToken = defaultText(res.data?.access_token)
						updateAccessToken({ accessToken: newAccessToken, accessType: 'Login' })
					}
					return axiosInstance({
						...originalRequest,
						headers: {
							...originalRequest.headers,
							authorization: `Bearer ${newAccessToken}`,
						},
					}).catch((err) => {
						console.error(err)
						// TODO: modal logout
					})
				}
			} catch (err) {
				return Promise.reject({
					title: errorData.title || errorData.message,
					status: errorData.status || errorData.success,
					detail: errorData.detail,
				})
			}
		}

		return Promise.reject({
			title: errorData.title || errorData.message,
			status: errorData.status || errorData.success,
			detail: errorData.detail,
			countImported: errorData?.countImported,
			data: errorData?.data,
		})
	},
)

export function updateAccessToken({
	accessToken,
	refreshToken,
	accessType,
}: {
	accessToken?: string
	refreshToken?: string
	accessType: 'Guest' | 'Login'
}) {
	if (accessToken) {
		axiosInstance.defaults.headers.common.authorization = 'Bearer ' + accessToken
		_apiAccessToken = accessToken
		if (refreshToken) apiRefreshToken = refreshToken
		_apiAccessType = accessType
	} else {
		axiosInstance.defaults.headers.common.authorization = null
		_apiAccessToken = null
		apiRefreshToken = null
	}
}
