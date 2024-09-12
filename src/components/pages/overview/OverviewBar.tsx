'use client'
import React from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { area, bar, ChartOptions, line } from 'billboard.js'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'
import classNames from 'classnames'
import useResponsive from '@/hook/responsive'

interface OverviewBarTableProps {
	overviewBarColumns?: any
	overviewBarColorArr?: any
	overviewBarXAxis?: any
	overviewBarTooltipData?: any
}

const OverviewBar: React.FC<OverviewBarTableProps> = ({
	overviewBarColumns,
	overviewBarColorArr,
	overviewBarXAxis,
	overviewBarTooltipData,
}) => {
	const overviewBarChart = React.useRef<IChart>(null)
	const { isDesktop } = useResponsive()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation()
	const language = i18n.language as keyof ResponseLanguage
	const barOption = React.useMemo(() => {
		return {
			data: {
				columns: [[...overviewBarColumns]],
				type: bar(),
				color: function (color: string, d: any) {
					return overviewBarColorArr[d.index]
				},
			},
			bar: {
				width: {
					ratio: 0.2,
				},
			},
			axis: {
				x: {
					tick: {
						format: function (index: number) {
							return overviewBarXAxis[index]
						},
					},
					label: {
						text: `${t('overview:ageRange')}`,
						position: 'outer-top',
					},
				},
				y: {
					max: 100,
					padding: 0,
					label: {
						text: `% ${t('overview:plantationArea')}`,
						position: 'inner-top',
					},
					tick: {
						stepSize: 20,
						format: function (x: number) {
							const usformatter = Intl.NumberFormat('en-US', {
								notation: 'compact',
								compactDisplay: 'short',
							})
							return usformatter.format(x)
						},
					},
				},
			},
			legend: {
				show: false,
			},
			grid: {
				y: {
					show: true,
				},
			},
			padding: {
				mode: 'fit' as const,
				top: 20,
				bottom: 0,
				right: isDesktop ? 25 : language === 'en' ? 40 : 25,
				left: language === 'en' ? 25 : 5,
			},
			resize: {
				auto: true,
			},
			tooltip: {
				contents: function (d: any, defaultTitleFormat: any, defaultValueFormat: any, color: any) {
					console.log(d)
					return `<div key=${overviewBarTooltipData} class="bb-tooltip bg-${d[0].index}">
							<p>${t('overview:area')} (${t(`overview:${areaUnit}`)})<p/>
                            <p>${overviewBarTooltipData[d[0].index]}</p>
						</div>`
				},
				position: function (data: any, width: number, height: number, element: any, pos: any) {
					return { top: pos.yAxis - height, left: pos.xAxis - width / 2 }
				},
			},
		}
	}, [
		overviewBarColumns,
		t,
		language,
		overviewBarColorArr,
		overviewBarXAxis,
		areaUnit,
		overviewBarTooltipData,
		isDesktop,
	])

	React.useEffect(() => {
		const chart = overviewBarChart.current?.instance
		if (chart) {
			chart.unload(overviewBarColumns)
			chart.load({
				columns: [[...overviewBarColumns]], //[['data1', 90, 11, 23]],
				append: false,
			})
		}
	}, [overviewBarColumns, overviewBarColorArr, overviewBarXAxis, overviewBarTooltipData, areaUnit])

	return (
		<BillboardJS
			bb={bb}
			options={barOption}
			ref={overviewBarChart}
			className={classNames(
				`bb [&_.bb-axis-x-label]:translate-y-[-14px] [&_.bb-axis-x-label]:text-[10px] [&_.bb-axis-x]:text-sm [&_.bb-axis-x]:font-medium [&_.bb-axis-y-label]:translate-x-[26px] [&_.bb-axis-y-label]:translate-y-[-22px] [&_.bb-axis-y]:text-[10px] [&_.bb-axis-y]:text-[#A1A1A1] [&_.bb-tooltip]:mb-1 [&_.bb-tooltip]:w-max [&_.bb-tooltip]:p-1 [&_.bb-tooltip]:text-center [&_.bb-tooltip]:text-white [&_.bb-tooltip]:shadow-xl [&_.bb-ygrids]:stroke-[#DEE2E6] [&_.domain]:fill-none [&_.value]:text-center`,
				isDesktop
					? language === 'en'
						? `[&_.bb-axis-x-label]:translate-x-[-254px]`
						: `[&_.bb-axis-x-label]:translate-x-[-270px]`
					: `[&_.bb-axis-x-label]:translate-y-[5px]`,
				`[&_.bg-0]:bg-[${overviewBarColorArr[0]}]`,
				`[&_.bg-1]:bg-[${overviewBarColorArr[1]}]`,
				`[&_.bg-2]:bg-[${overviewBarColorArr[2]}]`,
			)}
		/>
	)
}

export default OverviewBar
