// oxlint-disable no-unused-vars
import { flatenNestedArray } from '@retts-packages/utilities-helper';
import type { CustomDataTableProps } from '../../types/Datatable';
import type {
  AutoCompleteCompleteHandlerProps,
  FormSchema,
  IFormDependantFields,
  IFormField,
  RemoteFilterHandlerProps,
} from '../../types/Form';;
import { h, type Ref } from 'vue';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: `${K}` | `${K}.${NestedKeyOf<T[K]>}`;
    }[keyof T & (string | number)]
  : never;

type ExtractedData<T, K extends string> = {
  [P in K as P extends `${infer Key}.${infer _Rest}`
    ? Key
    : P]: P extends `${infer Key}.${infer Rest}`
    ? ExtractedData<T[Key & keyof T], Rest>
    : P extends keyof T
      ? T[P]
      : never;
};

export const RemoteFilterMatchMode = 'allow-all';

export function extractKeysFromObject<T, K extends NestedKeyOf<T>>(
  obj: T,
  keys: K[],
): ExtractedData<T, K>[] {
  const result: any = {};

  keys.forEach((key) => {
    const parts = key.split('.');
    let currentObj: any = obj;
    let currentResult: any = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (currentObj && part! in currentObj) {
        if (i === parts.length - 1) {
          currentResult[part!] = currentObj[part!];
        } else {
          currentResult[part!] = currentResult[part!] || {};
          currentResult = currentResult[part!];
          currentObj = currentObj[part!];
        }
      } else {
        break;
      }
    }
  });

  return result;
}

// Function to find the dependantFields based on the matchValue
const findDependantFields = (
  dependantFields: IFormDependantFields[],
  matchValue: string | any,
) => dependantFields.find((field) => field.matchValue === matchValue);

// Function to find the unmatchFields based on the matchValue
const findUnmatchFields = (
  dependantFields: IFormDependantFields[],
  oldValue: string | any,
) => dependantFields.find((field) => field.matchValue === oldValue);

const resetFieldsOrNestedFields = (
  field: IFormField,
  regex: RegExp,
  resetFieldValue: (name: string, value: any) => void,
) => {
  flatenNestedArray(field.props?.fields || [], 'fields')
    .filter((item) => item?.as !== undefined)
    .forEach((nestedField) => {
      if (nestedField.name && regex.test(nestedField.name)) {
        const match = nestedField.name.match(regex);
        if (match && match?.length > 0) {
          resetFieldValue(match[1], undefined);
        }
      } else if (nestedField.name) {
        resetFieldValue(nestedField.name, undefined);
      }
      if (nestedField.as === 'tabs') {
        resetFieldsOrNestedFields(nestedField, regex, resetFieldValue);
      }
    });
};

const resetFields = (
  fields: IFormField[],
  regex: RegExp,
  resetFieldValue: (name: string, value: any) => void,
) => {
  fields.forEach((field) => {
    if (field.name && regex.test(field.name)) {
      resetFieldValue(field.name, undefined);
    } else if (field.name) {
      resetFieldValue(field.name, undefined);
    }
    if (field.as === 'tabs') {
      resetFieldsOrNestedFields(field, regex, resetFieldValue);
    }
  });
};

export const ParseObjectLikeFieldName = (name: string): string => {
  const regex = /([a-zA-Z0-9]+(?:\[\w+\])?)(\.[a-zA-Z0-9]+)*/;
  if (regex.test(name)) {
    const match = name.match(regex);
    if (match && match?.length > 0) {
      return match[1]!;
    }
  }
  return name;
};
/**
 * This function handles the logic for dependant fields based on matchValue and oldVal.
 * It finds the dependant fields and unmatched fields based on the matchValue and oldVal.
 * If there are unmatched fields, it resets the corresponding fields using resetFieldValue.
 * If there are dependant fields, it returns the dependant fields.
 *
 * @param {IFormDependantFields[]} dependantFields - The array of dependant fields.
 * @param {string | any} matchValue - The match value to find the dependant fields.
 * @param {string | any} oldVal - The old value to find the unmatched fields.
 * @param {(name: string, value: any) => void} resetFieldValue - The function to reset the field value.
 * @return {IFormDependantFields | undefined} - The dependant fields if found, else undefined.
 */
