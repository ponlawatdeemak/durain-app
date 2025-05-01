import { NextResponse } from 'next/server'

export function middleware(req: any) {
	const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
	const contentSecurityPolicyHeaderValue = getCsp(nonce)
	const requestHeaders = new Headers(req.headers)
	requestHeaders.set('x-nonce', nonce)
	requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)
	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	})
	response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)
	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		{
			source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
			missing: [
				{
					type: 'header',
					key: 'next-router-prefetch',
				},
				{
					type: 'header',
					key: 'purpose',
					value: 'prefetch',
				},
			],
		},
	],
}

export function getCsp(nonce: string) {
	const baseApiUrl = process.env.NEXT_PUBLIC_API_HOSTNAME
	const dataApiUrl = process.env.NEXT_PUBLIC_API_HOSTNAME_DATA
	const tileApiUrl = process.env.NEXT_PUBLIC_API_HOSTNAME_TILE

	const cspHeader = `
		default-src 'self' ${baseApiUrl} ${dataApiUrl} ${tileApiUrl};
    script-src 'self'${process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"} blob: 'nonce-${nonce}';
    style-src 'self' 'unsafe-inline';
		font-src 'self' https://fonts.gstatic.com;
		img-src 'self' ${baseApiUrl} ${dataApiUrl} ${tileApiUrl} https://api.maplibre.com https://*.cloudfront.net https://bucket-name.s3.region.amazonaws.com blob: data:;
		connect-src 'self' ${baseApiUrl} ${dataApiUrl} ${tileApiUrl} https://*.googleapis.com https://*.maplibre.com https://*.thaicom.io https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com/ https://*.cloudfront.net https://www.gstatic.com data:;
		object-src 'none';
		base-uri 'self';
		form-action 'self';
		block-all-mixed-content;
		upgrade-insecure-requests;
		frame-src 'self' https://www.youtube.com/;
	`
	return cspHeader.replace(/\s{2,}/g, ' ').trim()
}
