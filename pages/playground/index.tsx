import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import { Button, Container } from '@mui/material'
import MapView from '@/components/common/map/MapView'
import { useCallback, useEffect } from 'react'
import { useMap } from '@/components/common/map/context/map'
import useLayerStore from '@/components/common/map/store/map'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { tileLayer } from '@/config/app.config'
import { MapLayer } from '@/components/common/map/interface/map.jsx'

export const getServerSideProps: GetServerSideProps = async (context) => ({
	props: {
		...(await serverSideTranslations(
			context.locale ?? DEFAULT_LOCALE,
			['common'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const TEST_LAYER_ID = 'test-layer'
const MOCK_TOKEN =
	'eyJraWQiOiI1Vzl6NmhXZmVNQjRhTXlUcGVNV01relk5UEJrakR1YjZsN1lLUTlVdmpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyOTVhNDU5Yy05MGExLTcwMzgtNzA2NC00ZGFmYzFlY2QwYjYiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfSUdMb3Fub2tNIiwiY2xpZW50X2lkIjoiNHA0MzBwMmRhbGEzYWxqbWloa2s3OWg4MmciLCJvcmlnaW5fanRpIjoiY2Q3Y2M5MzYtZTIwZC00ZThkLTk2ZjUtYmFhOGVhZGRiNTFiIiwiZXZlbnRfaWQiOiI0MTExMjg3My00ZDNhLTRlZDgtYmY3ZC05ZDdhYzY4MzZhNTkiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzI2NDAxMTUwLCJleHAiOjE3MjY0ODc1NTAsImlhdCI6MTcyNjQwMTE1MCwianRpIjoiOWM1YWFiOTgtNDU4Yy00ZGE4LWI5NzgtYzJjYmIyYzhkYjMyIiwidXNlcm5hbWUiOiIyOTVhNDU5Yy05MGExLTcwMzgtNzA2NC00ZGFmYzFlY2QwYjYifQ.DIIqgrU6J6dCp1sD7ibvl7YwoT_8WOMQlMKmZcZs4di9uK-dB5R_Z48NyQN0JUgWaeriHM1b9O1t0GOdt89cEDLnwgMb293CUiOTjCF8B00WTVm71Sy6e2h6rhzpyc5A4qNhSPxdPH1Utx3jYvrauOorri1O8VpVKxHPrsixY08fC6tx201uIgrbcfpl2MyTx1dFF1dlTDly6nKnxNqHJQndP1zxsPsBlFCm2fb-4DIEbgVpOUpPxaeqytYF-2keq1-fDjfTtQSTzgwBluiQxLYJT1jCmDQpzu6ZOFk4Z2qWEKazgwr84FVPqC3qXmxymz7H93Yi2AYMD7wg5cA2Ew'

const MapInfoWindowContent: React.FC<{ data: { name: string; math: number } }> = ({ data }) => {
	return (
		<div className={`m-4 flex flex-col`}>
			<div>name : {data.name}</div>
			<div>math : {data.math}</div>
		</div>
	)
}

const PlaygroundPage = () => {
	const { t } = useTranslation('common')
	const { setExtent, showMapInfoWindow } = useMap()
	const { setLayers, addLayer, getLayer, removeLayer } = useLayerStore()

	const handleSetExtent = useCallback(() => {
		setExtent([100.5, 13.7, 100.7, 13.9])
	}, [setExtent])

	const handleAddLayer = useCallback(() => {
		const layer = getLayer(TEST_LAYER_ID)
		if (!layer) {
			addLayer(
				new IconLayer({
					id: TEST_LAYER_ID,
					data: [{ coordinates: [100.5, 13.65] }],
					iconAtlas: '/images/map/icon-atlas.png',
					iconMapping: {
						marker: {
							x: 0,
							y: 0,
							width: 128,
							height: 128,
							anchorX: 64,
							anchorY: 64,
							mask: true,
						},
					},
					getIcon: () => 'marker',
					getPosition: (d) => d.coordinates,
					getSize: 40,
					getColor: [255, 0, 0],
					pickable: true,
				}),
			)
		}
	}, [getLayer, addLayer])

	const handleRemoveLayer = useCallback(() => {
		removeLayer(TEST_LAYER_ID)
	}, [removeLayer])

	const initTileLayer = useCallback(() => {
		const layerProvince = tileLayer.province
		const layerBoundary = tileLayer.boundaryYear(2024)
		setLayers([
			new MVTLayer({
				id: 'province',
				name: 'province',
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${MOCK_TOKEN}`,
						},
					},
				},
				data: layerProvince,
				filled: true,
				lineWidthUnits: 'pixels',
				pickable: true,
				getFillColor() {
					return [226, 226, 226, 100]
				},
				onClick: (info) => {
					if (info.object) {
						const mock = {
							name: 'ทดสอบ',
							math: Math.random(),
						}
						showMapInfoWindow({
							positon: {
								x: info.x,
								y: info.y,
							},
							children: <MapInfoWindowContent data={mock} />,
						})
					}
				},
			}),
		])
	}, [setLayers])

	useEffect(() => {
		// initTileLayer()
	}, [])

	const getInitialLayer = (): MapLayer[] => {
		const layerProvince = tileLayer.province
		const layer = new MVTLayer({
			id: 'muii-test-layer',
			name: 'province',
			loadOptions: {
				fetch: {
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${MOCK_TOKEN}`,
					},
				},
			},
			data: layerProvince,
			filled: true,
			lineWidthUnits: 'pixels',
			pickable: true,
			getFillColor() {
				return [226, 226, 226, 100]
			},
			onClick: (info) => {
				if (info.object) {
					const mock = {
						name: 'ทดสอบ',
						math: Math.random(),
					}
					showMapInfoWindow({
						positon: {
							x: info.x,
							y: info.y,
						},
						children: <MapInfoWindowContent data={mock} />,
					})
				}
			},
		})
		const layerBoundary = tileLayer.boundaryYear(2024)
		const layer2 = new MVTLayer({
			id: 'muii-test2-layer',
			name: 'province',
			loadOptions: {
				fetch: {
					headers: {
						'content-type': 'application/json',
						Authorization: `Bearer ${MOCK_TOKEN}`,
					},
				},
			},
			data: layerBoundary,
			filled: true,
			lineWidthUnits: 'pixels',
			pickable: true,
			getFillColor() {
				return [226, 226, 226, 100]
			},
			onClick: (info) => {
				if (info.object) {
					const mock = {
						name: 'ทดสอบ',
						math: Math.random(),
					}
					showMapInfoWindow({
						positon: {
							x: info.x,
							y: info.y,
						},
						children: <MapInfoWindowContent data={mock} />,
					})
				}
			},
		})
		return [
			{
				id: 'muii-test-layer',
				label: 'muii-test-layer',
				color: '#000000',
				layer,
			},
			{
				id: 'muii-test2-layer',
				label: 'muii-test2-layer',
				color: '#000000',
				layer: layer2,
			},
		]
	}

	return (
		<PageContainer>
			<Container className='flex-1 p-2'>
				<div className='m-0 flex h-full flex-col gap-2 overflow-hidden p-0'>
					<div className='flex-0 flex justify-end gap-2 bg-white p-2'>
						<Button variant='contained' onClick={handleRemoveLayer}>
							Remove Layer
						</Button>
						<Button variant='contained' onClick={handleAddLayer}>
							Add Layer
						</Button>
						<Button variant='contained' onClick={handleSetExtent}>
							Set Extent
						</Button>
					</div>
					<div className='flex flex-1 bg-white p-2'>
						<div className='flex flex-1 flex-row'>
							<MapView initialLayer={getInitialLayer()} />
							<div className='w-[440px]'></div>
						</div>
					</div>
				</div>
			</Container>
		</PageContainer>
	)
}

export default PlaygroundPage
