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
      <CascadeSelect
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        ref="acRef"
        v-model="inputValue"
        :placeholder="placeholder"
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        @change="onHandleSelect"
        @focus="onFocus"
        @before-show="onDropdownClick"
        @before-hide="onBeforeHide"
        @update:model-value="
          (event: any) =>
            props.datatable ? onDatatableItemChange(event) : undefined
        "
        :pt="{
          list: {
            class:
              props.componentProps?.options &&
              props.componentProps?.options?.length > 10
                ? 'h-20rem overflow-y-auto w-10rem'
                : '',
          },
        }"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        v-bind="props?.componentProps"
      >
        <!--  Option Slot -->
        <template
          v-if="slots && slots.option && !props.datatable"
          #option="slotProps"
        >
          <component :is="slots.option" v-bind="{ data: slotProps }" />
        </template>
        <!-- Value Slot -->
        <template v-if="slots && slots.value" #value="slotProps">
          <span v-if="!slotProps.value">{{ slotProps.placeholder }}</span>
          <component v-else :is="slots.value" v-bind="{ data: slotProps }" />
        </template>
      </CascadeSelect>
    </div>

    <small
      :data-testid="`errorMessage_${name.replace(/[\[\]']+/g, '')}`"
      class="p-error"
      :class="[errorInputClass ? errorInputClass : '']"
    >
      {{ errorMessage }}
    </small>
  </div>
  <OverlayPanel ref="datatableOverlay" appendTo="body">
    <component
      v-if="props.datatableNode && props.datatable"
      :is="props.datatableNode"
      :title="name + 'datatable'"
      @onRowSelectChange="onDatatableItemChange"
    />
  </OverlayPanel>
  <DynamicField
    v-if="dependantFields && fieldsRef && fieldsRef.length > 0"
    :fields="fieldsRef"
  />
</template>

<script setup lang="ts">
import { HandleDependantFields } from '../../DynamicForm/helper/index';
import type {
  IFormDependantFields,
  IFormField,
  IOptionSelect,
} from '../../types/Form';;
import type { CascadeSelectProps } from 'primevue/cascadeselect';
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

defineOptions({ name: 'BaseCascadeSelect', inheritAttrs: false });

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
  datatable?: boolean | null;
  datatableNode?: any | VNode | undefined;
  keysToExtract?: string[];
  componentProps?: CascadeSelectProps;
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
    event: 'handle-init-lazy',
    payload: {
      name: string;
    },
  ): void;
  (
    event: 'handle-init-datatable',
    payload: {
      name: string;
      value?: any;
    },
  ): void;
}>();

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const dependantFields = toRef(props, 'dependantFields');
const waterfallFields = toRef(props, 'waterfallFields');
const lazy = toRef(props, 'lazy');
const isDatatable = toRef(props, 'datatable');
const fieldsRef = ref<IFormField[] | undefined>();
const datatableOverlay = ref();
const acRef = ref();

//#region Composables
const {
  value: inputValue,
  errorMessage,
  handleChange,
  meta,
} = useField(name, rules, {
  initialValue: value?.value,
  label: label,
});
//#endregion Composables

//#region Injects
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
//#endregion Injects

//#region Lifecycle
onMounted(() => {
  if (isDatatable.value) {
    emits('handle-init-datatable', {
      name: name.value,
    });
  }
  if (lazy.value) {
    emits('handle-init-lazy', {
      name: name.value,
    });
  }
});

//#region Watchers
watch(
  inputValue,
  (newVal, oldVal) => {
    if (dependantFields.value && dependantFields.value.length > 0) {
      if (!newVal && props.name.includes('.')) {
        resetField(props.name.replace(/\..*$/, ''), undefined);
        return;
      }
      fieldsRef.value = HandleDependantFields(
        dependantFields.value,
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
//#endregion Watchers

//#region Methods
const onHandleSelect = (e: any) => {
  if (!isDatatable.value) {
    emits('handle-select', {
      value: e.value,
      cb: resetField,
      name: name.value,
      waterfallFields: waterfallFields.value,
    });
  }
};

const onShow = (e: Event) => {
  datatableOverlay.value.toggle(e);
};

const onBeforeHide = () => {
  console.log('onBeforeHide');
  if (isDatatable.value) {
    acRef.value.$el.removeEventListener('click', onShow);
  }
};

const onFocus = (e: Event): void => {
  if (!datatableOverlay.value || !isDatatable.value) return undefined;
  else {
    acRef.value.$el.addEventListener('click', onShow);
  }
};
const onDropdownClick = (): void => {
  if (!datatableOverlay.value || !isDatatable.value) return undefined;
  else {
    acRef.value.onFocus();
  }
};

const onDatatableItemChange = (event: any) => {
  if (!event) {
    handleChange(undefined);
  } else {
    handleChange(event[props.componentProps?.optionValue as string] ?? 'value');
  }
  datatableOverlay.value.hide();

  emits('handle-select', {
    value: event,
    cb: resetField,
    name: name.value,
    waterfallFields: waterfallFields.value,
  });
};
</script>

<style scoped></style>
