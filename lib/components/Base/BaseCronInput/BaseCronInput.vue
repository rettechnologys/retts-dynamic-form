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
      :class="['flex ', parentInputClass ? parentInputClass : '']"
    >
      <div class="col-3 pl-0">
        <Dropdown
          :id="name.replace(/[\[\]']+/g, '')"
          :name="name"
          ref="inputRef"
          v-model="cycle"
          :option-label="'text'"
          :option-value="'value'"
          :options="cycleTypeOptions"
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
          :data-testid="name.replace(/[\[\]']+/g, '')"
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
      <CronField :fields="cronSchema" :modelValue="cronValue" />
    </div>
    <InputText
      v-model="inputValue"
      class="w-full mt-3"
      :size="'small'"
      :disabled="true"
    />

    <small :data-testid="`errorMessage_${name.replace(/[\[\]']+/g, '')}`">
      {{ cronExpression }}
    </small>
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
import { RemoteFilterMatchMode } from '../../../DynamicForm/helper/index';
import type { IFormDependantFields, IOptionSelect } from '../../../types/Form';
import { useDebounceFn } from '@vueuse/core';
import cronstrue from 'cronstrue/i18n';
import type {
  DropdownChangeEvent,
  DropdownFilterEvent,
  DropdownProps,
} from 'primevue/dropdown';
import { useField } from 'vee-validate';
import {
  computed,
  inject,
  onMounted,
  reactive,
  ref,
  toRef,
  watch,
  type VNode,
} from 'vue';
import CronField from './CronField.vue';

defineOptions({ name: 'BaseCronInput', inheritAttrs: false });
const CNAME = 'BaseCronInput';
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
const inputRef = ref();
const cronSchema = ref<
  {
    type: 'minute' | 'hour' | 'day' | 'dayWeek' | 'month';
    addOn: string;
    options?: IOptionSelect[];
    class?: string;
  }[]
>([
  { type: 'hour', addOn: 'Hour' },
  { type: 'minute', addOn: 'Minute' },
]);

const cycleTypeOptions = ref([
  { text: 'Daily', value: 'daily' },
  { text: 'Weekly', value: 'weekly' },
  { text: 'Monthly', value: 'monthly' },
  { text: 'N Days', value: 'nDays' },
  { text: 'N Hours', value: 'nHours' },
]);
const daysOptions = ref([
  { text: 'Sunday', value: 0 },
  { text: 'Monday', value: 1 },
  { text: 'Tuesday', value: 2 },
  { text: 'Wednesday', value: 3 },
  { text: 'Thursday', value: 4 },
  { text: 'Friday', value: 5 },
  { text: 'Saturday', value: 6 },
]);

//* Crons Data
const cycle = ref<
  string | undefined | 'daily' | 'weekly' | 'monthly' | 'nDays' | 'nHours'
>(cycleTypeOptions.value[0]!.value);
const cronValue = reactive<{
  hour: number | undefined;
  minute: number | undefined;
  dayWeek: number | undefined;
  day: number | undefined;
  month: number | undefined;
}>({
  hour: 1,
  minute: 30,
  dayWeek: undefined,
  day: undefined,
  month: undefined,
});
//#endregion Datas

//#region Composables
const {
  value: inputValue,
  errorMessage,
  handleChange,
  setValue,
  meta,
} = useField(name, rules, {
  initialValue: value?.value,
  label: label,
});

//#region Injects
const resetField = inject('setFieldValue') as (e: string, v: any) => void;

//#region Computed
const cronExpression = computed(() => {
  return parseCronValue();
});

//#region Lifecycle
onMounted(() => {
  if (inputValue?.value) {
    parseCronExpression(inputValue?.value);
    cycle.value = getCycleTypeFromCron(inputValue?.value);
    initCronSchema();
  }
});
//#endregion Lifecycle

//#region Watchers
watch(
  () => value?.value,
  (newValue) => {
    if (newValue) {
      console.log(`[${CNAME}]:value: ${newValue}`);
      value.value = newValue;
      inputValue.value = newValue;
    }
  },
  { immediate: true },
);

watch(
  () => inputValue?.value,
  (newValue) => {
    if (newValue) {
      console.log(`[${CNAME}]:value: ${newValue}`);
      parseCronExpression(newValue);
      cycle.value = getCycleTypeFromCron(newValue);
      parseCronValue();
      // initCronSchema();
    }
  },
  { immediate: true },
);
//#endregion Watchers

