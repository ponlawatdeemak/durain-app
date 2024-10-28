/** @type {import('tailwindcss').Config} */
import { Tooltip } from '@mui/material'
import { RegisterTableColor, RegisterTypeColor, TooltipColor } from './src/config/color'

module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'var(--primary-color-1)',
					light: 'var(--primary-color-2)',
                    light2: 'var(--primary-color-3)',
				},
				secondary: {
					DEFAULT: 'var(--secondary-color-1)',
				},
				success: {
					DEFAULT: 'var(--success-color-1)',
					light: 'var(--success-color-2)',
				},
				error: {
					DEFAULT: 'var(--error-color-1)',
					light: 'var(--error-color-2)',
				},
				green: {
					light: 'var(--light-green-color)',
					light1: 'var(--light-green-color1)',
					dark: 'var(--dark-green-color)',
					dark1: 'var(--deep-green-600)',
					dark2: 'var(--deep-green-200)',
					dark3: 'var(--deep-green-50)',
					alpha: 'var(--light-green-color-alpha)',
				},
				gray: {
					DEFAULT: 'var(--light-gray-color)',
					light1: 'var(--gray-400)',
				},
				registerType: {
					registered: RegisterTypeColor.registered,
					nonRegistered: RegisterTypeColor.nonRegistered,
				},
				tooltip: {
					DEFAULT: TooltipColor.default,
					hover: TooltipColor.hover,
				},
				registerTable: {
					header: RegisterTableColor.header,
					rowHover: RegisterTableColor.rowHover,
				},
			},
		},
	},
	plugins: [],
}
