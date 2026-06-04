export interface ILoginData {
    accessToken: string
    refreshToken: string
    isAdmin: boolean
    requiresReset: boolean
    username: string
    id: string
}