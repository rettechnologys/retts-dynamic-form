<template>
  <BlockUI :blocked="formState.status === 'submiting'" fullScreen>
    <div v-if="formStateRef.status === 'submiting'">
      <ProgressBar
        v-if="!formStateRef.uploadProgress"
        mode="indeterminate"
        style="height: 10px"
        class="mb-2"
      />
      <ProgressBar
        v-else
        :value="formStateRef.uploadProgress"
        style="height: 10px; font-size: 10px"
        class="mb-2"
      />
    </div>

    <div :class="[containerClass ? containerClass : 'card border-none p-0']">
      <h4 v-if="title" class="flex justify-content-center m-0 mb-3">
        {{ title }}
      </h4>
      <form
        data-testid="dynamicForm"
        class="form"
        @keydown.enter.prevent="submitOnEnter ? fnHandleSubmit() : null"
        @submit="fnHandleSubmit"
      >
        <span v-if="formStateRef.status === 'failure' && formStateRef.message">
          <DynamicFailMsg
            :message="formStateRef.message"
            :fields="formSchema.fields || tabSchemaFields || []"
            @event-close="formStateRef = initialFormState"
          />
        </span>
        <slot>
          <div :class="['formgrid grid p-2', formClass ? formClass : '']">
            <DynamicField
              v-if="formSchema?.fields"
              :fields="formSchema?.fields"
              :isViewMode="props.isViewMode"
            />
            <DynamicTabsField
              v-else-if="formSchema?.tabs"
              :tabs="formSchema.tabs"
              :mode="tabsMode"
              :form-state-ref-status="formStateRef.status"
              :buttonSubmitType="buttonSubmitType"
              :buttonSubmitClass="buttonSubmitClass"
              :buttonSubmitLabel="buttonSubmitLabel"
              :formActionsClass="formActionsClass"
              :buttonActionsClass="buttonActionsClass"
              :active-steps="activeSteps"
              :isViewMode="props.isViewMode"
              @onNextStep="fnHandleSteps"
              @onPrevStep="fnHandleSteps"
              @onTabsChange="fnHandleTabsChange"
            />
            <div class="col-12 my-2" :class="props.isViewMode ? 'hidden' : ''">
              <Divider v-if="tabsMode !== 'steps'" />
            </div>
            <div
              v-if="tabsMode !== 'steps' || !props.schema?.tabs"
              :class="[
                'col-12',
                props.isViewMode ? 'hidden' : '',
                formActionsClass ? formActionsClass : '',
              ]"
            >
              <div :class="[buttonActionsClass ? buttonActionsClass : '']">
                <slot
                  name="form-actions-start"
                  :handleSubmit="handleSubmit"
                ></slot>
                <Button
                  ref="submitBtnRef"
                  v-if="!buttonSubmitHide"
                  :type="buttonSubmitType ? buttonSubmitType : 'submit'"
                  data-testid="buttonSubmit"
                  :class="[
                    'button submit-btn',
                    buttonSubmitClass ? buttonSubmitClass : '',
                  ]"
                  :label="
                    buttonSubmitLabel
                      ? buttonSubmitLabel
                      : 'Submit'
                  "
                  iconPos="right"
                  :loading="formStateRef.status === 'submiting'"
                >
                </Button>
                <Button
                  v-if="!buttonResetHide"
                  data-testid="buttonReset"
                  :class="[
                    'button',
                    buttonResetClass
                      ? buttonResetClass
                      : 'ml-3 p-button-secondary p-button-outlined',
                  ]"
                  :type="buttonResetType ? buttonResetType : 'reset'"
                  :label="
                    buttonResetLabel
                      ? buttonResetLabel
                      : 'Reset'
                  "
                  @click="fnHandleResetForm"
                />
                <slot
                  name="form-actions-end"
                  :handleSubmit="handleSubmit"
                ></slot>
              </div>
            </div>
          </div>
        </slot>
      </form>
    </div>
  </BlockUI>
</template>

