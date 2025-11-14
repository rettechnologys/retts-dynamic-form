/* Import TinyMCE */
import tinymce from 'tinymce';

/* Default icons are required. After that, import custom icons if applicable */
import 'tinymce/icons/default/icons.min.js';

/* Required TinyMCE components */
import 'tinymce/themes/silver/theme.min.js';
import 'tinymce/models/dom/model.min.js';

/* Import a skin (can be a custom skin instead of the default) */
import 'tinymce/skins/ui/oxide/skin.js';
import 'tinymce/skins/ui/oxide-dark/skin.js';

/* Import plugins */
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/code';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/save';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/accordion';

/* Import premium plugins */
/* NOTE: Download separately and add these to /src/plugins */
/* import './plugins/<plugincode>'; */

// /* content UI CSS is required */
// import contentUiSkinCss from 'tinymce/skins/ui/oxide/content.js';

// /* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
// import contentCss from 'tinymce/skins/content/default/content.js';

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

/* Initialize TinyMCE */
export function render(unique?: string) {
  tinymce.init({
    license_key: 'gpl',
    selector: `div#editor-${unique}`,
    object_resizing: true,
    resize_img_proportional: true,
    image_advtab: true,
    file_picker_types: 'file image media',
    file_picker_callback: filePickerCallback,
    images_upload_handler: (blobInfo: any) => {
      const base64str =
        'data:' + blobInfo.blob().type + ';base64,' + blobInfo.base64();
      return Promise.resolve(base64str);
    },
    plugins:
      'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount  charmap quickbars emoticons accordion',
    toolbar:
      'undo redo | accordion accordionremove | blocks fontfamily fontsize | bold italic underline strikethrough | align numlist bullist | link image | table media | lineheight outdent indent| forecolor backcolor removeformat | charmap emoticons | code fullscreen preview | save print | pagebreak anchor codesample | ltr rtl',
    importcss_append: true,
    height: 600,
    image_caption: true,
    quickbars_selection_toolbar:
      'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    noneditable_class: 'mceNonEditable',
    toolbar_mode: 'sliding',
    contextmenu: 'link image',
    content_style:
      'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    skin_url: 'default',
    content_css: 'default',
    setup: (editor: any) => {
      editor.on('keydown', (e: any) => {
        if (e.keyCode === 8 || e.keyCode === 46) {
          try {
            const selection = editor.selection;
            const node = selection.getNode().parentNode;
            console.log('node', node);
            if (node.classList.contains('protected')) {
              e.preventDefault();
              console.log('Cannot delete this element');
              return false;
            }
          } catch (error) {
            console.log('error', error);
          }
        }
      });
    },
  });
}
