<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLogo from '@/components/ui/AppLogo.vue'
import IconChain from '@/components/ui/IconChain.vue'
import IconEnvelope from '@/components/ui/IconEnvelope.vue'
import IconEye from '@/components/ui/IconEye.vue'
import IconLock from '@/components/ui/IconLock.vue'
import { useAuthValidation } from '@/composables/useAuthValidation'
import { useAuthStore } from '@/features/auth'
import type { LoginErrors, LoginRequest } from '@/features/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const { validateLogin } = useAuthValidation()

const showPassword = ref(false)
const form = reactive<LoginRequest>({
   email: '',
   password: '',
})
const errors = ref<LoginErrors>({})

const submitLogin = async () => {
   errors.value = validateLogin(form)
   if (Object.keys(errors.value).length > 0) return

   const loggedIn = await authStore.login(form.email, form.password)
   if (!loggedIn) return

   const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : '/app/dashboard'
   await router.push(redirectPath)
}
</script>

<template>
   <main class="auth-layout">
      <AppLogo to="/" class="auth-layout__logo" />

      <section class="auth-card">
         <header class="auth-card__header">
            <span class="auth-card__icon">
               <IconChain />
            </span>
            <h1 class="auth-card__title">Welcome Back</h1>
            <p class="auth-card__subtitle">Continue your crypto journey</p>
         </header>

         <form class="auth-form" @submit.prevent="submitLogin">
            <div class="auth-form__group" :class="{ 'auth-form__group--error': errors.email }">
               <label class="auth-form__label" for="login-email">Email Address</label>
               <div class="auth-form__input-wrapper">
                  <span class="auth-form__icon-left">
                     <IconEnvelope />
                  </span>
                  <input
                     id="login-email"
                     v-model="form.email"
                     class="auth-form__input"
                     type="email"
                     placeholder="name@example.com"
                     autocomplete="email"
                  />
               </div>
               <span v-if="errors.email" class="auth-form__error-text">{{ errors.email }}</span>
            </div>

            <div class="auth-form__group" :class="{ 'auth-form__group--error': errors.password }">
               <label class="auth-form__label" for="login-password">Password</label>
               <div class="auth-form__input-wrapper">
                  <span class="auth-form__icon-left">
                     <IconLock />
                  </span>
                  <input
                     id="login-password"
                     v-model="form.password"
                     class="auth-form__input"
                     :type="showPassword ? 'text' : 'password'"
                     placeholder="Enter your password"
                     autocomplete="current-password"
                  />
                  <button
                     class="auth-form__icon-right"
                     type="button"
                     :aria-label="showPassword ? 'Hide password' : 'Show password'"
                     @click="showPassword = !showPassword"
                  >
                     <IconEye :crossed="showPassword" />
                  </button>
               </div>
               <span v-if="errors.password" class="auth-form__error-text">{{ errors.password }}</span>
            </div>

            <p v-if="authStore.error" class="auth-form__error-text">{{ authStore.error }}</p>

            <button class="auth-form__submit" type="submit" :disabled="authStore.loading">
               {{ authStore.loading ? 'Loading...' : 'Sign In' }}
            </button>
         </form>

         <footer class="auth-card__footer">
            Don't have an account?
            <RouterLink to="/register" class="auth-card__link">Register</RouterLink>
         </footer>
      </section>
   </main>
</template>
