import React, { useEffect, useMemo, useRef } from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { bar } from 'billboard.js'
import { GetHistoryOverviewDtoOut } from '@/api/analyze/dto.out.dto'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'next-i18next'
import { ResponseLanguage } from '@/api/interface'

interface HistoryDataType {
	[key: string]: {
		color?: string
		columns?: (string | number)[]
	}
}

interface HistoryBarColorType {
	[key: string]: string | undefined
}

interface HistoryChartProps {
	historyOverviewData: GetHistoryOverviewDtoOut[] | undefined
}

const HistoryChart: React.FC<HistoryChartProps> = ({ historyOverviewData }) => {
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage
	const historyBarChart = useRef<IChart>(null)

	const historyBarData = useMemo(() => {
		const historyBarData: HistoryDataType = {}
		historyOverviewData?.forEach((data) =>
			data?.ageClass?.forEach((ageClass) => {
				if (!historyBarData[ageClass?.name?.[language]]) {
					historyBarData[ageClass?.name?.[language]] = {}
				}
				if (!historyBarData[ageClass?.name?.[language]].color) {
					historyBarData[ageClass?.name?.[language]].color = ageClass?.color
				}
				if (!historyBarData[ageClass?.name?.[language]].columns) {
					historyBarData[ageClass?.name?.[language]].columns = [ageClass?.name?.[language]]
				}
				historyBarData[ageClass?.name?.[language]].columns?.push(ageClass?.area?.[areaUnit])
			}),
		)
		return historyBarData
	}, [historyOverviewData, language, areaUnit])

	const historyBarColumns = useMemo(() => {
		const historyBarColumns: ((string | number)[] | undefined)[] = []
		for (let data in historyBarData) {
			historyBarColumns.push(historyBarData[data].columns)
		}
		return historyBarColumns
	}, [historyBarData])

	const historyBarColors = useMemo(() => {
		const historyBarColors: HistoryBarColorType = {}
		for (let data in historyBarData) {
			historyBarColors[data] = historyBarData[data].color
		}
		return historyBarColors
	}, [historyBarData])

	const historyBarGroup = useMemo(() => {
		const historyBarGroup: string[][] = [[]]
		for (let data in historyBarData) {
			historyBarGroup[0].push(data)
		}
		return historyBarGroup
	}, [historyBarData])

	const barOption = useMemo(() => {
		return {
			data: {
				columns: [],
				type: bar(),
				groups: [],
				stack: {
					normalize: true,
				},
				colors: {},
				order: 'desc' as const,
			},
			axis: {
				x: {
					type: 'category' as const,
					categories: [],
					tick: {
						centered: true,
						text: {
							position: {
								y: 8,
							},
						},
					},
				},
				y: {
					tick: {
						format: (x: number) => {
							return x % 20 === 0 ? x : ''
						},
						text: {
							position: {
								x: 4,
							},
						},
					},
				},
			},
			grid: {
				y: {
					lines: [{ value: 0 }, { value: 20 }, { value: 40 }, { value: 60 }, { value: 80 }, { value: 100 }],
				},
				lines: {
					front: false,
				},
			},
			bar: {
				width: 14,
				radius: 2,
			},
			legend: {
				show: true,
				contents: {
					bindto: '#legend',
					template: function (title: string, color: string) {
						return `<div class='flex flex-row items-center gap-[10px]'>
								<div style='background-color:${color}' class='w-3 h-3 rounded-full'></div>
								<span class='text-sm leading-[18px] font-medium text-[#333333]'>${title}</span>
							</div>`
					},
				},
			},
			// size: {
			// 	height: 220,
			// },
			padding: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 24,
			},
			tooltip: {
				contents: function (d: any, defaultTitleFormat: any, defaultValueFormat: any, color: any) {
					const separatedLine = `<div class='h-[30px] border-0 border-l border-solid border-[#E5E8EB]'></div>`
					let tooltipHistory = `<div style='box-shadow:0px 5px 11px 0px #AFAFAF80' class='rounded border border-solid border-[#E9ECEE] bg-white px-4 py-2'>
                                            <div class='flex flex-col items-center gap-1'>
                                                <span class='text-[10px] leading-[14px] font-medium text-[#F1A90B]'>${t('analyze:historicalDurianPlantation')}</span>
                                                <div class='flex flex-row items-center gap-[10px]'>`
					d.forEach((item: any, index: number) => {
						tooltipHistory += `${index !== 0 ? separatedLine : ''}
                                        <div class='flex flex-col items-center'>
                                            <span style='color:${color(item.id)}' class='text-[10px] leading-[14px] font-medium'>${item.name}</span>
                                            <span class='text-xs font-medium text-[#5C5C5C]'>${Math.round(item.ratio * 100)} %</span>
                                        </div>`
					})
					tooltipHistory += `</div>
                                </div>
                            </div>`

					return tooltipHistory
				},
			},
		}
	}, [language])

	useEffect(() => {
		const chart = historyBarChart.current?.instance

		if (chart) {
			chart.load({
				columns: historyBarColumns as any,
				colors: historyBarColors as any,
				categories: historyOverviewData?.map((item) => item?.yearName?.[language]),
				unload: true,
			})
			chart.groups(historyBarGroup)
		}
	}, [historyOverviewData, historyBarColumns, historyBarColors, historyBarGroup, language])

	return (
		<>
			<div className='flex w-full flex-col gap-2.5'>
				<span className='text-[10px] font-medium text-[#333333]'>{'%'}</span>
				<BillboardJS
					bb={bb}
					options={barOption}
					ref={historyBarChart}
					className={
						'h-[220px] [&_.bb-axis-x]:text-sm [&_.bb-axis-x]:font-medium [&_.bb-axis-x]:text-[#333333] [&_.bb-axis-y]:text-[10px] [&_.bb-axis-y]:font-medium [&_.bb-axis-y]:text-[#A1A1A1] [&_.bb-ygrid-line]:stroke-[#DEE2E6] [&_.bb-ygrid-line]:[stroke-dasharray:6,2] [&_.domain]:hidden [&_svg]:absolute'
					}
				/>
			</div>
			<div id='legend' className='flex gap-12'></div>
		</>
	)
}

export default HistoryChart
