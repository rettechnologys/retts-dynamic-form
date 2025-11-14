<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(regexDataId, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>

    <div
      :data-testid="`${name.replace(regexDataId, '')}_loader`"
      :class="['flex', parentInputClass ? parentInputClass : '']"
    >
      <CodeMirror
        :id="name.replace(regexDataId, '')"
        :name="name"
        basic
        :lang="json()"
        ref="inputRef"
        v-model="inputValue"
        :class="[
          'w-full p-inputtext',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        :data-testid="name.replace(regexDataId, '')"
        v-bind="props?.componentProps"
      >
      </CodeMirror>
    </div>

    <small
      :data-testid="`errorMessage_${name.replace(regexDataId, '')}`"
      class="p-error"
      :class="[errorInputClass ? errorInputClass : '']"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { json } from '@codemirror/lang-json';
import { useField } from 'vee-validate';
import { inject, ref, toRef, watch } from 'vue';
import CodeMirror from 'vue-codemirror6';

type CodeMirrorProps = InstanceType<typeof CodeMirror>['$props'];

defineOptions({ name: 'BaseAutoComplete', inheritAttrs: false });

//* Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value?: string | undefined;
  rules?: string | undefined;
  fieldClass?: string | undefined;
  labelClass?: string | undefined;
  parentInputClass?: string | undefined;
  inputClass?: string | undefined;
  errorInputClass?: string | undefined;
  componentProps?: CodeMirrorProps;
}>();

//#region Emits
const emits = defineEmits<{
  (
    event: 'handle-change',
    payload: {
      value: any;
      cb?: (e: string, v: any) => void;
      name?: string;
      waterfallFields?: string[];
    },
  ): void;
}>();

//* Data
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const inputRef = ref();
// eslint-disable-next-line no-useless-escape
const regexDataId = new RegExp(/[\[\]']+/g);

//#region Composables
const {
  value: inputValue,
  errorMessage,
  meta,
} = useField(name, rules, {
  initialValue:
    typeof value.value === 'string' ? value.value : JSON.stringify(value.value),
  label: label,
});

//#region Injects
const resetField = inject('setFieldValue') as (e: string, v: any) => void;

//#region Watchers
watch(
  () => value?.value,
  (newValue) => {
    if (newValue) {
      value.value = JSON.stringify(newValue);
      inputValue.value = JSON.stringify(newValue);
    }
  },
  { immediate: true },
);
//#endregion Watchers
</script>

<style>
.p-autocomplete-multiple-container {
  width: 100% !important;
}
</style>
