import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { APIConfigType, APIService, AppAPI } from './interface'
import service from '@/api'

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

export let apiAccessToken: string | null = null
let apiRefreshToken: string | null = null

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

// axiosInstance.interceptors.response.use(
// 	(response) => {
// 		return response
// 	},
// 	async function (error) {
// 		const errorData = error.response.data
// 		if (error instanceof AxiosError && error.config && error.response?.status === 401) {
// 			try {
// 				const originalRequest = error.config as any
// 				if (!originalRequest?._retry) {
// 					originalRequest._retry = true

// 					console.log('refreshhhhh')
// 					console.log('apiRefreshToken : ', apiRefreshToken)
// 					const res = await service.auth.refreshToken({ refreshToken: apiRefreshToken })
// 					const newAccessToken = res.data?.access_token
// 					updateAccessToken({ accessToken: newAccessToken })
// 					return axiosInstance({
// 						...originalRequest,
// 						headers: {
// 							...originalRequest.headers,
// 							authorization: `Bearer ${newAccessToken}`,
// 						},
// 					}).catch((err) => {
// 						console.error(err)
// 					})
// 				}
// 			} catch (err) {
// 				return Promise.reject({
// 					title: errorData.title || errorData.message,
// 					status: errorData.status || errorData.success,
// 					detail: errorData.detail,
// 				})
// 			}
// 		}
// 		return Promise.reject({
// 			title: errorData.title || errorData.message,
// 			status: errorData.status || errorData.success,
// 			detail: errorData.detail,
// 		})
// 	},
// )

export function updateAccessToken({ accessToken, refreshToken }: { accessToken?: string; refreshToken?: string }) {
	if (accessToken) {
		axiosInstance.defaults.headers.common.authorization = 'Bearer ' + accessToken
		apiAccessToken = accessToken
		if (refreshToken) apiRefreshToken = refreshToken
	} else {
		axiosInstance.defaults.headers.common.authorization = null
		apiAccessToken = null
		apiRefreshToken = null
	}
}
