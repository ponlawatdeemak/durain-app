import React, { CSSProperties } from 'react'

export default function PointMeasure({
	style,
	className,
}: {
	style?: CSSProperties
	className?: HTMLElement['className']
}) {
	return (
		<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<g clipPath='url(#clip0_9596_80313)'>
				<ellipse cx='12' cy='18' rx='8' ry='2' fill='#00AA86' />
				<path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M14.2302 14.6372C17.0027 13.706 19 11.0863 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.0863 6.9973 13.706 9.76984 14.6372L12 18.5L14.2302 14.6372ZM16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8Z'
					fill='#515151'
				/>
			</g>
			<defs>
				<clipPath id='clip0_9596_80313'>
					<rect width='24' height='24' fill='white' />
				</clipPath>
			</defs>
		</svg>
	)
}
