import React, { useCallback, useEffect } from 'react'
import bb, { bar } from 'billboard.js'
import 'billboard.js/dist/billboard.css'
import { useTranslation } from 'next-i18next'
import useResponsive from '@/hook/responsive'
import useAreaUnit from '@/store/area-unit'
import classNames from 'classnames'
import { Languages } from '@/enum'

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
                    <p>${Math.round(data.overall.ageClass[index].area[areaUnit]).toLocaleString()}</p>
                </div>`
		},
		[data, areaUnit, t],
	)

	useEffect(() => {
		if (data && data?.overall?.ageClass?.length > 0) {
			bb.generate({
				bindto: '#chart',
				data: {
					columns: [['data'].concat(data?.overall?.ageClass?.map((item: any) => item.percent))],
					type: bar(),
					color: function (_: string, d: any) {
						return data.overall.ageClass?.[d.index].color
					},
				},
				bar: {
					width: { ratio: 0.2 },
				},
				axis: {
					x: {
						tick: {
							format: function (index: number) {
								return data.overall.ageClass?.[index].name[language]
							},
						},
						label: {
							text: `${t('overview:ageRange')}`,
							position: 'outer-top',
						},
					},
					y: {
						max: 100,
						padding: { top: 4 },
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
					bottom: 10,
					right: isDesktop ? 10 : language === Languages.TH ? 25 : 45,
					left: language === Languages.TH ? 20 : 40,
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
	}, [data, generateTooltips, language, isDesktop, t])

	return (
		<div
			id='chart'
			className={classNames(
				`bb`,
				`[&_.bb-main]:font-[anuphan,sans-serif]`,
				`[&_.bb-axis>.tick>line]:hidden`,
				`[&_.bb-axis-x-label]:translate-y-[-12px] [&_.bb-axis-x-label]:text-[10px] [&_.bb-axis-x-label]:font-normal`,
				`[&_.bb-axis-x]:text-sm [&_.bb-axis-x]:font-medium`,
				`[&_.bb-axis-y-label]:translate-x-[26px] [&_.bb-axis-y-label]:translate-y-[-22px]`,
				`[&_.bb-axis-y>.tick]:text-[10px] [&_.bb-axis-y>.tick]:opacity-35`,
				`[&_.bb-tooltip]:mb-1 [&_.bb-tooltip]:w-max [&_.bb-tooltip]:p-1 [&_.bb-tooltip]:text-center [&_.bb-tooltip]:text-white [&_.bb-tooltip]:shadow-xl`,
				`[&_.bb-xgrid-focus]:hidden`,
				`[&_.bb-ygrids]:opacity-45`,
				`[&_.domain]:hidden [&_.value]:text-center`,
				isDesktop
					? language === 'en'
						? `[&_.bb-axis-x-label]:translate-x-[-216px]`
						: `[&_.bb-axis-x-label]:translate-x-[-237px]`
					: `[&_.bb-axis-x-label]:translate-y-[5px]`,
			)}
		></div>
	)
}

export default Chart
