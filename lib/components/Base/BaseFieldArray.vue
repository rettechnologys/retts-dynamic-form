<!-- eslint-disable vue/no-unused-vars -->
<template>
  <!-- Fieldset -->
  <Fieldset v-if="displayMode === 'fieldset'" :legend="label" :toggleable="true" :disabled="disabled">
    <div data-testid="div-data" v-for="(field, idx) in fields" class="grid mt-2" :key="field.key">
      <DynamicField v-for="(arr, idxArray) in fieldArray as IFormField[]" :key="idxArray" :fields="[
          Object.assign(
            { ...arr },
            { name: `${name}[${idx}].${arr.name}` },
            {
              props: {
                ...arr.props,
                disabled: disabled || arr.props?.disabled,
              },
            },
            {
              fieldArrIndex: idx,
            },
          ),
        ]" />

      <div v-if="idx === 0 && props.atLeastOne" />

      <div v-else class="col-12 pb-2 flex h-fit justify-content-end mt-2">
        <Button v-if="showButton" data-testid="button-remove" class="p-button-sm p-button-danger" icon="pi pi-trash"
          @click="remove(idx)" />
      </div>
      <Divider v-if="idx !== fields.length - 1" />
    </div>

    <div class="mt-2" />

    <div class="flex justify-content-end">
      <Button v-if="showButton" data-testid="button-add" class="p-button-sm p-button-success" icon="pi pi-plus"
        @click="onAddField()" />
    </div>
  </Fieldset>
  <!-- Draggable -->
  <Fieldset v-else-if="displayMode === 'draggable'" :legend="label" :toggleable="true" :disabled="disabled" :pt="{
      toggleableContent: { class: 'p-3' },
    }">
    <draggable v-model="fields" @start="isDragging = true" @end="onHandleMove" item-key="orderNo" :force-fallback="true"
      @choose="isDragging = true" @unchoose="isDragging = false">
      <template #item="{ index: idx }">
        <div class="flex align-items-center mb-4">
          <i class="inline pi pi-arrows-v text-xl w-2rem mr-4 top-50" />
          <div class="grid card w-full" :style="isDragging ? 'cursor: grabbing' : 'cursor: grab'">
            <DynamicField v-for="(arr, idxArray) in fieldArray as IFormField[]" :key="idxArray" :fields="[
                Object.assign(
                  { ...arr },
                  { name: `${name}[${idx}].${arr.name}` },
                  {
                    props: {
                      ...arr.props,
                      disabled: disabled || arr.props?.disabled,
                    },
                  },
                  {
                    fieldArrIndex: idx,
                  },
                ),
              ]" />
            <div v-if="idx === 0 && props.atLeastOne" />

            <div v-else class="col-12 pb-2 flex h-fit justify-content-end mt-2">
              <Button v-if="showButton" data-testid="button-remove" class="p-button-sm p-button-danger"
                icon="pi pi-trash" @click="remove(idx)" />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-content-end mt-4">
          <Button v-if="showButton" data-testid="button-add" class="p-button-sm p-button-success" icon="pi pi-plus"
            @click="onAddField()" />
        </div>
      </template>
    </draggable>
  </Fieldset>
  <template v-else>
    <!-- Datatable -->
    <div v-if="displayMode === 'table'" class="p-datatable p-component">
      <div class="p-datatable-table-wrapper">
        <table class="p-datatable-table">
          <!-- Header -->
          <thead class="p-datatable-thead">
            <tr>
              <template v-for="(col, i) in columns">
                <th class="p-datatable-header-cell" :key="i" v-if="
                    !(
                      col.form?.type === 'header' ||
                      col.form?.type === 'footer' ||
                      col.form?.parentFieldClass?.includes('hidden')
                    )
                  ">
                  <div class="p-datatable-column-header-content">
                    <span class="p-column-title">{{ col.header }}</span>
                  </div>
                </th>
              </template>
            </tr>
          </thead>
          <!-- Body -->
          <tbody v-if="rowGroup" class="p-datatable-tbody">
            <!-- Row Group -->
            <template v-for="(header, i) in iRowGroupHeaderValues" :key="i">
              <tr class="p-rowgroup-header" :class="[header.class || '', i % 2 === 0 ? 'p-even' : 'p-odd']"
                :style="(header.style as any) || undefined">
                <td :colspan="colSpan">
                  <div class="flex align-items-center justify-content-between p-2">
                    <span class="font-bold">
                      {{ header.value }}
                    </span>
                    <Button rounded icon="pi pi-plus" size="small" @click="onAddFieldDT(header.value)" />
                  </div>
                </td>
              </tr>
              <!-- Content -->
              <tr v-for="(field, j) in fields" :key="j" class="">
                <template v-if="
                    (field?.value as any)[groupRowsBy as string] ===
                    header.value
                  ">
                  <template v-for="(col, c) in columns">
                    <td v-if="
                        !(
                          col?.form?.type === 'header' ||
                          col?.form?.type === 'footer' ||
                          col.form?.parentFieldClass?.includes('hidden')
                        )
                      " :key="c" style="vertical-align: top" :style="col?.style || {}"
                      :class="[col?.form?.fieldClass, ' ']">
                      <div v-if="
                          col?.bodyComponent &&
                          !(col?.type === 'header' || col?.type === 'footer')
                        ">
                        <component v-if="typeof col?.bodyComponent === 'function'" :is="
                            col.bodyComponent({
                              field,
                              index: j,
                              setValue: update,
                            })
                          " v-bind="{
                            ...col.form,
                            name: `${name}[${j}].${col.form?.name}`,
                          }" />
                      </div>
                      <template v-else>
                        <DynamicField v-if="
                            col &&
                            col?.form &&
                            !(col?.type === 'header' || col?.type === 'footer')
                          " :fields="
                            [
                              Object.assign(
                                { ...col.form },
                                { name: `${name}[${j}].${col.form?.name}` },
                              ),
                            ] as any
                          " />
                      </template>
                    </td>
                  </template>
                </template>
              </tr>
            </template>
          </tbody>
          <tbody v-else class="p-datatable-tbody">
            <tr v-for="(field, j) in fields" :key="j" :class="[j % 2 === 0 ? 'p-even' : 'p-odd']">
              <td v-for="(col, c) in columns" :key="c" :style="col?.style || {}">
                <DynamicField v-if="col && col?.form" :fields="
                    [
                      Object.assign(
                        { ...col.form },
                        { label: undefined },
                        { name: `${name}[${j}].${col.form?.name}` },
                      ),
                    ] as any
                  " />
                <div if="col?.bodyComponent">
                  <component v-if="typeof col?.bodyComponent === 'function'"
                    :is="col.bodyComponent({ field, index: j })" v-bind="{ rowData: { data: field, index: j } }" />
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot class="p-datatable-footer">
            <tr>
              <template v-for="(col, i) in columns">
                <td :colspan="colSpan" v-if="
                    col &&
                    col?.form?.type === 'footer' &&
                    !col?.form?.parentFieldClass?.includes('hidden')
                  " :key="i">
                  <div class="flex justify-content-end p-3">
                    <component v-if="typeof col?.bodyComponent === 'function'" :is="col.bodyComponent(fields)"
                      v-bind="{ ...col.form }" />
                    <component v-else :is="col.bodyComponent" v-bind="fields" />
                  </div>
                </td>
              </template>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <template v-else>
      <div data-testid="div-data" v-for="(field, idx) in fields" class="grid" :key="field.key">
        <DynamicField v-for="(arr, idxArray) in fieldArray as IFormField[]" :key="idxArray" :fields="[
            Object.assign(
              { ...arr },
              { name: `${name}[${idx}].${arr.name}` },
              {
                fieldArrIndex: idx,
              },
            ),
          ]" />

        <div v-if="idx === 0 && props.atLeastOne" />

        <div v-else class="col-12 pb-2 flex h-fit justify-content-end mt-2">
          <Button v-if="showButton" data-testid="button-remove" class="p-button-sm p-button-danger" icon="pi pi-trash"
            @click="remove(idx)" />
        </div>
      </div>

      <div class="mt-2" />

      <div class="flex justify-content-end">
        <Button v-if="showButton" data-testid="button-add" class="p-button-sm p-button-success" icon="pi pi-plus"
          @click="push({})" />
      </div>
    </template>
  </template>
