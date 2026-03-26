<script setup lang="ts">
import { ref } from "vue";
import { XyMessage } from "xiaoye-components";

const logs = ref<string[]>([]);

function openInteractiveMessage() {
  XyMessage({
    message: "点击消息卡片或按 Esc 都可以关闭它。",
    type: "primary",
    closeOnClick: true,
    closeOnPressEscape: true,
    showClose: true,
    onClick(ctx) {
      logs.value.unshift(`onClick: reason=${ctx.reason}`);
    },
    onClose(ctx) {
      logs.value.unshift(`onClose: reason=${ctx.reason}`);
    }
  });
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="openInteractiveMessage">打开交互消息</xy-button>

    <div class="xy-doc-stack">
      <div v-for="log in logs" :key="log" class="xy-doc-note">{{ log }}</div>
    </div>
  </div>
</template>