<script setup lang="ts">
//#region Imports
// import { useConfirmationService } from '@/composables/prime';
// import { PRIME } from '@/config';
// import i18n from '@/plugins/i18nPlugin';
import {
  type FormSchemaWithFields,
  type FormSchemaWithTabs,
  type IFormState,
  type IFormTabsModes,
  initialFormState,
} from '../types/Form';;
import BlockUI from 'primevue/blockui';
import { useToast } from 'primevue/usetoast';
import { useForm } from 'vee-validate';
import { computed, onBeforeUnmount, provide, ref, toRef, watch } from 'vue';
import DynamicFailMsg from './DynamicFailMsg.vue';
import DynamicField from './DynamicField.vue';
import DynamicTabsField from './DynamicTabsField/DynamicTabsField.vue';
import { useConfirmationService } from '../composables/prime';
//#endregion Imports

const CNAME = 'DynamicForm' as const;

//#region Props
const props = defineProps<{
  formState: IFormState;
  schema: FormSchemaWithFields | FormSchemaWithTabs;
  title?: string;
  initialValues?: object;
  tabsMode?: IFormTabsModes;
  tabsLinear?: boolean;
  containerClass?: string;
  formClass?: string;
  formActionsClass?: string;
  buttonActionsClass?: string;
  buttonSubmitType?: any;
  buttonSubmitClass?: string;
  buttonSubmitLabel?: string;
  buttonSubmitHide?: boolean;
  buttonResetType?: any;
  buttonResetClass?: string;
  buttonResetLabel?: string;
  buttonResetHide?: boolean;
  disabled?: boolean;
  isConfirmSubmit?: boolean;
  isViewMode?: boolean;
  submitOnEnter?: boolean;
}>();
//#endregion Props

//#region Datas
const submitBtnRef = ref();
const activeSteps = ref(0);
const formState = toRef(props, 'formState');
const formStateRef = ref(formState.value);
const initialValues = toRef(props, 'initialValues');
//#endregion Datas

//#region computed
/**
 * Vee-Validate form
 * Returns the current schema based on the active tab.
 * If the tabsMode is "steps", it returns the schema of the active tab.
 * Otherwise, it returns undefined.
 */
const currentSchema = computed(() => {
  if (props.tabsMode === 'steps' && props.schema?.tabs) {
    // Get the fields of the active tab
    console.log(props.schema);
    const activeTabFields = props.schema?.tabs[activeSteps.value]!.fields;

    // Create a schema object with the rules of each field
    const schema = activeTabFields.reduce((acc: Record<string, any>, field) => {
      // If the field is a nested tab, iterate over its fields and add their rules to the schema
      if (
        field.name === 'tabs' &&
        field.props.field &&
        field.props.field.length > 0
      ) {
        field?.props?.field.forEach((tab: any) => {
          tab.fields.forEach((subField: any) => {
            acc[subField.name] = subField.rules;
          });
        });
      } else {
        // Otherwise, add the field's own rules to the schema
        acc[field.name] = field.rules;
      }
      return acc;
    }, {});

    return schema;
  } else {
    // If the tabsMode is not "steps", return undefined
    return undefined;
  }
});

/**
 * Form State Message
 * Flattens the schema by iterating over each tab and field.
 * If the field has nested tabs, it recursively flattens the tabs.
 * Otherwise, it returns the field itself.
 *
 * @returns An array of flattened fields with their tabIndex property.
 */
const tabSchemaFields = computed(() => {
  return (
    props.schema?.tabs?.flatMap((tab, i) =>
      // Iterate over each field in the tab
      tab.fields.flatMap((field) => {
        // If the field has nested tabs, recursively flatten them
        if (field.name === 'tabs' && field.props.fields) {
          return field.props.fields.flatMap((tabField: any) =>
            // Iterate over each field in the nested tab
            tabField.fields.map((fieldChild: any) => ({
              // Return the field with its tabIndex property
              ...fieldChild,
              tabIndex: i,
            })),
          );
        } else {
          // Otherwise, return the field itself with its tabIndex property
          return [{ ...field, tabIndex: i }];
        }
      }),
    ) || [] // Return an empty array if there are no fields
  );
});

