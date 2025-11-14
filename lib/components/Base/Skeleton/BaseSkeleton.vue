<template>
  <Skeleton v-if="!props.template" v-bind="props" />
  <template v-else>
    <!-- Card Style -->
    <ul v-if="props.template === 'card'" class="m-0 p-0 list-none w-full">
      <li
        v-for="i in props.repeat"
        :key="i"
        class="flex mb-3 p-3 border-bottom-1 border-200"
      >
        <Skeleton
          v-if="props.cardStyle?.circleHeader"
          shape="circle"
          size="4rem"
          class="mr-2"
          v-bind="props.cardStyle?.circleHeader"
        ></Skeleton>
        <div class="align-self-start" style="flex: 1">
          <div class="align-self-start" style="flex: 1">
            <Skeleton
              v-for="i in props.cardStyle?.rectangleHeader?.repeat"
              :key="i"
              width="75%"
              class="mb-2"
              v-bind="props.cardStyle?.rectangleHeader"
            ></Skeleton>
          </div>
          <div>
            <Skeleton
              v-for="i in props.cardStyle?.rectangleBody?.repeat"
              :key="i"
              width="100%"
              class="mb-2"
              height="4rem"
              v-bind="props.cardStyle?.rectangleBody"
            ></Skeleton>
          </div>
        </div>
      </li>
    </ul>
    <!-- List Style -->
    <ul v-else-if="props.template === 'list'" class="m-0 p-0 list-none w-full">
      <li
        class="mb-3 p-3 border-bottom-1 border-200"
        v-for="i in props?.repeat"
        :key="i"
      >
        <div class="flex">
          <Skeleton
            shape="circle"
            size="4rem"
            class="mr-2"
            v-bind="props.listStyle?.circleStyle"
          ></Skeleton>
          <div class="align-self-center" style="flex: 1">
            <Skeleton
              v-for="i in props.listStyle?.rectangleStyle?.repeat"
              :key="i"
              width="100%"
              class="mb-2"
              v-bind="props.listStyle?.rectangleStyle"
            ></Skeleton>
          </div>
        </div>
      </li>
    </ul>
  </template>
</template>

<script setup lang="ts">
import Skeleton,  {type SkeletonProps } from 'primevue/skeleton';

interface ISkeletonProps extends SkeletonProps {
  template?: 'card' | 'list';
  cardStyle?: {
    circleHeader?: SkeletonProps & { class?: string };
    rectangleHeader?: SkeletonProps & { class?: string; repeat?: number };
    rectangleBody?: SkeletonProps & { class?: string; repeat?: number };
  };
  listStyle?: {
    circleStyle?: SkeletonProps & { class?: string; repeat?: number };
    rectangleStyle?: SkeletonProps & { class?: string; repeat?: number };
  };
  repeat?: number;
}
const props = withDefaults(defineProps<ISkeletonProps>(), {
  cardStyle: () => ({
    rectangleBody: {
      repeat: 1,
    },
    rectangleHeader: {
      repeat: 1,
    },
  }),

  listStyle: () => ({
    rectangleStyle: {
      repeat: 1,
    },
  }),
  repeat: 3,
});
</script>

<style scoped></style>