</template>

<script setup lang="ts">
import DynamicField from '../../dynamicfield';
import type { IFormField, TRowGroupHeaderValues } from '../../types/Form';;
import Button from 'primevue/button';
import type { ColumnProps } from 'primevue/column';
import type { FieldsetProps } from 'primevue/fieldset';
import { useFieldArray } from 'vee-validate';
import { computed, h, onMounted, ref, toRef, watch } from 'vue';
import draggable from 'vuedraggable';
import { useConfirmationService, useToastService } from '../../composables/prime';

const CNAME = 'BaseFieldArray';
//#region Props
interface Props {
  name: string;
  label?: string | undefined;
  atLeastOne?: boolean;
  showOne?: boolean;
  value?: any;
  showButton?: boolean;
  fieldArray?: IFormField[];
  disabled?: boolean;
  display?: 'table' | 'fieldset' | 'draggable' | 'none';
  rowGroup?: boolean;
  rowGroupHeaderValues?: TRowGroupHeaderValues[];
  groupRowsBy?: string;
  componentProps?: FieldsetProps;
  
}
const props = withDefaults(defineProps<Props>(), {
  showOne: true,
  showButton: true,
  rowGroup: false,
  rowGroupHeaderValues: () => [],
  display: 'fieldset',
});
//#endregion Props

interface CustomColumnProps extends ColumnProps, Record<string, any> {
  form?: IFormField;
  bodyComponent?: any;
}
//* Data
const name = toRef(props, 'name');
const fieldArray = toRef(props, 'fieldArray');
const value = toRef(props, 'value');
const columns = ref<CustomColumnProps[]>([]);
const rowGroup = toRef(props, 'rowGroup');
const groupRowsBy = toRef(props, 'groupRowsBy');
const iRowGroupHeaderValues = toRef(props, 'rowGroupHeaderValues');
//* Draggable
const isDragging = ref<boolean>(false);
//#endregion Datas

