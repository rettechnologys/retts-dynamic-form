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
      :class="[
        'flex',
        parentInputClass ? parentInputClass : '',
        rules?.includes('Async') && meta.pending ? ' p-input-icon-right' : '',
      ]"
      :name="name"
    >
      <i
        :class="
          rules?.includes('Async') && meta.pending
            ? 'pi pi-spin pi-spinner'
            : ''
        "
      />

      <Password
        v-if="isLazyValidation"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :feedback="false"
        v-model="inputValue"
        :placeholder="placeholder"
        @update:model-value="onHandleChange"
        inputClass="w-full"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props.componentProps"
      />
      <Password
        v-else
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :feedback="false"
        v-model="inputValue"
        :placeholder="placeholder"
        @update:model-value="onHandleChange"
        inputClass="w-full"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        :pt="{
          input: {
            root: {
              autocomplete: props.componentProps?.autocomplete,
            },
          },
        }"
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
//#region Imports
import type { PasswordProps } from 'primevue/password';
import { useField } from 'vee-validate';
import { inject } from 'vue';
import { toRef, watch } from 'vue';
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
  componentProps?: PasswordProps;
}>();
//#endregion Props

const emits = defineEmits<{
  (
    e: 'handle-change',
    payload: {
      value: any;
      cb?: (e: string, v: any) => void;
    },
  ): void;
}>();

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
//#endregion Datas

//#region Inject
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
//#endregion Inject

//#region Composables
const {
  value: inputValue,
  errorMessage,
  handleChange,
  meta,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
});
//#endregion Composables

//#region Watch
watch(
  () => value?.value,
  (newValue) => {
    if (newValue) {
      value.value = newValue;
      inputValue.value = newValue;
    }
  },
  { immediate: true },
);
//#endregion Watch

//#region Methods
const onHandleChange = (value: string) => {
  handleChange(value);
  emits('handle-change', {
    value,
    cb: resetField,
  });
};
//#endregion Methods
</script>

<style scoped></style>
