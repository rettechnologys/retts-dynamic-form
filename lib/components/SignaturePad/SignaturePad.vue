<template>
  <div class="w-full h-full flex flex-column gap-2">
    <canvas
      ref="canvasRef"
      :class="[
        props.class,
        'border-1 border-200 h-15rem',
        { 'bg-gray-100': isDarkTheme },
      ]"
      :style="
        props.style
          ? props.style
          : 'border: 1px solid #000; width: 100%; height: 100%'
      "
    ></canvas>
    <ButtonGroup class="mt-2" v-if="!props.disabled">
      <Button
        icon="pi pi-undo"
        @click="undo"
        :title="props.locale?.undoButtonText || 'Undo'"
      />
      <Button
        v-show="!props.hideSaveButton"
        icon="pi pi-download"
        @click="save"
        :title="props.locale?.saveButtonText || 'Save'"
      />
      <Button
        icon="pi pi-trash"
        @click="clear"
        :title="props.locale?.clearButtonText || 'Clear'"
      />
    </ButtonGroup>
  </div>
</template>

<script setup lang="ts">
import SignaturePad from 'signature_pad';
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
import type { SignaturePadOptions, SignaturePadProps } from './Types';

//* Default Config
const DEFAULT_CONFIG: SignaturePadOptions = {
  dotSize: 2,
  minWidth: 2,
  maxWidth: 4,
  throttle: 10,
  backgroundColor: 'rgba(255,255,255,0)',
  minDistance: 5,
  velocityFilterWeight: 0.7,
};
//#region Model
const modelValue = defineModel<string | null | undefined>();
//#endregion Model
//#region Props
const props = defineProps<SignaturePadProps>();
console.log('props', props);
//endregion Props

//#region Emits
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | Blob | null | undefined): void;
}>();
//#endregion Emits

//#region Composables
const canvasRef = useTemplateRef('canvasRef');
//#endregion Composables

//#region Datas
const padOptions = ref<SignaturePadOptions>({
  ...DEFAULT_CONFIG,
  ...props.options,
});
let signaturePad: SignaturePad | null = null;
const originalImage = ref<string | null>(null);
const isDarkTheme = ref(props.isDarkTheme || false);
//#endregion Datas

//#region Lifecycle Hooks
onMounted(() => {
  if (canvasRef.value) {
    signaturePad = new SignaturePad(canvasRef.value, padOptions.value);
    resizeCanvas();
    if (modelValue.value) {
      signaturePad.fromDataURL(modelValue.value);
      originalImage.value = modelValue.value;
      console.log('signaturePad', signaturePad.toDataURL());
    }
    signaturePad.addEventListener(
      'beginStroke',
      () => {
        console.log('Signature started');
      },
      { once: true },
    );
    signaturePad.addEventListener('endStroke', () => {
      if (signaturePad) {
        console.log('Signature saved', signaturePad.toDataURL());
        const data = signaturePad.toDataURL();
        const processedData = handleDataType(data);
        emit('update:modelValue', processedData);
      }
    });

    window.addEventListener('resize', resizeCanvas);

    if (props.disabled) {
      console.log('disabled');
      signaturePad.off();
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
  originalImage.value = null;
});
//#endregion Lifecycle Hooks

watch(
  () => modelValue.value,
  (newValue) => {
    if (newValue && signaturePad) {
      signaturePad.fromDataURL(newValue);
    }
  },
  { immediate: true },
);

watch(
  () => props.disabled,
  (newValue) => {
    if (signaturePad) {
      if (newValue) {
        signaturePad.off();
      } else {
        signaturePad.on();
      }
    }
  },
);

watch(() => props.isDarkTheme, (newValue) => {
  isDarkTheme.value = newValue;
}, {

})

const clear = () => {
  if (signaturePad) {
    signaturePad.clear();
    const data = signaturePad.toDataURL();
    originalImage.value = null;
    emit('update:modelValue', data);
  }
};

const undo = () => {
  const data = signaturePad?.toData();

  if (data && data.length) {
    // signaturePad?.clear();

    data.pop(); // remove the last dot
    if (originalImage.value) {
      signaturePad?.fromDataURL(originalImage.value);
    }
    signaturePad?.fromData(data, { clear: true });

    emit('update:modelValue', signaturePad?.toDataURL());
  }
};

const save = () => {
  if (signaturePad?.isEmpty()) return;
  const assets = signaturePad?.toDataURL('image/png');
  console.log(assets);
  if (assets) {
    const parts = assets.split(';base64,');
    const contentType = parts[0]!.split(':')[1];
    const raw = window.atob(parts[1]!);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([uInt8Array], { type: contentType });
    console.log(blob);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signature.png';
    link.click();
    URL.revokeObjectURL(url);
  }
};

const handleDataToBlob = (data: string) => {
  const parts = data.split(';base64,');
  const contentType = parts[0]!.split(':')[1];
  const raw = window.atob(parts[1]!);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  const blob = new Blob([uInt8Array], { type: contentType });

  return blob;
};

const handleDataToFile = (data: string) => {
  const blob = handleDataToBlob(data);
  const file = new File([blob], 'signature.png', { type: blob.type });
  return file;
};

const resizeCanvas = () => {
  if (canvasRef.value && signaturePad) {
    const canvas = canvasRef.value;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    // Save current signature data before resizing
    const data = signaturePad.toData();

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);

    // Restore the saved signature data after resizing
    signaturePad.clear();
    signaturePad.fromData(data);
  }
};

const getImageData = () => {
  if (signaturePad) {
    return signaturePad.toDataURL();
  }
  return null;
};

const handleDataType = (data: string) => {
  switch (props.options?.saveAs) {
    case 'file':
      return handleDataToFile(data);
    case 'blob':
      return handleDataToBlob(data);
    default:
      return data;
  }
};

defineExpose({
  clear,
  undo,
  save,
  handleDataToBlob,
  getImageData,
});
</script>
