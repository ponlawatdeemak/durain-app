import { AreaUnit } from '@/enum'

export function areaUnitString(key: AreaUnit) {
	if (key === AreaUnit.Rai) {
		return 'areaUnit.rai'
	} else if (key === AreaUnit.Sqkm) {
		return 'areaUnit.sqkm'
	} else {
		return 'areaUnit.hectare'
	}
}
