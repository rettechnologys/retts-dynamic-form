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
    >
      <i
        :class="
          rules?.includes('Async') && meta.pending
            ? 'pi pi-spin pi-spinner'
            : ''
        "
      />
      <InputMask
        v-if="isLazyValidation"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :mask="mask"
        :value="inputValue"
        @change="handleChange"
        :placeholder="placeholder"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props?.componentProps"
      />
      <InputMask
        v-else
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :mask="mask"
        :unmask="true"
        :auto-clear="false"
        v-model="inputValue"
        :placeholder="placeholder"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props?.componentProps"
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
import type { InputMaskProps } from 'primevue/inputmask';
import { useField } from 'vee-validate';
import { toRef, watch } from 'vue';
//#endregion Imports

const CNAME = 'BaseInputMask' as const;

//#region Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  mask?: string;
  type?: string;
  rules?: string;
  isLazyValidation?: boolean;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  componentProps?: InputMaskProps & { disabled?: boolean, phone_code?: string };
  inputClass?: string;
  errorInputClass?: string;
}>();
//#endregion Props

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
// const type = toRef(props, 'type');
// const phone_code = props.componentProps?.phone_code || '62';

console.log(`[${CNAME}]:value: ${value.value}`);

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

//#region Watchers
watch(
  () => value?.value,
  (newValue) => {
    if (newValue) {
      console.log(`[${CNAME}]:value: ${newValue}`);
      value.value = newValue ? newValue : undefined;
      inputValue.value = newValue;
    }
  },
  { immediate: true },
);
//#endregion Watchers
</script>

<style scoped></style>
