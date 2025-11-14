<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>

    <Knob
      :data-testid="name.replace(/[\[\]']+/g, '')"
      :id="name.replace(/[\[\]']+/g, '')"
      :name="name"
      v-model="inputValue"
      @change="handleChange"
      :class="[
        'w-full',
        inputClass ? inputClass : '',
        meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
      ]"
      v-bind="props.componentProps"
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
import Knob, { type KnobProps } from 'primevue/knob';
import { useField } from 'vee-validate';
import { toRef, watch } from 'vue';

//#region Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: number;
  rules?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: KnobProps;
}>();
//#endregion Props

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
//#endregion Datas

//#region Composables
const {
  value: inputValue,
  errorMessage,
  handleChange,
  meta,
} = useField(name, rules, {
  initialValue: value.value ? value.value : 0,
  validateOnMount: false,
  label: label,
});
//#endregion Composables

//#region Watch
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
//#endregion Watch
</script>

<style scoped></style>
