<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const files = ref<UploadFileItem[]>([
  {
    uid: "cover-v1",
    name: "项目封面-v1.png",
    size: 128_540
  }
]);

function handleChange(nextFiles: UploadFileItem[]) {
  files.value = nextFiles.length ? [nextFiles[nextFiles.length - 1] as UploadFileItem] : [];
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-upload
      :file-list="files"
      tip="单文件场景里只保留最后一次选择结果，适合头像、封面和主合同替换"
      @update:file-list="handleChange"
    />

    <xy-tag :status="files.length ? 'primary' : 'neutral'">
      当前保留：{{ files[0]?.name ?? "未上传" }}
    </xy-tag>
  </div>
</template>
