import type { LoginErrors, LoginRequest, RegisterErrors, RegisterForm } from '@/types/auth'
import { isEmpty, isValidEmail } from '@/utils/validators'

export function useAuthValidation() {
   const validateLogin = (form: LoginRequest) => {
      const errors: LoginErrors = {}

      if (isEmpty(form.email)) errors.email = 'Email is required'
      else if (!isValidEmail(form.email)) errors.email = 'Enter a valid email'

      if (isEmpty(form.password)) errors.password = 'Password is required'

      return errors
   }

   const validateRegister = (form: RegisterForm) => {
      const errors: RegisterErrors = {}

      if (isEmpty(form.username)) errors.username = 'Username is required'
      if (isEmpty(form.email)) errors.email = 'Email is required'
      else if (!isValidEmail(form.email)) errors.email = 'Enter a valid email'
      if (isEmpty(form.password)) errors.password = 'Password is required'
      else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters'
      if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match'

      return errors
   }

   return {
      validateLogin,
      validateRegister,
   }
}
