<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const latest = ref("最近一次结果：尚未自动关闭");

function openAlert() {
  visible.value = false;
  requestAnimationFrame(() => {
    visible.value = true;
  });
}

function handleAutoClose() {
  latest.value = `最近一次结果：已在 ${new Date().toLocaleTimeString()} 自动关闭`;
}
</script>

<template>
  <div class="alert-demo-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="openAlert">显示并开始计时</xy-button>
      <xy-tag round status="primary">duration = 3000</xy-tag>
      <xy-tag round status="warning">hover 暂停 = true</xy-tag>
    </xy-space>

    <xy-alert
      v-model="visible"
      title="把鼠标停在这条提示上会暂停计时"
      type="info"
      :duration="3000"
      :pause-on-hover="true"
      show-icon
      description="离开后会继续剩余时间，而不是重新从头开始。"
      @auto-close="handleAutoClose"
    />

    <xy-tag round status="success">{{ latest }}</xy-tag>
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
