import MainLayout from '@/components/layout/MainLayout'
import IdentityProvider from '@/providers/IdentityProvider'
import PageManager from '@/providers/PageManager'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { SSRConfig, appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import theme from '../styles/theme'

function MyApp({ Component, pageProps }: AppProps<{ session: Session } & SSRConfig>) {
	return (
		<SessionProvider session={pageProps.session}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<PageManager>
					<IdentityProvider>
						<MainLayout>
							<Component {...pageProps} />
						</MainLayout>
					</IdentityProvider>
				</PageManager>
			</ThemeProvider>
		</SessionProvider>
	)
}

export default appWithTranslation(MyApp)
