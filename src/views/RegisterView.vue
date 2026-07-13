<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLogo from '@/components/ui/AppLogo.vue'
import IconChain from '@/components/ui/IconChain.vue'
import IconEnvelope from '@/components/ui/IconEnvelope.vue'
import IconEye from '@/components/ui/IconEye.vue'
import IconLock from '@/components/ui/IconLock.vue'
import IconUser from '@/components/ui/IconUser.vue'
import { useAuthValidation } from '@/composables/useAuthValidation'
import { useAuthStore } from '@/features/auth'
import type { RegisterErrors, RegisterForm } from '@/types/auth'

const authStore = useAuthStore()
const router = useRouter()
const { validateRegister } = useAuthValidation()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const form = reactive<RegisterForm>({
   username: '',
   email: '',
   password: '',
   confirmPassword: '',
})
const errors = ref<RegisterErrors>({})

const submitRegister = async () => {
   errors.value = validateRegister(form)
   if (Object.keys(errors.value).length > 0) return

   const registered = await authStore.register(form.username, form.email, form.password)
   if (!registered) return

   await router.push('/app/dashboard')
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
            <h1 class="auth-card__title">Join Chain Tycoon</h1>
            <p class="auth-card__subtitle">
               Start with <span class="auth-card__highlight">$10,000</span> virtual capital
            </p>
         </header>

         <form class="auth-form" @submit.prevent="submitRegister">
            <div class="auth-form__group" :class="{ 'auth-form__group--error': errors.username }">
               <label class="auth-form__label" for="register-username">Username</label>
               <div class="auth-form__input-wrapper">
                  <span class="auth-form__icon-left">
                     <IconUser />
                  </span>
                  <input
                     id="register-username"
                     v-model="form.username"
                     class="auth-form__input"
                     type="text"
                     placeholder="Enter your username"
                     autocomplete="username"
                  />
               </div>
               <span v-if="errors.username" class="auth-form__error-text">{{ errors.username }}</span>
            </div>

            <div class="auth-form__group" :class="{ 'auth-form__group--error': errors.email }">
               <label class="auth-form__label" for="register-email">Email Address</label>
               <div class="auth-form__input-wrapper">
                  <span class="auth-form__icon-left">
                     <IconEnvelope />
                  </span>
                  <input
                     id="register-email"
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
               <label class="auth-form__label" for="register-password">Password</label>
               <div class="auth-form__input-wrapper">
                  <span class="auth-form__icon-left">
                     <IconLock />
                  </span>
                  <input
                     id="register-password"
                     v-model="form.password"
                     class="auth-form__input"
                     :type="showPassword ? 'text' : 'password'"
                     placeholder="Create robust password"
                     autocomplete="new-password"
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

            <div class="auth-form__group" :class="{ 'auth-form__group--error': errors.confirmPassword }">
               <label class="auth-form__label" for="register-confirm-password">Confirm Password</label>
               <div class="auth-form__input-wrapper">
                  <span class="auth-form__icon-left">
                     <IconLock />
                  </span>
                  <input
                     id="register-confirm-password"
                     v-model="form.confirmPassword"
                     class="auth-form__input"
                     :type="showConfirmPassword ? 'text' : 'password'"
                     placeholder="Repeat your password"
                     autocomplete="new-password"
                  />
                  <button
                     class="auth-form__icon-right"
                     type="button"
                     :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                     @click="showConfirmPassword = !showConfirmPassword"
                  >
                     <IconEye :crossed="showConfirmPassword" />
                  </button>
               </div>
               <span v-if="errors.confirmPassword" class="auth-form__error-text">{{ errors.confirmPassword }}</span>
            </div>

            <p v-if="authStore.error" class="auth-form__error-text">{{ authStore.error }}</p>

            <button class="auth-form__submit" type="submit" :disabled="authStore.loading">
               {{ authStore.loading ? 'Loading...' : 'Create Account' }}
            </button>
         </form>

         <footer class="auth-card__footer">
            Already have an account?
            <RouterLink to="/login" class="auth-card__link">Sign In</RouterLink>
         </footer>
      </section>
   </main>
</template>
