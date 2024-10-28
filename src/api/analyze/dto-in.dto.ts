export interface GetSummaryOverviewDtoIn {
	year: number
	admCode?: number
}

export interface GetCompareOverviewDtoIn {
	year1: number
	year2: number
	admCode?: number
}

export interface GetAgeclassLocationDtoIn {
	lat: number
	lon: number
	year: number
}

export interface GetCompareLocationDtoIn {
	lat: number
	lon: number
	year1: number
	year2: number
}
