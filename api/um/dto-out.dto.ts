import { ResponseLanguage } from '../interface'

export interface UmSearchDtoOut {
	id: string
	username: string
	firstName: string
	lastName: string
	email: string
	image: string
	orgCode: string
	role: string
	responsibleProvinceCode: string
	responsibleDistrictCode: string
	flagStatus: string
	createdAt: string
	updatedAt: string
	orgName: ResponseLanguage
	roleName: ResponseLanguage
	responsibleProvinceName: ResponseLanguage
	responsibleDistrictName: ResponseLanguage
	flagStatusName: ResponseLanguage
}
