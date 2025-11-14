<template>
  <div :class="['field ', fieldClass ? fieldClass : '']">
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
      <ToggleButton
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
  </div>
  <DynamicField
    v-if="dependantFields && fieldsRef && fieldsRef.length > 0 && inputValue"
    :fields="fieldsRef"
  />
</template>

<script setup lang="ts">
import {
  HandleDependantFields,
  ParseObjectLikeFieldName,
} from '../../DynamicForm/helper/index';
import type { IFormDependantFields, IFormField } from '../../types/Form';;
import type { ToggleButtonProps } from 'primevue/togglebutton';
import { useField } from 'vee-validate';
import { defineAsyncComponent, inject, ref, toRef, watch } from 'vue';
const DynamicField = defineAsyncComponent(
  () => import('../../DynamicForm/DynamicField.vue'),
);

//#region Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  value?: any | undefined;
  rules?: string | undefined;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: ToggleButtonProps;
  dependantFields?: IFormDependantFields[];
}>();
//#endregion Props

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const fieldsRef = ref<IFormField[]>();
//#endregion Datas

//#region Composables
const { value: inputValue, errorMessage } = useField(name, rules, {
  initialValue: value.value,
  label: label,
});
//#endregion Composables

//#region Inject
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
//#endregion Composables

//#region Watchers
watch(
  inputValue,
  (newVal, oldVal) => {
    if (props.dependantFields && props.dependantFields.length > 0 && newVal) {
      fieldsRef.value = HandleDependantFields(
        props.dependantFields,
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
