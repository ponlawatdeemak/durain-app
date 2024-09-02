import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AreaUnitKey } from '@/enum'

type StoreAreaUnitKey = {
	areaUnit: AreaUnitKey
	setAreaUnit: (areaUnit: AreaUnitKey) => void
}

const useAreaUnit = create(
	persist<StoreAreaUnitKey>(
		(set) => ({
			areaUnit: AreaUnitKey.Rai,
			setAreaUnit: (areaUnit: AreaUnitKey) =>
				set(() => {
					return { areaUnit: areaUnit }
				}),
		}),
		{
			name: 'areaUnit', // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
		},
	),
)

export default useAreaUnit
