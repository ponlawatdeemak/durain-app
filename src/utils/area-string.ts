import { AreaUnitKey } from '@/enum'

export function areaUnitString(key: AreaUnitKey) {
	if (key === AreaUnitKey.Rai) {
		return 'areaUnit.rai'
	} else if(key === AreaUnitKey.Sqkm) {
		return 'areaUnit.sqkm'
	} else {
		return 'areaUnit.hectare'
	}
}
