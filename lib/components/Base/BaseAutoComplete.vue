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
      <AutoComplete
        :id="name.replace(regexDataId, '')"
        :name="name"
        ref="inputRef"
        v-model="inputValue"
        :forceSelection="true"
        :input-class="['w-full', inputClass ? inputClass : '']"
        :input-props="{
          readonly: props.datatable ? true : false,
        }"
        :panelClass="[props.datatable ? 'hidden' : '']"
        :placeholder="placeholder"
        :class="[
          'w-full',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        :suggestions="suggestions"
        :data-testid="name.replace(regexDataId, '')"
        aria-haspopup="true"
        aria-controls="overlay_panel"
        @focus="onFocus"
        @item-select="handleItemSelect"
        @item-unselect="handleItemUnselect"
        @dropdown-click="handleDropdownClick"
        @complete="handleFilter"
        v-bind="props?.componentProps"
      >
        <!-- Options -->
        <template
          v-if="
            props?.slots ||
            props?.slots?.option ||
            props.componentProps?.optionLabel
          "
          #option="slotProps"
        >
          <span v-if="props.componentProps?.optionLabel && !props.slots">{{
            slotProps.option[props.componentProps?.optionLabel as string]
          }}</span>
          <!-- TODO: Implement dynamic components -->
          <component :is="props.slots?.option" v-bind="{ data: slotProps }" />
        </template>

        <!-- Datatable -->
        <template v-if="props.datatable" #dropdownicon>
          <i class="pi pi-table" />
        </template>
      </AutoComplete>
    </div>

    <small
      :data-testid="`errorMessage_${name.replace(regexDataId, '')}`"
      class="p-error"
      :class="[errorInputClass ? errorInputClass : '']"
    >
      {{ errorMessage }}
    </small>
  </div>
  <OverlayPanel
    ref="datatableOverlay"
    appendTo="body"
    @show="() => (isVisible = true)"
    @hide="() => (isVisible = false)"
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
import { useElementSize } from '@vueuse/core';
import type {
  AutoCompleteCompleteEvent,
  AutoCompleteItemSelectEvent,
  AutoCompleteItemUnselectEvent,
  AutoCompleteProps
} from 'primevue/autocomplete';
import AutoComplete from 'primevue/autocomplete';
import OverlayPanel from 'primevue/overlaypanel';
import { useField } from 'vee-validate';
import { inject, onMounted, ref, toRef, watch, type VNode } from 'vue';
import DynamicField from '../../DynamicForm/DynamicField.vue';
import {
  extractKeysFromObject,
  HandleDependantFields,
} from '../../DynamicForm/helper/index';
import type { IFormDependantFields, IFormField } from '../../types/Form';
;

defineOptions({ name: 'BaseAutoComplete', inheritAttrs: false });

//* Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value?: string | string[] | undefined;
  rules?: string | undefined;
  fieldClass?: string | undefined;
  labelClass?: string | undefined;
  parentInputClass?: string | undefined;
  inputClass?: string | undefined;
  errorInputClass?: string | undefined;
  datatable?: boolean | null;
  datatableNode?: any | VNode | undefined;
  keysToExtract?: string[];
  componentProps?: AutoCompleteProps & {
    optionValue?: string;
  };
  slots?: {
    chip?: VNode;
    option?: VNode;
    value?: VNode;
  };
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
    event: 'handle-unselect',
    payload: {
      value: any;
      cb?: (e: string, v: any) => void;
      name?: string;
      waterfallFields?: string[];
    },
  ): void;
  (
    event: 'handle-search',
    payload: {
      event: AutoCompleteCompleteEvent;
      name?: string;
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

//* Data
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const dependantFields = toRef(props, 'dependantFields');
const waterfallFields = toRef(props, 'waterfallFields');
const isDatatable = toRef(props, 'datatable');
const fieldsRef = ref<IFormField[] | undefined>();
const datatableOverlay = ref<InstanceType<typeof OverlayPanel>>();
const inputRef = ref();
const isVisible = ref(false);
const suggestions = ref(props.componentProps?.suggestions || []);
// eslint-disable-next-line no-useless-escape
const regexDataId = new RegExp(/[\[\]']+/g);

//#region Composables
const { width: pWidth } = useElementSize(inputRef);
const {
  value: inputValue,
  errorMessage,
  handleChange,
  meta,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
});

//#region Injects
const resetField = inject('setFieldValue') as (e: string, v: any) => void;

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

//#region Lifecycle
onMounted(() => {
  if (isDatatable.value) {
    emits('handle-init-datatable', {
      name: name.value,
      value: inputValue.value,
    });
  }
});

//#region Methods
const handleItemSelect = (e: AutoCompleteItemSelectEvent) => {
  console.log('handleItemSelect', e);
  emits('handle-select', {
    value: e.value,
    cb: resetField,
    name: name.value,
    waterfallFields: waterfallFields.value,
  });
};
const handleItemUnselect = (e: AutoCompleteItemUnselectEvent) => {
  emits('handle-unselect', {
    value: e.value,
    cb: resetField,
    name: name.value,
    waterfallFields: waterfallFields.value,
  });
};

const handleFilter = (event: AutoCompleteCompleteEvent) => {
  emits('handle-search', {
    event,
    name: name.value,
  });
};

const onShow = (e: Event) => {
  if (!datatableOverlay.value) return;
  if (isVisible.value && datatableOverlay.value) {
    datatableOverlay.value.hide();
  } else {
    datatableOverlay.value.show(e);
  }
};

const onFocus = (): void => {
  if (!datatableOverlay.value || !props.datatable) return undefined;
  else {
    inputRef.value.$el.addEventListener('click', onShow);
  }
};
const handleDropdownClick = (): void => {
  emits('handle-init-datatable', {
    name: name.value,
  });

  if (!datatableOverlay.value || !props.datatable) return;
  else {
    inputRef.value.onFocus();
    suggestions.value = [];
    console.log('inputRef', inputRef.value);
  }
};

const onDatatableItemChange = (payload: any) => {
  if (props.componentProps?.multiple) {
    const parsed = payload.map((item: any) => {
      if (props.keysToExtract && props.keysToExtract.length > 0)
        return extractKeysFromObject(item, props.keysToExtract);
      else {
        return item;
      }
    });

    handleChange(parsed);

    if (datatableOverlay.value) datatableOverlay.value.hide();
    emits('handle-select', {
      value: payload,
      cb: resetField,
      name: name.value,
      waterfallFields: waterfallFields.value,
    });
  } else {
    console.log('payload', payload);
    handleChange(
      props?.keysToExtract && props.keysToExtract.length > 0
        ? extractKeysFromObject(payload[0], props.keysToExtract as string[])
        : payload[0],
    );
    if (datatableOverlay.value) datatableOverlay.value.hide();
    emits('handle-select', {
      value: payload[0],
      cb: resetField,
      name: name.value,
      waterfallFields: waterfallFields.value,
    });
  }
};
</script>

<style>
.p-autocomplete-multiple-container {
  width: 100% !important;
}
</style>
