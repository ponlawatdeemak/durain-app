/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

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
		API_HOSTNAME: process.env.API_HOSTNAME,
		API_KEY: process.env.API_KEY,

		COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
		COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
		COGNITO_WELLKNOWN: process.env.COGNITO_WELLKNOWN,
		COGNITO_ISSUER: process.env.COGNITO_ISSUER,
	},

	async rewrites() {
		console.log('NODE_ENV = %o', process.env.NODE_ENV)

		console.log('WEB_HOSTNAME = %o', process.env.WEB_HOSTNAME)
		console.log('API_HOSTNAME = %o', process.env.API_HOSTNAME)
		console.log('API_KEY = %o', process.env.API_KEY)

		console.log('COGNITO_CLIENT_ID = %o', process.env.COGNITO_CLIENT_ID)
		console.log('COGNITO_CLIENT_SECRET = %o', process.env.COGNITO_CLIENT_SECRET)
		console.log('COGNITO_WELLKNOWN = %o', process.env.COGNITO_WELLKNOWN)
		console.log('COGNITO_ISSUER = %o', process.env.COGNITO_ISSUER)

		return [
			{
				source: '/durian-api/:path*',
				destination: `${process.env.API_HOSTNAME}/:path*`,
			},
		]
	},
}

module.exports = nextConfig
