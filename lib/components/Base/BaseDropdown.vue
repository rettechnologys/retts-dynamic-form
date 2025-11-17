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
      <Dropdown
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        ref="inputRef"
        v-model="inputValue"
        :option-label="'text'"
        :option-value="'value'"
        :panel-class="[props.datatable ? 'hidden' : '']"
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
        @focus="onFocus"
        @before-show="onDropdownClick"
        @before-hide="onBeforeHide"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        v-bind="props?.componentProps"
      >
        <!-- Filter Icon Slot -->
        <template v-if="props.lazy" #filtericon>
          <i
            :class="[
              'pi-icon text-400',
              props.componentProps?.loading
                ? 'pi-icon pi pi-spin pi-spinner'
                : 'pi pi-search',
            ]"
          />
        </template>
        <!-- Filter Option Slot -->
        <template
          v-if="slots && slots.option && !props.datatable"
          #option="slotProps"
        >
          <component :is="slots.option" v-bind="{ data: slotProps.option }" />
        </template>
        <!-- Value Slot -->
        <template v-if="slots && slots.value" #value="slotProps">
          <span v-if="!slotProps.value">{{ slotProps.placeholder }}</span>
          <component v-else :is="slots.value" v-bind="{ data: slotProps }" />
        </template>
      </Dropdown>
    </div>

    <small
      :data-testid="`errorMessage_${name.replace(/[\[\]']+/g, '')}`"
      class="p-error"
      :class="[errorInputClass ? errorInputClass : '']"
    >
      {{ errorMessage }}
    </small>
  </div>
  <OverlayPanel
    ref="datatableOverlay"
    appendTo="body"
    :style="{ width: `${pWidth}px` }"
  >
    <component
      v-if="props.datatable && props.datatableNode"
      :is="props.datatableNode"
      :title="name + 'datatable'"
      @handle-select-all-change="onDatatableItemChange"
      @handle-row-unselect="onDatatableItemChange"
    />
  </OverlayPanel>
  <DynamicField
    v-if="dependantFields && fieldsRef && fieldsRef.length > 0"
    :fields="fieldsRef"
  />
</template>

<script setup lang="ts">
import {
  HandleDependantFields,
  LazyFilterMatch,
  RemoteFilterMatchMode,
} from '../../DynamicForm/helper/index';
import type {
  IFormDependantFields,
  IFormField,
  IOptionSelect,
} from '../../types/Form';;
import { useDebounceFn, useElementSize } from '@vueuse/core';
import { FilterService } from 'primevue/api';
import type { DropdownFilterEvent, DropdownProps } from 'primevue/dropdown';
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
  () => import('../../DynamicForm/DynamicField.vue') as any,
);

defineOptions({ name: 'BaseDropdown', inheritAttrs: false });
//#region Props
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
  fieldArrIndex?: number;
  lazy?: boolean;
  datatable?: boolean | null;
  datatableNode?: any | VNode | undefined;
  keysToExtract?: string[];
  componentProps?: DropdownProps;
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
      fieldArrIndex?: number;
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
      currentValue?: any;
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
const inputRef = ref();

//#region Composables
const { width: pWidth } = useElementSize(inputRef);
const {
  value: inputValue,
  errorMessage,
  handleChange,
  meta,
} = useField(name, rules, {
  initialValue: value?.value,
  label: label,
});

//#region Injects
const resetField = inject('setFieldValue') as (e: string, v: any) => void;

//#region Lifecycle
onMounted(() => {
  if (lazy.value && !isDatatable.value) {
    FilterService.register(RemoteFilterMatchMode, LazyFilterMatch);
    // Trigger the initial fetch data
    emits('handle-filter', {
      event: {
        originalEvent: undefined,
        value: '',
      },
      name: name.value,
      currentValue: inputValue.value,
    });
  } else if (isDatatable.value) {
    emits('handle-init-datatable', {
      name: name.value,
    });
  }
});

//#region Watchers
watch(
  inputValue,
  (newVal, oldVal) => {
    if (dependantFields.value && dependantFields.value.length > 0) {
      if (!newVal && name.value.includes('.')) {
        resetField(name.value.replace(/\..*$/, ''), undefined);
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

//#region Methods
const onHandleSelect = (e: any) => {
  const selectedData = props.componentProps?.options?.find(
    (v) =>
      v[
        `${
          props.componentProps?.optionValue
            ? props.componentProps?.optionValue
            : 'value'
        }`
      ] == e.value,
  );

  if (!props.datatable) {
    emits('handle-select', {
      value: selectedData,
      cb: resetField,
      name: name.value,
      waterfallFields: waterfallFields.value,
    });
  }
};

const onHandleFilter = useDebounceFn((event: DropdownFilterEvent) => {
  if (!event.value) {
    emits('handle-filter', {
      event,
      name: name.value,
      currentValue: inputValue.value,
    });
    return;
  } else if (event.value?.length > 3) {
    emits('handle-filter', {
      event,
      name: name.value,
      currentValue: inputValue.value,
    });
  }
}, 1000);

const onShow = (e: Event) => {
  datatableOverlay.value.toggle(e);
};

const onBeforeHide = () => {
  if (isDatatable.value) {
    inputRef.value.$el.removeEventListener('click', onShow);
  }
};

const onFocus = (): void => {
  FilterService.register(RemoteFilterMatchMode, () => true);
  if (!datatableOverlay.value || !props.datatable) return undefined;
  else {
    inputRef.value.$el.addEventListener('click', onShow);
  }
};
const onDropdownClick = (): void => {
  if (!datatableOverlay.value || !props.datatable) return undefined;
  else {
    inputRef.value.onFocus();
  }
};

const onDatatableItemChange = (event: any) => {
  if (!event || !event.length) {
    handleChange(undefined);
  } else {
    handleChange(
      event[0][props.componentProps?.optionValue as string] ?? 'value',
    );
  }
  datatableOverlay.value.hide();

  emits('handle-select', {
    value: event,
    cb: resetField,
    name: name.value,
    waterfallFields: props.waterfallFields,
  });
};
</script>

<style scoped></style>
