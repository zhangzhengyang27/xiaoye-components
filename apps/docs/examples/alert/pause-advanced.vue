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
      <xy-tag round status="primary">focus 暂停 = true</xy-tag>
      <xy-tag round status="warning">page hidden 暂停 = true</xy-tag>
    </xy-space>

    <xy-alert
      v-model="visible"
      title="把焦点停在操作按钮上，或切到其他浏览器标签页"
      type="warning"
      :duration="3000"
      :pause-on-focus="true"
      :pause-on-page-hidden="true"
      show-icon
      description="聚焦到内部按钮时会暂停计时；页面切到后台后，也会在返回时继续剩余时间。"
      @auto-close="handleAutoClose"
    >
      <template #actions>
        <xy-button plain size="sm">内部操作</xy-button>
      </template>
    </xy-alert>

    <xy-tag round status="success">{{ latest }}</xy-tag>
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
