<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <IconField
      :data-testid="`${name.replace(/[\[\]']+/g, '')}_loader`"
      :class="[
        'flex',
        parentInputClass ? parentInputClass : '',
        rules?.includes('Async') && meta.pending ? ' p-input-icon-right' : '',
      ]"
    >
      <component
        v-if="
          props?.componentProps?.component &&
          typeof props?.componentProps?.component === 'function'
        "
        :is="
          props?.componentProps.component(
            isFormValues ? formValues : inputValue,
            valueSetter,
          )
        "
        :data-testid="props.name.replace(/[\[\]']+/g, '')"
        :id="props.name.replace(/[\[\]']+/g, '')"
        :placeholder="props.placeholder"
        v-model="inputValue"
        :name="props.name"
        :type="props.type"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props.componentProps"
      />
      <component
        v-else
        :is="props?.componentProps?.component"
        :data-testid="props.name.replace(/[\[\]']+/g, '')"
        :id="props.name.replace(/[\[\]']+/g, '')"
        :name="props.name"
        :placeholder="props.placeholder"
        v-model="inputValue"
        :type="props.type"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props.componentProps"
      />
    </IconField>

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
//#region Imports
import type { ComponentType } from '../../types/Form';
import { useField } from 'vee-validate';
import { computed, inject, toRef, watch } from 'vue';
//#endregion Imports

//#region Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  rules?: string;
  isLazyValidation?: boolean;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: ComponentType;
}>();

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
//#endregion Datas

const isFormValues = computed(() => {
  return props?.componentProps?.formValues ? true : false;
});

const isSetFieldValue = computed(() => {
  return props?.componentProps?.formSetValues ? true : false;
});

const formValues = inject('formValues') as any;
const setFieldValue = inject('setFieldValue') as any;

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
//#region Methods
const valueSetter = (payload: any) => {
  if (isSetFieldValue.value) {
    setFieldValue(payload.fieldName, payload.value, payload?.shouldValidate);
  } else {
    setValue(payload);
  }
};

//#region Watchers
watch(
  () => props?.value,
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
