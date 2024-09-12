import MainLayout from '@/components/Layout/MainLayout'
import PageManager from '@/providers/PageManager'
import IdentityProvider from '@/providers/IdentityProvider'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { SSRConfig, appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import '../src/styles/globals.css'
import theme from '../src/styles/theme'
import { MapProvider } from '@/components/common/map/context/map'

function MyApp({ Component, pageProps }: AppProps<{ session: Session } & SSRConfig>) {
	return (
		<SessionProvider session={pageProps.session}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<PageManager>
					<IdentityProvider>
						<MainLayout>
							<MapProvider>
								<Component {...pageProps} />
							</MapProvider>
						</MainLayout>
					</IdentityProvider>
				</PageManager>
			</ThemeProvider>
		</SessionProvider>
	)
}

export default appWithTranslation(MyApp)
