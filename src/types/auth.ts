export type AuthUser = {
   id: string
   username: string
   email?: string
   balance?: number
}

export type LoginRequest = {
   email: string
   password: string
}

export type RegisterRequest = LoginRequest & {
   username: string
}

export type RegisterForm = RegisterRequest & {
   confirmPassword: string
}

export type LoginErrors = Partial<Record<keyof LoginRequest, string>>

export type RegisterErrors = Partial<Record<keyof RegisterForm, string>>

export type AuthResponse = {
   token: string
   user: AuthUser
}

export type RawAuthResponse = {
   token?: string
   user?: AuthUser
   error?: string
   message?: string
}
