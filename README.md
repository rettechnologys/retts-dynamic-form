# Retts Dynamic Form

A powerful Vue 3 dynamic form builder with base components library, built with PrimeVue and VeeValidate.

## Features

- 🎨 **Dynamic Form Generation** - Create forms dynamically from configuration
- 🧩 **Rich Component Library** - 35+ pre-built base components
- ✅ **Form Validation** - Built-in validation with VeeValidate
- 🎯 **Type Safety** - Full TypeScript support
- 🚀 **PrimeVue Integration** - Leverages PrimeVue component library
- � **Tree-shakeable** - Import only what you need
- 🔌 **Plugin System** - Easy validator setup with Vue plugins
- �📝 **Field Types** - Support for text, select, date, file upload, signature pad, rich text editor, code editor, and more

## Installation

```bash
npm install retts-dynamic-form
```

### Required Peer Dependencies

```bash
npm install vue@^3.5 primevue@^3.53 primeicons@^7.0 vee-validate@^4.13
```

### Optional Dependencies (for specific features)

```bash
# For validation rules and i18n
npm install @vee-validate/rules @vee-validate/i18n

# For styling
npm install primeflex@^3.3

# For TinyMCE editor
npm install @tinymce/tinymce-vue tinymce

# For Code editor
npm install vue-codemirror6 @codemirror/lang-javascript @codemirror/lang-json

# For signature pad
npm install signature_pad
```

## Quick Start

### 1. Setup PrimeVue and Services

In your `main.ts`:

```typescript
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice'

// Import PrimeVue styles
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'

// Import component styles
import 'retts-dynamic-form/style.css'

import App from './App.vue'

const app = createApp(App)

app.use(PrimeVue)
app.use(ToastService)
app.use(DialogService)
app.use(ConfirmationService)

app.mount('#app')
```

### 2. Setup Validators (Optional but Recommended)

```typescript
import { createApp } from 'vue'
import { ValidatorPlugin } from 'retts-dynamic-form'

const app = createApp(App)

// Install all validation rules (built-in + custom)
app.use(ValidatorPlugin)

// Or with options
app.use(ValidatorPlugin, {
  installBuiltInRules: true,  // Install @vee-validate/rules (default: true)
  installCustomRules: true,   // Install custom validators (default: true)
  i18n: yourI18nInstance,     // Optional: for translated error messages
  locales: { en, id }         // Optional: VeeValidate locales
})
```

### 3. Use in Your Components

```vue
<template>
  <DynamicForm
    :form-state="formState"
    :schema="formSchema"
    @handle-submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicForm, initialFormState } from 'retts-dynamic-form'
import type { FormSchemaWithFields, IFormState } from 'retts-dynamic-form'

const formState = ref<IFormState>(initialFormState)

const formSchema: FormSchemaWithFields = {
  fields: [
    {
      name: 'username',
      component: 'BaseInputText',
      label: 'Username',
      rules: 'required|min:3',
      componentProps: {
        placeholder: 'Enter your username'
      }
    },
    {
      name: 'email',
      component: 'BaseInputText',
      label: 'Email',
      rules: 'required|email',
      componentProps: {
        type: 'email'
      }
    },
    {
      name: 'password',
      component: 'BasePassword',
      label: 'Password',
      rules: 'required|min:8'
    }
  ]
}

const handleSubmit = (data: any) => {
  console.log('Form submitted:', data)
}
</script>
```

## Usage Examples

### Import Styles

```typescript
// Main CSS (required)
import 'retts-dynamic-form/style.css'
```

### Import Components

```typescript
// Option 1: Import from main entry
import { 
  DynamicForm,
  DynamicField,
  BaseInputText,
  BaseButton,
  BaseDropdown
} from 'retts-dynamic-form'

// Option 2: Import specific components via subpath exports
import DynamicForm from 'retts-dynamic-form/dynamicform'
import BaseInputText from 'retts-dynamic-form/baseinputtext'
import BaseButton from 'retts-dynamic-form/basebutton'

// Option 3: Import types
import type { 
  FormSchemaWithFields,
  IFormField,
  IFormState 
} from 'retts-dynamic-form/types'
```

### Using Base Components Directly

