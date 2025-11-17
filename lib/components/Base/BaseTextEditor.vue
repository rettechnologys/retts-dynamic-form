<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>

    <TinyMceEditor
      :data-testid="name.replace(/[\[\]']+/g, '')"
      :id="name.replace(/[\[\]']+/g, '')"
      :name="name"
      v-model="inputValue"
      :height="800"
      :unique="`content-${name.replace(/[\[\]']+/g, '')}`"
      :disabled="props.componentProps?.disabled"
      @handle-change="onHandleChange"
      v-bind="props?.componentProps"
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
import TinyMceEditor from '../TinyMce/TinyMceEditor.vue';
import { useField } from 'vee-validate';
import { inject } from 'vue';
import { toRef, watch } from 'vue';

// const CNAME = 'BaseTextEditor' as const;

//* Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  rules?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  autocomplete?: string;
  componentProps?: any;
}>();

//#region emits
const emits = defineEmits<{
  (event: 'handle-preview', value: string): void;
  (
    event: 'handle-change',
    payload: {
      value: any;
      cb?: (e: string, v: any) => void;
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
//#endregion Datas

//#region Composables
const {
  value: inputValue,
  errorMessage,
  handleChange,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
});
//#endregion Composables

//#region Injects
const resetField = inject('setFieldValue') as (e: string, v: any) => void;

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
const onHandleChange = (e: string) => {
  handleChange(e);
  emits('handle-change', {
    value: e,
    cb: resetField,
  });
};
//#endregion Methods
</script>

<style scoped></style>
