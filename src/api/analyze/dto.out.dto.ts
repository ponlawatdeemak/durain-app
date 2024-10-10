import { ResponseLanguage } from '../interface'

interface AvailableAdm {
	admCode: number
	admName: ResponseLanguage
}

export interface GetDurianAvailabilityDtoOut {
	year: number
	yearName: ResponseLanguage
	availableAdm: AvailableAdm[]
}

interface Area {
	rai: number
	sqkm: number
	hectare: number
}

interface AgeClass {
	name: ResponseLanguage
	id: string
	color: string
	area: Area
	percent: number
}

interface Overall {
	ageClass: AgeClass[]
	area: Area
}

interface ADMS {
	admCode: number
	admName: ResponseLanguage
}

interface ADMSSummary extends ADMS {
	area: Area
	percentOverall: number
	ageClass: AgeClass[]
}

export interface GetSummaryOverviewDtoOut {
	overall: Overall
	adms: ADMSSummary[]
}

export interface GetHistoryOverviewDtoOut {
	year: number
	yearName: ResponseLanguage
	ageClass: AgeClass[]
}

interface CompareChange {
	decrease: Area
	increase: Area
	totalChange: Area
}

interface ADMSCompare extends ADMS {
	change: CompareChange
	year1Area: Area
}

export interface GetCompareOverviewDtoOut {
	adms: ADMSCompare[]
	year1: ResponseLanguage
	year2: ResponseLanguage
}

interface AgeclassLocation {
	name: ResponseLanguage
	age: ResponseLanguage
	unit: ResponseLanguage
	color: string
}

export interface GetAgeclassLocationDtoOut {
	admCode: string
	admNameFull: ResponseLanguage
	ageClass: AgeclassLocation
}

export interface GetCompareLocationDtoOut {
	admCode: number
	admNameFull: ResponseLanguage
	change: CompareChange
}
