<script setup lang="ts">
import { ref } from "vue";

const files = ref([
  {
    uid: "preview-1",
    name: "avatar.png",
    size: 1024,
    status: "success",
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'></svg>"
  }
]);

async function previewFile(file: { url?: string }) {
  return file.url;
}
</script>

<template>
  <xy-upload
    v-model:file-list="files"
    list-type="picture-card"
    paste
    :preview-file="previewFile"
    tip="支持直接粘贴截图或图片文件"
  />
</template>
