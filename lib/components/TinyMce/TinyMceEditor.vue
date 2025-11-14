<template>
  <Editor
    ref="editorRef"
    :id="`editor-${props.unique}`"
    :init="init"
    :disabled="props.disabled"
    v-model="model"
  />
</template>

<script setup lang="ts">
import * as editor from './editor/editor';
import min_style from './editor/min-style';
import Utils from '../../helpers/Utils';
import Editor from '@tinymce/tinymce-vue';
import { useDialog } from 'primevue/usedialog';
import { useToast } from 'primevue/usetoast';
import tinymce from 'tinymce';
import { defineAsyncComponent, onBeforeMount, ref, watch } from 'vue';

const CNAME = 'TinyMceEditor' as const;

type onSubmitType = {
  original: string;
  parsed: string;
};

const WhatsAppPreviewer = defineAsyncComponent(
  () => import('./editor/preview/HTMLWAPreview.vue'),
);

const ECOMMANDS = {
  INSERT_CONTENT: 'mceInsertContent',
  FOCUS: 'mceFocus',
};

//#region Props
const props = withDefaults(
  defineProps<{
    height: number;
    unique?: string;
    disabled?: boolean;
    isDarkTheme?: boolean;
  }>(),
  {
    height: 500,
    unique: '2',
    disabled: false,
  },
);
//#endregion Props

//#region Emits
const emits = defineEmits<{
  (event: 'handle-preview', value: string): void;
  (event?: 'handle-submit', value?: onSubmitType): onSubmitType;
  (event?: 'handle-change', value?: string): string;
  (event?: 'handle-blur', value?: string): string;
}>();
//#endregion Emits

//#region Datas
const model = defineModel({
  default: '',
});
const editorRef = ref();
const init = ref({
  license_key: 'gpl',
  selector: `div#editor-${props.unique}`,
  object_resizing: true,
  resize_img_proportional: true,
  image_advtab: true,
  file_picker_types: 'file image media',
  file_picker_callback: (
    cb: (blobUri: string, options: { title: string }) => void,
    value: string,
    meta: any,
  ) => filePickerCallback(cb, value, meta),
  images_upload_handler: (blobInfo: any) => {
    const base64str =
      'data:' + blobInfo.blob().type + ';base64,' + blobInfo.base64();
    return Promise.resolve(base64str);
  },
  plugins:
    ' importcss  searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount  charmap quickbars emoticons accordion',
  toolbar:
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen  whatsAppPreview | save print | pagebreak anchor codesample | ltr rtl',
  importcss_append: true,
  height: props.height,
  link_class_list: [
    { title: 'Button Link', value: 'link-btn' },
    { title: 'External Link', value: 'ext_link' },
    { title: 'Internal Support Link', value: 'int_sup_link' },
    { title: 'Internal Marketing Link', value: 'int_mark_link' },
    { title: 'Other Internal Link', value: 'int_other_link' },
  ],
  image_caption: true,
  quickbars_selection_toolbar:
    'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_class: 'mceNonEditable',
  toolbar_mode: 'sliding',
  contextmenu: 'link image',
  content_style: min_style,
  skin_url: () => (isDarkTheme.value ? 'dark' : 'default'),
  content_css: 'default',
  setup: (editor: any) => {
    //#region Preview Icon
    editor.ui.registry.addIcon(
      'Preview',
      '<svg fill="#000000" width="20" height="20" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>eye</title> <path d="M0 16q0.064 0.128 0.16 0.352t0.48 0.928 0.832 1.344 1.248 1.536 1.664 1.696 2.144 1.568 2.624 1.344 3.136 0.896 3.712 0.352 3.712-0.352 3.168-0.928 2.592-1.312 2.144-1.6 1.664-1.632 1.248-1.6 0.832-1.312 0.48-0.928l0.16-0.352q-0.032-0.128-0.16-0.352t-0.48-0.896-0.832-1.344-1.248-1.568-1.664-1.664-2.144-1.568-2.624-1.344-3.136-0.896-3.712-0.352-3.712 0.352-3.168 0.896-2.592 1.344-2.144 1.568-1.664 1.664-1.248 1.568-0.832 1.344-0.48 0.928zM10.016 16q0-2.464 1.728-4.224t4.256-1.76 4.256 1.76 1.76 4.224-1.76 4.256-4.256 1.76-4.256-1.76-1.728-4.256zM12 16q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848-1.184-2.816-2.816-1.184-2.816 1.184l2.816 2.816h-4z"></path> </g></svg>',
    );

    // Custom toolbar button
    editor.ui.registry.addButton('whatsAppPreview', {
      icon: 'Preview',
      tooltip: 'Preview Email & Message',
      onAction: (_: any) => onPreviewHtmlWhatsApp(),
    });

    editor.on('keydown', (e: any) => {
      if (e.keyCode === 8 || e.keyCode === 46) {
        try {
          const selection = editor.selection;
          const parentNode = selection.getNode().parentNode;
          const node = selection.getNode();

          if (
            parentNode.classList.contains('protected') ||
            parentNode.classList.contains('mceNonEditable') ||
            selection.getNode().classList.contains('protected')
          ) {
            e.preventDefault();
            console.log('Cannot delete this element');
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Cannot delete this element',
              closable: true,
              life: 2000,
            });
            return false;
          }
        } catch (error) {
          console.log('error', error);
        }
      }
    });
    editor.on('focus', (e: any) => {
      const selection = editor.selection;
      const parentNode = selection.getNode().parentNode;
      const node = selection.getNode();
    });
    editor.on('input', (e: any) => {
      emits(
        'handle-change',
        Utils.InlineHTMLStyle(editor.getContent(), min_style),
      );
    });

    editor.on('blur', (e: any) => {
      console.log('blur', e.command);

      emits(
        'handle-blur',
        Utils.InlineHTMLStyle(editor.getContent(), min_style),
      );
    });
    editor.on('execCommand', async (e: any) => {
      // console.log('execCommand', e.command);
      if (e.command === ECOMMANDS.FOCUS)
        emits(
          'handle-change',
          Utils.InlineHTMLStyle(editor.getContent(), min_style),
        );
    });
  },

  text_patterns_lookup: (ctx: any) => {
    const parentTag = ctx.block.nodeName.toLowerCase();
    // console.log('parentTag', parentTag);
    // console.log('ctx', ctx.text);
    return [
      {
        start: '{{' + `${ctx.text.replace('{{', '')}`,
        replacement: `<span class="mceNonEditable" style="background-color: #f1c40f;">${ctx.text.replace(
          '{{',
          '{{ ',
        )} }}</span>`,
      },
    ];
  },
});
//#endregion Datas

