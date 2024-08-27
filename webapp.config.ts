import packageJson from './package.json'

export const APP_TITLE: string = 'Durian Plantation Area Analysis System'
export const APP_VERSION: string = `${packageJson.version} (15 August 2024)`

export const DEFAULT_LOCALE = 'en'
export const PILOTED_PROVINCE_CODES = [21, 22, 23]

export const NEXTAUTH_PROVIDER_ID = 'cognito'
export const NEXTAUTH_PROVIDER_NAME = 'Cognito'
