import React, { useEffect, useMemo, useRef } from 'react'
import BillboardJS, { IChart } from '@billboard.js/react'
import bb, { bar } from 'billboard.js'
import { GetHistoryOverviewDtoOut } from '@/api/analyze/dto.out.dto'
import useAreaUnit from '@/store/area-unit'
import useSearchAnalyze from '../Main/context'
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
	const { queryParams, setQueryParams } = useSearchAnalyze()
	const { t, i18n } = useTranslation(['common'])
	const language = i18n.language as keyof ResponseLanguage
	const historyBarChart = useRef<IChart>(null)

	const historyBarData = useMemo(() => {
		const historyBarData: HistoryDataType = {}
		historyOverviewData?.forEach((data) =>
			data.ageClass.forEach((ageClass) => {
				if (!historyBarData[ageClass.name[language]]) {
					historyBarData[ageClass.name[language]] = {}
				}
				if (!historyBarData[ageClass.name[language]].color) {
					historyBarData[ageClass.name[language]].color = ageClass.color
				}
				if (!historyBarData[ageClass.name[language]].columns) {
					historyBarData[ageClass.name[language]].columns = [ageClass.name[language]]
				}
				historyBarData[ageClass.name[language]].columns?.push(ageClass.area[areaUnit])
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
					template: function (title: any, color: any) {
						return `<div style='display:flex;align-items:center;gap:10px'>
								<div style='background-color:${color};width:12px;height:12px;border-radius:50%'></div>
								<span style='font-size:14px;line-height:18px;font-weight:500;color:#333333'>${title}</span>
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
					return `<div style='background-color:white;padding:8px 16px;border:1px solid #E9ECEE;box-shadow:0px 5px 11px 0px #AFAFAF80'>
                                <div style='display:flex;flex-direction:column;align-items:center;gap:4px'>
                                    <span style='font-size:10px;line-height:14px;font-weight:500;color:#F1A90B'>${'พื้นที่ปลูกรายปีย้อนหลัง'}</span>
                                    <div style='display:flex;flex-direction:row;align-items:center;gap:10px'>
                                        <div style='display:flex;flex-direction:column;align-items:center'>
                                            <span style='font-size:10px;line-height:14px;font-weight:500;color:${color(d[0].id)}'>${d[0].name}</span>
                                            <span style='font-size:12px;line-height:16px;font-weight:500;color:#5C5C5C'>${Math.round(d[0].ratio * 100)} %</span>
                                        </div>
                                        <div style='border-left:1px solid #E5E8EB;height:30px'></div>
                                        <div style='display:flex;flex-direction:column;align-items:center'>
                                            <span style='font-size:10px;line-height:14px;font-weight:500;color:${color(d[1].id)}'>${d[1].name}</span>
                                            <span style='font-size:12px;line-height:16px;font-weight:500;color:#5C5C5C'>${Math.round(d[1].ratio * 100)} %</span>
                                        </div>
                                        <div style='border-left:1px solid #E5E8EB;height:30px'></div>
                                        <div style='display:flex;flex-direction:column;align-items:center'>
                                            <span style='font-size:10px;line-height:14px;font-weight:500;color:${color(d[2].id)}'>${d[2].name}</span>
                                            <span style='font-size:12px;line-height:16px;font-weight:500;color:#5C5C5C'>${Math.round(d[2].ratio * 100)} %</span>
                                        </div>
                                    </div>
                                </div>
                            </div>`
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
				categories: historyOverviewData?.map((item) => item.yearName[language]),
				unload: true,
			})
			chart.groups(historyBarGroup)
		}
	}, [historyOverviewData, historyBarColumns, historyBarColors, historyBarGroup, language])

	return (
		<>
			<div className='flex flex-col gap-2.5'>
				<span className='text-[10px] font-medium text-[#333333]'>{'%'}</span>
				<BillboardJS
					bb={bb}
					options={barOption}
					ref={historyBarChart}
					className={
						'h-[220px] [&_.bb-axis-x]:text-sm [&_.bb-axis-x]:font-medium [&_.bb-axis-x]:text-[#333333] [&_.bb-axis-y]:text-[10px] [&_.bb-axis-y]:font-medium [&_.bb-axis-y]:text-[#A1A1A1] [&_.bb-ygrid-line]:stroke-[#DEE2E6] [&_.bb-ygrid-line]:[stroke-dasharray:6,2] [&_.domain]:hidden'
					}
				/>
			</div>
			<div id='legend' className='flex gap-12'></div>
		</>
	)
}

export default HistoryChart
