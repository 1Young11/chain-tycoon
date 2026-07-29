import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
   // Публичные маршруты (лендинг, auth)
   {
      path: '/',
      component: () => import('@/components/layout/PublicLayout.vue'),
      children: [
         {
            path: '/',
            component: () => import('@/components/layout/PublicLayout.vue'),
            children: [
               {
                  path: '',
                  name: 'landing',
                  component: () => import('@/views/LandingView.vue'), // главная = лендинг
               },
               {
                  path: 'login',
                  name: 'login',
                  component: () => import('@/views/LoginView.vue'),
                  meta: { guestOnly: true },
               },
               {
                  path: 'register',
                  name: 'register',
                  component: () => import('@/views/RegisterView.vue'),
                  meta: { guestOnly: true },
               },
            ],
         },
      ],
   },

   // Приложение — только для авторизованных
   {
      path: '/app',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
         {
            path: '',
            redirect: { name: 'dashboard' },
         },
         {
            path: 'dashboard',
            name: 'dashboard',
            component: () => import('@/views/DashboardView.vue'),
            meta: { title: 'Dashboard' },
         },
         {
            path: 'portfolio',
            name: 'portfolio',
            component: () => import('@/views/PortfolioView.vue'),
            meta: { title: 'Portfolio' },
         },
         {
            path: 'mining',
            component: () => import('@/views/MiningView.vue'),
            meta: { title: 'Mining' },
            children: [
               {
                  path: '',
                  name: 'mining-overview',
                  component: () => import('@/views/MiningOverviewView.vue'),
                  meta: { title: 'Mining' },
               },
               {
                  path: 'inventory',
                  name: 'mining-inventory',
                  component: () => import('@/views/MiningInventoryView.vue'),
                  meta: { title: 'Mining / Inventory' },
               },
            ],
         },
         {
            path: 'market',
            name: 'market',
            component: () => import('@/views/MarketView.vue'),
            meta: { title: 'Market Events' },
         },
         {
            path: 'leaderboard',
            name: 'leaderboard',
            component: () => import('@/views/LeaderboardView.vue'),
            meta: { title: 'Leaderboard' },
         },
      ],
   },

   // 404
   {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
   },
]
