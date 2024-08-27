import '../styles/globals.css'
import theme from '../styles/theme'
import type { AppProps } from 'next/app'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { SSRConfig, appWithTranslation } from 'next-i18next'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import AuthProvider from '@/components/AuthProvider'
import MainLayout from '@/components/Layout/MainLayout/MainLayout'

function MyApp({ Component, pageProps }: AppProps<{ session: Session } & SSRConfig>) {
	return (
		<SessionProvider session={pageProps.session}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AuthProvider>
					<MainLayout>
						<Component {...pageProps} />
					</MainLayout>
				</AuthProvider>
			</ThemeProvider>
		</SessionProvider>
	)
}

export default appWithTranslation(MyApp)
