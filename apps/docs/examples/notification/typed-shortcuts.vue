<script setup lang="ts">
import { XyNotificationService } from "xiaoye-components";

const actions = [
  {
    label: "success()",
    run: () =>
      XyNotificationService.success({
        title: "发布成功",
        message: "已同步到预发环境。"
      })
  },
  {
    label: "info()",
    run: () =>
      XyNotificationService.info({
        title: "任务开始",
        message: "批量导出正在后台执行。"
      })
  },
  {
    label: "warning()",
    run: () =>
      XyNotificationService.warning({
        title: "容量不足",
        message: "对象存储只剩 8% 可用空间。"
      })
  },
  {
    label: "error()",
    run: () =>
      XyNotificationService.error({
        title: "同步失败",
        message: "请稍后重试，或检查权限配置。"
      })
  }
] as const;
</script>

<template>
  <xy-space wrap>
    <xy-button
      v-for="action in actions"
      :key="action.label"
      type="primary"
      plain
      @click="action.run"
    >
      {{ action.label }}
    </xy-button>
  </xy-space>
</template>
