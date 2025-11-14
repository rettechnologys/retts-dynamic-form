<template>
  <Fieldset :legend="label" :toggleable="true">
    <div data-testid="div-data" v-for="(field, idx) in fields" :key="field.key">
      <!-- <DynamicField2
        v-for="(arr, idxArray) in (fieldArray as IFormField[])"
        :key="idxArray"
        :fields="[
          Object.assign({ ...arr }, { name: `${name}[${idx}].${arr.name}` }),
        ]"
      /> -->

      <div v-if="idx === 0 && atLeastOne" />

      <div v-else class="flex h-fit justify-content-end mt-2">
        <Button
          data-testid="button-remove"
          class="p-button-sm p-button-danger"
          icon="pi pi-trash"
          @click="remove(idx)"
        />
      </div>
    </div>

    <div class="mt-2" />

    <div class="flex justify-content-end">
      <Button
        data-testid="button-add"
        class="p-button-sm p-button-success"
        icon="pi pi-plus"
        @click="push({})"
      />
    </div>
  </Fieldset>
</template>

<script setup lang="ts">
import type { IFormField } from '../../types/Form';;
import { useFieldArray } from 'vee-validate';
import { onMounted, toRef } from 'vue';
// import DynamicField from '../Dynamic/DynamicField.vue';
import Fieldset from 'primevue/fieldset';
// import DynamicField2 from '../Dynamic/DynamicField2.vue';

//* Props
const props = defineProps<{
  name: string;
  label?: string | undefined;
  atLeastOne?: boolean;
  rules?: string | undefined;
  fieldArray?: IFormField[];
}>();

//* Data
const name = toRef(props, 'name');

const { remove, push, fields } = useFieldArray(name);

//#region LifeCycle
onMounted(() => {
  if (props.atLeastOne && props.rules === 'required') {
    push({});
  }
});
</script>

<style scoped lang="scss"></style>
