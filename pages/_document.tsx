import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

import type { DocumentContext, DocumentProps } from 'next/document'
import { Component } from 'react'

interface MyDocumentProps extends DocumentProps {
	nonce: string
}

class MyDocument extends Component<MyDocumentProps> {
	static async getInitialProps(ctx: DocumentContext) {
		const nonce = ctx.req?.headers?.['x-nonce'] as string
		const initialProps = await NextDocument.getInitialProps(ctx)
		return {
			...initialProps,
			nonce,
		}
	}

	render() {
		const { nonce } = this.props
		return (
			<Html>
				<Head nonce={nonce}></Head>
				<body>
					<Main />
					<NextScript nonce={nonce} />
				</body>
			</Html>
		)
	}
}

export default MyDocument
