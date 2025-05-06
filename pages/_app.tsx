import MainLayout from '@/components/Layout/MainLayout'
import PageManager from '@/providers/PageManager'
import IdentityProvider from '@/providers/IdentityProvider'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import '../src/styles/globals.css'
import theme from '../src/styles/theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import type { AppContext } from 'next/app'

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false, // not retry when error
				refetchInterval: 60000 * 30, // refetch every 30 minutes
			},
		},
	})

	const nonce = pageProps.nonce
	const cache = createCache({
		key: 'csp-nonce',
		nonce: nonce,
		prepend: true,
	})

	return (
		<SessionProvider session={pageProps.session}>
			<QueryClientProvider client={queryClient}>
				<CacheProvider value={cache}>
					<ThemeProvider theme={theme()}>
						<CssBaseline />
						<PageManager>
							<IdentityProvider>
								<MainLayout>
									<Component {...pageProps} />
								</MainLayout>
							</IdentityProvider>
						</PageManager>
					</ThemeProvider>
				</CacheProvider>
			</QueryClientProvider>
		</SessionProvider>
	)
}

MyApp.getInitialProps = async (app: AppContext) => {
	const nonce = app?.ctx.req?.headers?.['x-nonce'] as string | ''
	return {
		pageProps: {
			...app.Component?.getInitialProps?.(app.ctx),
			nonce,
		},
	}
}

export default appWithTranslation(MyApp)
