import { AreaUnit } from '@/enum'

export function areaUnitString(key: AreaUnit) {
	if (key === AreaUnit.Rai) {
		return 'durainAreaUnit.rai'
	} else if (key === AreaUnit.Sqkm) {
		return 'durainAreaUnit.sqkm'
	} else {
		return 'durainAreaUnit.hectare'
	}
}
