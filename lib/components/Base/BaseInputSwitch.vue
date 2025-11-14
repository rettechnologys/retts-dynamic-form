<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium mr-2', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <div
      :data-testid="`${name.replace(/[\[\]']+/g, '')}_loader`"
      :class="['flex', parentInputClass ? parentInputClass : '']"
    >
      <InputSwitch
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :input-id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :type="type"
        v-model="inputValue"
        :aria-label="'test'"
        :placeholder="placeholder"
        :class="[
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        @update:model-value="onHandleChange"
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
    v-if="dependantFields && fieldsRef"
    :fields="fieldsRef"
    :is-view-mode="props.componentProps?.disabled"
  />
</template>

<script setup lang="ts">
import type { InputSwitchProps } from 'primevue/inputswitch';
import { useField } from 'vee-validate';
import { defineAsyncComponent, inject, ref, toRef, watch } from 'vue';
import { HandleDependantFields } from '../../DynamicForm/helper';
import type { IFormDependantFields, IFormField } from '../../types/Form';
;
const DynamicField = defineAsyncComponent(
  () => import('../../DynamicForm/DynamicField.vue'),
);

//#region Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: boolean | string | undefined;
  type?: string;
  rules?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: InputSwitchProps;
  dependantFields?: IFormDependantFields[];
}>();
//#endregion Props

//#region Emits
const emits = defineEmits<{
  (
    event: 'handle-change',
    payload: {
      value: any;
      formValues?: any;
      cb?: (e: string, v: any) => void;
    },
  ): string;
  (event: 'handle-blur', value: string): string;
}>();
//#endregion Emits

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const fieldsRef = ref<IFormField[]>();
//#endregion Datas

//#region Inject
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
const formValues = inject('formValues') as Record<string, any>;
//#endregion Inject

//#region Composables
const {
  value: inputValue,
  errorMessage,
  meta,
} = useField(name.value, rules.value, {
  initialValue: value.value,
  label: label.value,
});
//#endregion Composables

//#region Watchers
watch(
  inputValue,
  (newVal, oldVal) => {
    if (props.dependantFields && props.dependantFields.length > 0) {
      fieldsRef.value = HandleDependantFields(
        props.dependantFields,
        newVal,
        Array.isArray(oldVal) ? oldVal[0] : oldVal,
        resetField,
      );
    }
  },
  {
    immediate: true,
  },
);
//#endregion Watchers

//#region Methods
const onHandleChange = (e: boolean) => {
  console.log('[BaseInputSwitch]:onHandleChange', e);
  console.log('[BaseInputSwitch]:formValues', formValues);
  emits('handle-change', {
    value: e,
    formValues: formValues,
    cb: resetField,
  });
};
//#endregion Methods
</script>

<style scoped></style>
