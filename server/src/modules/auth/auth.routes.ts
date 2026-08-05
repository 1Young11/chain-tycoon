import { Router } from 'express'
import * as authController from './auth.controller'
import { requireAuth } from '../../middleware/auth.middleware'
import { issueCsrfToken } from '../../middleware/csrf.middleware'

const router = Router()

router.get('/csrf', issueCsrfToken)
router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', requireAuth, authController.me)
router.post('/logout', authController.logout)

export default router
