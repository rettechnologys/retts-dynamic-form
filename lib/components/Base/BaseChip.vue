<template>
  <Chip v-bind="props">
    <img
      v-if="props.image"
      class="p-chip-image"
      :alt="props.label"
      crossorigin="anonymous"
      v-lazy="props.image"
    />
    <span class="p-chip-text">{{ props.label }}</span>
  </Chip>
</template>

<script setup lang="ts">
import type { ChipProps } from 'primevue/chip';

const props = defineProps<ChipProps>();

console.log(`[BASECHIPS]:props:`, props.image);
</script>

<style scoped></style>
