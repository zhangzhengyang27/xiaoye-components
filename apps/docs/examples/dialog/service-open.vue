<script setup lang="ts">
import { ref } from "vue";
import { XyDialogService } from "xiaoye-components";

const logs = ref<string[]>([]);

async function openServiceDialog() {
  const handle = XyDialogService.open({
    title: "批量发布确认",
    message: "当前操作会影响 12 个菜单入口。",
    dialogProps: {
      width: 560,
      closeOnClickModal: false,
      maximizable: true
    }
  });

  logs.value.unshift(`open() 已创建 handle：${handle.id}`);

  handle.update({
    title: "批量发布确认（已更新）",
    dialogProps: {
      width: 600
    }
  });
  logs.value.unshift("handle.update() 已把标题和宽度更新到最新状态");

  const result = await handle.result;
  logs.value.unshift(`result.action = ${result.action}`);
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="openServiceDialog">打开 service dialog</xy-button>
    <xy-tag status="primary">示例已接入真实 `XyDialogService.open()`。</xy-tag>

    <div class="xy-doc-stack">
      <div v-for="log in logs" :key="log" class="xy-doc-note">{{ log }}</div>
    </div>
  </div>
</template>
