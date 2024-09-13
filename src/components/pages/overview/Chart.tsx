import React, { useCallback, useEffect } from 'react'
import bb, { bar } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import { useTranslation } from 'next-i18next'
import useResponsive from '@/hook/responsive'
import useAreaUnit from '@/store/area-unit'

// ทำ interface สำหรับ data เพิ่มด้วย
interface OverviewBarTableProps {
	data?: any
}

const Chart: React.FC<OverviewBarTableProps> = ({ data }) => {
	const { t, i18n } = useTranslation()
	const { areaUnit } = useAreaUnit()
	const { isDesktop } = useResponsive()
	const language = i18n.language

	const generateTooltips = useCallback(
		(index: number, color: string) => {
			return `<div class="bb-tooltip" style="background-color:${color}">
                    <p>${t('overview:area')} (${t(`overview:${areaUnit}`)})<p/>
                    <p>${data.overall.ageClass[index].area[areaUnit]}</p>
                </div>`
		},
		[data, areaUnit],
	)

	useEffect(() => {
		if (data) {
			bb.generate({
				bindto: '#chart',
				data: {
					columns: [['data'].concat(data.overall.ageClass.map((item: any) => item.percent))],
					type: bar(),
					color: function (_: string, d: any) {
						return data.overall.ageClass[d.index].color
					},
				},
				bar: {
					width: { ratio: 0.2 },
				},
				axis: {
					x: {
						tick: {
							format: function (index: number) {
								return data.overall.ageClass[index].name[language]
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
					contents: function (d: any, _arg1: any, _arg2: any, color: any) {
						return generateTooltips(d[0].index, color(d[0]))
					},
					position: function (_arg1: any, width: number, height: number, _arg2: any, pos: any) {
						return { top: pos.yAxis - height, left: pos.xAxis - width / 2 }
					},
				},
			})
		}
	}, [data, generateTooltips])

	return <div id='chart'></div>
}

export default Chart
