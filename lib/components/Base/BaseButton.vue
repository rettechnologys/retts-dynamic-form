<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <Button
      :label="label"
      :class="['', inputClass ? inputClass : '']"
      @click="handleClick"
      v-bind="props.componentProps"
    />
  </div>
</template>

<script setup lang="ts">
import type { ButtonProps } from 'primevue/button';
import { inject } from 'vue';

///* Props
const props = defineProps<{
  label: string | undefined;
  fieldClass?: string;
  inputClass?: string;
  componentProps?: ButtonProps;
  formValues?: boolean;
}>();

const formValuesData = inject('formValues') as any;

//* Emits
const emits = defineEmits<{
  (event: 'handle-click', payload?: any): void;
}>();

const handleClick = () => {
  emits('handle-click', props.formValues ? formValuesData : undefined);
};
</script>

<style scoped></style>
