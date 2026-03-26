<script setup lang="ts">
import { ref } from "vue";
import { XyMessage } from "xiaoye-components";

const logs = ref<string[]>([]);

function openControlledMessage() {
  XyMessage({
    message: "关闭前会模拟一次异步校验。",
    type: "warning",
    duration: 0,
    showClose: true,
    beforeClose(done, ctx) {
      logs.value.unshift(`beforeClose: reason=${ctx.reason}`);
      window.setTimeout(() => done(), 180);
    },
    onClose(ctx) {
      logs.value.unshift(`onClose: reason=${ctx.reason}`);
    }
  });
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="openControlledMessage">打开关闭拦截消息</xy-button>

    <div class="xy-doc-stack">
      <div v-for="log in logs" :key="log" class="xy-doc-note">{{ log }}</div>
    </div>
  </div>
</template>
