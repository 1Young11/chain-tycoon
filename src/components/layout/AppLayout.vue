<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import { useGameStore } from '@/stores/game'

const MOBILE_NAVIGATION_QUERY = '(max-width: 1024px)'

interface SidebarControls {
   focusCloseButton(): void
   getFocusableElements(): HTMLElement[]
   getSidebarElement(): HTMLElement | null
}

const route = useRoute()
const gameStore = useGameStore()
const isMobileViewport = ref(false)
const isMobileMenuOpen = ref(false)
const menuButtonElement = ref<HTMLButtonElement | null>(null)
const sidebarComponent = ref<SidebarControls | null>(null)

let viewportMediaQuery: MediaQueryList | null = null
let previousBodyOverflow: string | null = null

const pageTitle = computed(() => (route.meta.title as string | undefined) ?? 'Dashboard')

const lockBodyScroll = () => {
   if (previousBodyOverflow !== null) return

   previousBodyOverflow = document.body.style.overflow
   document.body.style.overflow = 'hidden'
}

const unlockBodyScroll = () => {
   if (previousBodyOverflow === null) return

   document.body.style.overflow = previousBodyOverflow
   previousBodyOverflow = null
}

const openMobileMenu = async () => {
   if (!isMobileViewport.value || isMobileMenuOpen.value) return

   isMobileMenuOpen.value = true
   lockBodyScroll()
   await nextTick()
   sidebarComponent.value?.focusCloseButton()
}

const setMobileMenuClosed = async (restoreFocus: boolean) => {
   if (!isMobileMenuOpen.value) return

   isMobileMenuOpen.value = false
   unlockBodyScroll()

   if (restoreFocus && isMobileViewport.value) {
      await nextTick()
      menuButtonElement.value?.focus()
   }
}

const closeMobileMenu = () => setMobileMenuClosed(true)

const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList) => {
   isMobileViewport.value = event.matches

   if (!event.matches) {
      void setMobileMenuClosed(false)
   }
}

const handleDocumentKeydown = (event: KeyboardEvent) => {
   if (!isMobileMenuOpen.value || !isMobileViewport.value) return

   if (event.key === 'Escape') {
      event.preventDefault()
      void closeMobileMenu()
      return
   }

   if (event.key !== 'Tab') return

   const sidebarElement = sidebarComponent.value?.getSidebarElement()
   const focusableElements = sidebarComponent.value?.getFocusableElements() ?? []

   if (sidebarElement === null || sidebarElement === undefined || focusableElements.length === 0) {
      event.preventDefault()
      return
   }

   const firstElement = focusableElements[0]
   const lastElement = focusableElements[focusableElements.length - 1]
   const activeElement = document.activeElement
   const focusIsOutsideSidebar = !(activeElement instanceof Node) || !sidebarElement.contains(activeElement)

   if (event.shiftKey && (activeElement === firstElement || focusIsOutsideSidebar)) {
      event.preventDefault()
      lastElement?.focus()
   } else if (!event.shiftKey && (activeElement === lastElement || focusIsOutsideSidebar)) {
      event.preventDefault()
      firstElement?.focus()
   }
}

onMounted(() => {
   gameStore.fetchGameState()
   viewportMediaQuery = window.matchMedia(MOBILE_NAVIGATION_QUERY)
   handleViewportChange(viewportMediaQuery)
   viewportMediaQuery.addEventListener('change', handleViewportChange)
   document.addEventListener('keydown', handleDocumentKeydown)
})

watch(
   () => route.fullPath,
   () => {
      if (isMobileMenuOpen.value) {
         void closeMobileMenu()
      }
   },
)

onBeforeUnmount(() => {
   viewportMediaQuery?.removeEventListener('change', handleViewportChange)
   document.removeEventListener('keydown', handleDocumentKeydown)
   isMobileMenuOpen.value = false
   unlockBodyScroll()
})
</script>

