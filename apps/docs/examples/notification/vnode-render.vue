<script setup lang="ts">
import { h } from "vue";
import { XyNotificationService } from "xiaoye-components";

function openRenderNotification() {
  XyNotificationService.open({
    title: "渲染函数内容",
    duration: 0,
    message: () =>
      h("div", { class: "demo-notification-vnode-render__body" }, [
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
:global(.demo-notification-vnode-render__body) {
  display: grid;
  gap: 6px;
}

:global(.demo-notification-vnode-render__body strong) {
  color: var(--xy-text-color-primary);
}

:global(.demo-notification-vnode-render__body span) {
  color: var(--xy-text-color-secondary);
}

:global(.demo-notification-vnode-render__body a) {
  color: var(--xy-color-primary);
  text-decoration: none;
}
</style>
