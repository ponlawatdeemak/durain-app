import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { APIConfigType, APIService, AppAPI } from './interface'

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
// 		if (error instanceof AxiosError && error.config && error.response?.status === 401) {
// 			try {
// 				const originalRequest = error.config as any
// 				if (!originalRequest?._retry) {
// 					originalRequest._retry = true
// 					const { updateToken } = await import('@arv-bedrock/auth')
// 					const result = await updateToken()
// 					const newToken = `${AuthType.Arv}-${result?.access_token}`
// 					updateAccessToken(newToken)
// 					return axiosInstance({
// 						...originalRequest,
// 						headers: {
// 							...originalRequest.headers,
// 							authorization: `Bearer ${newToken}`,
// 						},
// 					}).catch((err) => {
// 						if (isModalShown) return
// 						isModalShown = true
// 						const href =
// 							typeof location !== 'undefined' ? `${location.protocol}//${location.host}${basePath}` : ''
// 						return new Promise((resolve) => {
// 							Modal.confirm({
// 								closable: false,
// 								okCancel: false,
// 								okText: 'ตกลง',
// 								title: 'ระยะเวลาการใช้งานหมดอายุ',
// 								content: 'โปรดเข้าสู่ระบบอีกครั้ง',
// 								onOk: () =>
// 									import('@arv-bedrock/auth')
// 										.then(({ doLogout }) => doLogout(href))
// 										.then(() => {
// 											isModalShown = false
// 											resolve(err)
// 										}),
// 							})
// 						})
// 					})
// 				}
// 			} catch (err) {
// 				return Promise.reject(err)
// 			}
// 		}
// 		return Promise.reject(error)
// 	},
// )

export function updateAccessToken(token?: string | void) {
	if (token) {
		axiosInstance.defaults.headers.common.authorization = 'Bearer ' + token
	} else {
		axiosInstance.defaults.headers.common.authorization = ''
	}
}
