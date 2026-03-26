<script setup lang="ts">
import { ref } from "vue";

const lastAction = ref("等待操作");

async function beforeConfirm() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 900);
  });

  lastAction.value = "已完成发布前检查";
}

async function beforeCancel() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 500);
  });

  lastAction.value = "已取消本次发布";
}
</script>

<template>
  <div class="demo-popconfirm-async">
    <xy-popconfirm
      title="确认发布当前版本吗？"
      content="组件会自动托管按钮 loading，并在 hook resolve 后关闭。"
      confirm-button-text="开始发布"
      :before-confirm="beforeConfirm"
      :before-cancel="beforeCancel"
    >
      <template #reference>
        <xy-button type="primary">发布版本</xy-button>
      </template>
    </xy-popconfirm>

    <xy-text type="secondary">最近状态：{{ lastAction }}</xy-text>
  </div>
</template>

<style scoped>
.demo-popconfirm-async {
  display: grid;
  gap: 12px;
  justify-items: start;
}
</style>
