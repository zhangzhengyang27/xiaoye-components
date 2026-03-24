<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const files = ref<UploadFileItem[]>([
  {
    uid: "contract",
    name: "合作协议.pdf",
    size: 328_910,
    status: "success"
  }
]);
</script>

<template>
  <xy-upload v-model:file-list="files">
    <template #file="{ file }">
      <div class="xy-doc-upload-file">
        <xy-tag status="primary">{{ file.status ?? "ready" }}</xy-tag>
        <xy-text>{{ file.name }}</xy-text>
      </div>
    </template>
  </xy-upload>
</template>

<style scoped>
.xy-doc-upload-file {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
