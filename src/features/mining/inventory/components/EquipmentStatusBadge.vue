<script setup lang="ts">
import { statusLabels } from '../model/equipment.utils'
import type { EquipmentStatus } from '../model/equipment.types'

defineProps<{ status: EquipmentStatus }>()
</script>

<template>
   <span class="equipment-status" :class="`equipment-status--${status}`">
      <i class="equipment-status__dot" aria-hidden="true"></i>
      {{ statusLabels[status] }}
   </span>
</template>

<style scoped lang="scss">
.equipment-status {
   display: inline-flex;
   width: fit-content;
   align-items: center;
   gap: 6px;
   height: 24px;
   padding: 0 8px;
   border: 1px solid currentColor;
   border-radius: 5px;
   font-size: var(--text-2xs);
   font-weight: var(--font-semibold);
   line-height: 1;
   white-space: nowrap;
   transition:color var(--transition-fast),background-color var(--transition-fast),border-color var(--transition-fast);

   &__dot { width: 6px; height: 6px; flex:0 0 auto; border-radius: 50%; background: currentColor; }
   &--installed { color: var(--color-profit); background: var(--color-profit-subtle); }
   &--in_storage { color: var(--color-text-secondary); background: rgba(144, 144, 168, 0.08); }
   &--reserved { color: var(--color-accent); background: var(--color-accent-subtle); }
   &--installing { color: var(--color-info); background: var(--color-info-subtle); }
   &--repairing,
   &--for_sale { color: var(--color-warning); background: var(--color-warning-subtle); }
   &--broken { color: var(--color-loss); background: var(--color-loss-subtle); }
}
@media(prefers-reduced-motion:reduce){.equipment-status{transition:none;}}
</style>
