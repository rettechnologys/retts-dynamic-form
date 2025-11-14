<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <div
      :class="[
        props.componentProps?.orientation === 'vertical'
          ? 'flex flex-row pl-4 justify-content-start flex-wrap  gap-3 '
          : '',
      ]"
    >
      <div
        :class="[
          'flex',
          props.componentProps?.orientation === 'vertical'
            ? 'flex-column-reverse pt-2  justify-content-between'
            : 'w-full justify-content-center mb-5',
        ]"
      >
        <span
          v-if="
            props.componentProps?.range &&
            Array.isArray(inputValue) &&
            inputValue.length > 1
          "
        >
          {{ inputValue[0] }} - {{ inputValue[1] }}
        </span>
        <span v-else>{{ inputValue }}</span>
      </div>

      <Slider
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        v-model="inputValue"
        ref="acref"
        @change="handleChange"
        :class="[
          'mt-2',
          props.componentProps?.orientation !== 'vertical' ? 'w-full' : '',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props.componentProps"
      />
      <div
        :class="[
          'flex',
          props.componentProps?.orientation === 'vertical'
            ? 'flex-column-reverse pt-2  justify-content-between'
            : 'w-full justify-content-between mt-3',
        ]"
      >
        <span>{{ props.componentProps?.min || 0 }}</span>
        <span>{{ props.componentProps?.max || 100 }}</span>
      </div>
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
import type { SliderProps } from 'primevue/slider';
import { useField } from 'vee-validate';
import type { VNode } from 'vue';
import { ref, toRef, watch } from 'vue';

//#region Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: number | number[];
  rules?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  slots?: { [key: string]: VNode | undefined };
  componentProps?: SliderProps;
}>();
//#endregion Props

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const acref = ref();
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
</script>

<style scoped></style>
