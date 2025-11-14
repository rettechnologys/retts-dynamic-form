<template>
  <!-- Tabs mode -->
  <TabView
    v-if="mode === 'tabs'"
    v-model:active-index="activeStepsRef"
    @update:active-index="onTabsChange"
    :scrollable="true"
    class="col-12"
  >
    <TabPanel
      v-for="(tab, i) in tabs"
      :key="tab.label"
      :header="!tab?.headerSlots?.header ? tab.label : ''"
      contentClass="py-3"
    >
      <template v-if="tab?.headerSlots?.header" #header>
        <component
          :is="tab.headerSlots.header"
          v-bind="{
            index: i,
            active: activeStepsRef,
            headerIcon: tab?.headerSlots?.headerIcon,
            headerIconClass: tab?.headerSlots?.headerIconClass,
            headerClass: tab?.headerSlots?.headerClass,
            headerTitleClass: tab?.headerSlots?.headerTitleClass,
            headerTitle: tab?.label,
          }"
        />
      </template>
      <DynamicField :fields="tab.fields" :is-view-mode="props.isViewMode" />
    </TabPanel>
  </TabView>
  <!-- Stepper mode -->
  <div class="col-12" v-else-if="mode === 'steps'">
    <Steps v-model:activeStep="activeStepsRef" :model="tabs">
      <template #item="slotProps">
        <component
          v-if="tabs[activeStepsRef]?.headerSlots?.header"
          :is="slotProps.item.headerSlots.header"
          v-bind="{
            ...slotProps,
            active: activeStepsRef,
            headerIcon: slotProps.item.headerSlots?.headerIcon,
            headerIconClass: slotProps.item.headerSlots?.headerIconClass,
            headerClass: slotProps.item.headerSlots?.headerClass,
            headerTitleClass: slotProps.item?.headerSlots?.headerTitleClass,
            headerTitle: slotProps.item.label,
            clickCallback: () => onTabsChange(slotProps.index),
          }"
        />
        <component
          v-else
          :is="h(DefaultStepperHeader)"
          v-bind="{
            ...slotProps,
            active: activeStepsRef,
            headerIcon: slotProps.item.headerSlots?.headerIcon,
            headerIconClass: slotProps.item.headerSlots?.headerIconClass,
            headerClass: slotProps.item.headerSlots?.headerClass,
            headerTitleClass: slotProps.item?.headerSlots?.headerTitleClass,
            headerTitle: slotProps.item.label,
            clickCallback: () => onTabsChange(slotProps.index),
          }"
        />
      </template>
    </Steps>
    <div class="formgrid grid p-2 pt-4">
      <DynamicField
        :fields="tabs[activeStepsRef]!.fields"
        :isViewMode="props.isViewMode"
      />
      <Divider />
      <div :class="['', buttonActionsClass ? buttonActionsClass : '']">
        <Button
          v-if="activeStepsRef > 0"
          class="mr-3"
          label="Previous"
          :severity="'secondary'"
          data-testid="prev-step-button"
          @click="onPrevStep"
        />
        <Button
          v-if="activeStepsRef < tabs.length - 1"
          label="Next"
          :severity="'info'"
          iconPos="right"
          data-testid="next-step-button"
          @click="onNextStep"
        />
        <Button
          v-if="activeStepsRef === tabs.length - 1 && !props.isViewMode"
          :class="[
            'button',
            buttonSubmitClass ? buttonSubmitClass : 'submit-btn',
          ]"
          :label="
            buttonSubmitLabel
              ? buttonSubmitLabel
              : 'Submit'
          "
          iconPos="right"
          data-testid="submit-form-button"
          :loading="formStateRef === 'submiting'"
          type="submit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  IFormFieldTabsWithFields,
  IFormStatus,
  IFormTabsModes,
} from '../../types/Form';;
import { defineAsyncComponent, h, ref, watch } from 'vue';
import DefaultStepperHeader from './components/DefaultStepperHeader.vue';

const DynamicField = defineAsyncComponent(() => import('../DynamicField.vue'));

//#region Props
const props = withDefaults(
  defineProps<{
    tabs: IFormFieldTabsWithFields[];
    mode?: IFormTabsModes;
    formActionsClass?: string;
    buttonActionsClass?: string;
    buttonSubmitType?: any;
    buttonSubmitClass?: string;
    buttonSubmitLabel?: string;
    formStateRefStatus?: IFormStatus;
    tabsLinear?: boolean;
    activeSteps?: number;
    isViewMode?: boolean;
  }>(),
  {
    tabs: () => [],
    mode: 'tabs',
    tabsLinear: false,
    activeSteps: 0,
    isViewMode: false,
  },
);
//#endregion Props

//#region Emits
const emit = defineEmits([
  'onSubmit',
  'onNextStep',
  'onPrevStep',
  'onTabsChange',
]);
//#endregion

//#region Data
const formStateRef = ref(props.formStateRefStatus);
const activeStepsRef = ref(props.activeSteps);
//#endregion

//#region Methods
const onNextStep = () => {
  emit('onNextStep', activeStepsRef.value + 1, 'next');
};
const onPrevStep = () => {
  emit('onPrevStep', activeStepsRef.value - 1, 'prev');
};

const onTabsChange = (index: number) => {
  emit('onTabsChange', index);
};
//#endregion

//#region Watcher
watch(
  () => props.formStateRefStatus,
  (newFormState) => {
    formStateRef.value = newFormState;
  },
);
watch(
  () => props.activeSteps,
  (newFormState) => {
    activeStepsRef.value = newFormState;
  },
  {
    immediate: true,
  },
);
</script>

<style scoped>
.submit-btn.invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}
</style>
