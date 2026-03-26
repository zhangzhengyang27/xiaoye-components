<script setup lang="ts">
import { ref } from "vue";

const visible = ref(true);

function reopen() {
  visible.value = false;

  requestAnimationFrame(() => {
    visible.value = true;
  });
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="reopen">重新显示组件通知</xy-button>
      <xy-tag round status="success">页面内组件</xy-tag>
    </xy-space>

    <xy-notification
      v-model="visible"
      title="审批流已更新"
      type="success"
      :duration="0"
    >
      新节点会在 2 分钟内同步到所有工作区，适合页面内局部反馈，而不是 service 形式的全局广播。
    </xy-notification>
  </div>
</template>
