import { ResponseLanguage } from '../interface'

export interface OverviewSummaryDtoOut {
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

export interface OverviewSummaryDtoOut {
	overall: {
		area: Area
		ageClass: AgeClass[]
	}
	adms: {
		admCode: number
		admName: ResponseLanguage
		area: Area
		percentOverall: number
		ageClass: AgeClass[]
	}[]
}

export interface availabilityDurianDtoOut {
    availableAdm: availableAdm[]
    year: number
    yearName: ResponseLanguage
}

export interface locationExtentDtoOut {
    admCode: number
    admName: ResponseLanguage
    extent: [number,number,number,number]
}

interface availableAdm {
    admCode: number
    admName : ResponseLanguage
}

interface AgeClass {
	name: ResponseLanguage
	id: string
	color: string
	area: Area
	percent: number
}

interface Area {
	rai: number
	sqkm: number
	hectare: number
}
