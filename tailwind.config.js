/** @type {import('tailwindcss').Config} */
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
                    alpha: 'var(--light-green-color-alpha)'
                },
                gray: {
                    DEFAULT: 'var(--light-gray-color)'
                }
			},
		},
	},
	plugins: [],
}
