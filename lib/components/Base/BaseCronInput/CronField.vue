<template>
  <InputGroup
    v-for="field in props.fields"
    :key="field.type"
    :class="field?.class || colSpan"
  >
    <InputNumber
      v-if="field.type !== 'dayWeek' && field.type !== 'month'"
      :key="`${field.type}__input`"
      :name="field.type"
      :placeholder="field.addOn"
      :min="0"
      :max="field.type === 'minute' ? 59 : field.type === 'day' ? 31 : 23"
      v-model="modelValue[field.type]"
    />
    <Dropdown
      v-else
      v-model="modelValue[field.type]"
      :key="`${field.type}__dropdown`"
      :options="field.options"
      :name="field.type"
      option-label="text"
      option-value="value"
    />
    <InputGroupAddon>{{ limitCharStr(field.addOn, 4) }} </InputGroupAddon>
  </InputGroup>
</template>

<script setup lang="ts">
import { limitCharStr } from '@retts-packages/utilities-helper';
import { computed, toRef } from 'vue';

//#region Props
const props = defineProps<{
  modelValue: any;
  fields: {
    type: 'minute' | 'hour' | 'day' | 'dayWeek' | 'month';
    addOn: string;
    options?: any[];
    class?: string;
  }[];
}>();

const colSpan = computed(() => {
  return `col-${Math.ceil(8 / props.fields.length)}`;
});

const modelValue = toRef(props, 'modelValue');
</script>

<style scoped></style>