```vue
<template>
  <div>
    <BaseInputText
      v-model="username"
      label="Username"
      placeholder="Enter username"
    />
    
    <BaseDropdown
      v-model="country"
      :options="countries"
      label="Country"
      option-label="name"
      option-value="code"
    />
    
    <BaseButton
      label="Submit"
      icon="pi pi-check"
      @click="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BaseInputText, BaseDropdown, BaseButton } from 'retts-dynamic-form'

const username = ref('')
const country = ref('')
const countries = ref([
  { name: 'United States', code: 'US' },
  { name: 'Indonesia', code: 'ID' }
])

const handleSubmit = () => {
  console.log({ username: username.value, country: country.value })
}
</script>
```

## Available Components

### Dynamic Form Components
- **DynamicForm** - Main dynamic form component with validation
- **DynamicField** - Individual field renderer
- **DynamicFailMsg** - Validation error message display

### Base Input Components
- **BaseInputText** - Text input field
- **BaseTextArea** - Multi-line text area
- **BaseInputNumber** - Number input with formatting
- **BasePassword** - Password input with visibility toggle
- **BaseInputMask** - Masked input (phone, date, etc.)
- **BaseInputOTP** - One-time password input
- **BaseInputChips** - Tag/chip input
- **BaseInputSwitch** - Toggle switch
- **BaseInputFile** - File upload with preview

### Base Selection Components
- **BaseDropdown** - Single select dropdown
- **BaseMultiSelect** - Multi-select dropdown
- **BaseAutoComplete** - Autocomplete/typeahead
- **BaseListBox** - List selection
- **BaseCascadeSelect** - Cascading select
- **BaseTreeSelect** - Tree structure select
- **BaseCheckbox** - Checkbox input
- **BaseRadioButton** - Radio button input
- **BaseSelectButton** - Toggle button group
- **BaseToggleButton** - Single toggle button

### Base Date/Time Components
- **BaseCalendar** - Date/time picker

### Base UI Components
- **BaseButton** - Action button
- **BaseSlider** - Range slider
- **BaseKnob** - Circular knob input
- **BaseRating** - Star rating input
- **BaseColorPicker** - Color selection

### Advanced Components
- **BaseSignaturePad** - Signature capture canvas
- **BaseTextEditor** - Rich text WYSIWYG editor (TinyMCE)
- **BaseCodeEditor** - Code editor with syntax highlighting (CodeMirror)
- **BaseCronInput** - Cron expression builder
- **BaseFieldArray** - Dynamic field array/repeater
- **BaseInputGroup** - Grouped inputs with addons
- **BaseTabs** - Tabbed form sections

## Validation

### Built-in Validators

The package includes VeeValidate integration with common validation rules:

- `required` - Field is required
- `email` - Valid email format
- `min:3` - Minimum length
- `max:10` - Maximum length
- `confirmed` - Match another field
- `phone` - Valid phone number
- `url` - Valid URL
- And all [@vee-validate/rules](https://vee-validate.logaretm.com/v4/guide/global-validators)

### Custom Validators

You can add custom validators:

```typescript
import { defineRule } from 'retts-dynamic-form'

defineRule('customRule', (value: any) => {
  if (value === 'expected') {
    return true
  }
  return 'Value must be "expected"'
})
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type { 
  // Form types
  FormSchemaWithFields,
  FormSchemaWithTabs,
  IFormField,
  IFormState,
  IFormTabsModes,
  
  // Component props
  IMessage,
  SignaturePadProps,
  
  // Helpers
  formatPhoneNumber,
  capitalizeFirstLetter
} from 'retts-dynamic-form'
```

## Exports

### Subpath Exports

All components are available via subpath exports:

```typescript
// Components
import DynamicForm from 'retts-dynamic-form/dynamicform'
import BaseInputText from 'retts-dynamic-form/baseinputtext'
import BaseButton from 'retts-dynamic-form/basebutton'
// ... and all other components

// Types
import type { FormSchemaWithFields } from 'retts-dynamic-form/types'

// Validators
import { ValidatorPlugin } from 'retts-dynamic-form/validators'

// Styles
import 'retts-dynamic-form/style.css'
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and feature requests, please use the GitHub issue tracker.

