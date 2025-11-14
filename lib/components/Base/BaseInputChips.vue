<template>
  <div :class="['field p-fluid', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <div
      :data-testid="`${name.replace(/[\[\]']+/g, '')}_loader`"
      :class="['flex', parentInputClass ? parentInputClass : '']"
    >
      <Chips
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        :type="type"
        v-model="inputValue"
        inputClass="w-full"
        :placeholder="placeholder"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        :invalid="meta.validated ? (meta.valid ? false : true) : false"
        @add="onAdd"
        @click="toggle($event)"
        @remove="restoreActionType"
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
    <OverlayPanel ref="overlay" v-if="defOptions && defOptions?.length > 0">
      <div class="w-full flex flex-column gap-2 w-15rem">
        <div
          v-for="item in defOptions"
          :key="item.text"
          class="hover:cursor-pointer hover:surface-200 p-2 select-none"
          @click="onChipsChange(item.value)"
        >
          {{ item.text }}
        </div>
      </div>
    </OverlayPanel>
  </div>
</template>

<script setup lang="ts">
import type { IOptionSelect } from '../../types/Form';;
import Chips, {
  type ChipsAddEvent,
  type ChipsRemoveEvent,
  type ChipsProps,
} from 'primevue/chips';
import { useToast } from 'primevue/usetoast';
import { useField } from 'vee-validate';
import { computed, ref, toRef, watch } from 'vue';

//* Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: any[];
  type?: string;
  rules?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  disabled?: boolean;
  componentProps?: ChipsProps;
  options?: IOptionSelect[];
}>();

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const defOptions = ref(props.options);
const overlay = ref();
//#endregion Datas

//#region Composables
const toast = useToast();
const {
  value: inputValue,
  errorMessage,
  setValue,
  meta,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
});
//#endregion Composables

//#region Computed
const valueType = computed(() => {
  return typeof props?.options?.[0]?.value;
});
//#endregion Computed

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

watch(
  inputValue,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      newVal.forEach((item) => {
        if (defOptions.value?.find((opt) => opt.value === item)) {
          defOptions.value = defOptions.value?.filter(
            (opt) => opt.value !== item,
          );
        }
      });
    }
  },
  { immediate: true },
);
//#endregion Watchers

//#region Methods
const toggle = (event: any | null) => {
  if (!overlay.value) {
    return;
  }
  overlay.value.toggle(event);
};

const onAdd = (e: ChipsAddEvent) => {
  const newValue =
    valueType.value === 'string'
      ? e.value[e.value.length - 1]
      : +e.value[e.value.length - 1];
  const existingValues = e.value
    .slice(0, e.value.length - 1)
    .filter((v: any) => v !== undefined);
  if (isNaN(newValue) && valueType.value === 'number') {
    setValue(existingValues);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Invalid input',
      life: 3000,
    });
  } else if (existingValues.includes(newValue)) {
    setValue(existingValues);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Already added',
      life: 3000,
    });
  } else if (!isNaN(newValue)) {
    setValue([...existingValues, newValue]);
  }
};

const onChipsChange = (e: any) => {
  if (inputValue.value && inputValue.value.length > 0) {
    if (inputValue.value.includes(e)) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Already added',
        life: 3000,
      });
    }
    setValue([...inputValue.value, e]);
  } else {
    setValue([e]);
  }
  if (defOptions.value && defOptions.value)
    defOptions.value = defOptions.value?.filter((opt) => opt.value !== e);
};

const restoreActionType = (e: ChipsRemoveEvent) => {
  const val = props?.options
    ? props?.options.find((opt) => opt.value === e.value[0])
    : undefined;
  if (props.options && val) {
    defOptions.value = defOptions.value?.concat({
      text: val.text,
      value: e.value[0],
    });
  }
};
//#endregion Methods
</script>

<style scoped></style>
