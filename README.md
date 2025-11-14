# Retts Dynamic Form

A powerful Vue 3 dynamic form builder with base components library, built with PrimeVue and VeeValidate.

## Features

- 🎨 **Dynamic Form Generation** - Create forms dynamically from configuration
- 🧩 **Rich Component Library** - 30+ pre-built base components
- ✅ **Form Validation** - Built-in validation with VeeValidate
- 🎯 **Type Safety** - Full TypeScript support
- 🚀 **PrimeVue Integration** - Leverages PrimeVue component library
- 📝 **Field Types** - Support for text, select, date, file upload, signature pad, rich text editor, and more

## Installation

```bash
npm install retts-dynamic-form
```

### Peer Dependencies

Make sure you have these peer dependencies installed:

```bash
npm install vue primevue primeicons primeflex vee-validate
```

## Usage

### Import Components

```typescript
import { DynamicForm, BaseInputText, BaseButton } from 'retts-dynamic-form'
```

### Basic Example - Dynamic Form

```vue
<template>
  <DynamicForm
    :fields="formFields"
    :model-value="formData"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DynamicForm } from 'retts-dynamic-form'

const formFields = [
  {
    name: 'username',
    type: 'text',
    label: 'Username',
    rules: 'required|min:3'
  },
  {
    name: 'email',
    type: 'text',
    label: 'Email',
    rules: 'required|email'
  }
]

const formData = ref({})

const handleSubmit = (data: any) => {
  console.log('Form submitted:', data)
}
</script>
```

### Using Individual Base Components

```vue
<template>
  <BaseInputText
    v-model="username"
    label="Username"
    placeholder="Enter username"
  />
  
  <BaseButton
    label="Submit"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BaseInputText, BaseButton } from 'retts-dynamic-form'

const username = ref('')

const handleClick = () => {
  console.log('Button clicked')
}
</script>
```

## Available Components

### Dynamic Form Components
- `DynamicForm` - Main form component
- `DynamicField` - Individual field renderer
- `DynamicFailMsg` - Validation error display

### Base Components
- `BaseInputText` - Text input
- `BaseTextArea` - Textarea
- `BaseInputNumber` - Number input
- `BasePassword` - Password input
- `BaseDropdown` - Dropdown select
- `BaseMultiSelect` - Multi-select dropdown
- `BaseAutoComplete` - Autocomplete input
- `BaseCalendar` - Date/time picker
- `BaseCheckbox` - Checkbox
- `BaseRadioButton` - Radio button
- `BaseInputSwitch` - Toggle switch
- `BaseSlider` - Range slider
- `BaseButton` - Button
- `BaseInputFile` - File upload
- `BaseSignaturePad` - Signature capture
- `BaseTextEditor` - Rich text editor (TinyMCE)
- `BaseCodeEditor` - Code editor (CodeMirror)
- And many more...

## Configuration

### PrimeVue Setup

Make sure to configure PrimeVue in your main app:

```typescript
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)
app.use(PrimeVue)
app.mount('#app')
```

## TypeScript Support

The package includes TypeScript definitions. Import types:

```typescript
import type { IFormField, IMessage } from 'retts-dynamic-form'
```

## License

MIT

## Repository

[GitHub Repository URL - Update this]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

