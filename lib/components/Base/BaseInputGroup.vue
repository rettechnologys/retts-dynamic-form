<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ props.label }}
    </label>
    <InputGroup
      :data-testid="`${name.replace(/[\[\]']+/g, '')}_loader`"
      :class="[
        'flex',
        parentInputClass ? parentInputClass : '',
        rules?.includes('Async') && meta.pending ? ' p-input-icon-right' : '',
      ]"
    >
      <InputGroupAddon v-if="props.startAddon" class="p-inputgroup-addon">
        <!-- <i class="pi pi-user"></i> -->
        <span>{{ props.startAddon }}</span>
      </InputGroupAddon>
      <InputText
        v-if="isLazyValidation"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :value="inputValue"
        @change="handleChange"
        @blur="handleBlur"
        :placeholder="placeholder"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props?.componentProps"
      />
      <InputText
        v-else
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        v-model="inputValue"
        :placeholder="placeholder"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        v-bind="props?.componentProps"
      />

      <InputGroupAddon v-if="props.endAddon">
        <span>{{ props.endAddon }}</span>
      </InputGroupAddon>
    </InputGroup>

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
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
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
  startAddon?: string;
  endAddon?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: InputTextProps;
}>();

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
  handleBlur,
  handleChange,
  meta,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
  validateOnMount: false,
});
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

watch(
  inputValue,
  (newValue) => {
    if (newValue) {
      if (props.type === 'url' && newValue.match(/^(http|https):\/\//i)) {
        inputValue.value = newValue.replace(/^(http|https):\/\//i, '');
      }
    }
  },
  { immediate: true },
);

//#endregion Watchers
</script>

<style scoped></style>