//#region Composables
const { remove, push, replace, update, move, fields } = useFieldArray(name);
const confirmation = useConfirmationService();
const toast = useToastService();
//#endregion Composables
if (props.display === 'fieldset' || props.display === 'none') {
  if (fields.value.length === 0 && props.showOne) push({});
}
//#endregion Composables

//#region Computes
const colSpan = computed(() => {
  return (columns.value as any).filter(
    (c: CustomColumnProps) =>
      !(c.form?.type === 'header' || c.form?.type === 'footer'),
  ).length;
});

const displayMode = computed(() => {
  return props.display;
});
//#endregion Computes
console.log(
  `${CNAME}:fieldArray:${name.value}`,
  fieldArray.value,
  fields.value.length,
);
//#region Lifecycle hooks
onMounted(() => {
  if (props.display === 'table') {
    initDTColumn();
  }
});

//#region Watcher
watch(
  () => value?.value,
  (newValue) => {
    console.log(`[${CNAME}]:watcher:value:`, newValue);
    if (newValue) {
      replace(newValue);
    }
  },
  { immediate: true },
);
//#endregion Watcher

//#region Methods
const initDTColumn = () => {
  if (fieldArray.value) {
    const col = fieldArray.value.map((field) => {
      return {
        field: field.name,
        header: field.label,
        type: field.type,
        form: field,
        bodyComponent:
          field.as === 'component' ? field?.props?.component : undefined,
      } as any;
    });
    const act = {
      field: 'actions',
      header: '',
      type: 'actions',
      bodyComponent: (rowData: any) => {
        if (rowGroup.value) {
          return h(Button, {
            icon: 'pi pi-trash',
            rounded: true,
            size: 'small',
            text: true,
            onClick: () => {
              onRemoveFieldDT(rowData.index);
            },
          });
        } else {
          if (rowData.field?.isFirst) {
            return h(
              'div',
              {
                class: 'flex gap-2',
              },
              [
                rowData.field?.isFirst && rowData.field?.isLast
                  ? h(Button, {
                      icon: 'pi pi-plus',
                      rounded: true,
                      size: 'small',
                      text: true,
                      onClick: () => {
                        console.log(
                          `[${CNAME}]:bodyComponent:onClick:`,
                          rowData,
                        );
                        onAddFieldDT(rowData.data);
                      },
                    })
                  : h(Button, {
                      icon: 'pi pi-trash',
                      rounded: true,
                      size: 'small',
                      text: true,
                      onClick: () => {
                        console.log(
                          `[${CNAME}]:bodyComponent:onClick:`,
                          rowData,
                        );
                        onRemoveFieldDT(rowData.index);
                      },
                    }),
              ],
            );
          } else {
            return h(
              'div',
              {
                class: 'flex gap-2',
              },
              [
                h(Button, {
                  icon: 'pi pi-trash',
                  rounded: true,
                  size: 'small',
                  text: true,
                  onClick: () => {
                    console.log(`[${CNAME}]:bodyComponent:onClick:`, rowData);
                    onRemoveFieldDT(rowData.index);
                  },
                }),
                rowData.field?.isLast &&
                  h(Button, {
                    icon: 'pi pi-plus',
                    rounded: true,
                    size: 'small',
                    text: true,
                    onClick: () => {
                      console.log(`[${CNAME}]:bodyComponent:onClick:`, rowData);
                      onAddFieldDT(rowData.data);
                    },
                  }),
              ],
            );
          }
        }
      },
    };
    columns.value = [...col, act];

    if (rowGroup.value) {
      if (fields.value.length > 0) {
        return;
      }
      iRowGroupHeaderValues.value.forEach((header) => {
        push({
          planGroup: header.value,
        });
      });
    } else {
      push({});
    }
  }
  console.log(`[${CNAME}]:initDTColumn:`, columns.value);
  console.log(`[${CNAME}]:fields:`, fields.value);
};

const onAddFieldDT = (props: any) => {
  push({
    planGroup: props,
  });

  console.log(`[${CNAME}]:onAddFieldDT:`, fields.value);
};
const onAddField = () => {
  push({});

  console.log(`[${CNAME}]:onAddField:${name.value}`, fields.value);
};

const onRemoveFieldDT = (idx: number) => {
  console.log(`[${CNAME}]:onRemoveFieldDT:idx:`, idx);
  console.log(`[${CNAME}]:onRemoveFieldDT:before:`, fields.value);

  confirmation.deleteSelected({
    accept: () => {
      remove(idx);
      toast.successDeleted();
      console.log(`[${CNAME}]:onRemoveFieldDT:after:`, fields.value);
    },
  });
};

const onHandleMove = (event: any) => {
  move(event.oldIndex, event.newIndex);
  isDragging.value = false;
};
//#endregion Methods
</script>

<style lang="scss">
.p-rowgroup-header > td {
  padding: 0;
}
</style>
