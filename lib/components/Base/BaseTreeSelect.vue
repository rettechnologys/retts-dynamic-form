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
      :class="['flex', parentInputClass ? parentInputClass : '']"
    >
      <TreeSelect
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        ref="acRef"
        v-model="inputValue"
        :placeholder="placeholder"
        :filter="props?.lazy ? true : false"
        :filter-match-mode="props?.lazy ? RemoteFilterMatchMode : 'contains'"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        @change="onHandleSelect"
        @filter="onHandleFilter"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        v-bind="props?.componentProps"
      >
      </TreeSelect>
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
    v-if="dependantFields && fieldsRef && fieldsRef.length > 0"
    :fields="fieldsRef"
  />
</template>

<script setup lang="ts">
import {
  HandleDependantFields,
  RemoteFilterMatchMode,
} from '../../DynamicForm/helper/index';
import type {
  IFormDependantFields,
  IFormField,
  IOptionSelect,
} from '../../types/Form';;
import { useDebounceFn } from '@vueuse/core';
import { FilterService } from 'primevue/api';
import type { DropdownFilterEvent } from 'primevue/dropdown';
import type { TreeSelectProps } from 'primevue/treeselect';
import { useField } from 'vee-validate';
import {
  defineAsyncComponent,
  inject,
  onMounted,
  ref,
  toRef,
  watch,
  type VNode,
} from 'vue';
const DynamicField = defineAsyncComponent(
  () => import('../../DynamicForm/DynamicField.vue'),
);

defineOptions({ name: 'BaseDropdown', inheritAttrs: false });

//* Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value?: any | undefined;
  rules?: string | undefined;
  fieldClass?: string | undefined;
  labelClass?: string | undefined;
  parentInputClass?: string | undefined;
  inputClass?: string | undefined;
  errorInputClass?: string | undefined;
  optionSelect?: IOptionSelect[];
  lazy?: boolean;
  componentProps?: TreeSelectProps;
  slots?: { [key: string]: VNode | undefined };
  dependantFields?: IFormDependantFields[];
  waterfallFields?: string[];
}>();

//#region Emits
const emits = defineEmits<{
  (
    event: 'handle-select',
    payload: {
      value: any;
      cb?: (e: string, v: any) => void;
      name?: string;
      waterfallFields?: string[];
    },
  ): void;
  (
    event: 'handle-filter',
    payload: {
      event: {
        originalEvent?: DropdownFilterEvent['originalEvent'] | undefined;
        value: any;
      };
      name?: string;
    },
  ): void;
  (
    event: 'handle-init-lazy',
    payload: {
      name: string;
      value?: any;
    },
  ): void;
}>();
//#endregion Emits

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const fieldsRef = ref<IFormField[]>();
const acRef = ref();
//#endregion Datas

//#region Composables
const {
  value: inputValue,
  errorMessage,
  meta,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
});
//#endregion Composables

//#region Injects
const resetField = inject('setFieldValue') as (e: string, v: any) => void;

//#region Lifecycle
onMounted(() => {
  if (props?.lazy) {
    FilterService.register(RemoteFilterMatchMode, () => true);
    // Trigger the initial fetch data
    emits('handle-init-lazy', {
      name: name.value,
    });
  }
});

//#region Watchers
watch(
  inputValue,
  (newVal, oldVal) => {
    if (props.dependantFields && props.dependantFields.length > 0) {
      if (!newVal && props.name.includes('.')) {
        resetField(props.name.replace(/\..*$/, ''), undefined);
        return;
      }
      fieldsRef.value = HandleDependantFields(
        props.dependantFields,
        newVal,
        oldVal,
        resetField,
      );
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
//#endregion Watchers

//#region Methods
const onHandleSelect = (e: any) => {
  emits('handle-select', {
    value: e.value,
    cb: resetField,
    name: props.name,
    waterfallFields: props.waterfallFields,
  });
};

const onHandleFilter = useDebounceFn((event: DropdownFilterEvent) => {
  if (!event.value) {
    emits('handle-filter', {
      event,
      name: props.name,
    });
    return;
  } else if (event.value?.length > 3) {
    emits('handle-filter', {
      event,
      name: props.name,
    });
  }
}, 1000);
//#endregion Methods
</script>

<style scoped></style>
