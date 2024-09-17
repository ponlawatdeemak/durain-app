import { create } from 'zustand'

export interface AnalyzeParamsType {
	year?: number
	yearStart?: number
	yearEnd?: number
	provinceId?: number
	districtId?: number
}

const initialParams = {
	year: undefined,
	yearStart: undefined,
	yearEnd: undefined,
	provinceId: undefined,
	districtId: undefined,
}

interface SearchAnalyzeContextType {
	queryParams: AnalyzeParamsType
	setQueryParams: (queryParams: AnalyzeParamsType) => void
}

const useSearchAnalyze = create<SearchAnalyzeContextType>((set) => ({
	queryParams: initialParams,
	setQueryParams: (queryParams: AnalyzeParamsType) => set({ queryParams }),
}))

export default useSearchAnalyze
