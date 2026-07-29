<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = [
   { name: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
   { name: 'portfolio', label: 'Portfolio', icon: 'fa-wallet' },
   { name: 'mining-overview', label: 'Mining', icon: 'fa-microchip', pathPrefix: '/app/mining' },
   { name: 'market', label: 'Market Events', icon: 'fa-bolt' },
   { name: 'leaderboard', label: 'Leaderboard', icon: 'fa-trophy' },
]

const isNavItemActive = (item: (typeof navItems)[number]) =>
   item.pathPrefix ? route.path.startsWith(item.pathPrefix) : route.name === item.name

const username = computed(() => authStore.user?.username ?? 'CryptoMaster')
const initials = computed(() =>
   username.value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'CT',
)

const logout = async () => {
   authStore.logout()
   await router.push({ name: 'login' })
}
</script>

<template>
   <aside class="sidebar">
      <RouterLink to="/" class="sidebar__logo">
         <i class="fa-solid fa-cubes"></i>
         <span>Chain Tycoon</span>
      </RouterLink>

      <nav class="sidebar__nav" aria-label="Application navigation">
         <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': isNavItemActive(item) }"
         >
            <i class="fa-solid" :class="item.icon"></i>
            <span>{{ item.label }}</span>
         </RouterLink>
      </nav>

      <div class="sidebar__divider"></div>

      <div class="sidebar__footer">
         <div class="sidebar__profile">
            <div class="sidebar__avatar">{{ initials }}</div>
            <span class="sidebar__username">{{ username }}</span>
         </div>

         <button class="sidebar__logout" type="button" @click="logout">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
         </button>
      </div>
   </aside>
</template>

<style scoped lang="scss">
.sidebar {
   position: sticky;
   top: 0;
   z-index: var(--z-sticky);

   display: flex;
   width: 220px;
   height: 100vh;
   flex: 0 0 220px;
   flex-direction: column;
   padding: var(--space-6) var(--space-4);

   border-right: 1px solid var(--color-border);
   background: var(--color-bg-secondary);

   &__logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: var(--space-8);
      padding-left: var(--space-2);

      color: var(--color-text-primary);
      font-size: var(--text-lg);
      font-weight: var(--font-bold);

      i {
         color: var(--color-accent);
      }
   }

   &__nav {
      display: flex;
      flex-direction: column;
      gap: 3px;
   }

   &__link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      height: 44px;
      padding: 0 14px;

      border-left: 2px solid transparent;
      border-radius: var(--radius-sm);

      color: var(--color-text-secondary);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      transition: all var(--duration-base) var(--ease-default);

      i {
         width: 18px;
         font-size: 17px;
         text-align: center;
      }

      &:hover {
         background: rgba(255, 255, 255, 0.03);
         color: var(--color-text-primary);
      }

      &--active {
         padding-left: 10px;

         border-left-color: var(--color-accent);
         border-top-left-radius: 0;
         border-bottom-left-radius: 0;
         background: rgba(108, 99, 255, 0.08);

         color: var(--color-text-primary);

         i {
            color: var(--color-accent);
         }
      }
   }

   &__divider {
      height: 1px;
      margin: var(--space-5) 0;

      background: var(--color-border);
   }

   &__footer {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      margin-top: auto;
   }

   &__profile {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-2);

      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.02);
   }

   &__avatar {
      display: flex;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;

      border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--color-accent), #8f88ff);

      color: #fff;
      font-size: 11px;
      font-weight: var(--font-bold);
   }

   &__username {
      overflow: hidden;

      color: var(--color-text-primary);
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   &__logout {
      display: flex;
      width: fit-content;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2);

      border: 0;
      border-radius: var(--radius-sm);
      background: transparent;

      color: var(--color-text-muted);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      cursor: pointer;
      transition: all var(--duration-base) var(--ease-default);

      &:hover {
         background: rgba(255, 83, 112, 0.08);
         color: var(--color-loss);
      }
   }
}

@include md {
   .sidebar {
      position: static;

      width: 100%;
      height: auto;
      flex-basis: auto;

      &__footer {
         display: none;
      }
   }
}
</style>
