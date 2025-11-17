<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ props.label }}
    </label>
    <IconField
      :data-testid="`${name.replace(/[\[\]']+/g, '')}_loader`"
      :class="[
        'flex',
        parentInputClass ? parentInputClass : '',
        rules?.includes('Async') && meta.pending ? ' p-input-icon-right' : '',
      ]"
      :iconPosition="type === 'clipboard' ? 'right' : undefined"
    >
      <InputIcon
        :class="
          rules?.includes('Async') && meta.pending
            ? 'pi pi-spin pi-spinner'
            : ''
        "
      />
      <InputText
        v-if="isLazyValidation"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :type="type"
        :value="inputValue"
        @change="handleChange"
        @blur="handleBlur"
        :placeholder="placeholder"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props.componentProps"
      />
      <template v-else>
        <InputText
          :data-testid="name.replace(/[\[\]']+/g, '')"
          :id="name.replace(/[\[\]']+/g, '')"
          :name="name"
          :type="type"
          v-model="inputValue"
          :placeholder="placeholder"
          @update:model-value="onHandleChange"
          :class="[
            'w-full',
            inputClass ? inputClass : '',
            meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
          ]"
          v-bind="props.componentProps"
        />
        <Button
          v-if="type === 'clipboard' && isSupported"
          :class="' p-input-icon-right cursor-pointer p-button-text'"
          plain
          :icon="'pi pi-clipboard'"
          @click="onCopyToClipboard"
        />
      </template>
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
import { useClipboard } from '@vueuse/core';
import type { InputTextProps } from 'primevue/inputtext';
import { useField } from 'vee-validate';
import { toRef, watch } from 'vue';

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
  componentProps?: InputTextProps & {
    composables?: {
      toast: any;
    }
  };
}>();

//#region Emits
const emits = defineEmits<{
  (
    e: 'handle-change',
    payload: {
      value: any;
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
const type = toRef(props, 'type');
//#endregion Datas

//#region Composables
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
  setValue,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
});

const { isSupported, copy } = useClipboard();
//#endregion Composables

//#region Inject
// const resetField = inject('setFieldValue') as (e: string, v: any) => void;
//#endregion Inject

//#region Watchers
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
//#endregion Watchers

//#region Methods
const onHandleChange = (value: string | undefined) => {
  handleChange(value);

  emits('handle-change', {
    value,
    cb: setValue,
  });
};

const onCopyToClipboard = () => {
  copy(inputValue.value);
  props.componentProps?.composables?.toast.add({
    severity: 'success',
    summary: 'Copied',
    detail: 'Copied to clipboard',
    life: 3000,
  });
};
//#endregion Methods
</script>

<style scoped></style>