const formSchema = computed(() => {
  return props.schema;
});
//#endregion

//#region Composables
const toast = useToast();
const { resetForm, handleSubmit, setFieldValue, setValues, values } = useForm({
  initialValues: initialValues,
  // validationSchema: currentSchema,
  validateOnMount: false,
  keepValuesOnUnmount: true,
});
const confirmation = useConfirmationService();
//#endregion Composables

//#region Provide
provide('setFieldValue', setFieldValue);
provide('formValues', values);
//#endregion

//#region Emits
const emits = defineEmits<{
  (event: 'handle-submit', payload: any): void;
}>();
//#endregion Emits

//#region Lifecycle Hooks
onBeforeUnmount(() => {
  console.log(
    `[${CNAME}]:onBeforeUnmount:formStateRef:before:`,
    formStateRef.value,
  );
  console.log(`[${CNAME}]:onBeforeUnmount:formState:`, formState.value);
  formStateRef.value = { ...initialFormState };
  console.log(
    `[${CNAME}]:onBeforeUnmount:formStateRef:after:`,
    formStateRef.value,
  );
  console.log(`[${CNAME}]:onBeforeUnmount:${new Date().getTime()}`);
});

//#region Methods
const fnHandleInvalidSubmit = ({ values, errors, results }: any) => {
  console.log('fnHandleInvalidSubmit', values); // current form values

  if (
    props?.schema?.tabs &&
    props?.schema?.tabs?.length > 0 &&
    props.tabsMode !== 'steps'
  ) {
    const firstErrorTabIndex = tabSchemaFields.value.find((field) =>
      Object.keys(errors).includes(field.name),
    )?.tabIndex;

    activeSteps.value = firstErrorTabIndex || 0;
  }

  toast.add({
    severity: 'error',
    summary: 'Error',
    detail: 'Invalid form submission. Please check the fields.',
    life: 3000,
  });

  formStateRef.value = {
    status: 'failure',
  };

  submitBtnRef.value.$el.classList.add('invalid');

  setTimeout(() => {
    submitBtnRef.value.$el.classList.remove('invalid');
  }, 1000);
};

const fnHandleSubmit = handleSubmit((values, actions) => {
  if (
    props.tabsMode === 'steps' &&
    props?.schema?.tabs &&
    activeSteps.value !== props?.schema.tabs.length - 1
  ) {
    activeSteps.value += 1;
    formStateRef.value = initialFormState;
    return;
  }

  if (props.isConfirmSubmit) {
    confirmation.saveProceed({
      accept: async () => {
        formStateRef.value = {
          status: 'submiting',
        };

        emits('handle-submit', values);
      },
    });
  } else {
    formStateRef.value = {
      status: 'submiting',
    };

    emits('handle-submit', values);
  }
}, fnHandleInvalidSubmit);

const fnHandleResetForm = () => {
  resetForm();
  formStateRef.value = initialFormState;
  console.log('fnHandleResetForm');
};

const fnHandleSteps = (index: number, steps: string) => {
  if (steps === 'next') {
    fnHandleSubmit();
    // activeSteps.value = index;
  } else if (steps === 'prev') {
    console.log('prev', index);
    activeSteps.value = index;
    formStateRef.value = initialFormState;
  }
};

const fnHandleTabsChange = (index: number) => {
  activeSteps.value = index;
};
//#endregion Methods

//#region Watchers
watch(initialValues, async (newVal: any) => {
  console.log(`[${CNAME}]:watch:initialValues`, newVal);
  setValues(newVal, false);
});

watch(
  formState,
  (newVal) => {
    console.log('watch:formState', newVal);
    formStateRef.value = newVal;
    if (newVal.isReset) {
      fnHandleResetForm();
    }
  },
  { immediate: true },
);
//#endregion Watchers
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
