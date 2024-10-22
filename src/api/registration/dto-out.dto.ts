import { ResponseLanguage } from '../interface'

export interface availabilityRegisteredDtoOut {
	availableAdm: availableAdm[]
	year: number
	yearName: ResponseLanguage
}

export interface overviewRegisteredDtoOut {
	adms: availableAdm[]
	overall: {
		nonRegisteredArea: Area
		registeredArea: Area
		totalArea: Area
	}
}

interface availableAdm {
	admCode: number
	admName: ResponseLanguage
	nonRegisteredArea: Area
	registeredArea: Area
	totalArea: Area
}

interface Area {
	rai: number
	sqkm: number
	hectare: number
}

export interface GetRegisteredLocationDtoOut {
	admCode: number
	admNameFull: ResponseLanguage
	status: string
}
