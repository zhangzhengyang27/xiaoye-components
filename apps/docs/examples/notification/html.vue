<script setup lang="ts">
import { XyNotificationService } from "xiaoye-components";

function openHtmlNotification() {
  XyNotificationService.open({
    title: "同步结果",
    dangerouslyUseHTMLString: true,
    duration: 0,
    message:
      "<strong>3 个任务成功</strong><br><span>1 个任务等待重试</span>"
  });
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="openHtmlNotification">
      打开 HTML 通知
    </xy-button>
    <xy-tag round status="warning">仅限可信内容</xy-tag>
  </xy-space>
</template>