export const HandleDependantFields = (
  dependantFields: IFormDependantFields[],
  matchValue: string | any,
  oldVal: string | any,
  resetFieldValue: (name: string, value: any) => void,
) => {
  // Find the dependant fields based on the matchValue
  const _dependantFields = findDependantFields(dependantFields, matchValue);
  // Find the unmatched fields based on the oldVal
  const _unmatchFields = findUnmatchFields(dependantFields, oldVal);

  // If there are unmatched fields, reset the corresponding fields
  if (_unmatchFields) {
    const fields = flatenNestedArray(
      _unmatchFields.fields,
      'fields',
    ) as IFormField[];
    const regex = /(.*)\[\w+\]+\.?\w*/;
    // const regex = /([a-zA-Z0-9]+(?:\[\w+\])?)(\.[a-zA-Z0-9]+)*/;
    resetFields(fields, regex, resetFieldValue);
  }

  // If there are dependant fields, return them
  if (_dependantFields) {
    const fields = flatenNestedArray(
      _dependantFields.fields,
      'fields',
    ) as IFormField[];
    return fields;
  }
};

export const HandleAutocompleteSearch = async (
  payload: AutoCompleteCompleteHandlerProps,
  schema: FormSchema,
  fetcher: Promise<any>,
  options?: {
    optionLabel?: string;
    optionValue?: string;
  },
) => {
  schema.fields?.forEach(async (field) => {
    if (field.as === 'autocomplete' && field.name === payload.name) {
      const data = await fetcher;
      if (data) {
        if (options && options?.optionLabel && options?.optionValue) {
          field.props = {
            ...field.props,
            suggestions: data.map((item: Record<string, any>) => ({
              text: item[options.optionLabel as string],
              value: item[options.optionValue as string],
            })),
          };
        } else {
          field.props = {
            ...field.props,
            suggestions: data,
          };
        }
      }
    }
  });
  return schema;
};
export const RemoteFilterHandler = async (
  payload: RemoteFilterHandlerProps,
  schema: FormSchema,
  fetcher: Promise<any>,
  options?: {
    optionLabel?: string;
    optionValue?: string;
  },
) => {
  const field = schema.fields?.find(
    (f) =>
      (f.as === 'dropdown' || f.as === 'multiSelect' || f.as === 'listbox') &&
      f.name === payload.name &&
      f.props,
  );
  if (field) {
    field.props.loading = true;

    const data = await fetcher;
    console.assert(Array.isArray(data), 'Remote data is not an array');
    let selectedOptions: any[] = [];
    if (payload.currentValue && field.props?.options) {
      selectedOptions = field.props.options.filter((option: any) =>
        payload.currentValue.includes(option[field.props?.optionValue]),
      );
    }
    if (Array.isArray(data)) {
      if (options && options?.optionLabel && options?.optionValue) {
        const newOptions = data.map((item: Record<string, any>) => ({
          text: item[options.optionLabel as string],
          value: item[options.optionValue as string],
        }));
        const filteredOptions = newOptions.filter(
          (option) =>
            !selectedOptions.some(
              (selectedOption) => selectedOption.value === option.value,
            ),
        );
        const mergedOptions = [...filteredOptions, ...selectedOptions];
        console.log('[RemoteFilterHandler]:data', mergedOptions);

        field.props.options = mergedOptions;
      } else {
        // field.props.options = newOptions;
        const filteredOptions = data.filter(
          (option: any) =>
            !selectedOptions.some(
              (selectedOption) =>
                selectedOption[field.props?.optionValue] ===
                option[field.props?.optionValue],
            ),
        );
        const mergedOptions = [...filteredOptions, ...selectedOptions];
        console.log('[RemoteFilterHandler]:data', mergedOptions);
        field.props.options = mergedOptions;
      }
    }
    field.props.loading = false;
  }
};
export const RemoteInitHandler = async (
  payload: any,
  schema: FormSchema,
  fetcher: Promise<any>,
  options?: {
    optionLabel?: string;
    optionValue?: string;
  },
) => {
  const field = schema.fields?.find(
    (f) =>
      (f.as === 'dropdown' ||
        f.as === 'cascade-select' ||
        f.as === 'tree-select' ||
        f.as === 'listbox' ||
        f.as === 'select-button' ||
        f.as === 'multiSelect') &&
      f.name === payload.name &&
      f.props,
  );
  if (field) {
    field.props.loading = true;

    const data = await fetcher;
    console.assert(Array.isArray(data), 'Remote data is not an array');
    if (
      options &&
      options?.optionLabel &&
      options?.optionValue &&
      Array.isArray(data)
    ) {
      const newOptions = data.map((item: Record<string, any>) => ({
        text: item[options.optionLabel as string],
        value: item[options.optionValue as string],
      }));
      // field.props.options = newOptions;

      field.props.options = newOptions;
    } else {
      field.props.options = data;
    }

    field.props.loading = false;
  }
};