//#region Methods
const onHandleSelect = (e: DropdownChangeEvent) => {
  console.log(`[${CNAME}]:onHandleSelect:`, e.value);
  resetCronValue();
  switch (e.value as string) {
    case 'daily':
      cronSchema.value = [
        { type: 'hour', addOn: 'Hour' },
        { type: 'minute', addOn: 'Minute' },
      ];
      cronValue.hour = 1;
      cronValue.minute = 30;
      break;
    case 'weekly':
      cronSchema.value = [
        { type: 'dayWeek', addOn: 'Day', options: daysOptions.value },
        { type: 'hour', addOn: 'Hour' },
        { type: 'minute', addOn: 'Minute' },
      ];
      cronValue.dayWeek = 1;
      cronValue.hour = 1;
      cronValue.minute = 30;
      break;
    case 'monthly':
      cronSchema.value = [
        {
          type: 'day',
          addOn: 'Day',
        },
        { type: 'hour', addOn: 'Hour' },
        { type: 'minute', addOn: 'Minute' },
      ];
      cronValue.day = 1;
      cronValue.hour = 1;
      cronValue.minute = 30;
      break;
    case 'nDays':
      cronSchema.value = [
        { type: 'day', addOn: 'Day' },
        { type: 'hour', addOn: 'Hour' },
        { type: 'minute', addOn: 'Minute' },
      ];
      cronValue.day = 1;
      cronValue.hour = 1;
      cronValue.minute = 30;
      break;
    case 'nHours':
      cronSchema.value = [
        { type: 'hour', addOn: 'Hour', class: 'col-3' },
        { type: 'minute', addOn: 'Minute', class: 'col-3' },
      ];
      cronValue.hour = 1;
      cronValue.minute = 0;
      break;
  }

  emits('handle-select', {
    value: e.value,
    cb: resetField,
    name: name.value,
    waterfallFields: undefined,
  });
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

function parseCronValue() {
  const min = cronValue.minute === undefined ? '*' : cronValue.minute;
  const hour = cronValue.hour === undefined ? '*' : cronValue.hour;
  const day = cronValue.day === undefined ? '*' : cronValue.day;
  const dayWeek = cronValue.dayWeek === undefined ? '*' : cronValue.dayWeek;

  let val;
  switch (cycle.value) {
    case 'daily':
      val = `${min} ${hour} * * *`;
      break;
    case 'weekly':
      val = `${min} ${hour} * * ${dayWeek}`;
      break;
    case 'monthly':
      val = `${min} ${hour} ${day} * *`;
      break;
    case 'nDays':
      val = `${min} ${hour} */${day} * *`;
      break;
    case 'nHours':
      val = `${min} */${hour} * * *`;
      break;
    default:
      val = inputValue.value;
  }

  setValue(val);

  const parsed = cronstrue.toString(val, {
    locale: 'id',
    verbose: true,
  });

  return parsed;
}

const resetCronValue = () => {
  cronValue.day = undefined;
  cronValue.hour = undefined;
  cronValue.minute = undefined;
  cronValue.month = undefined;
  cronValue.dayWeek = undefined;
};

function initCronSchema() {
  switch (cycle.value as string) {
    case 'daily':
      cronSchema.value = [
        { type: 'hour', addOn: 'Hour' },
        { type: 'minute', addOn: 'Minute' },
      ];
      break;

    case 'weekly':
      cronSchema.value = [
        { type: 'dayWeek', addOn: 'Day', options: daysOptions.value },
        { type: 'hour', addOn: 'Hour' },
        { type: 'minute', addOn: 'Minute' },
      ];
      break;

    case 'monthly':
      cronSchema.value = [
        {
          type: 'day',
          addOn: 'Day',
        },
        { type: 'hour', addOn: 'Hour' },
        { type: 'minute', addOn: 'Minute' },
      ];
      break;

    case 'nDays':
      cronSchema.value = [
        { type: 'day', addOn: 'Day' },
        { type: 'hour', addOn: 'Hour' },
        { type: 'minute', addOn: 'Minute' },
      ];
      break;

    case 'nHours':
      cronSchema.value = [
        { type: 'hour', addOn: 'Hour', class: 'col-3' },
        { type: 'minute', addOn: 'Minute', class: 'col-3' },
      ];
      break;
  }
}

function getCycleTypeFromCron(cronExpression: string) {
  // Daily: Matches cron expressions like "0 0 * * *" for every day at midnight
  if (/^(\d+)\s(\d+)\s\*\s\*\s\*$/.test(cronExpression)) {
    return 'daily';
  }

  // Weekly: Matches cron expressions like "0 0 * * 0" for every Sunday at midnight
  if (/^(\d+)\s(\d+)\s\*\s\*\s(\d+)$/.test(cronExpression)) {
    return 'weekly';
  }

  // Monthly: Matches cron expressions like "0 0 1 * *" for the first of each month at midnight
  if (/^(\d+)\s(\d+)\s(\d+)\s\*\s\*$/.test(cronExpression)) {
    return 'monthly';
  }

  // N Days: Matches cron expressions like "0 0 */N * *" for every N days
  if (/^(\d+)\s(\d+)\s\*\/(\d+)\s\*\s\*$/.test(cronExpression)) {
    return 'nDays';
  }

  // N Hours: Matches cron expressions like "0 */N * * *" for every N hours
  if (/^(\d+)\s\*\/(\d+)\s\*\s\*\s\*$/.test(cronExpression)) {
    return 'nHours';
  }

  return undefined; // Return null if no match is found
}

function parseCronExpression(expression: string) {
  const [minute, hour, day, month, dayWeek] = expression
    .split(' ')
    .map((val) => {
      if (val === '*') {
        return undefined;
      }
      if (val.includes('*/')) {
        return parseInt(val.replace('*/', ''), 10);
      }

      return parseInt(val, 10);
    });

  cronValue.minute = minute;
  cronValue.hour = hour;
  cronValue.day = day;
  cronValue.month = month;
  cronValue.dayWeek = dayWeek;
}
//#endregion Methods
</script>

<style scoped></style>
