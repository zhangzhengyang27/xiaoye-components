<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const files = ref<UploadFileItem[]>([]);
const exceedMessage = ref("最多保留 2 个文件。");

function handleExceed(exceededFiles: File[]) {
  exceedMessage.value = exceededFiles.length
    ? `超出的文件：${exceededFiles.map((file) => file.name).join("、")}`
    : "已达到数量上限。";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-upload
      v-model:file-list="files"
      multiple
      :limit="2"
      tip="尝试一次选择 3 个以上文件，可以看到超限反馈"
      :on-exceed="handleExceed"
    />

    <xy-space wrap>
      <xy-tag status="warning">{{ exceedMessage }}</xy-tag>
      <xy-tag status="neutral">当前文件数：{{ files.length }}</xy-tag>
    </xy-space>
  </div>
</template>
