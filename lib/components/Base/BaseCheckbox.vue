<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium ', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <div
      :class="['field flex gap-5 ', parentInputClass ? parentInputClass : '']"
    >
      <div
        v-for="option in options"
        :key="`${name}-${option}`"
        class="flex align-items-center"
      >
        <Checkbox
          :name="name"
          :value="option.value"
          v-model="inputValue"
          :invalid="meta.validated ? (meta.valid ? false : true) : false"
          @update:modelValue="onHandleChange"
          v-bind="props.componentProps as CheckboxProps"
        />
        <label
          :for="name.replace(/[\[\]']+/g, '')"
          :class="['font-medium ml-2', labelClass ? labelClass : '']"
        >
          {{ option.text }}
        </label>
      </div>
    </div>

    <small
      :data-testid="`errorMessage_${name.replace(/[\[\]']+/g, '')}`"
      class="p-error"
      :class="[errorInputClass ? errorInputClass : '']"
    >
      {{
        errorMessage
          ?.replace(/[\[\]'\d]+/g, '')
          .split('.')
          .join(' ')
      }}
    </small>
  </div>
  <DynamicField
    v-if="dependantFields && fieldsRef && fieldsRef.length > 0"
    :fields="fieldsRef"
  />
</template>

<script setup lang="ts">
import type { CheckboxProps } from 'primevue/checkbox';
import { useField } from 'vee-validate';
import { defineAsyncComponent, inject, ref, toRef, watch } from 'vue';
import {
  HandleDependantFields,
  ParseObjectLikeFieldName,
} from '../../DynamicForm/helper/index';
import type {
  IFormDependantFields,
  IFormField,
  IOptionSelect,
} from '../../types/Form';
const DynamicField = defineAsyncComponent(
  () => import('../../DynamicForm/DynamicField.vue'),
);

//#region Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  value?: string | string[] | undefined;
  rules?: string | undefined;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  type: 'checkbox' | 'radio';
  options: IOptionSelect[];
  atLeastOne?: boolean;
  componentProps?: CheckboxProps;
  dependantFields?: IFormDependantFields[];
}>();

//#region Emits
const emits = defineEmits<{
  (
    e: 'handle-change',
    payload: {
      value: string | string[] | undefined;
      name?: string;
      cb?: (e: string) => void;
    },
  ): void;
}>();
//#endregion Emits

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const dependantFields = toRef(props, 'dependantFields');
const fieldsRef = ref<IFormField[]>();
//#endregion Datas

//#region Composables
const {
  value: inputValue,
  errorMessage,
  handleChange,
  setValue,
  meta,
} = useField(name, rules, {
  initialValue: value?.value,
  label: label,
});
//#endregion

//#region Inject
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
//#endregion

//#region Methods
const onHandleChange = (value: any | undefined) => {
  handleChange(value);

  emits('handle-change', {
    value,
    name: props.name,
    cb: setValue,
  });
};

//#region Watchers
watch(
  inputValue,
  (newVal, oldVal) => {
    if (
      dependantFields.value &&
      dependantFields.value.length > 0 &&
      props.options &&
      props.options.length === 1 &&
      props.componentProps?.binary
    ) {
      fieldsRef.value = HandleDependantFields(
        dependantFields.value,
        newVal,
        Array.isArray(oldVal) ? oldVal[0] : oldVal,
        resetField,
      );
    } else if (props.options.length > 1) {
      if (Array.isArray(newVal) && !newVal.length) {
        resetField(ParseObjectLikeFieldName(name.value), undefined);
      }
    }

    if (props.atLeastOne) {
      if (!newVal && props.options.length > 1) {
        resetField(ParseObjectLikeFieldName(name.value), [
          props.options[0]!.value,
        ]);
      }
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
</script>

<style scoped></style>
