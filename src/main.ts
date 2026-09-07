import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from '@/features/auth'
import { setUnauthorizedHandler } from '@/shared/api/client'
import '@/styles/main.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
const authStore = useAuthStore()
setUnauthorizedHandler(() => {
   const currentRoute = router.currentRoute.value
   const requiresAuth = currentRoute.matched.some((routeRecord) => routeRecord.meta.requiresAuth)
   authStore.clearSession()
   if (!requiresAuth) {
      return
   }
   void router.replace({
      name: 'login',
      query: { redirect: currentRoute.fullPath }
   })
})
void authStore.initAuth()
app.use(router)

app.mount('#app')
