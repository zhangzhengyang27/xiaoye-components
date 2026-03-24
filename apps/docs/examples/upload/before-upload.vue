<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem, UploadRawFile } from "xiaoye-components";

const files = ref<UploadFileItem[]>([]);
const message = ref("请上传小于 1 MB 的文件。");

function beforeUpload(file: UploadRawFile) {
  const allowed = file.size <= 1024 * 1024;
  message.value = allowed ? `${file.name} 通过校验。` : `${file.name} 超出 1 MB 限制。`;
  return allowed;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-upload
      v-model:file-list="files"
      :before-upload="beforeUpload"
      tip="上传前先做业务校验，失败文件不会进入列表"
    />

    <xy-tag status="warning">{{ message }}</xy-tag>
  </div>
</template>
