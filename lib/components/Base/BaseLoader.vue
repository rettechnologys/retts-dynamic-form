<template>
  <div class="flex justify-content-center align-items-center flex-column">
    <ProgressSpinner />
    <span :class="['', messageClass ? messageClass : '']">
      {{ props.message ?? 'Loading Data' }}
    </span>
  </div>
</template>

<script setup lang="ts">
//#region Imports
//#endregion Imports

//#region Props
const props = defineProps<{
  message?: string | undefined;
  messageClass?: string | undefined;
}>();
//#endregion Props
</script>

<style scoped></style>
