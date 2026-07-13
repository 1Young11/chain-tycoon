import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useAuthStore } from '@/features/auth'
import '@/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
useAuthStore().initAuth()
app.use(router)

app.mount('#app')
