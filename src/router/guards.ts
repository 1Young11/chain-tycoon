import type { Router } from 'vue-router'
import { useAuthStore } from '@/features/auth'

export function setupGuards(router: Router) {
   router.beforeEach(async (to) => {
      const authStore = useAuthStore()
      await authStore.initAuth()

      const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
      const guestOnly = to.matched.some((r) => r.meta.guestOnly)

      // Страница требует авторизации — не залогинен
      if (requiresAuth && !authStore.isAuthenticated) {
         return { name: 'login', query: { redirect: to.fullPath } }
      }

      // Страница только для гостей — уже залогинен
      if (guestOnly && authStore.isAuthenticated) {
         return { name: 'dashboard' }
      }

      // Обновляем title страницы
      const title = to.meta.title as string | undefined
      document.title = title ? `${title} — Chain Tycoon` : 'Chain Tycoon'

      return true
   })
}
