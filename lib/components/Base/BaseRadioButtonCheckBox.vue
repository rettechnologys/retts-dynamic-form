<template>
  <div class="field-checkbox field-radiobutton flex-1">
    <component
      :is="type"
      :inputId="id.replace(/[\[\]']+/g, '')"
      :name="name"
      :disabled="disabled"
      :value="value"
      v-model="inputValue"
      :class="['m-0 mr-1', inputClass ? inputClass : '']"
      :data-testid="id.replace(/[\[\]']+/g, '')"
      :binary="typeof value === 'boolean' ? true : false"
    />
    <label
      :for="id.replace(/[\[\]']+/g, '')"
      :class="['ml-0', parentInputClass ? parentInputClass : '']"
      :title="text"
    >
      {{ text }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useField } from 'vee-validate';

//* Props
const props = defineProps<{
  id: string;
  name: string;
  text: string;
  label?: string | undefined;
  value?: string | boolean | number | string[] | number[] | undefined;
  type?: 'checkbox' | 'radio' | 'default' | undefined;
  rules?: string | undefined;
  parentInputClass?: string | undefined;
  inputClass?: string | undefined;
  disabled?: boolean;
}>();

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
//#endregion Datas

const { value: inputValue } = useField(name, rules, {
  label: label,
  type: props.type,
  checkedValue: value.value,
});
</script>

<style scoped></style>
