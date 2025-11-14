<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <div
      :data-testid="`${name.replace(/[\[\]']+/g, '')}_loader`"
      :class="['flex', parentInputClass ? parentInputClass : '']"
    >
      <Rating
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :cancel="false"
        v-model="inputValue"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        @dblclick="doubleClick"
        v-bind="props.componentProps"
      />
    </div>

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
import type { RatingProps } from 'primevue/rating';
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
  componentProps?: RatingProps;
}>();

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
  setValue,
  meta,
} = useField(name, rules, {
  initialValue: value.value,
  validateOnMount: false,
  label: label,
});
//#endregion Composables

//#region Watchers
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
//#endregion Watchers

//#region Methods
const doubleClick = () => {
  setValue(0);
};
</script>

<style scoped></style>
