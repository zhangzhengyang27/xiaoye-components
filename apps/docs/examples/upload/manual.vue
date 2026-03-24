<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const files = ref<UploadFileItem[]>([]);
const uploadRef = ref<{
  submit: () => Promise<void>;
} | null>(null);

async function submitFiles() {
  await uploadRef.value?.submit();
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-upload
      ref="uploadRef"
      v-model:file-list="files"
      :auto-upload="false"
      multiple
      tip="先选中文件，再由业务按钮手动发起上传"
    />

    <xy-space wrap>
      <xy-button type="primary" @click="submitFiles">开始上传</xy-button>
      <xy-tag status="neutral">待处理文件：{{ files.length }}</xy-tag>
    </xy-space>
  </div>
</template>
