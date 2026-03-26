<script setup lang="ts">
import { h } from "vue";
import { XyNotificationService } from "xiaoye-components";

function openRenderNotification() {
  XyNotificationService.open({
    title: "渲染函数内容",
    duration: 0,
    message: () =>
      h("div", { class: "render-body" }, [
        h("strong", "发布窗口已开启"),
        h("span", "请在 10 分钟内完成审批。"),
        h(
          "a",
          {
            href: "javascript:void(0)"
          },
          "查看排班影响范围"
        )
      ])
  });
}
</script>

<template>
  <xy-space wrap>
    <xy-button type="primary" @click="openRenderNotification">
      打开渲染函数通知
    </xy-button>
    <xy-tag round status="info">message: () =&gt; VNode</xy-tag>
  </xy-space>
</template>

<style scoped>
:deep(.render-body) {
  display: grid;
  gap: 6px;
}

:deep(.render-body strong) {
  color: var(--xy-text-color-primary);
}

:deep(.render-body span) {
  color: var(--xy-text-color-secondary);
}

:deep(.render-body a) {
  color: var(--xy-color-primary);
  text-decoration: none;
}
</style>
