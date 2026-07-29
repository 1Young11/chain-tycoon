<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import { useGameStore } from '@/stores/game'

const route = useRoute()
const gameStore = useGameStore()

const pageTitle = computed(() => (route.meta.title as string | undefined) ?? 'Dashboard')

onMounted(() => {
   gameStore.startTicker()
})

onBeforeUnmount(() => {
   gameStore.stopTicker()
})
</script>

<template>
   <div class="app-wrapper">
      <AppSidebar />

      <main class="main-panel">
         <header class="topbar">
            <div class="topbar__title">{{ pageTitle }}</div>

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
   position: relative;

   display: grid;
   width: 100%;
   max-width: 1440px;
   min-height: 100vh;
   grid-template-columns: 220px minmax(0, 1fr);
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
</style>
