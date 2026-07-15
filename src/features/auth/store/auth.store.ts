import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginRequest, register as registerRequest } from '@/api/auth'
import type { AuthUser } from '@/types/auth'

const AUTH_TOKEN_KEY = 'chain-tycoon-token'
const AUTH_USER_KEY = 'chain-tycoon-user'

export const useAuthStore = defineStore('auth', () => {
   const user = ref<AuthUser | null>(null)
   const token = ref<string | null>(null)
   const loading = ref(false)
   const error = ref('')

   const isAuthenticated = computed(() => Boolean(token.value && user.value))

   const setSession = (nextToken: string, nextUser: AuthUser) => {
      token.value = nextToken
      user.value = nextUser

      localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser))
   }

   const clearSession = () => {
      token.value = null
      user.value = null

      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
   }

   const initAuth = () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY)
      const savedUser = localStorage.getItem(AUTH_USER_KEY)

      if (!savedToken || !savedUser) {
         clearSession()
         return
      }

      try {
         token.value = savedToken
         user.value = JSON.parse(savedUser) as AuthUser
      } catch {
         clearSession()
      }
   }

   const login = async (email: string, password: string) => {
      error.value = ''
      loading.value = true

      try {
         const response = await loginRequest({ email, password })
         setSession(response.token, response.user)
         return true
      } catch (err) {
         error.value = err instanceof Error ? err.message : 'Login failed'
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
         setSession(response.token, response.user)
         return true
      } catch (err) {
         error.value = err instanceof Error ? err.message : 'Registration failed'
         return false
      } finally {
         loading.value = false
      }
   }

   const logout = () => {
      clearSession()
   }

   return {
      isAuthenticated,
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      initAuth,
   }
})
