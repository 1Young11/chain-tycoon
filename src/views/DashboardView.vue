<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseCard from '@/components/ui/BaseCard.vue';
import BaseInput from '@/components/ui/BaseInput.vue';
</script>

<template>
  <div class="view">
    <h1>DashboardView</h1>
    <BaseButton :variant="'primary'">Click Me</BaseButton>
    <BaseCard :padding="'2rem'" :hoverable="true">
      <p>This is a simple card.</p>
    </BaseCard>
    <BaseInput placeholder="Enter text here" />
  </div>
</template>
