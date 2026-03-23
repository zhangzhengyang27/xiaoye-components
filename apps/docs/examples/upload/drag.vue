<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const files = ref<UploadFileItem[]>([]);
</script>

<template>
  <xy-upload
    v-model="files"
    drag
    multiple
    tip="拖拽上传适合补充材料、附件批量提交等场景"
  />
</template>
