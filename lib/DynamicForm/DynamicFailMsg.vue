<template>
  <Message
    data-testid="dynamicFailMsg"
    severity="error"
    style="padding: 0"
    :sticky="true"
    :closable="true"
    @close="$emit('event-close')"
  >
    <template #messageicon>
      <span></span>
    </template>

    <div v-if="formatedFailureMessage" v-html="formatedFailureMessage"></div>
    <div v-else>Invalid Form</div>
  </Message>
</template>

<script setup lang="ts">
//#region Imports
import { parseFailureMessageFromFields } from '../helpers/Form';
import type { IFormField, IMessage } from '../types/Form';;
import { computed, ref, watch } from 'vue';
//#endregion Imports

//#region Props
const props = defineProps<{
  message: IMessage;
  fields: IFormField[];
}>();
//#endregion Props

//#region Datas
const message = ref<IMessage>(props.message);
//#endregion Datas

//#region Emits
const emits = defineEmits<{
  (event: 'event-close'): void;
}>();
//#endregion Emits

//#region Computeds
const formatedFailureMessage = computed(() => {
  return parseFailureMessageFromFields(message.value, props.fields);
});
//#endregion Computeds

//#region Watchers
watch(
  () => props.message,
  (value) => {
    message.value = value;
  },
);
//#endregion Watchers
</script>

<style>
/* .p-message .p-message-wrapper {
  padding: 0rem 1rem 0rem 0rem !important;
} */

/* @layer primevue {
  .p-message .p-message-wrapper {
    padding: 0;
  }
} */
</style>
