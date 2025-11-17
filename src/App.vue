<script setup lang="ts">
import { ref } from 'vue';
// Import from lib folder for development
import {
  DynamicForm,
  type IFormState,
  type FormSchema,
  type IFormField,
  initialFormState,
} from '../lib';


const submittedData = ref<string | null>(null);
const formState = ref<IFormState>(initialFormState);

const formSchema = ref<FormSchema>({
  fields: [
    {
      label: 
      'UserName',
      labelClass: '',
      placeholder: 'Enter your username',
      name: 'username',
      as: 'text',
      type: 'text',
      rules: 'required',
      //parentFieldClass: 'col-12',
      //fieldClass: 'w-full',
      //parentInputClass: 'w-full',
      //inputClass: 'w-full',
      //errorInputClass: 'col-offset-3 col-6',
    },
   
    // {
    //   name: 'deviceInfo',
    //   as: 'input',
    //   type: 'hidden',
    //   rules: '',
    // },
  ] as IFormField[],
});

const handleSubmit = (data: any) => {
  submittedData.value = JSON.stringify(data, null, 2);
  console.log('Form submitted:', data);
};
</script>

<template>
  <div class="container">
    <h1>🚀 Retts Dynamic Form Example</h1>bun <i class="devicons devicons-android"></i>
    <p class="subtitle">Importing from <code>./dist/retts-dynamic-form.es.js</code></p>

    <DynamicForm :schema="formSchema as FormSchemaWithFields" :form-state="formState" @submit="handleSubmit" />

    <div v-if="submittedData" class="result-box">
      <h3>✅ Submitted Data:</h3>
      <pre>{{ submittedData }}</pre>
    </div>
  </div>
</template>

<style scoped>


</style>
