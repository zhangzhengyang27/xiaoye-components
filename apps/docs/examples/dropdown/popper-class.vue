<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("等待触发命令");

function handleCommand(command: string | number | Record<string, unknown> | undefined) {
  feedback.value = `已触发命令：${String(command ?? "undefined")}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-dropdown
        trigger="click"
        popper-class="dropdown-admin-surface"
        @command="handleCommand"
      >
        <xy-button plain>实例级样式收口</xy-button>

        <template #dropdown>
          <xy-dropdown-menu>
            <xy-dropdown-item command="refresh">刷新概览</xy-dropdown-item>
            <xy-dropdown-item command="pin" description="固定到首页顶部">固定看板</xy-dropdown-item>
            <xy-dropdown-item divided danger command="archive">归档视图</xy-dropdown-item>
          </xy-dropdown-menu>
        </template>
      </xy-dropdown>

      <xy-tag status="neutral">{{ feedback }}</xy-tag>
    </xy-space>
  </div>
</template>

<style scoped>
:global(.dropdown-admin-surface) {
  --xy-dropdown-bg: color-mix(in srgb, var(--xy-bg-color-floating) 96%, var(--xy-bg-color-subtle));
  --xy-dropdown-border: color-mix(
    in srgb,
    var(--xy-border-color-subtle) 80%,
    var(--xy-border-color)
  );
  --xy-dropdown-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-color-floating) 10%, transparent),
    0 12px 28px color-mix(in srgb, var(--xy-text-color-heading) 7%, transparent);
  --xy-dropdown-item-hover-bg: color-mix(
    in srgb,
    var(--xy-color-primary) 7%,
    var(--xy-bg-color-floating)
  );
}
</style>
