<script setup lang="ts">
import { computed } from 'vue'
import { clampCondition, formatConditionLabel, getConditionLabel } from '../model/equipment.utils'

const props = defineProps<{ condition: number; compact?: boolean }>()
const value = computed(() => clampCondition(props.condition))
const label = computed(() => getConditionLabel(value.value))
</script>

<template>
   <div class="condition" :class="{ 'condition--compact': compact }">
      <div class="condition__meta">
         <span>Condition</span>
         <strong class="text-mono">{{ value }}% <template v-if="!compact">({{ formatConditionLabel(label) }})</template></strong>
      </div>
      <div v-if="compact" class="condition__state">{{ formatConditionLabel(label) }}</div>
      <div class="condition__track" role="progressbar" aria-label="Equipment condition" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="value">
         <i class="condition__fill" :class="`condition__fill--${label}`" :style="{ width: `${value}%` }" aria-hidden="true"></i>
      </div>
   </div>
</template>

<style scoped lang="scss">
.condition {
   display: grid;
   width: 100%;
   max-width: 100%;
   min-width: 0;
   gap: 7px;

   &__meta { display: flex; min-width:0; align-items: center; justify-content: space-between; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--text-xs); }
   &__meta strong { flex:0 0 auto;color: var(--color-text-primary); font-size: var(--text-2xs); font-weight: var(--font-semibold);white-space:nowrap; }
   &__state { margin-top:-5px;color:var(--color-text-secondary);font-size:11px;line-height:1.2;text-align:right;white-space:nowrap; }
   &__track { position:relative;width:100%;max-width:100%;height:6px;overflow:hidden;border-radius:var(--radius-full);background:var(--color-border); }
   &__fill { display: block;max-width:100%;height:100%;border-radius:inherit;transition:width var(--transition-slow),background-color var(--transition-base); }
   &__fill--excellent,
   &__fill--good { background: var(--color-profit); }
   &__fill--worn { background: var(--color-warning); }
   &__fill--poor,
   &__fill--critical { background: var(--color-loss); }
   &--compact { gap:7px; }
}
@media(prefers-reduced-motion:reduce){.condition__fill{transition:none;}}
</style>
