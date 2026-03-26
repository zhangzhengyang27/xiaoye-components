<script setup lang="ts">
import { ref } from "vue";

const lastClosed = ref("最近关闭：尚无记录");

function handleClose(label: string) {
  lastClosed.value = `最近关闭：${label}`;
}
</script>

<template>
  <div class="alert-demo-stack">
    <xy-alert title="该提示不可关闭" type="info" :closable="false" />
    <xy-alert
      title="发布前请再次确认通知范围"
      type="warning"
      close-text="我知道了"
      @close="handleClose('warning')"
    />
    <xy-tag status="warning" round>{{ lastClosed }}</xy-tag>
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
  align-items: start;
}
</style>
