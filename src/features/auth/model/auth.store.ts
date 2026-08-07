import { defineStore } from 'pinia'
import {
   getCurrentUser,
   login as loginRequest,
   logout as logoutRequest,
   register as registerRequest,
} from '../api/auth.api'
import { ApiError } from '@/shared/api/client'
import type { AuthUser } from './auth.types'

const AUTH_TOKEN_KEY = 'chain-tycoon-token'
const AUTH_USER_KEY = 'chain-tycoon-user'
let initializationRequest: Promise<void> | null = null

interface AuthState {
   user: AuthUser | null
   loading: boolean
   error: string
   isInitialized: boolean
}

const removeLegacyStorage = () => {
   localStorage.removeItem(AUTH_TOKEN_KEY)
   localStorage.removeItem(AUTH_USER_KEY)
}

export const useAuthStore = defineStore('auth', {
   state: (): AuthState => ({
      user: null,
      loading: false,
      error: '',
      isInitialized: false,
   }),

   getters: {
      isAuthenticated: (state) => Boolean(state.user),
   },

   actions: {
      setSession(nextUser: AuthUser) {
         this.user = nextUser
      },

      clearSession() {
         this.user = null
      },

      initAuth(): Promise<void> {
         if (this.isInitialized) return Promise.resolve()
         if (initializationRequest) return initializationRequest

         removeLegacyStorage()
         initializationRequest = (async () => {
            try {
               const response = await getCurrentUser()
               this.setSession(response.user)
            } catch (reason) {
               this.clearSession()
               if (!(reason instanceof ApiError && reason.status === 401)) {
                  this.error = reason instanceof Error ? reason.message : 'Unable to restore session'
               }
            } finally {
               this.isInitialized = true
               initializationRequest = null
            }
         })()

         return initializationRequest
      },

      async login(email: string, password: string) {
         this.error = ''
         this.loading = true

         try {
            const response = await loginRequest({ email, password })
            this.setSession(response.user)
            return true
         } catch (reason) {
            this.error = reason instanceof Error ? reason.message : 'Login failed'
            return false
         } finally {
            this.loading = false
         }
      },

      async register(username: string, email: string, password: string) {
         this.error = ''
         this.loading = true

         try {
            const response = await registerRequest({ username, email, password })
            this.setSession(response.user)
            return true
         } catch (reason) {
            this.error = reason instanceof Error ? reason.message : 'Registration failed'
            return false
         } finally {
            this.loading = false
         }
      },

      async logout() {
         this.clearSession()
         try {
            await logoutRequest()
         } catch (reason) {
            this.error = reason instanceof Error ? reason.message : 'Logout failed'
         }
      },
   },
})
