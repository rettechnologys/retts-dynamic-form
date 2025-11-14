<template>
  <div :class="['field', fieldClass ? fieldClass : '']">
    <label
      :for="name.replace(/[\[\]']+/g, '')"
      :class="['font-medium', labelClass ? labelClass : '']"
    >
      {{ label }}
    </label>
    <FileUpload
      v-if="props.componentProps?.mode === 'advanced' && props.type === 'rich'"
      :id="name.replace(/[\[\]']+/g, '')"
      :name="name"
      custom-upload
      ref="fileupload"
      v-model="inputValue"
      :multiple="true"
      data-testid="fileupload-rich"
      :accept="props.componentProps?.allowedMimeTypes"
      :show-upload-button="false"
      :class="[
        inputClass ? inputClass : '',
        meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
      ]"
      @select="handleSelectedFiles"
      @remove="handlefnHandleFileRemove"
      @clear="handleClear"
      v-bind="props.componentProps"
    >
      <template #header="{ chooseCallback, clearCallback, files }">
        <div
          class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2"
        >
          <div class="flex gap-2">
            <Button
              @click="chooseCallback()"
              icon="pi pi-images"
              rounded
              outlined
            ></Button>

            <Button
              @click="handleClearTemplatingUpload(clearCallback)"
              icon="pi pi-times"
              rounded
              outlined
              severity="danger"
              :disabled="!files || files.length === 0"
            ></Button>
          </div>
          <div class="flex text-center flex-column justify-content-center">
            <div v-if="UploadLimitBoundary">
              <ProgressBar
                :value="totalSizePercent"
                :showValue="false"
                :class="[
                  'md:w-20rem h-1rem w-full md:ml-auto',
                  { 'exceeded-progress-bar': totalSizePercent > 100 },
                ]"
              >
              </ProgressBar>
              <span class="white-space-nowrap text-sm text-400"
                >{{ formatSize(totalSize) }} /
                {{ formatSize(UploadLimitBoundary) }} - ({{ currFileLength }} /
                {{ props.componentProps.fileLimit }}
                files)</span
              >
            </div>
            <span v-else class="text-sm text-400">{{
              formatSize(totalSize)
            }}</span>
          </div>
        </div>
      </template>
      <template #content="{ files, removeFileCallback }">
        <div v-if="files.length > 0">
          <div class="flex flex-wrap p-0 sm:p-5 gap-5">
            <div
              v-for="(file, index) of files"
              :key="file.name + file.type + file.size"
              class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
            >
              <div>
                <img
                  v-if="'objectURL' in file"
                  role="presentation"
                  :alt="file.name"
                  :src="file?.objectURL as string"
                  width="100"
                  height="50"
                />
              </div>
              <span class="font-semibold">{{ file.name }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <Button
                icon="pi pi-times"
                @click="
                  handleRemoveTemplatingFile(file, removeFileCallback, index)
                "
                outlined
                rounded
                severity="danger"
              />
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex align-items-center justify-content-center flex-column">
          <i
            class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400"
          />
          <p class="mt-4 mb-0">Drag and drop files to here to upload.</p>
        </div>
      </template>
    </FileUpload>

    <FileUpload
      v-else-if="props.componentProps?.mode === 'advanced'"
      :id="name.replace(/[\[\]']+/g, '')"
      :name="name"
      ref="fileupload"
      custom-upload
      v-model="inputValue"
      @select="customUpload"
      @remove="handlefnHandleFileRemove"
      @clear="handleClear"
      @error="
        (e) => {
          console.log('Error event:', e);
        }
      "
      :show-upload-button="false"
      :multiple="true"
      :cancel-label="props.componentProps?.cancelLabel"
      :accept="props.componentProps?.allowedMimeTypes"
      :class="[
        inputClass ? inputClass : '',
        meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
      ]"
      :pt="{
        badge: {
          root: {
            class: 'hidden',
          },
        },
      }"
      v-bind="props.componentProps"
    >
      <template #empty>
        <p>{{ props.componentProps?.emptyMessage || 'No files uploaded.' }}</p>
      </template>
      <template #content="{ files, removeFileCallback, messages }">
        <div v-if="files.length > 0">
          <div class="grid p-2">
            <div
              v-for="(file, index) of files"
              :key="file.name + file.type + file.size"
              class="card m-0 p-6 flex flex-column border-1 surface-border align-items-center gap-3 col-12 sm:col-6 md:col-6 lg:col-4"
            >
              <div>
                <img
                  v-if="'objectURL' in file"
                  role="presentation"
                  :alt="file.name"
                  :src="(file?.objectURL as string) || ''"
                  :style="{ objectFit: 'contain' }"
                  width="100"
                  height="50"
                />
                <i
                  v-else
                  role="presentation"
                  :class="getThumbnail(file.type) + ' p-5 text-8xl text-400'"
                />
              </div>
              <span class="font-semibold text-sm">{{ file.name }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <Button
                icon="pi pi-times"
                @click="removeFileCallback(index)"
                outlined
                rounded
                severity="danger"
              />
            </div>
          </div>
        </div>
        <Message
          v-for="(message, index) in messages"
          :key="index"
          severity="error"
        >
          {{ message }}
        </Message>
      </template>
    </FileUpload>
    <FileUpload
      v-else
      ref="fileupload"
      :data-testid="name.replace(/[\[\]']+/g, '')"
      :id="name.replace(/[\[\]']+/g, '')"
      :name="name"
      :type="type"
      mode="basic"
      v-model="inputValue"
      custom-upload
      @select="customUpload"
      @uploader="handleClear"
      :showUploadButton="false"
      choose-icon="pi pi-trash"
      :showCancelButton="true"
      :accept="props.componentProps?.allowedMimeTypes"
      :pt="{
        chooseButton: {
          class: 'p-button p-button-secondary',
        },
      }"
      :placeholder="placeholder"
      :choose-label="props.componentProps?.chooseLabel"
      :class="[
        inputClass ? inputClass : '',
        meta.validated ? (meta.valid ? 'p-valid' : 'p-invalid') : '',
      ]"
      v-bind="props.componentProps"
    />

    <small
      :data-testid="`errorMessage_${name.replace(/[\[\]']+/g, '')}`"
      class="p-error"
      :class="[errorInputClass ? errorInputClass : '']"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { usePrimeVue } from 'primevue/config';
