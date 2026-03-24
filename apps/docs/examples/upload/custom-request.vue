<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem, UploadRequestOptions } from "xiaoye-components";

const files = ref<UploadFileItem[]>([]);
const lastResponse = ref("暂无响应");

function handleSuccess(response: unknown) {
  lastResponse.value = JSON.stringify(response);
}

function customRequest(options: UploadRequestOptions) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      options.onProgress({
        lengthComputable: true,
        loaded: options.file.size,
        total: options.file.size,
        percent: 100
      } as ProgressEvent & { percent: number });
      const response = {
        action: options.action,
        fileName: options.file.name
      };
      options.onSuccess(response);
      resolve(response);
    }, 300);
  });
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-upload
      v-model:file-list="files"
      action="/mock/upload"
      :http-request="customRequest"
      :on-success="handleSuccess"
      tip="适合接入项目自己的 SDK、签名直传或网关封装"
    />

    <xy-tag status="primary">最近响应：{{ lastResponse }}</xy-tag>
  </div>
</template>
