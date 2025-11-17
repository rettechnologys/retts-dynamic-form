import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      outDir: 'dist',
      insertTypesEntry: true,
      copyDtsFiles: true,
      include: ['lib/**/*.ts', 'lib/**/*.vue'],
      exclude: ['src/**/*', 'node_modules/**/*']
    })
  ],
  
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'RettsDynamicForm',
      fileName: 'retts-dynamic-form',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Externalize dependencies that shouldn't be bundled
      external: (id) => {
        return (
          id === 'vue' ||
          id.startsWith('vue/') ||
          id.startsWith('primevue/') ||
          id === 'primevue' ||
          id === 'primeicons' ||
          id === 'primeflex' ||
          id === 'vee-validate' ||
          id.startsWith('@vueuse/') ||
          id.startsWith('@supercharge/') ||
          id === 'cronstrue' ||
          id === 'html-to-text' ||
          id === 'juice' ||
          id === 'signature_pad' ||
          id === 'tinymce' ||
          id.startsWith('@tinymce/') ||
          id === 'vue-codemirror6' ||
          id.startsWith('@codemirror/') ||
          id === 'vuedraggable' ||
          id === 'chart.js' ||
          id === 'quill'
        )
      },
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'retts-dynamic-form.css';
          return assetInfo.name || 'assets/[name][extname]';
        },
      },
    },
  },
})
