import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { mdiClose, mdiEyedropperVariant, mdiMapMarker, mdiTrashCan } from '@mdi/js'
import Icon from '@mdi/react'
import {
	Box,
	Divider,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'

import classNames from 'classnames'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import turfArea from '@turf/area'
import turfLength from '@turf/length'
import LineMeasure from './LineMeasure'
import PointMeasure from './PointMeasure'
import PolygonMeasure from './PolygonMeasure'

import 'mapbox-gl/dist/mapbox-gl.css'

enum MeasureMode {
	Polygon,
	Line,
	Point,
}

enum Unit {
	SquareMeter = 'square-meters',
	SquareKilometer = 'square-kilometers',
	Degree = 'degree',
	Meter = 'meters',
	Kilometer = 'kilometers',
}

const lutPolygonUnit = [
	{ id: 1, label: 'ตารางเมตร', value: 'square-meters' },
	{ id: 2, label: 'ตารางกิโลเมตร', value: 'square-kilometers' },
]

const lutLintUnit = [
	{ id: 1, label: 'เมตร', value: 'meters' },
	{ id: 2, label: 'กิโลเมตร', value: 'kilometers' },
]

const lutPointUnit = [{ id: 1, label: 'องศา', value: 'degree' }]

const Measurement = ({
	map,
	open,
	setOpen,
}: {
	map: maplibregl.Map | undefined
	open: boolean
	setOpen: (value: boolean) => void
}) => {
	const [mode, setMode] = useState<MeasureMode>(MeasureMode.Polygon)
	const [totalDistance, setTotalDistance] = useState<number>()
	const [coordinateValue, setCoordinatesValue] = useState<{
		current: [number, number]
		pinned: [number, number]
	}>({
		current: [0, 0],
		pinned: [0, 0],
	})

	const [selectdUnit, setSelectUnit] = useState<{ id: number; label: string; value: string }>({
		id: 1,
		label: 'ตารางเมตร',
		value: 'square-meters',
	})

	const draw = useMemo(() => {
		return new MapboxDraw({
			displayControlsDefault: false,
			// Select which mapbox-gl-draw control buttons to add to the map.
			// controls: {
			//   trash: true,
			// },
			// Set mapbox-gl-draw to draw by default.
			// The user does not have to click the polygon control button first.
			defaultMode: 'draw_polygon',
			styles: [
				{
					id: 'gl-draw-line',
					type: 'line',
					layout: {
						'line-cap': 'round',
						'line-join': 'round',
					},
					paint: {
						'line-color': '#001AFF',
						'line-dasharray': [1, 0],
						'line-width': 3,
					},
				},
				{
					id: 'highlight-points',
					type: 'circle',
					paint: {
						'circle-radius': 4,
						'circle-color': '#ffffff',
						'circle-stroke-color': '#001AFF',
						'circle-stroke-width': 2,
					},
				},
				{
					id: 'gl-draw-polygon-fill',
					type: 'fill',
					filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
					paint: {
						'fill-color': '#1400FF',
						'fill-opacity': 0.4,
					},
				},
			],
		})
	}, [])

	useEffect(() => {
		if (!map || !draw) return
		// return
		setTotalDistance(0)

		if (map.hasControl(draw as any)) {
			map.removeControl(draw as any)
		}

		if (map.getLayer('points')) {
			map.removeLayer('points')
			map.removeSource('sourcePoints')
		}

		map.off('click', onMouseClickPointMode)
		map.off('mousemove', onMouseMovePointMode)
		map.off('draw.create', updateArea)
		map.off('draw.delete', updateArea)
		map.off('draw.update', updateArea)
		map.off('draw.render', updateArea)
		map.off('draw.create', updateRoute)
		map.off('draw.update', updateRoute)
		map.off('draw.delete', updateRoute)
		map.off('draw.render', updateRoute)

		if (open) {
			map.addControl(draw as any, 'top-left')
			map.getCanvasContainer().style.cursor = 'default'
			map.getCanvas().style.cursor = 'default'

			if (mode === MeasureMode.Polygon) {
				draw.changeMode('draw_polygon')
				setSelectUnit({
					id: 1,
					label: 'ตารางเมตร',
					value: 'square-meters',
				})
				map.on('draw.create', updateArea)
				map.on('draw.delete', updateArea)
				map.on('draw.update', updateArea)
				map.on('draw.render', updateArea)
			} else if (mode === MeasureMode.Line) {
				setSelectUnit({
					id: 1,
					label: 'เมตร',
					value: 'meters',
				})
				draw.changeMode('draw_line_string')
				map.on('draw.create', updateRoute)
				map.on('draw.update', updateRoute)
				map.on('draw.delete', updateRoute)
				map.on('draw.render', updateRoute)
			} else if (mode === MeasureMode.Point) {
				setSelectUnit({
					id: 1,
					label: 'องศา',
					value: 'degree',
				})
				draw.changeMode('simple_select')
				setCoordinatesValue({ pinned: [0, 0], current: [0, 0] })

				map.on('mousemove', onMouseMovePointMode)

				map.on('click', onMouseClickPointMode)
				map.on('touchend', onMouseClickPointMode)
			}
		}
	}, [map, mode, open])

	const updateRoute = useCallback(
		(e: any) => {
			const data = draw.getAll()

			if (data.features.length > 0) {
				const area = turfLength(data, { units: 'meters' })

				if (data) {
					setTotalDistance(area)
				}
			}
			if (e.type === 'draw.delete') {
				draw.changeMode('draw_line_string')
			}
		},
		[draw],
	)

	const updateArea = useCallback(
		(e: any) => {
			const data = draw.getAll()

			if (data.features.length > 0) {
				const area = turfArea(data)

				setTotalDistance(area)
			}
			if (e.type === 'draw.delete') {
				draw.changeMode('draw_polygon')
			}
		},
		[draw],
	)

	const onMouseMovePointMode = useCallback(
		(e: maplibregl.MapMouseEvent) => {
			if (!map) return

			const [lat, lng] = [e.lngLat.lat, e.lngLat.lng]
			setCoordinatesValue((prev) => ({
				current: [lat, lng],
				pinned: prev.pinned,
			}))
		},
		[map],
	)

	const onMouseClickPointMode = useCallback(
		(e: maplibregl.MapMouseEvent) => {
			if (!map) return

			e.preventDefault()

			if (map.getLayer('points')) {
				map.removeLayer('points')
				map.removeSource('sourcePoints')
			}
			setCoordinatesValue({
				current: [e.lngLat.lat, e.lngLat.lng],
				pinned: [e.lngLat.lat, e.lngLat.lng],
			})

			map.addSource('sourcePoints', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							// feature for Mapbox DC
							type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: [e.lngLat.lng, e.lngLat.lat],
							},
							properties: {},
						},
					],
				},
			})

			map.addLayer({
				id: 'points',
				type: 'circle',
				source: 'sourcePoints',
				paint: {
					'circle-color': '#ffffff',
					'circle-radius': 5,
					'circle-stroke-color': '#001AFF',
					'circle-stroke-width': 3,
				},
			})
		},
		[map],
	)

	const handleChangeMode = useCallback((value: number) => {
		setMode(value)
	}, [])

	const onClickTrash = useCallback(() => {
		draw.deleteAll()
		if (mode === MeasureMode.Line) {
			draw.changeMode('draw_line_string')
		} else if (mode === MeasureMode.Polygon) {
			draw.changeMode('draw_polygon')
		}
	}, [mode, draw])

	const onClickClose = useCallback(() => {
		setOpen(false)
	}, [])

	const handleChangeUnit = (event: SelectChangeEvent<number>) => {
		const temp = event.target?.value
		const matchItem = lutUnit.find((item) => item.id === temp)
		if (matchItem) {
			setSelectUnit(matchItem)
		}
	}

	const lutUnit = useMemo(() => {
		switch (mode) {
			case MeasureMode.Polygon:
				return lutPolygonUnit
			case MeasureMode.Line:
				return lutLintUnit
			case MeasureMode.Point:
				return lutPointUnit
		}
	}, [mode])

	const displayValue = useMemo(() => {
		if (totalDistance) {
			if (
				selectdUnit.value === Unit.SquareMeter ||
				selectdUnit.value === Unit.Degree ||
				selectdUnit.value === Unit.Meter
			) {
				return `${Number(totalDistance.toFixed(2)).toLocaleString()} ${selectdUnit.label}`
			} else if (selectdUnit.value === Unit.SquareKilometer) {
				const kilometerValue = totalDistance / 1000000

				return `${Number(kilometerValue.toFixed(2)).toLocaleString()} ${selectdUnit.label}`
			} else if (selectdUnit.value === Unit.Kilometer) {
				const kilometerValue = totalDistance / 1000

				return `${Number(kilometerValue.toFixed(2)).toLocaleString()} ${selectdUnit.label}`
			}
		} else {
			return '-'
		}
	}, [selectdUnit, totalDistance])

	return (
		<>
			{open && (mode === MeasureMode.Line || mode === MeasureMode.Polygon) && (
				<Box className='absolute left-2 top-2 z-10'>
					<IconButton aria-label='delete' onClick={onClickTrash} className='!bg-[#2F7A59]'>
						<Icon title={'ลบ'} path={mdiTrashCan} size={1} className='text-white' />
					</IconButton>
				</Box>
			)}

			<div
				style={{ display: open ? undefined : 'none' }}
				className={classNames(
					'absolute bottom-[10px] right-4 z-20',
					'w-[306px] min-w-[306px] bg-white p-4 font-normal min-[390px]:w-[329px] lg:max-h-[100%]',
					'sm:top-[auto] sm:h-auto sm:max-h-[calc(100%_-_38px)]',
					'[&_.label]:text-[14px] [&_.label]:text-[#999999]',
					'shadow-[0px_8px_24px_rgba(149,157,165,0.2)]',
				)}
			>
				<>
					<div className='flex items-center justify-between'>
						<Typography className=''>เครื่องมือวัดแผนที่</Typography>

						<IconButton aria-label='close' onClick={onClickClose}>
							<Icon path={mdiClose} size={'24px'} />
						</IconButton>
					</div>
					<Divider />

					<div
						className={classNames(
							'max-h-[170px] overflow-y-auto lg:max-h-full lg:overflow-y-hidden',
							'max-h-[270px] lg:!overflow-y-auto',
						)}
					>
						<div className='label my-2'>กำหนดตำแหน่งการวัดระยะด้วยการ Double Click</div>
						<ToggleButtonGroup
							className='mb-4'
							size='large'
							exclusive
							color='primary'
							value={mode}
							onChange={(_, value) => handleChangeMode(value)}
						>
							<ToggleButton
								className='flex flex-col rounded-none border-none'
								value={MeasureMode.Polygon}
							>
								<PolygonMeasure />
							</ToggleButton>
							<ToggleButton className='flex flex-col rounded-none border-none' value={MeasureMode.Line}>
								<LineMeasure />
							</ToggleButton>
							<ToggleButton className='flex flex-col rounded-none border-none' value={MeasureMode.Point}>
								<PointMeasure />
							</ToggleButton>
						</ToggleButtonGroup>

						<Divider />
						<div className='my-4 text-sm'>
							{mode === MeasureMode.Polygon
								? 'วัดขนาดพื้นที่'
								: mode === MeasureMode.Line
									? 'วัดระยะทาง'
									: mode === MeasureMode.Point
										? 'วัดตำแหน่ง'
										: 'วัดระยะร่น'}
						</div>

						<FormControl sx={{ minWidth: 150 }} size='small'>
							<InputLabel id='measurement-unit-label'>หน่วย</InputLabel>
							<Select
								labelId='measurement-unit-label'
								label='หน่วย'
								id='measurement-unit-id'
								value={selectdUnit.id}
								onChange={handleChangeUnit}
							>
								{lutUnit.map((item) => {
									return (
										<MenuItem key={item.id} value={item.id}>
											<span className='text-sm'>{item.label}</span>
										</MenuItem>
									)
								})}
							</Select>
						</FormControl>

						{mode === MeasureMode.Point ? (
							<div className='mt-4 text-sm'>
								<div className='label w-[110px]'>ผลลัพธ์จากการวัด:</div>
								<div className='mt-2'>
									<div className='my-2 flex'>
										<div className='flex-1'></div>
										<div className='flex-1'>ละติจูด</div>
										<div className='flex-1'>ลองจิจูด</div>
									</div>
									<Divider />
									<div className='my-2 flex'>
										<div className='flex-1'>
											<Icon path={mdiEyedropperVariant} size={1} />
										</div>
										<div className='flex-1'>{coordinateValue.current[0].toFixed(6) || '---'}</div>
										<div className='flex-1'>{coordinateValue.current[1].toFixed(6) || '---'}</div>
									</div>
									<Divider />
									<div className='my-2 flex'>
										<div className='flex-1'>
											<Icon path={mdiMapMarker} size={1} className='text-[rgb(105,210,190)]' />
										</div>
										<div className='flex-1'>{coordinateValue.pinned[0].toFixed(6) || '---'}</div>
										<div className='flex-1'>{coordinateValue.pinned[1].toFixed(6) || '---'}</div>
									</div>
									<Divider className='my-[4px]' />
								</div>
							</div>
						) : (
							<div className='mt-4 flex gap-4 text-sm'>
								<div>
									<div className='label w-[110px]'>ผลลัพธ์จากการวัด:</div>
								</div>
								<div>
									<div>{displayValue}</div>
								</div>
							</div>
						)}
					</div>
				</>
			</div>
		</>
	)
}

export default memo(Measurement)
