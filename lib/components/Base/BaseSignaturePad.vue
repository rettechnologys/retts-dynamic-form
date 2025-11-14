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

      <SignaturePad
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :type="type"
        v-model="inputValue"
        @update:model-value="onHandleChange"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        :isDarkTheme="isDarkTheme"
        v-bind="props.componentProps"
      />
      <!-- <Button
        v-if="type === 'clipboard' && isSupported"
        :class="' p-input-icon-right cursor-pointer p-button-text'"
        plain
        :icon="'pi pi-clipboard'"
        @click="onCopyToClipboard"
      /> -->
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
import SignaturePad from '../SignaturePad/SignaturePad.vue';
import type { SignaturePadProps } from '../SignaturePad/Types';
import { useField } from 'vee-validate';
import { inject, toRef, watch } from 'vue';

const CNAME = 'BaseSignaturePad';

//#region Props
const props = defineProps<{
  name: string;
  label?: string;
  value?: string;
  type?: string;
  rules?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: SignaturePadProps & {
    composables?: {
      toast: any;
    }
    isDarkTheme?: boolean
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
const isDarkTheme = toRef(
  props.componentProps?.isDarkTheme || false,
);
//#endregion Datas

//#region Composables
const {
  value: inputValue,
  errorMessage,
  meta,
  setValue,
  handleChange,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
});

//#endregion Composables

//#region Inject
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
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
watch(() => props.componentProps?.isDarkTheme, (newValue) => {
  isDarkTheme.value = newValue || false;
});
//#endregion Watchers

//#region Methods
const onHandleChange = (value: string | Blob | undefined | null) => {
  console.log(`[${CNAME}]:onHandleChange:`, value);
  handleChange(value);

  emits('handle-change', {
    value,
    cb: setValue,
  });
};
//#endregion Methods
</script>

<style scoped></style>
