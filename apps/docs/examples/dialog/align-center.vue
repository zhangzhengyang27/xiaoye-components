<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button plain @click="open = true">打开垂直居中对话框</xy-button>

    <xy-dialog v-model="open" title="居中信息层" align-center width="520px">
      <p>当信息量不大、希望用户更聚焦内容时，垂直居中比传统的 top 偏移更稳妥。</p>
    </xy-dialog>
  </div>
</template>

