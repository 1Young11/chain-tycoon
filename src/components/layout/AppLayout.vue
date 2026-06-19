<script setup lang="ts">
import AppSidebar from './AppSidebar.vue'
</script>

<template>
   <div class="app-layout">
      <AppSidebar />
      <main class="app-layout__main">
         <RouterView />
      </main>
   </div>
</template>

<style scoped>
.app-layout {
   display: flex;
   min-height: 100vh;
}

.app-layout__main {
   flex: 1;
   padding: var(--space-6);
   overflow-y: auto;
   background: var(--color-bg-primary);
}
</style>