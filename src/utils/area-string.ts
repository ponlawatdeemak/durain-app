import { AreaUnitKey } from '@/enum'


export function areaUnitString(key: AreaUnitKey) {
	if (key === AreaUnitKey.Rai) {
		return 'menu.areaUnitUnit.rai'
	} else {
		return 'menu.areaUnitUnit.landPlot'
	}
}
