import { DEFAULT_LOCALE } from '@/../webapp.config'
import { GetServerSideProps } from 'next'
import { UserConfig, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../next-i18next.config.js'
import PageContainer from '@/components/Layout/PageContainer'
import { Button, Container } from '@mui/material'
import MapView from '@/components/common/map/MapView'
import { useCallback, useEffect, useMemo } from 'react'
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
			['common', 'um'],
			nextI18NextConfig as UserConfig,
		)),
	},
})

const TEST_LAYER_ID = 'test-layer'
const MOCK_TOKEN =
	'eyJraWQiOiI1Vzl6NmhXZmVNQjRhTXlUcGVNV01relk5UEJrakR1YjZsN1lLUTlVdmpnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJiOTFhYjU5Yy1mMGYxLTcwNWYtNTk0Yi04NWY1N2Q5NjVjYmIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGhlYXN0LTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGhlYXN0LTFfSUdMb3Fub2tNIiwiY2xpZW50X2lkIjoiNHA0MzBwMmRhbGEzYWxqbWloa2s3OWg4MmciLCJvcmlnaW5fanRpIjoiNGJjNDJmZWItODY0ZC00NTFhLTg1OWYtYjkyOGM2NzZlZjFlIiwiZXZlbnRfaWQiOiIwNTQxZDM4MC0zNDdjLTQ4ZjctYWUzMS04MDI5MjM4NzE2NTAiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzI1MjYyOTQ5LCJleHAiOjE3MjY5OTE3MjEsImlhdCI6MTcyNjkwNTMyMSwianRpIjoiZDI1OWVlZjktMWIwNS00NjljLWIxMWEtNzgzYWM2OTdjOTczIiwidXNlcm5hbWUiOiJiOTFhYjU5Yy1mMGYxLTcwNWYtNTk0Yi04NWY1N2Q5NjVjYmIifQ.bSnPsgn5u_6k3ho4j9wnCj3QQ64twt82F_y_vHvdlhRIS0tNfzZzOQ7SaNDyAttZF3p1lLllo0Jsdg5TobPL1YsJnvXOaHqN4GWPG7Toi_P8dX0poO-9LdvRKp2m27a2PuSNnuyt90uZoz0tMrrsBMYYUQ8zsGv0jFvuo-VJegMFYt9ojZPCaNa7cO34zME8t7ge_XkcKga2ekcxTvzOCovn8V90HDaIGN0YQV6e0gLNfvbrYwG1g0Ja1xX0J9Ix3N2NOvD7g7myUJOxXl1Lzi9wHC2Qx0Xivc-RFHuaZKrHPykgPlpQWf86fkqRgG319Kss15uNjocuqVn0KBPc7g'
const MapInfoWindowContent: React.FC<{ data: { name: string; math: number } }> = ({ data }) => {
	return (
		<div className={`m-4 flex flex-col`}>
			<div>name : {data.name}</div>
			<div>math : {data.math}</div>
		</div>
	)
}

const PlaygroundPage = () => {
	const { setExtent, setMapInfoWindow } = useMap()
	const { addLayer, getLayer, removeLayer } = useLayerStore()

	const initialLayer = useMemo(() => {
		return [
			{
				id: 'province-layer',
				label: 'province',
				color: '#1f75cb',
				layer: new MVTLayer({
					id: 'province-layer',
					name: 'province',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${MOCK_TOKEN}`,
							},
						},
					},
					data: tileLayer.province,
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
							setMapInfoWindow({
								positon: {
									x: info.x,
									y: info.y,
								},
								children: <MapInfoWindowContent data={mock} />,
							})
						}
					},
				}),
			},
			{
				id: 'boundary-layer',
				label: 'boundary',
				color: '#f9d7dc',
				layer: new MVTLayer({
					id: 'boundary-layer',
					name: 'province',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${MOCK_TOKEN}`,
							},
						},
					},
					data: tileLayer.boundaryYear(2024),
					filled: true,
					lineWidthUnits: 'pixels',
					getFillColor() {
						return [226, 226, 226, 100]
					},
				}),
			},
		]
	}, [])

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
							<MapView initialLayer={initialLayer} />
							<div className='w-[440px]'></div>
						</div>
					</div>
				</div>
			</Container>
		</PageContainer>
	)
}

export default PlaygroundPage
