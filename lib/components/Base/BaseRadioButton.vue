<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium ', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <div
      :class="[
        'field flex gap-5 mt-2',
        parentInputClass ? parentInputClass : '',
      ]"
    >
      <div
        v-for="option in options"
        :key="`${name}-${option}`"
        class="flex align-items-center"
      >
        <RadioButton
          :name="name"
          :value="option.value"
          v-model="inputValue"
          @change="onHandleChange"
          v-bind="props.componentProps"
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
      {{ errorMessage }}
    </small>
  </div>
  <DynamicField
    v-if="props.dependantFields && fieldsRef && fieldsRef.length > 0"
    :fields="fieldsRef"
    :is-view-mode="false"
  />
</template>

<script setup lang="ts">
import {
  HandleDependantFields,
  ParseObjectLikeFieldName,
} from '../../DynamicForm/helper/index';
import type {
  IFormDependantFields,
  IFormField,
  IOptionSelect,
} from '../../types/Form';;
import type { RadioButtonProps } from 'primevue/radiobutton';
import { useField } from 'vee-validate';
import {
  defineAsyncComponent,
  inject,
  onMounted,
  ref,
  toRef,
  watch,
} from 'vue';
const DynamicField = defineAsyncComponent(
  () => import('../../DynamicForm/DynamicField.vue'),
);

const CNAME = 'BaseRadioButton';

///* Props
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
  componentProps?: RadioButtonProps;
  dependantFields?: IFormDependantFields[];
}>();

//#region emits
const emits = defineEmits<{
  (event: 'handle-preview', value: string): void;
  (
    event: 'handle-change',
    payload: {
      value: any;
      cb?: (e: string, v: any) => void;
      values?: any;
    },
  ): string;
  (event: 'handle-blur', value: string): string;
}>();
//#endregion emits

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const fieldsRef = ref<IFormField[] | undefined>();
//#endregion Datas

//#region Composables
const {
  value: inputValue,
  errorMessage,
  handleChange,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
  validateOnMount: false,
});
//#endregion

//#region Inject
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
const formValues = inject('formValues') as Record<string, any>;
//#endregion

//#region Lifecycle Hooks
onMounted(() => {
  if (props.dependantFields && props.dependantFields.length > 0) {
    fieldsRef.value = HandleDependantFields(
      props.dependantFields,
      props.options[0]!.value,
      undefined,
      resetField,
    );
  }
});
//#endregion Lifecycle Hooks

//#region Watchers
watch(inputValue, (newVal, oldVal) => {
  console.log(`${CNAME}:dependant`, props.dependantFields);
  if (props.dependantFields && props.dependantFields.length > 0) {
    fieldsRef.value = HandleDependantFields(
      props.dependantFields,
      newVal,
      oldVal,
      resetField,
    );

    if (!newVal) {
      resetField(ParseObjectLikeFieldName(name.value), undefined);
    }
  }
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
//#endregion Watchers

//#region Methods
const onHandleChange = (e: Event) => {
  console.log(`${CNAME}:onHandleChange:`, (e.target as HTMLInputElement).value);
  const value = (e.target as HTMLInputElement).value;
  handleChange(value);
  emits('handle-change', {
    value,
    values: formValues,
    cb: resetField,
  });
};
</script>

<style scoped></style>
