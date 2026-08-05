import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
   getCurrentUser,
   login as loginRequest,
   logout as logoutRequest,
   register as registerRequest,
} from '@/api/auth'
import { ApiError } from '@/api/client'
import type { AuthUser } from '@/types/auth'

const AUTH_TOKEN_KEY = 'chain-tycoon-token'
const AUTH_USER_KEY = 'chain-tycoon-user'

export const useAuthStore = defineStore('auth', () => {
   const user = ref<AuthUser | null>(null)
   const loading = ref(false)
   const error = ref('')
   const isInitialized = ref(false)
   let initializationRequest: Promise<void> | null = null

   const isAuthenticated = computed(() => Boolean(user.value))

   const setSession = (nextUser: AuthUser) => {
      user.value = nextUser
   }

   const clearSession = () => {
      user.value = null
   }

   const removeLegacyStorage = () => {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
   }

   const initAuth = (): Promise<void> => {
      if (isInitialized.value) return Promise.resolve()
      if (initializationRequest) return initializationRequest

      removeLegacyStorage()
      initializationRequest = (async () => {
         try {
            const response = await getCurrentUser()
            setSession(response.user)
         } catch (reason) {
            clearSession()
            if (!(reason instanceof ApiError && reason.status === 401)) {
               error.value = reason instanceof Error ? reason.message : 'Unable to restore session'
            }
         } finally {
            isInitialized.value = true
            initializationRequest = null
         }
      })()

      return initializationRequest
   }

   const login = async (email: string, password: string) => {
      error.value = ''
      loading.value = true

      try {
         const response = await loginRequest({ email, password })
         setSession(response.user)
         return true
      } catch (reason) {
         error.value = reason instanceof Error ? reason.message : 'Login failed'
         return false
      } finally {
         loading.value = false
      }
   }

   const register = async (username: string, email: string, password: string) => {
      error.value = ''
      loading.value = true

      try {
         const response = await registerRequest({ username, email, password })
         setSession(response.user)
         return true
      } catch (reason) {
         error.value = reason instanceof Error ? reason.message : 'Registration failed'
         return false
      } finally {
         loading.value = false
      }
   }

   const logout = async () => {
      clearSession()
      try {
         await logoutRequest()
      } catch (reason) {
         error.value = reason instanceof Error ? reason.message : 'Logout failed'
      }
   }

   return {
      isAuthenticated,
      isInitialized,
      user,
      loading,
      error,
      login,
      register,
      logout,
      initAuth,
   }
})
