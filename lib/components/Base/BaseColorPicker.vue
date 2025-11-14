<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium ', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <div
      :data-testid="`${name.replace(/[\[\]']+/g, '')}_loader`"
      :class="['flex', parentInputClass ? parentInputClass : '']"
    >
      <ColorPicker
        :key="`${name}`"
        :name="name"
        v-model="inputValue"
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
    <DynamicField
      v-if="dependantFields && fieldsRef && fieldsRef.length > 0"
      :fields="fieldsRef"
    />
  </div>
</template>

<script setup lang="ts">
import {
  HandleDependantFields,
  ParseObjectLikeFieldName,
} from '../../DynamicForm/helper/index';
import type { IFormDependantFields, IFormField } from '../../types/Form';
import ColorPicker, { type ColorPickerProps } from 'primevue/colorpicker';
import { useField } from 'vee-validate';
import { defineAsyncComponent, inject, ref, toRef, watch } from 'vue';
const DynamicField = defineAsyncComponent(
  () => import('../../DynamicForm/DynamicField.vue'),
);

///* Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  value?: string | object | Record<string, any> | undefined;
  rules?: string | undefined;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: ColorPickerProps;
  dependantFields?: IFormDependantFields[];
}>();

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const dependantFields = toRef(props, 'dependantFields');
const fieldsRef = ref<IFormField[]>();

//#region Composables
const { value: inputValue, errorMessage } = useField(name, rules, {
  initialValue: value?.value,
  label: label,
});
//#endregion

//#region Inject
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
//#endregion

//#region Watchers
watch(
  inputValue,
  (newVal, oldVal) => {
    if (dependantFields.value && dependantFields.value.length > 0) {
      fieldsRef.value = HandleDependantFields(
        dependantFields.value,
        newVal,
        Array.isArray(oldVal) ? oldVal[0] : oldVal,
        resetField,
      );
    }

    if (!newVal) {
      resetField(ParseObjectLikeFieldName(name.value), undefined);
    }
  },
  {
    immediate: true,
  },
);
</script>

<style scoped></style>
