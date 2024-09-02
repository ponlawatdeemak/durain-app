import React from 'react'

interface SVGProps {
	width?: number
	height?: number
}

export const OverviewIcon: React.FC<SVGProps> = ({ width = 25, height = 24 }) => {
	return (
		<svg width={width} height={height} viewBox='0 0 25 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M24.0283 7.0188V10.0511C24.0283 14.4056 20.7839 17.9352 16.7813 17.9352H13.994V23.9999H11.7642V15.5094L11.7853 14.2964C12.0696 10.2258 15.197 7.0188 19.0112 7.0188H24.0283Z'
				fill='#0C5D52'
			/>
			<path
				d='M5.05264 3.24536C8.61562 3.24536 11.6393 5.51517 12.7075 8.66347C10.979 10.1069 9.83823 12.2046 9.68036 14.5661H8.50961C4.05473 14.5661 0.443359 11.0182 0.443359 6.64159V3.24536H5.05264Z'
				fill='#0C5D52'
			/>
		</svg>
	)
}

export default OverviewIcon
