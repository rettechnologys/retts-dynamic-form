<template>
  <div class="grid">
    <div :class="[true ? 'col-12 md:col-6' : 'col-12 ']">
      <h4>Email Preview</h4>
      <div
        class="z-5 p-4 border-round h-auto card"
        :style="{
          'word-break': 'break-word',
          overflow: 'auto',
        }"
        v-html="html"
      ></div>
    </div>
    <div v-if="true" class="col-12 md:col-6">
      <h4>WhatsApp Preview</h4>

      <div
        class="card html-wrapper relative flex align-items-end justify-content-end"
      >
        <div
          class="bg-green-800 html-block z-5 p-4 text-white relative border-round white-space-normal max-w-30rem h-auto"
          style="word-break: break-word"
          v-html="whatsApp"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//#region imports
import Utils from '../../../../helpers/Utils';
import { ref } from 'vue';
import { inject, onMounted } from 'vue';
//#endregion imports

//#region Datas
const whatsApp = ref<string>('');
const html = ref<string>('');
const dialogRef = inject<any>('dialogRef');
//#endregion Datas

const CNAME = 'WhatsApps Preview';

//#region Lifecycle Hooks
onMounted(() => {
  const params = dialogRef.value.data;
  const { updatedHtml } = Utils.extractUrlsAndReplace(params.whatsapp);
  whatsApp.value = updatedHtml;
  html.value = params.html;
  console.log(`${CNAME}:onmounted:value `, params);
  console.log(`${CNAME}:onmounted:extractUrlsFromHtml `, updatedHtml);
});
//#endregion Lifecycle Hooks
</script>

<style>
.html-wrapper {
  padding-top: 4rem;
  background-color: #0c1317;
}
.html-wrapper::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-image: url('/images/whatsapp-bg.png');
  background-repeat: no-repeat;
}

.html-block h1,
.html-block h2,
.html-block h3,
.html-block h4,
.html-block h5,
.html-block h6 {
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  margin: 0;
}
.html-block a {
  color: #53bdeb;
}
</style>
