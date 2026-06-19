import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
   // Временно true чтобы можно было зайти в /app
   const isAuthenticated = ref(true)
   const user = ref<{ id: string; username: string } | null>(null)

   return { isAuthenticated, user }
})