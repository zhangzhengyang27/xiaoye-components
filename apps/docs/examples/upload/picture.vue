<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const coverUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
  <rect width="320" height="200" rx="24" fill="#dbeafe"/>
  <rect x="18" y="18" width="284" height="164" rx="18" fill="#93c5fd"/>
  <circle cx="96" cy="90" r="28" fill="#f8fafc"/>
  <path d="M42 154L112 96L164 136L214 86L278 154Z" fill="#2563eb"/>
  <text x="24" y="38" font-size="18" fill="#1e3a8a" font-family="Arial">Cover</text>
</svg>
`)}`;

const files = ref<UploadFileItem[]>([
  {
    uid: "cover",
    name: "活动封面.png",
    size: 123_456,
    status: "success",
    url: coverUrl
  }
]);
</script>

<template>
  <xy-upload
    v-model:file-list="files"
    list-type="picture"
    accept=".png,.jpg,.jpeg"
    tip="图片列表适合头像、封面和设计稿回显。"
  />
</template>
