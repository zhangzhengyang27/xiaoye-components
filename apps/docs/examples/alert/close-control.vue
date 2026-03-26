<script setup lang="ts">
import { ref } from "vue";

const allowClose = ref(false);
const message = ref("当前未满足关闭条件，请先勾选“允许关闭”。");

function beforeClose(done: (cancel?: boolean) => void) {
  if (!allowClose.value) {
    message.value = "关闭已被拦截：请先确认风险范围。";
    done(true);
    return;
  }

  message.value = "已通过关闭前检查，提示即将关闭。";
  done();
}
</script>

<template>
  <div class="alert-demo-stack">
    <xy-space wrap>
      <xy-checkbox v-model="allowClose">允许关闭</xy-checkbox>
      <xy-tag :status="allowClose ? 'success' : 'warning'" round>{{ message }}</xy-tag>
    </xy-space>

    <xy-alert
      title="这条提示关闭前需要先通过校验"
      type="warning"
      description="before-close 会在点击关闭按钮时先执行，只有 done() 放行后才会真正关闭。"
      show-icon
      :before-close="beforeClose"
    />
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
