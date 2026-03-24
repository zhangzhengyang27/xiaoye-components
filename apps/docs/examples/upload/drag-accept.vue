<script setup lang="ts">
import { computed, ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const files = ref<UploadFileItem[]>([]);
const fileNames = computed(() => files.value.map((item) => item.name));
</script>

<template>
  <div class="xy-doc-stack">
    <xy-upload
      v-model:file-list="files"
      drag
      multiple
      accept=".pdf,.png,.jpg,.jpeg"
      tip="仅接收 PDF / PNG / JPG / JPEG，用于合同、截图和设计稿补充"
    />

    <xy-space wrap>
      <xy-tag status="primary">允许类型：PDF / PNG / JPG / JPEG</xy-tag>
      <xy-tag status="neutral">当前文件数：{{ files.length }}</xy-tag>
    </xy-space>

    <xy-space v-if="fileNames.length" wrap>
      <xy-tag v-for="fileName in fileNames" :key="fileName" status="success">
        {{ fileName }}
      </xy-tag>
    </xy-space>
  </div>
</template>
