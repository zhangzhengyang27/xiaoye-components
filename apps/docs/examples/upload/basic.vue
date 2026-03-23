<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const files = ref<UploadFileItem[]>([]);
</script>

<template>
  <xy-upload
    v-model="files"
    tip="支持 png、jpg、pdf 等常见格式"
    accept=".png,.jpg,.jpeg,.pdf"
  />
</template>
