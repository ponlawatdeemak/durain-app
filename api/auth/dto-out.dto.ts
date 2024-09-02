import UserAccountResponse from '@/models/UserAccountResponse'
import UserTokens from '@/models/UserTokens'

export interface LoginGuestDtoOut extends UserAccountResponse {
	tokens?: UserTokens
}

export interface RefreshTokenDtoOut {
	id_token: string
	access_token: string
	expires_in: number
	token_type: string
}
