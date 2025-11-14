<template>
  <Button
    @click="props.clickCallback"
    :class="['p-menuitem-link z-1 border-0 p-0', props.headerClass]"
  >
    <span
      :class="[
        'p-steps-number inline-flex align-items-center justify-content-center align-items-center border-circle border-1 h-3rem w-3rem z-1 cursor-pointer',
        ,
        {
          'bg-primary  border-primary': props.index <= props.active,
          'surface-overlay ': props.index > props.active,
        },
      ]"
    >
      <i v-if="props.headerIcon" :class="[props.headerIcon, 'text-xl']" />
      <span v-else>{{ props.index + 1 }}</span>
    </span>
    <span
      :class="[
        'p-steps-title',
        headerTitleClass,
        {
          'text-primary font-semibold': props.index <= props.active,
          'text-500': props.active,
        },
      ]"
      >{{ props.headerTitle }}</span
    >
  </Button>
</template>

<script setup lang="ts">
import type { IFormTabsHeaderProps } from '../../../types/Form';;
const props = defineProps<IFormTabsHeaderProps>();
</script>

<style scoped></style>
