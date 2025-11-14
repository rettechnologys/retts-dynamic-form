<template>
  <div>
    <TabView>
      <TabPanel
        v-for="(tab, i) in props.tabs"
        :key="i"
        :header="tab.title"
        style="padding: 0"
      >
        <template #default>
          <slot
            :name="parseTitle(tab.id)"
            :tab="{
              title: tab.title,
              index: i,
              schema: tab.formSchema,
            }"
          ></slot>
        </template>
      </TabPanel>
    </TabView>
    <slot name="footer"> </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  tabs: {
    type: Array as any,
    required: true,
  },
  formSchema: {
    type: Object,
  },
});

const parseTitle = (title: string) => {
  return title.toLowerCase().replace(/ /g, '-');
};
</script>

<style>
.p-tabview .p-tabview-panels {
  padding: 0;
}
</style>
