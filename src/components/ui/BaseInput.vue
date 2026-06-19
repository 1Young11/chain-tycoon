<script setup lang="ts">
withDefaults(defineProps<{
   label?: string
   type?: string
   placeholder?: string
   modelValue?: string
   error?: string
   isDisabled?: boolean
}>(), {
   type: 'text',
   placeholder: '',
   modelValue: '',
   error: '',
   isDisabled: false,
})

defineEmits<{
   'update:modelValue': [value: string]
}>()
</script>

<template>
   <div class="input-wrapper">
      <label v-if="label">{{ label }}</label>
      <input class="base-input" :type="type" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" :placeholder="placeholder" :value="modelValue" :disabled="isDisabled" />
      <span v-if="error" class="base-input__error">{{ error }}</span>
   </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
   display: flex;
   flex-direction: column;
   gap: 0.25rem;

   label {
      font-weight: 500;
      color: var(--color-accent);
      font-size: 0.875rem;
   }

   & > .base-input__error {
      color: var(--color-loss);
      font-size: 0.75rem;
   }

   & > .base-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: 4px;
      transition: border-color 0.3s ease;

      &:focus {
         border-color: var(--color-accent);
         outline: none;
      }

      &::placeholder {
         color: var(--color-text-muted);
      }

      &:disabled {
         background-color: var(--color-bg-secondary);
         cursor: not-allowed;
      }
   }
}
</style>