<template>
   <div class="app-wrapper">
      <AppSidebar
         ref="sidebarComponent"
         :is-mobile="isMobileViewport"
         :is-open="isMobileMenuOpen"
         @close="closeMobileMenu"
         @navigate="closeMobileMenu"
      />

      <div
         v-if="isMobileViewport"
         class="mobile-navigation-backdrop"
         :class="{ 'mobile-navigation-backdrop--visible': isMobileMenuOpen }"
         aria-hidden="true"
         @click="closeMobileMenu"
      ></div>

      <main class="main-panel" :inert="isMobileViewport && isMobileMenuOpen">
         <header class="topbar">
            <div class="topbar__heading">
               <button
                  v-if="isMobileViewport"
                  ref="menuButtonElement"
                  class="topbar__menu-button"
                  type="button"
                  aria-label="Open navigation"
                  :aria-expanded="isMobileMenuOpen"
                  aria-controls="app-sidebar"
                  @click="openMobileMenu"
               >
                  <i class="fa-solid fa-bars" aria-hidden="true"></i>
               </button>

               <div class="topbar__title">{{ pageTitle }}</div>
            </div>

            <div class="topbar__badges">
               <div class="topbar__badge topbar__badge--accent topbar__badge--mono">
                  {{ gameStore.formattedBalance }}
               </div>
               <div class="topbar__badge topbar__badge--profit topbar__badge--mono">
                  <i class="fa-solid fa-bolt"></i>
                  {{ gameStore.formattedPassiveIncome }}
               </div>
               <div class="topbar__badge">
                  <i class="fa-solid fa-star"></i>
                  Level {{ gameStore.level }}
               </div>
               <div class="topbar__badge">
                  <span>{{ gameStore.xp }}/{{ gameStore.xpTarget }} XP</span>
                  <div class="topbar__xp-bar">
                     <div class="topbar__xp-fill" :style="{ width: `${gameStore.xpProgress}%` }"></div>
                  </div>
               </div>
            </div>
         </header>

         <RouterView />
      </main>
   </div>
</template>

<style scoped lang="scss">
.app-wrapper {
   --app-sidebar-width: 220px;

   position: relative;

   display: grid;
   width: 100%;
   max-width: 1440px;
   min-height: 100vh;
   grid-template-columns: var(--app-sidebar-width) minmax(0, 1fr);
   margin-inline: auto;

   &::before,
   &::after {
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: 1;

      content: '';
      pointer-events: none;
   }

   &::before {
      right: calc(50% + 500px);
      left: 0;

      border-right: 1px solid var(--color-border);
      background: var(--color-bg-secondary);
   }

   &::after {
      right: 0;
      left: calc(50% + 500px);

      background: var(--color-bg-primary);
   }
}

.main-panel {
   position: relative;
   z-index: 5;

   display: flex;
   min-width: 0;
   min-height: 100vh;
   flex-direction: column;

   background: var(--color-bg-primary);
}

.mobile-navigation-backdrop {
   position: fixed;
   inset: 0;
   z-index: var(--z-modal);

   visibility: hidden;
   background: rgba(0, 0, 0, 0.62);
   opacity: 0;
   pointer-events: none;
   transition:
      opacity 200ms ease-out,
      visibility 0s linear 200ms;

   &--visible {
      visibility: visible;
      opacity: 1;
      pointer-events: auto;
      transition:
         opacity 200ms ease-out,
         visibility 0s linear 0s;
   }
}

.topbar {
   position: sticky;
   top: 0;
   z-index: var(--z-sticky);

   display: flex;
   height: 56px;
   align-items: center;
   justify-content: space-between;
   gap: var(--space-4);
   padding: 0 var(--space-8);

   border-bottom: 1px solid var(--color-border);
   background: rgba(15, 15, 19, 0.8);
   backdrop-filter: blur(12px);

   &__heading {
      display: flex;
      min-width: 0;
      align-items: center;
      gap: var(--space-3);
   }

   &__menu-button {
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

   &__title {
      color: var(--color-text-primary);
      font-size: var(--text-display-sm);
      font-weight: var(--font-bold);
   }

   &__badges {
      display: flex;
      align-items: center;
      gap: var(--space-2);
   }

   &__badge {
      display: flex;
      min-height: 32px;
      align-items: center;
      gap: 6px;
      padding: var(--space-1) 12px;

      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.02);

      color: var(--color-text-primary);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      white-space: nowrap;

      &--mono {
         font-family: var(--font-mono);
      }

      &--accent {
         color: var(--color-accent);
         font-weight: var(--font-semibold);
      }

      &--profit {
         color: var(--color-profit);
      }
   }

   &__xp-bar {
      width: 60px;
      height: 4px;
      margin-left: var(--space-1);
      overflow: hidden;

      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.1);
   }

   &__xp-fill {
      height: 100%;

      border-radius: inherit;
      background: var(--color-accent);
   }
}

@include lg {
   .app-wrapper {
      grid-template-columns: 1fr;

      &::before,
      &::after {
         display: none;
      }
   }

   .topbar {
      flex-wrap: wrap;
      height: auto;
      padding: var(--space-4) var(--space-6);
   }
}

@include md {
   .topbar {
      &__badges {
         width: 100%;
         flex-wrap: wrap;
      }
   }
}

@media (prefers-reduced-motion: reduce) {
   .mobile-navigation-backdrop {
      transition: none;
   }
}
</style>