import type {
  FileUploadProps,
  FileUploadRemoveEvent,
  FileUploadSelectEvent,
} from 'primevue/fileupload';
import { useToast } from 'primevue/usetoast';
import { useField } from 'vee-validate';
import { inject } from 'vue';
import { computed, ref, toRef, watch } from 'vue';

const CNAME = 'BaseInputFile' as const;

const fileupload = ref();
// const props.componentProps?.allowedMimeTypes = getAllowedMimeTypes();


//#region Props
const props = defineProps<{
  name: string;
  label?: string;
  placeholder?: string;
  value?: any;
  type?: string;
  rules?: string;
  fieldClass?: string;
  labelClass?: string;
  parentInputClass?: string;
  inputClass?: string;
  errorInputClass?: string;
  componentProps?: FileUploadProps & {
    componentSlots?: any;
    type?: 'rich' | undefined;
    allowedMimeTypes?: string;
    emptyMessage?: string;
    notif?: {
      file_size_error?: string;
      file_length_error?: string;
      submit_error?: string;
      submit_success?: string;

    }
  };
  

}>();
//#endregion Props

//#region Emits
const emits = defineEmits<{
  (e: 'handle-change', payload: any): void;
  (e: 'selected-files', payload: any): void;
}>();

//#region Datas
const name = toRef(props, 'name');
const rules = toRef(props, 'rules');
const label = toRef(props, 'label');
const value = toRef(props, 'value');
const totalSize = ref(0);
const totalSizePercent = ref(0);
//#endregion Datas

//#region Inject
const resetField = inject('setFieldValue') as (e: string, v: any) => void;
//#endregion Inject

//#region Computed
const UploadLimitBoundary = computed(() => {
  if (props.componentProps?.fileLimit && props.componentProps?.maxFileSize) {
    return props.componentProps.maxFileSize * props.componentProps?.fileLimit;
  } else {
    return undefined;
  }
});

const currFileLength = computed(() => {
  if (inputValue.value) {
    return inputValue.value.length;
  } else {
    return 0;
  }
});
//#endregion Computed

//#region Composable
const {
  value: inputValue,
  errorMessage,
  handleChange,
  setValue,
  meta,
} = useField(name, rules, {
  initialValue: value.value,
  label: label,
});
const $primevue = usePrimeVue();
const toast = useToast();
//#endregion Composable

//#region Watchers
watch(
  () => value?.value,
  (newValue) => {
    if (newValue) {
      value.value = newValue ? newValue : undefined;
      inputValue.value = newValue;
    }
  },
  { immediate: true },
);
//#endregion Watchers
//#region Methods
const customUpload = async (event: FileUploadSelectEvent) => {
  const files = event.files;
  console.log(`[${CNAME}]:customUpload:`, files);

  if (!files.length) return;
  if (props.componentProps?.multiple) {
    setValue([...(inputValue.value ? inputValue.value : []), ...files]);
  } else {
    console.log(`[${CNAME}]:customUpload:`, files[0]);
    setValue(files[0]);
  }
  emits('handle-change', {
    value: inputValue.value,
    cb: resetField,
  });

  console.log(`[${CNAME}]:customUpload:`, inputValue.value);
};

