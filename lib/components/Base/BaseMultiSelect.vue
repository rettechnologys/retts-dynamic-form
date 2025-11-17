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
      <MultiSelect
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        v-model="inputValue"
        ref="inputRef"
        :filterMatchMode="lazy ? 'allow-all' : 'contains'"
        :panel-class="props.datatable ? 'hidden' : ''"
        :placeholder="placeholder"
        :option-label="'text'"
        :option-value="'value'"
        :empty-filter-message="
          props.componentProps?.loading && filterMessage.length > 2
            ? 'Loading...'
            : ''
        "
        :class="[
          'w-full',
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        @change="onHandleSelect"
        @filter="onHandleFilter"
        @focus="onFocus"
        @before-hide="onBeforeHide"
        @before-show="onDropdownClick"
        @update:model-value="
          (event: any) =>
            props.datatable ? onDatatableItemChange(event) : undefined
        "
        v-bind="props.componentProps"
      >
        <template v-if="props.lazy" #filtericon>
          <i
            :class="[
              'pi-icon text-400  p-multiselect-filter-icon',
              props.componentProps?.loading && props.lazy
                ? 'pi-icon pi pi-spin pi-spinner'
                : 'pi pi-search',
            ]"
          />
        </template>
        <template v-if="slots && slots?.chip" #chip="slotProps">
          <component
            v-if="typeof slots.chip === 'function'"
            :is="(slots.chip as any)(slotProps)"
          />
          <component v-else :is="slots.chip" v-bind="{ data: slotProps }" />
        </template>
        <template v-if="slots && slots?.value" #value="slotProps">
          <component
            v-if="typeof slots.value === 'function'"
            :is="(slots.value as any)(slotProps)"
          />
          <component v-else :is="slots.value" v-bind="{ data: slotProps }" />
        </template>
        <template v-if="slots && slots?.option" #option="slotProps">
          <component :is="slots.option" v-bind="{ data: slotProps.option }" />
        </template>
      </MultiSelect>
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
</template>

<script setup lang="ts">
import {
  LazyFilterMatch,
  RemoteFilterMatchMode,
} from '../../DynamicForm/helper/index';
import type { IOptionSelect } from '../../types/Form';;
import { useElementSize } from '@vueuse/core';
import { useDebounceFn } from '@vueuse/core';
import { FilterService } from 'primevue/api';
import type {
  MultiSelectChangeEvent,
  MultiSelectFilterEvent,
  MultiSelectProps,
} from 'primevue/multiselect';
import MultiSelect from 'primevue/multiselect';
import { useField } from 'vee-validate';
import type { VNode } from 'vue';
import { inject, onMounted, ref, toRef } from 'vue';

defineOptions({ name: 'BaseMultiSelect', inheritAttrs: false });

// const CNAME = 'BaseMultiSelect' as const;

//#region Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value?: any[] | undefined;
  rules?: string | undefined;
  fieldClass?: string | undefined;
  labelClass?: string | undefined;
  parentInputClass?: string | undefined;
  inputClass?: string | undefined;
  errorInputClass?: string | undefined;
  lazy?: boolean;
  datatable?: boolean;
  datatableNode?: any | VNode | undefined;
  keysToExtract?: string[];
  optionSelect?: IOptionSelect[];
  componentProps?: MultiSelectProps;
  slots?: { [key: string]: VNode | undefined };
}>();
//#endregion Props

//#region Emits
const emits = defineEmits<{
  (
    event: 'handle-select',
    payload: {
      value: any[];
      cb?: (e: string, v: any) => void;
      name?: string;
    },
  ): void;
  (
    event: 'handle-filter',
    payload: {
      event: {
        originalEvent?: MultiSelectFilterEvent['originalEvent'] | undefined;
        value: any;
      };
      name?: string;
      currentValue?: any[];
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
//#endregion Emits

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const filterMessage = ref('');
const datatableOverlay = ref();
const inputRef = ref();
const { width: pWidth } = useElementSize(inputRef);
const lazy = toRef(props, 'lazy');
//#endregion Datas

//#region Injects
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
FilterService.register(RemoteFilterMatchMode, LazyFilterMatch);

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

//#region Lifecycle
onMounted(() => {
  if (props?.lazy && !props.datatable) {
    // Trigger the initial fetch data
    emits('handle-filter', {
      event: {
        originalEvent: undefined,
        value: '',
      },
      name: name.value,
    });
  } else if (props.datatable) {
    emits('handle-init-datatable', {
      name: name.value,
    });
  }
});
//#endregion Lifecycle

//#region Methods
const onHandleSelect = (e: MultiSelectChangeEvent) => {
  emits('handle-select', {
    value: e.value,
    cb: resetField,
    name: props.name,
  });
};

const onHandleFilter = useDebounceFn((event: MultiSelectFilterEvent) => {
  filterMessage.value = event.value;
  if (!event.value) {
    emits('handle-filter', {
      event,
      name: props.name,
      currentValue: inputValue.value,
    });
    return;
  } else if (event.value?.length > 2) {
    emits('handle-filter', {
      event,
      name: props.name,
      currentValue: inputValue.value,
    });
  } else {
    console.log('Filter message is too short:', event.value);
  }
}, 1000);

const onShow = (e: Event) => {
  datatableOverlay.value.toggle(e);
};

const onBeforeHide = () => {
  if (props.datatable) {
    inputRef.value.$el.removeEventListener('click', onShow);
  }
};

const onFocus = (): void => {
  //* Re-register the filter if component is called from overlay
  FilterService.register(RemoteFilterMatchMode, LazyFilterMatch);

  if (!datatableOverlay.value || !props.datatable) return undefined;
  else {
    emits('handle-init-datatable', {
      name: name.value,
    });
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
  if (!event?.length) {
    emits('handle-select', {
      value: [],
      cb: resetField,
      name: props.name,
    });
    handleChange(undefined);
  } else {
    const values = event.map((item: any) => {
      return props.componentProps?.optionValue
        ? (item[props.componentProps?.optionValue as string] ?? 'value')
        : item;
    });
    handleChange(values);
    emits('handle-select', {
      value: event,
      cb: resetField,
      name: props.name,
    });
  }

  datatableOverlay.value.hide();
};
//#endregion Methods
</script>

<style scoped></style>
