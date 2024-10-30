import React, { useCallback, useEffect, useMemo } from 'react'
import bb, { donut } from 'billboard.js'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'
import { OverviewIcon } from '@/components/svg/MenuIcon'
import { AreaUnitText } from '@/enum'
import { GetSummaryOverviewDtoOut } from '@/api/analyze/dto.out.dto'
import useResponsive from '@/hook/responsive'

interface SummaryDataType {
	[key: string]: {
		color?: string
		columns?: (string | number)[]
	}
}

interface SummaryChartColorType {
	[key: string]: string | undefined
}

interface SummaryChartProps {
	summaryOverviewData: GetSummaryOverviewDtoOut | undefined
	year: string | undefined
}

const SummaryChart: React.FC<SummaryChartProps> = ({ summaryOverviewData, year }) => {
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage

	const summaryChartData = useMemo(() => {
		const summaryChartData: SummaryDataType = {}
		summaryOverviewData?.overall?.ageClass?.forEach((ageClass) => {
			if (!summaryChartData[ageClass?.name?.[language]]) {
				summaryChartData[ageClass?.name?.[language]] = {}
			}
			if (!summaryChartData[ageClass?.name?.[language]].color) {
				summaryChartData[ageClass?.name?.[language]].color = ageClass?.color
			}
			if (!summaryChartData[ageClass?.name?.[language]].columns) {
				summaryChartData[ageClass?.name?.[language]].columns = [ageClass?.name?.[language]]
			}
			summaryChartData[ageClass?.name?.[language]].columns?.push(ageClass?.area?.[areaUnit])
		})
		return summaryChartData
	}, [summaryOverviewData, language, areaUnit])

	const summaryChartColumns = useMemo(() => {
		const summaryChartColumns: ((string | number)[] | undefined)[] = []
		for (let data in summaryChartData) {
			summaryChartColumns.push(summaryChartData[data].columns)
		}
		return summaryChartColumns
	}, [summaryChartData])

	const summaryChartColors = useMemo(() => {
		const summaryChartColors: SummaryChartColorType = {}
		for (let data in summaryChartData) {
			summaryChartColors[data] = summaryChartData[data].color
		}
		return summaryChartColors
	}, [summaryChartData])

	const generateTooltips = useCallback(
		(index: number, name: string, value: number, color: string) => {
			return `<div style='box-shadow:0px 5px 11px 0px #AFAFAF80' class='rounded border border-solid border-[#EDEDED] bg-white px-2.5 py-1.5'>
                <div class='flex flex-col items-center gap-1'>
                    <span class='text-[10px] font-medium text-[#F1A90B]'>${t('year')} ${year ?? ''}</span>
                    <span style='color:${color}' class='text-sm text-center font-medium'>${t('analyze:ageOfDurianTrees')} ${name}</span>
                    <span class='text-sm text-center font-medium text-[#5C5C5C]'>${Number(value?.toFixed(2) || 0).toLocaleString()} ${t(AreaUnitText[areaUnit])}</span>
                </div>
            </div>`
		},
		[summaryOverviewData, areaUnit, t, year],
	)

	useEffect(() => {
		if (summaryOverviewData && summaryOverviewData?.overall?.ageClass?.length > 0) {
			bb.generate({
				bindto: '#chart',
				data: {
					columns: summaryChartColumns as any,
					type: donut(),
					colors: summaryChartColors as any,
				},
				donut: {
					label: {
						show: false,
					},
					width: 14,
				},
				arc: {
					cornerRadius: 14,
				},
				legend: {
					show: false,
				},
				// size: {
				// 	height: 275,
				// },
				padding: {
					mode: 'fit' as const,
					bottom: -10,
				},
				tooltip: {
					contents: function (d: any, _arg1: any, _arg2: any, color: any) {
						return generateTooltips(d[0].index, d[0].name, d[0].value, color(d[0]))
					},
				},
			})
		}
	}, [summaryOverviewData, generateTooltips, language, isDesktop, t, summaryChartColumns, summaryChartColors])

	return (
		<>
			<div className='absolute flex w-[204px] flex-col items-center gap-2 [&_svg]:!h-[42px] [&_svg]:!w-[48px] [&_svg]:fill-[#F1A90B]'>
				<OverviewIcon />
				<span className='text-center text-xl font-medium text-[#0C5D52]'>{`${t('analyze:durianPlantationArea')} ${t('year')} ${year ?? ''}`}</span>
				<span className='text-center text-2xl font-medium text-[#333333]'>{`${Number(summaryOverviewData?.overall?.area?.[areaUnit]?.toFixed(2) ?? 0)?.toLocaleString() || ''} ${t(AreaUnitText[areaUnit])}`}</span>
			</div>
			<div id='chart' className={'z-10 h-[275px] w-[275px]'}></div>
		</>
	)
}

export default SummaryChart