/**
 * SelectHandler is an asynchronous function that handles the selection of a value in a form schema to control the target field behavior such as options, input state and etc.
 *
 * @param {FormSchema} schema - The form schema containing the fields to be updated.
 * @param {Promise<any>} fetcher - A promise that resolves to the data needed for updating the fields.
 * @param {string} targetKey - The name of the field to be updated.
 * @param {string} dataKey - The key in the fetched data used to update the field.
 * @param {any} val - The selected value.
 * @param {any} cb - A callback function to update the field value.
 * @return {Promise<FormSchema>} The updated form schema.
 */
export const SelectHandler = async (
  schema: FormSchema,
  fetcher: Promise<any>,
  targetKey: string,
  payload: {
    value: any;
    cb?: any;
    name?: string;
    waterfallFields?: string[];
  },
  dataKey?: string,
  hideField?: boolean,
) => {
  const { value, cb, waterfallFields } = payload;
  if (!value) {
    const tags = waterfallFields;
    schema?.fields?.forEach((item) => {
      if (tags && tags.includes(item.name)) {
        item.value = null;
        cb(item.name, undefined);
        item.props.options = undefined;
        item.props = {
          ...item.props,
          disabled: true,
        };

        item.parentFieldClass = `col-12 ${hideField ? 'hidden' : ''}`;
      }
    });
    return schema;
  } else {
    // Giving loading state
    schema?.fields?.forEach((item) => {
      if (item.name === targetKey) {
        if (item.as === 'dropdown')
          item.props = {
            ...item.props,
            loading: true,
            placeholder: 'Loading...',
            showClear: false,
            disabled: true,
          };
      }
    });
    // Fetching data
    const data = await fetcher;

    // Giving options
    if (data) {
      schema?.fields?.forEach((item) => {
        if (item.name === targetKey) {
          if (!dataKey) {
            item.props.options = data;
          } else {
            item.props.options = data[dataKey];
          }
          item.value = null;
          cb(item.name, undefined);
          item.props = {
            ...item.props,
            loading: false,
            disabled: false,
            showClear: true,
            placeholder: item.placeholder,
          };

          item.parentFieldClass = `col-12 `;
        }
      });
      return schema;
    }
  }
};

export const LazyFilterMatch = (...args: any[]) => {
  console.log('LazyFilterMatch', args);
  if (args && args[1]?.length > 2) {
    return args[0].toLowerCase().includes(args[1].toLowerCase());
  } else {
    return true;
  }
};

export const InitDatatableHandler = async (
  schema: FormSchema,
  payload: {
    name?: string;
    value?: any;
  },
  fetcher: Promise<any>,
  selectedRefs: Ref<any[]>,
) => {
  schema.fields?.forEach(async (field) => {
    if (
      payload &&
      (field.as === 'autocomplete' ||
        field.as === 'dropdown' ||
        field.as === 'multiSelect') &&
      field.name === payload.name &&
      field.dataTableComponent
    ) {
      (field.dataTableComponent.props as CustomDataTableProps).loading = true;
      const result = await fetcher;
      field.props = {
        ...field.props,
        loading: true,
      };

      const updatedVNode = h<CustomDataTableProps>(field.dataTableComponent, {
        ...(field.dataTableComponent.props as CustomDataTableProps),
        value: result.data || [],
        selection: selectedRefs.value,
        scrollHeight: '300px',
        selectionMode:
          field.as === 'multiSelect'
            ? 'multiple'
            : field.as === 'dropdown'
              ? 'single'
              : field.as === 'autocomplete' && field.props?.multiple
                ? 'multiple'
                : 'single',
        totalRecords: result?.pagination?.itemTotal,
      });

      field.dataTableComponent = updatedVNode;
      (field.dataTableComponent.props as CustomDataTableProps).loading = false;

      field.props.loading = false;
    }
  });
};
