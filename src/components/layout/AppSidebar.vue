<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navItems = [
   { name: 'dashboard', label: 'Dashboard', icon: '⬛' },
   { name: 'portfolio', label: 'Portfolio', icon: '📊' },
   { name: 'mining', label: 'Mining', icon: '⚡' },
   { name: 'market', label: 'Market', icon: '🌊' },
   { name: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
]
</script>

<template>
   <aside class="sidebar">
      <div class="sidebar__logo">
         Chain<span class="sidebar__logo-accent">Tycoon</span>
      </div>

      <nav class="sidebar__nav">
         <RouterLink v-for="item in navItems" :key="item.name" :to="{ name: item.name }" class="sidebar__nav-item"
            active-class="sidebar__nav-item--active">
            <span class="sidebar__nav-icon">{{ item.icon }}</span>
            <span class="sidebar__nav-label">{{ item.label }}</span>
         </RouterLink>
      </nav>
   </aside>
</template>

<style scoped>
.sidebar {
   width: 240px;
   min-height: 100vh;
   background: var(--color-bg-secondary);
   border-right: 1px solid var(--color-border);
   display: flex;
   flex-direction: column;
   padding: var(--space-6) var(--space-4);
   flex-shrink: 0;
}

.sidebar__logo {
   font-size: var(--text-xl);
   font-weight: var(--font-bold);
   color: var(--color-text-primary);
   margin-bottom: var(--space-8);
   padding: 0 var(--space-2);
}

.sidebar__logo-accent {
   color: var(--color-accent);
}

.sidebar__nav {
   display: flex;
   flex-direction: column;
   gap: var(--space-1);
}

.sidebar__nav-item {
   display: flex;
   align-items: center;
   gap: var(--space-3);
   padding: var(--space-3) var(--space-3);
   border-radius: var(--radius-md);
   color: var(--color-text-secondary);
   font-size: var(--text-sm);
   font-weight: var(--font-medium);
   transition: all var(--duration-fast) var(--ease-default);
   border-left: 2px solid transparent;
}

.sidebar__nav-item:hover {
   background: var(--color-bg-tertiary);
   color: var(--color-text-primary);
}

.sidebar__nav-item--active {
   background: var(--color-accent-subtle);
   color: var(--color-accent);
   border-left-color: var(--color-accent);
}

.sidebar__nav-icon {
   font-size: var(--text-base);
   width: 20px;
   text-align: center;
}
</style>