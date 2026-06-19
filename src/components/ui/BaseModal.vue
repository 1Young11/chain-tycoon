<script setup lang="ts">
defineEmits<{
   'close': []
}>()

withDefaults(defineProps<{
   title: string
   isOpen?: boolean
}>(), {
   isOpen: false,
   title: 'Modal Title',
})
</script>


<template>
   <Teleport to="body">
      <transition name="fade-out">
         <div class="base-modal" v-if="isOpen" @click.self="$emit('close')">
            <div class="base-modal__content">
               <div class="base-modal__header">
                  <span>{{ title }}</span>
                  <button @click="$emit('close')">✕</button>
               </div>
               <slot></slot> 
            </div>
         </div>
      </transition>
   </Teleport>
</template>

<style lang="scss" scoped>
.fade-out-enter-active,
.fade-out-leave-active {
   transition: opacity 0.3s ease;
}

.fade-out-enter-from,
.fade-out-leave-to {
   opacity: 0;
}

.base-modal {
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
   background-color: rgba(0, 0, 0, 0.5);

   &__content {
      background-color: var(--color-bg-elevated);
      padding: 1rem;
      border-radius: 4px;
      min-width: 300px;
      max-width: 90%;
   }

   &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      span {
         font-size: 1.25rem;
         font-weight: 500;
      }

      button {
         background: none;
         border: none;
         font-size: 1.25rem;
         cursor: pointer;
      }
   }
}
</style>