import { api } from '@/api/core'
import { ResponseDto } from '@/api/interface'
import { LoginGuestDtoOut, RefreshTokenDtoOut } from './dto-out.dto'
import axios from 'axios'
import OpenidConfiguration from '@/models/OpenidConfiguration'
import https from 'https'
import { RefreshTokenDtoIn } from './dto-in.dto'

const auth = {
	loginGuest: async (): Promise<ResponseDto<LoginGuestDtoOut>> => await api.post('/auth/login/guest', {}),
	refreshToken: async ({ refreshToken }: RefreshTokenDtoIn): Promise<ResponseDto<RefreshTokenDtoOut>> => {
		const responseWellknow = await axios.get(`${process.env.COGNITO_WELLKNOWN}`)
		const cognitoWellKnown: OpenidConfiguration = responseWellknow.data

		const agent = new https.Agent({
			rejectUnauthorized: false,
		})

		const config = {
			httpsAgent: agent,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(`${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`).toString('base64')}`,
			},
		}

		const payload = `grant_type=refresh_token&client_id=${process.env.COGNITO_CLIENT_ID}&refresh_token=${refreshToken}`
		return await axios.post(cognitoWellKnown.token_endpoint, payload, config)
	},
}

export default auth
