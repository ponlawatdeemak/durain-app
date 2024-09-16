export interface RefreshTokenDtoIn {
	refreshToken: string | null | undefined
}

export interface ChangePasswordDtoIn {
	userId: string
	password: string
	newPassword: string
}