const handleClear = () => {
  handleChange(undefined);
};

const handlefnHandleFileRemove = (e: FileUploadRemoveEvent) => {
  handleChange(e.files);
};

const handleRemoveTemplatingFile = (
  file: File,
  removeFileCallback: (index: number) => void,
  index: number,
) => {
  removeFileCallback(index);
  totalSize.value -= file.size;
  if (UploadLimitBoundary.value) {
    totalSizePercent.value =
      (totalSize.value / UploadLimitBoundary.value) * 100;
  } else {
    if(props.componentProps?.maxFileSize)
    totalSizePercent.value = (totalSize.value / props.componentProps?.maxFileSize) * 100;
  }
};

const handleClearTemplatingUpload = (clear: () => void) => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const handleSelectedFiles = (event: FileUploadSelectEvent) => {
  const files = event.files;

  let currentSize = 0;
  files.forEach((file: File) => {
    currentSize += file.size;
  });

  console.log(
    `[${CNAME}]:handleSelectedFiles:`,
    files,
    currentSize,
    UploadLimitBoundary.value,
  );

  if (UploadLimitBoundary.value && currentSize > UploadLimitBoundary.value) {
    console.log(`[${CNAME}]:handleSelectedFiles:`, 'File size exceeds limit');
    emits('selected-files', {
      message: props.componentProps?.notif?.file_size_error || 'File size exceeds limit',
    });
    toast.add({
      severity: 'error',
      summary: props.componentProps?.notif?.submit_error || 'Error occurred submitting',
      detail: props.componentProps?.notif?.file_size_error || 'File size exceeds limit',
      life: 3000,
    });

    fileupload.value.clear();

    return;
  }
  if (
    props.componentProps?.fileLimit &&
    files.length > props.componentProps.fileLimit
  ) {
    toast.add({
      severity: 'error',
      summary: props.componentProps?.notif?.submit_error || 'Error occurred submitting',
      detail: props.componentProps?.notif?.file_length_error || `Number of files exceeds the limit of ${props.componentProps?.fileLimit}`,
      life: 3000,
    });
    fileupload.value.clear();
    return;
  }
  totalSize.value = currentSize;
  if (UploadLimitBoundary.value) {
    totalSizePercent.value =
      (totalSize.value / UploadLimitBoundary.value) * 100;
  } else {
    if(props.componentProps?.maxFileSize)
    totalSizePercent.value = (totalSize.value / props.componentProps?.maxFileSize) * 100; // convert to percentage
  }
  handleChange(files);
};

const formatSize = (bytes: number) => {
  const k = 1000;
  const dm = 1;
  const sizes = $primevue.config?.locale?.fileSizeTypes;
  if (!sizes) return '';

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${formattedSize} ${sizes[i]}`;
};
const getThumbnail = (mimeTypes: string) => {
  if (mimeTypes.includes('image')) {
    return 'pi pi-image';
  } else if (mimeTypes.includes('video')) {
    return 'pi pi-video';
  } else if (mimeTypes.includes('audio')) {
    return 'pi pi-volume-up';
  } else {
    return getDocumentIcon(mimeTypes);
  }
};

const getDocumentIcon = (mimeTypes: string) => {
  if (mimeTypes.includes('text')) {
    return 'pi pi-file-text';
  } else if (mimeTypes.includes('pdf')) {
    return 'pi pi-file-pdf';
  } else if (mimeTypes.includes('zip')) {
    return 'pi pi-file-archive';
  } else if (mimeTypes.includes('sheet') || mimeTypes.includes('excel')) {
    return 'pi pi-file-excel';
  } else if (mimeTypes.includes('word')) {
    return 'pi pi-file-word';
  } else {
    return 'pi pi-file';
  }
};
//#region For Base64 Uploader
// const customBase64Uploader = async (event: any) => {
//   const files = event.files;
//   if (!files.length) return;
//   files.forEach(async (file: any) => {
//     const reader = new FileReader();

//     const blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
//     reader.readAsDataURL(blob);

//     reader.onloadend = function () {
//       const base64data = reader.result;
//       console.log(reader.result);
//       if (props.componentProps?.multiple) {
//         handleChange([
//           ...(inputValue.value ? inputValue.value : []),
//           base64data,
//         ]);
//       } else {
//         handleChange(base64data);
//       }
//     };
//   });
// };
//#endregion For Base64 Uploader
</script>

<style scoped></style>
