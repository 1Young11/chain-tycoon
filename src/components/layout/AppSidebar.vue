<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth'

const props = defineProps<{
   isMobile: boolean
   isOpen: boolean
}>()

const emit = defineEmits<{
   close: []
   navigate: []
}>()

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const sidebarElement = ref<HTMLElement | null>(null)
const closeButtonElement = ref<HTMLButtonElement | null>(null)

const navItems = [
   { name: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
   { name: 'portfolio', label: 'Portfolio', icon: 'fa-wallet' },
   { name: 'mining-overview', label: 'Mining', icon: 'fa-microchip', pathPrefix: '/app/mining' },
   { name: 'market', label: 'Market', icon: 'fa-bolt', pathPrefix: '/app/market' },
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
   emit('navigate')
   authStore.logout()
   await router.push({ name: 'login' })
}

const focusCloseButton = () => {
   closeButtonElement.value?.focus()
}

const getSidebarElement = () => sidebarElement.value

const getFocusableElements = (): HTMLElement[] => {
   if (sidebarElement.value === null) return []

   return Array.from(
      sidebarElement.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
   ).filter((element) => {
      const elementStyle = window.getComputedStyle(element)
      const hasHiddenParent = element.closest('[hidden], [inert], [aria-hidden="true"]') !== null

      return !hasHiddenParent && elementStyle.display !== 'none' && elementStyle.visibility !== 'hidden' && element.getClientRects().length > 0
   })
}

defineExpose({ focusCloseButton, getFocusableElements, getSidebarElement })
</script>

<template>
   <aside
      id="app-sidebar"
      ref="sidebarElement"
      class="sidebar"
      :class="{ 'sidebar--mobile': props.isMobile, 'sidebar--open': props.isMobile && props.isOpen }"
      :inert="props.isMobile && !props.isOpen"
      :role="props.isMobile && props.isOpen ? 'dialog' : undefined"
      :aria-modal="props.isMobile && props.isOpen ? 'true' : undefined"
      :aria-label="props.isMobile && props.isOpen ? 'Application navigation' : undefined"
      :aria-hidden="props.isMobile && !props.isOpen ? 'true' : undefined"
   >
      <div class="sidebar__header">
         <RouterLink to="/" class="sidebar__logo" @click="emit('navigate')">
            <i class="fa-solid fa-cubes" aria-hidden="true"></i>
            <span>Chain Tycoon</span>
         </RouterLink>

         <button
            v-if="props.isMobile"
            ref="closeButtonElement"
            class="sidebar__close"
            type="button"
            aria-label="Close navigation"
            @click="emit('close')"
         >
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
         </button>
      </div>

      <nav class="sidebar__nav" aria-label="Application navigation">
         <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': isNavItemActive(item) }"
            @click="emit('navigate')"
         >
            <i class="fa-solid" :class="item.icon" aria-hidden="true"></i>
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
            <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
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
   width: var(--app-sidebar-width);
   min-width: var(--app-sidebar-width);
   max-width: var(--app-sidebar-width);
   height: 100vh;
   flex: 0 0 var(--app-sidebar-width);
   flex-direction: column;
   padding: var(--space-6) var(--space-4);

   border-right: 1px solid var(--color-border);
   background: var(--color-bg-secondary);

   &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      margin-bottom: var(--space-8);
   }

   &__logo {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: 10px;
      padding-left: var(--space-2);

      color: var(--color-text-primary);
      font-size: var(--text-lg);
      font-weight: var(--font-bold);

      i {
         color: var(--color-accent);
      }

      &:focus-visible {
         outline: var(--focus-ring);
         outline-offset: var(--focus-offset);
      }
   }

   &__close {
      display: inline-flex;
      width: var(--control-height-sm);
      height: var(--control-height-sm);
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-bg-tertiary);
      color: var(--color-text-primary);
      cursor: pointer;

      &:hover {
         border-color: var(--color-accent);
         color: var(--color-accent-hover);
      }

      &:focus-visible {
         outline: var(--focus-ring);
         outline-offset: var(--focus-offset);
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
      transition:
         border-color var(--duration-base) var(--ease-default),
         background-color var(--duration-base) var(--ease-default),
         color var(--duration-base) var(--ease-default);

      i {
         width: 18px;
         font-size: 17px;
         text-align: center;
      }

      &:hover {
         background: rgba(255, 255, 255, 0.03);
         color: var(--color-text-primary);
      }

      &:focus-visible {
         outline: var(--focus-ring);
         outline-offset: var(--focus-offset);
      }

      &--active {
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

      &:focus-visible {
         outline: var(--focus-ring);
         outline-offset: var(--focus-offset);
      }
   }
}

@include lg {
   .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      z-index: calc(var(--z-modal) + 1);

      width: min(280px, calc(100vw - var(--space-8)));
      min-width: 0;
      max-width: 280px;
      height: 100vh;
      height: 100dvh;
      flex-basis: auto;
      overflow-y: auto;
      overscroll-behavior: contain;
      visibility: hidden;
      transform: translateX(-100%);
      transition:
         transform 220ms ease-out,
         visibility 0s linear 220ms;

      &--open {
         visibility: visible;
         transform: translateX(0);
         transition:
            transform 220ms ease-out,
            visibility 0s linear 0s;
      }
   }
}

@media (prefers-reduced-motion: reduce) {
   .sidebar {
      transition: none;
   }
}
</style>
