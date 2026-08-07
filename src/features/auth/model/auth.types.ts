export type AuthUser = {
   id: string
   username: string
   email: string
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
   user: AuthUser
}
