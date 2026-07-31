<script setup lang="ts">
import { ref, watch } from 'vue'
import type { EquipmentCategory } from '../model/equipment.types'

const props = withDefaults(defineProps<{ category: EquipmentCategory; imageUrl: string | null; name: string; compact?: boolean }>(), {
   compact: false,
})
const imageFailed = ref(false)

watch(() => props.imageUrl, () => { imageFailed.value = false })
</script>

<template>
   <div class="equipment-visual" :class="[`equipment-visual--${category}`, { 'equipment-visual--compact': compact }]">
      <img v-if="imageUrl && !imageFailed" :src="imageUrl" :alt="name" @error="imageFailed = true" />
      <template v-else>
         <div v-if="category === 'gpu'" class="hardware hardware--gpu" aria-hidden="true">
            <i v-for="index in 3" :key="index" class="hardware__fan"><span></span></i>
            <b></b>
         </div>
         <div v-else-if="category === 'psu'" class="hardware hardware--psu" aria-hidden="true"><i></i><b></b></div>
         <div v-else-if="category === 'base_system'" class="hardware hardware--system" aria-hidden="true"><i></i><i></i><i></i></div>
         <div v-else-if="category === 'case'" class="hardware hardware--frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
         <div v-else-if="category === 'cooling'" class="hardware hardware--cooling" aria-hidden="true"><i><span></span></i></div>
         <div v-else class="hardware hardware--accessory" aria-hidden="true"><i></i><b></b></div>
         <span class="equipment-visual__caption">{{ category.replace('_', ' ') }}</span>
      </template>
   </div>
</template>

<style scoped lang="scss">
.equipment-visual {
   position: relative;
   display: grid;
   width: 100%;
   height: 128px;
   place-items: center;
   overflow: hidden;
   border: 1px solid rgba(255, 255, 255, 0.045);
   border-radius: var(--radius-sm);
   background:
      radial-gradient(circle at 50% 45%, rgba(108, 99, 255, 0.1), transparent 55%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.025), transparent);

   &::before { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px); background-size: 14px 14px; content: ''; }
   img { position: relative; width: 100%; height: 100%; object-fit: contain; }
   &__caption { position: absolute; right: 8px; bottom: 6px; color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--text-2xs); letter-spacing: .08em; text-transform: uppercase; }
}
.equipment-visual--compact { height:108px; }
.equipment-visual--compact img { width:auto;height:auto;max-width:88%;max-height:88%; }
.equipment-visual--compact .hardware { transform:scale(.6); }

.hardware { position: relative; z-index: 1; filter: drop-shadow(0 8px 12px rgba(0,0,0,.42)); }
.hardware--gpu { display: flex; width: 144px; height: 64px; align-items: center; justify-content: center; gap: 7px; border: 2px solid #5e5e75; border-radius: 7px; background: linear-gradient(145deg, #343444, #20202c); box-shadow: inset 0 0 0 3px #191923; }
.hardware--gpu > b { position: absolute; right: -8px; width: 8px; height: 36px; border: 1px solid #68687c; background: #292936; }
.hardware__fan { display: grid; width: 32px; height: 32px; place-items: center; border: 2px solid #77778c; border-radius: 50%; background: repeating-conic-gradient(#5b5b70 0 12deg, #282835 12deg 32deg); }
.hardware__fan span { width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); box-shadow: 0 0 8px rgba(108,99,255,.65); }
.hardware--psu { width: 78px; height: 68px; border: 2px solid #626277; border-radius: 6px; background: linear-gradient(145deg,#343443,#1d1d28); }
.hardware--psu i { position: absolute; top: 9px; left: 12px; width: 42px; height: 42px; border: 2px solid #77778c; border-radius: 50%; background: repeating-conic-gradient(#5c5c70 0 5deg,transparent 5deg 18deg); }
.hardware--psu b { position: absolute; right: 7px; bottom: 6px; width: 8px; height: 5px; background: var(--color-profit); }
.hardware--system { display: grid; width: 94px; height: 66px; grid-template-columns: repeat(3,1fr); gap: 6px; padding: 9px; border: 2px solid #626277; background: #282835; }
.hardware--system i { border: 1px solid #66667b; border-radius: 3px; background: linear-gradient(#424255,#252532); }
.hardware--frame { display: flex; width: 116px; height: 66px; align-items: flex-end; justify-content: space-around; padding: 7px; border: 4px solid #65657a; border-top-width: 2px; background: rgba(22,22,29,.7); }
.hardware--frame i { width: 18px; height: 45px; border: 1px solid #68687e; background: #2d2d3c; }
.hardware--cooling i { display:grid; width:68px;height:68px;place-items:center;border:3px solid #66667a;border-radius:50%;background:repeating-conic-gradient(#505065 0 16deg,#252532 16deg 34deg); }
.hardware--cooling span { width:14px;height:14px;border-radius:50%;background:var(--color-info); }
.hardware--accessory { width: 88px; height: 48px; border: 2px solid #646479; border-radius: 20px 8px 8px 20px; background: #2a2a38; }
.hardware--accessory i { position:absolute;left:10px;top:13px;width:20px;height:20px;border-radius:50%;background:var(--color-accent); }
.hardware--accessory b { position:absolute;right:-20px;top:20px;width:24px;height:6px;background:#68687c; }
</style>
