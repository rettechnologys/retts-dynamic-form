<template>
  <div
    class="dynamic-field"
    v-for="{
      as,
      name,
      label,
      rules,
      fieldClass,
      labelClass,
      parentInputClass,
      inputClass,
      props: componentProps,
      errorInputClass,
      type,
      fieldArrIndex,
      parentFieldClass,
      value,
      ...attrs
    } in props.fields"
    :key="name"
    :class="parentFieldClass ? parentFieldClass : 'col-12'"
  >
    <div
      v-if="
        as === 'fieldArray' &&
        componentProps?.fieldArray &&
        componentProps?.fieldArray.length
      "
      :class="['field', fieldClass ? fieldClass : '']"
    >
      <BaseFieldArray
        :name="name"
        :label="label"
        :value="value"
        :fieldArray="componentProps.fieldArray"
        :disabled="componentProps.disabled ?? props.isViewMode ?? false"
        v-bind="{ ...attrs, ...componentProps }"
      />
    </div>
    <div v-else>
      <BaseAutoComplete
        v-if="as === 'autocomplete'"
        :name="name"
        :label="label"
        :rules="rules"
        :labelClass="labelClass ? labelClass : ''"
        :value="value"
        :field-class="fieldClass ? fieldClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :slots="componentProps?.componentSlots"
        :datatable="componentProps?.datatable"
        :dependantFields="componentProps?.dependantFields"
        :waterfallFields="componentProps?.waterfallFields"
        :keysToExtract="componentProps?.keysToExtract"
        :datatable-node="
          as === 'autocomplete' && 'dataTableComponent' in attrs
            ? attrs.dataTableComponent
            : null
        "
        @handle-select="
          (payload) =>
            as === 'autocomplete' &&
            'handle-select' in attrs &&
            attrs['handle-select']
              ? attrs['handle-select'](payload)
              : undefined
        "
        @handle-unselect="
          (payload) =>
            as === 'autocomplete' &&
            'handle-unselect' in attrs &&
            attrs['handle-unselect']
              ? attrs['handle-unselect'](payload)
              : undefined
        "
        @handle-init-datatable="
          (payload) =>
            as === 'autocomplete' &&
            'handle-init-datatable' in attrs &&
            attrs['handle-init-datatable']
              ? attrs['handle-init-datatable'](payload)
              : undefined
        "
        @handle-search="
          (payload) =>
            as === 'autocomplete' &&
            'handle-complete' in attrs &&
            attrs['handle-complete']
              ? attrs['handle-complete'](payload)
              : undefined
        "
        v-bind="attrs"
      />
      <BaseButton
        v-else-if="as === 'button'"
        :label="label"
        :fieldClass="fieldClass ? fieldClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :formValues="componentProps?.formValues"
        @handle-click="
          (payload: any) =>
            as === 'button' &&
            componentProps &&
            'handle-click' in componentProps
              ? (componentProps['handle-click'] ?? (() => {}))(payload)
              : undefined
        "
        v-bind="attrs"
      />
      <BaseCalendar
        v-else-if="as === 'calendar'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />
      <BaseCascadeSelect
        v-if="as === 'cascade-select'"
        :name="name"
        :label="label"
        :rules="rules"
        :labelClass="labelClass ? labelClass : ''"
        :value="value"
        :field-class="fieldClass ? fieldClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :slots="componentProps?.componentSlots"
        :lazy="componentProps?.lazy"
        :dependantFields="componentProps?.dependantFields"
        :waterfallFields="componentProps?.waterfallFields"
        :keysToExtract="componentProps?.keysToExtract"
        :datatable="componentProps?.datatable"
        :datatable-node="
          as === 'cascade-select' && 'dataTableComponent' in attrs
            ? attrs.dataTableComponent
            : null
        "
        @handle-select="
          (payload) =>
            as === 'cascade-select' &&
            'handle-select' in attrs &&
            attrs['handle-select']
              ? attrs['handle-select'](payload)
              : undefined
        "
        @handle-init-datatable="
          (payload) =>
            as === 'cascade-select' &&
            'handle-init-datatable' in attrs &&
            attrs['handle-init-datatable']
              ? attrs['handle-init-datatable'](payload)
              : undefined
        "
        @handle-init-lazy="
          (payload) =>
            as === 'cascade-select' &&
            'handle-init' in attrs &&
            attrs['handle-init']
              ? attrs['handle-init'](payload)
              : undefined
        "
        v-bind="attrs"
      />
      <BaseCheckbox
        v-if="
          as === 'checkbox' &&
          componentProps?.options &&
          componentProps?.options?.length
        "
        :name="name"
        :label="label"
        :rules="rules"
        :options="componentProps.options"
        :type="'checkbox'"
        :value="value"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :atLeastOne="componentProps.atLeastOne"
        :dependantFields="componentProps.dependantFields"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        @handle-change="
          (payload) =>
            as === 'checkbox' &&
            'handle-change' in attrs &&
            attrs['handle-change']
              ? attrs['handle-change'](payload)
              : undefined
        "
      />
      <BaseColorPicker
        v-if="as === 'color-picker'"
        :name="name"
        :label="label"
        :rules="rules"
        :type="'checkbox'"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
      />
      <BaseComponent
        v-else-if="as === 'component'"
        :name="name"
        :label="label"
        :rules="rules"
        :value="value"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :fieldArrIndex="fieldArrIndex"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="componentProps"
        v-bind="attrs"
      />
      <BaseCronInput
        v-if="as === 'cron'"
        :name="name"
        :label="label"
        :rules="rules"
        :labelClass="labelClass ? labelClass : ''"
        :value="value"
        :field-class="fieldClass ? fieldClass : ''"
        :fieldArrIndex="fieldArrIndex"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :slots="componentProps?.componentSlots"
        :lazy="componentProps?.lazy"
        :dependantFields="componentProps?.dependantFields"
        :waterfallFields="componentProps?.waterfallFields"
        :keysToExtract="componentProps?.keysToExtract"
        :datatable="componentProps?.datatable"
        v-bind="attrs"
      />
      <BaseCodeEditor
        v-if="as === 'codeEditor'"
        :name="name"
        :label="label"
        :rules="rules"
        :labelClass="labelClass ? labelClass : ''"
        :value="value"
        :field-class="fieldClass ? fieldClass : ''"
        :fieldArrIndex="fieldArrIndex"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />
      <BaseDropdown
        v-if="as === 'dropdown'"
        :name="name"
        :label="label"
        :rules="rules"
        :labelClass="labelClass ? labelClass : ''"
        :value="value"
        :field-class="fieldClass ? fieldClass : ''"
        :fieldArrIndex="fieldArrIndex"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :slots="componentProps?.componentSlots"
        :lazy="componentProps?.lazy"
        :dependantFields="componentProps?.dependantFields"
        :waterfallFields="componentProps?.waterfallFields"
        :keysToExtract="componentProps?.keysToExtract"
        :datatable="componentProps?.datatable"
        :datatable-node="
          as === 'dropdown' && 'dataTableComponent' in attrs
            ? attrs.dataTableComponent
            : null
        "
        @handle-select="
          (payload) =>
            as === 'dropdown' &&
            'handle-select' in attrs &&
            attrs['handle-select']
              ? attrs['handle-select'](payload)
              : undefined
        "
        @handle-filter="
          (payload) =>
            as === 'dropdown' &&
            'handle-dropdown-filter' in attrs &&
            attrs['handle-dropdown-filter']
              ? attrs['handle-dropdown-filter'](payload)
              : undefined
        "
        @handle-init-datatable="
          (payload) =>
            as === 'dropdown' &&
            'handle-init-datatable' in attrs &&
            attrs['handle-init-datatable']
              ? attrs['handle-init-datatable'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseInputChips
        v-else-if="as === 'chips'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :options="componentProps?.options"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />

      <BaseInputFile
        v-else-if="as === 'fileUpload'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :type="componentProps?.type"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        @handle-change="
          (payload) =>
            as === 'fileUpload' &&
            'handle-change' in attrs &&
            attrs['handle-change']
              ? attrs['handle-change'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseInputGroup
        v-else-if="as === 'input-group'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :startAddon="componentProps?.startAddon"
        :endAddon="componentProps?.endAddon"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :type="type"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />

      <BaseInputMask
        v-else-if="as === 'mask'"
        :name="name"
        :label="label"
        :rules="rules"
        :type="type"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :fieldArrIndex="fieldArrIndex"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.readonly,
        }"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        v-bind="attrs"
      />

      <BaseInputNumber
        v-else-if="as === 'number'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />

      <BaseInputOTP
        v-else-if="as === 'otp'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />

      <BaseInputSwitch
        v-else-if="as === 'switch'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :dependantFields="componentProps?.dependantFields"
        @handle-change="
          (payload) =>
            as === 'switch' &&
            'handle-change' in attrs &&
            attrs['handle-change']
              ? attrs['handle-change'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseInputText
        v-else-if="as === 'text'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :fieldArrIndex="fieldArrIndex"
        :value="value"
        :type="type"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        @handle-change="
          (payload) =>
            as === 'text' && 'handle-change' in attrs && attrs['handle-change']
              ? attrs['handle-change'](payload)
              : undefined
        "
        v-bind="attrs"
      />
      <BaseSignaturePad
        v-else-if="as === 'signature'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :fieldArrIndex="fieldArrIndex"
        :value="value"
        :type="type"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        @handle-change="
          (payload) =>
            as === 'signature' &&
            'handle-change' in attrs &&
            attrs['handle-change']
              ? attrs['handle-change'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseKnob
        v-else-if="as === 'knob'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />

      <BaseListBox
        v-if="as === 'listbox'"
        :name="name"
        :label="label"
        :rules="rules"
        :labelClass="labelClass ? labelClass : ''"
        :value="value"
        :field-class="fieldClass ? fieldClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :slots="componentProps?.componentSlots"
        :lazy="componentProps?.lazy"
        :dependantFields="componentProps?.dependantFields"
        :waterfallFields="componentProps?.waterfallFields"
        @handle-select="
          (payload) =>
            as === 'listbox' &&
            'handle-select' in attrs &&
            attrs['handle-select']
              ? attrs['handle-select'](payload)
              : undefined
        "
        @handle-filter="
          (payload) =>
            as === 'listbox' &&
            'handle-dropdown-filter' in attrs &&
            attrs['handle-dropdown-filter']
              ? attrs['handle-dropdown-filter'](payload)
              : undefined
        "
        @handle-init-lazy="
          (payload) =>
            as === 'listbox' && 'handle-init' in attrs && attrs['handle-init']
              ? attrs['handle-init'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseMultiSelect
        v-if="as === 'multiSelect'"
        :name="name"
        :label="label"
        :rules="rules"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :lazy="componentProps?.lazy"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :slots="componentProps?.componentSlots"
        :keysToExtract="componentProps?.keysToExtract"
        :datatable="componentProps?.datatable ? true : false"
        :datatable-node="
          as === 'multiSelect' && 'dataTableComponent' in attrs
            ? attrs.dataTableComponent
            : null
        "
        @handle-select="
          (payload) =>
            as === 'multiSelect' &&
            'handle-select' in attrs &&
            attrs['handle-select']
              ? attrs['handle-select'](payload)
              : undefined
        "
        @handle-filter="
          (payload) =>
            as === 'multiSelect' &&
            'handle-dropdown-filter' in attrs &&
            attrs['handle-dropdown-filter']
              ? attrs['handle-dropdown-filter'](payload)
              : undefined
        "
        @handle-init-datatable="
          (payload) =>
            as === 'multiSelect' &&
            'handle-init-datatable' in attrs &&
            attrs['handle-init-datatable']
              ? attrs['handle-init-datatable'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BasePassword
        v-else-if="as === 'password'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
          toggleMask: props.isViewMode ? false : componentProps?.toggleMask,
        }"
        @handle-change="
          (payload) =>
            as === 'password' &&
            'handle-change' in attrs &&
            attrs['handle-change']
              ? attrs['handle-change'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseRadioButton
        v-if="
          as === 'radioButton' &&
          componentProps?.options &&
          componentProps?.options?.length
        "
        :name="name"
        :label="label"
        :rules="rules"
        :options="componentProps.options"
        :type="'radio'"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :dependantFields="componentProps.dependantFields"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        @handle-change="
          (payload) =>
            as === 'radioButton' &&
            'handle-change' in attrs &&
            attrs['handle-change']
              ? attrs['handle-change'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseRating
        v-else-if="as === 'rating'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />

      <BaseSelectButton
        v-else-if="as === 'select-button'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :slots="componentProps?.componentSlots"
        :lazy="componentProps?.lazy"
        :dependantFields="componentProps?.dependantFields"
        :waterfallFields="componentProps?.waterfallFields"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        @handle-init-lazy="
          (payload) =>
            as === 'select-button' &&
            'handle-init' in attrs &&
            attrs['handle-init']
              ? attrs['handle-init'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseSlider
        v-else-if="as === 'slider'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :slots="componentProps?.componentSlots"
        v-bind="attrs"
      />

      <BaseTextArea
        v-else-if="as === 'text-area'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        v-bind="attrs"
      />

      <BaseTextEditor
        v-else-if="as === 'text-editor'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        @handle-change="
          (payload) =>
            as === 'text-editor' &&
            'handle-change' in attrs &&
            attrs['handle-change']
              ? attrs['handle-change'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <BaseToggleButton
        v-if="as === 'toggle-button'"
        :name="name"
        :label="label"
        :rules="rules"
        :fieldClass="fieldClass ? fieldClass : ''"
        :labelClass="labelClass ? labelClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :dependantFields="
          componentProps?.dependantFields
            ? componentProps?.dependantFields
            : undefined
        "
        :value="value"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
      />

      <BaseTreeSelect
        v-if="as === 'tree-select'"
        :name="name"
        :label="label"
        :rules="rules"
        :labelClass="labelClass ? labelClass : ''"
        :value="value"
        :field-class="fieldClass ? fieldClass : ''"
        :parentInputClass="parentInputClass ? parentInputClass : ''"
        :inputClass="inputClass ? inputClass : ''"
        :errorInputClass="errorInputClass ? errorInputClass : ''"
        :componentProps="{
          ...componentProps,
          disabled: props.isViewMode ? true : componentProps?.disabled,
        }"
        :slots="componentProps?.componentSlots"
        :lazy="componentProps?.lazy"
        :dependantFields="componentProps?.dependantFields"
        :waterfallFields="componentProps?.waterfallFields"
        @handle-select="
          (payload) =>
            as === 'tree-select' &&
            'handle-select' in attrs &&
            attrs['handle-select']
              ? attrs['handle-select'](payload)
              : undefined
        "
        @handle-filter="
          (payload) =>
            as === 'tree-select' &&
            'handle-dropdown-filter' in attrs &&
            attrs['handle-dropdown-filter']
              ? attrs['handle-dropdown-filter'](payload)
              : undefined
        "
        @handle-init-lazy="
          (payload) =>
            as === 'tree-select' &&
            'handle-init' in attrs &&
            attrs['handle-init']
              ? attrs['handle-init'](payload)
              : undefined
        "
        v-bind="attrs"
      />

      <DynamicTabsField
        v-else-if="as === 'tabs'"
        :tabs="componentProps?.fields as any"
        :is-view-mode="props.isViewMode"
      />

      <div v-else-if="as === 'inject-slot'">
        <slot name="inject"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//#region Imports
import BaseCodeEditor from '../components/Base/BaseCodeEditor.vue';
import BaseCronInput from '../components/Base/BaseCronInput/BaseCronInput.vue';
import {
  BaseAutoComplete,
  BaseButton,
  BaseCalendar,
  BaseCascadeSelect,
  BaseCheckbox,
  BaseColorPicker,
  BaseComponent,
  BaseDropdown,
  BaseFieldArray,
  BaseInputChips,
  BaseInputFile,
  BaseInputGroup,
  BaseInputMask,
  BaseInputNumber,
  BaseInputOTP,
  BaseInputSwitch,
  BaseInputText,
  BaseKnob,
  BaseListBox,
  BaseMultiSelect,
  BasePassword,
  BaseRadioButton,
  BaseRating,
  BaseSelectButton,
  BaseSignaturePad,
  BaseSlider,
  BaseTextArea,
  BaseTextEditor,
  BaseToggleButton,
  BaseTreeSelect,
} from '../components/Base/index';
import type { IFormField } from '../types/Form';
import { defineAsyncComponent } from 'vue';

const DynamicTabsField = defineAsyncComponent(
  () => import('./DynamicTabsField/DynamicTabsField.vue'),
);
//#endregion Imports

//#region Props
const props = defineProps<{
  fields: IFormField[];
  isViewMode?: boolean;
}>();
//#endregion Props
</script>
