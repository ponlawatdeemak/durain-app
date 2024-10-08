/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const { version } = require('./package.json')

const nextConfig = {
	reactStrictMode: true,

	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		// ignoreDuringBuilds: true,
	},

	i18n,

	env: {
		WEB_HOSTNAME: process.env.WEB_HOSTNAME,
		NEXT_PUBLIC_API_HOSTNAME: process.env.NEXT_PUBLIC_API_HOSTNAME,
		NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,

		COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
		COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
		COGNITO_WELLKNOWN: process.env.COGNITO_WELLKNOWN,
		COGNITO_ISSUER: process.env.COGNITO_ISSUER,

		GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
		GOOGLE_MAPS_API_MAP_ID: process.env.GOOGLE_MAPS_API_MAP_ID,
	},

	publicRuntimeConfig: {
		version,
	},

	async rewrites() {
		return [
			{
				source: '/durian-api/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_HOSTNAME}/:path*`,
			},
		]
	},
}

module.exports = nextConfig
