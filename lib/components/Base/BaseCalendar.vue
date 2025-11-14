<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>

    <Calendar
      :data-testid="name.replace(/[\[\]']+/g, '')"
      :id="name.replace(/[\[\]']+/g, '')"
      :name="name"
      :date-format="'dd/mm/yy'"
      v-model="inputValue"
      :placeholder="placeholder"
      :show-icon="true"
      :manual-input="false"
      :iconDisplay="'input'"
      :class="[
        'w-full',
        inputClass ? inputClass : '',
        meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
      ]"
      v-bind="{ ...props.componentProps }"
    />

    <small
      :data-testid="`errorMessage_${name.replace(/[\[\]']+/g, '')}`"
      class="p-error"
      :class="[errorInputClass ? errorInputClass : '']"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup lang="ts">
import type { CalendarProps } from 'primevue/calendar';
import { useField } from 'vee-validate';
import { toRef, watch } from 'vue';

//* Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: Date | Date[];
  type?: string;
  rules?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: CalendarProps;
}>();

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');

const {
  value: inputValue,
  errorMessage,
  meta,
} = useField(name, rules, {
  initialValue: value.value,
  validateOnMount: false,
  label: label,
});

watch(
  () => value?.value,
  (newValue) => {
    if (newValue) {
      value.value = newValue ? newValue : undefined;
      inputValue.value = newValue;
    }
  },
  { immediate: true },
);
</script>

<style scoped></style>
