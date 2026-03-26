<script setup lang="ts">
import { ref } from "vue";
import { XyLoadingService } from "xiaoye-components";

const status = ref("未触发");

function openGroupedLoading() {
  status.value = "已打开首个 loading";
  XyLoadingService({
    groupKey: "publish-task",
    text: "正在校验发布包..."
  });

  window.setTimeout(() => {
    status.value = "命中同一个 groupKey，已复用并更新文案";
    XyLoadingService({
      groupKey: "publish-task",
      text: "正在同步 CDN..."
    });
  }, 500);

  window.setTimeout(() => {
    status.value = "已调用 closeAll()";
    XyLoadingService.closeAll();
  }, 1600);
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="openGroupedLoading">演示 groupKey 复用</xy-button>
    <xy-tag status="warning">{{ status }}</xy-tag>
  </xy-space>
</template>