//#region Composables
const isDarkTheme = ref(props.isDarkTheme || false);
const toast = useToast();
const dialog = useDialog();
//#endregion Composables

//#region Lifecycle Hooks
onBeforeMount(() => {
  editor.render(props.unique);
  console.log(`[${CNAME}]:onBeforeMount:${new Date().getTime()}`);
});
//#endregion Lifecycle Hooks

//#region Methods
// eslint-disable-next-line no-useless-escape
const filePickerCallback = (
  cb: (blobUri: string, options: { title: string }) => void,
  value: string,
  meta: any,
) => {
  console.log('filePickerCallback');
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');

  input.addEventListener('change', (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];

    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const id = 'blobid' + new Date().getTime();
      const activeEditor = tinymce.activeEditor;

      if (activeEditor) {
        const blobCache = activeEditor.editorUpload.blobCache;
        const base64 = reader.result as string;
        const blobInfo = blobCache.create(id, file, base64.split(',')[1]!);
        blobCache.add(blobInfo);

        cb(base64, { title: file.name });
      }
    });
    reader.readAsDataURL(file);
  });

  input.click();
};
const onPreviewHtmlWhatsApp = () => {
  dialog.open(WhatsAppPreviewer, {
    data: {
      whatsapp: Utils.TrimHeaderFooterWithStyle(model.value),
      html: model.value,
    },
    props: {
      header: 'Preview',
      style: {
        width: '90dvw',
      },

      modal: true,
    },
  });
};
//#endregion Methods

watch(() => props.isDarkTheme, (newValue) => {
  isDarkTheme.value = newValue || false;
});
</script>

<style>
.tox-promotion {
  display: none;
}
</style>
