<script setup lang="ts">
import { ref } from "vue";
import type { UploadFileItem } from "xiaoye-components";

const files = ref<UploadFileItem[]>([
  {
    uid: "contract",
    name: "合作协议.pdf",
    size: 328910
  },
  {
    uid: "avatar",
    name: "团队头像.png",
    size: 18302
  }
]);
</script>

<template>
  <xy-upload
    v-model:file-list="files"
    :limit="3"
    tip="预设文件列表适合编辑态回显和继续补充上传"
  />
</template>
