<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <Skeleton
      v-if="props.lazy && props.componentProps?.loading"
      height="3rem"
      width="50%"
    />
    <div
      v-else
      :data-testid="`${name.replace(/[\[\]']+/g, '')}_loader`"
      :class="['flex', parentInputClass ? parentInputClass : '']"
    >
      <SelectButton
        :id="name.replace(/[\[\]']+/g, '')"
        :name="name"
        ref="acRef"
        v-model="inputValue"
        :class="[
          inputClass ? inputClass : '',
          meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
        ]"
        @change="onHandleSelect"
        :data-testid="name.replace(/[\[\]']+/g, '')"
        :ariaLabelledby="name.replace(/[\[\]']+/g, '')"
        v-bind="props?.componentProps"
      >
        <!-- Filter Option Slot -->
        <template v-if="slots && slots.option" #option="slotProps">
          <component :is="slots.option" v-bind="{ data: slotProps }" />
        </template>
        <!-- Value Slot -->
      </SelectButton>
    </div>

    <small
      :data-testid="`errorMessage_${name.replace(/[\[\]']+/g, '')}`"
      class="p-error"
      :class="[errorInputClass ? errorInputClass : '']"
    >
      {{ errorMessage }}
    </small>
    <DynamicField
      v-if="dependantFields && fieldsRef && fieldsRef.length > 0"
      :fields="fieldsRef"
    />
  </div>
</template>

<script setup lang="ts">
import { HandleDependantFields } from '../../DynamicForm/helper/index';
import type {
  IFormDependantFields,
  IFormField,
  IOptionSelect,
} from '../../types/Form';;
import type { DropdownFilterEvent } from 'primevue/dropdown';
import type { SelectButtonProps } from 'primevue/selectbutton';
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

defineOptions({ name: 'BaseSelectButton', inheritAttrs: false });

//#region Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value?: any | any[] | undefined;
  rules?: string | undefined;
  fieldClass?: string | undefined;
  labelClass?: string | undefined;
  parentInputClass?: string | undefined;
  inputClass?: string | undefined;
  errorInputClass?: string | undefined;
  optionSelect?: IOptionSelect[];
  lazy?: boolean;
  componentProps?: SelectButtonProps & { loading?: boolean };
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
const fieldsRef = ref<IFormField[] | undefined>();
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
    // Trigger the initial fetch data
    emits('handle-init-lazy', {
      name: name.value,
    });
  }
});
//#endregion Lifecycle

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
//#endregion Methods
</script>

<style scoped></style>
