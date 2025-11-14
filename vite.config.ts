import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  build: {
    lib: {
      entry: {
        'retts-dynamic-form': resolve(__dirname, 'lib/index.ts'),
        'types/SignaturePadTypes': resolve(__dirname, 'lib/types/SignaturePadTypes.ts'),
        'types/Form': resolve(__dirname, 'lib/types/Form.ts'),
      },
      name: 'RettsDynamicForm',
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: [
        'vue',
        'primevue',
        'primeicons',
        'primeflex',
        'vee-validate',
        '@vueuse/core',
        '@supercharge/strings',
        'cronstrue',
        'html-to-text',
        'juice',
        'signature_pad',
        'tinymce',
        '@tinymce/tinymce-vue',
        'vue-codemirror6',
        '@codemirror/lang-javascript',
        '@codemirror/lang-json',
        'vuedraggable',
        'chart.js',
        'quill',
      ],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          vue: 'Vue',
          primevue: 'PrimeVue',
          'vee-validate': 'VeeValidate',
          '@vueuse/core': 'VueUse',
          '@supercharge/strings': 'Str',
          '@codemirror/lang-json': 'langJson',
          '@codemirror/lang-javascript': 'langJavaScript',
          'vue-codemirror6': 'CodeMirror',
          vuedraggable: 'draggable',
          tinymce: 'tinymce',
          '@tinymce/tinymce-vue': 'Editor',
          signature_pad: 'SignaturePad',
          juice: 'juice',
          'html-to-text': 'htmlToText',
          cronstrue: 'cronstrue',
        },
        exports: 'named',
        // Ensure all modules end up in the same chunk
        manualChunks: undefined,
      },
    },
  },
})
