<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const avatarUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" rx="28" fill="#f3e7e1"/>
  <circle cx="100" cy="74" r="34" fill="#ebd4c7"/>
  <path d="M42 172C52 134 76 116 100 116C124 116 148 134 158 172Z" fill="#b88f7c"/>
  <text x="24" y="34" font-size="18" fill="#8b6a59" font-family="Arial">Avatar</text>
</svg>
`)}`;

const files = ref<UploadFileItem[]>([
  {
    uid: "avatar",
    name: "头像.png",
    size: 88_888,
    status: "success",
    url: avatarUrl
  }
]);
</script>

<template>
  <xy-upload v-model:file-list="files" list-type="picture-card" accept=".png,.jpg,.jpeg" />
</template>
