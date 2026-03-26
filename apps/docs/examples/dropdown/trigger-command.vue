<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("等待触发");

function handleCommand(command: string | number | Record<string, unknown> | undefined) {
  feedback.value = `最近命令：${String(command ?? "undefined")}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-dropdown
        :trigger="['click', 'contextmenu']"
        :trigger-keys="['F2', 'Enter']"
        :max-height="120"
        @command="handleCommand"
      >
        <xy-button plain>Click / 右键 / F2</xy-button>

        <template #dropdown>
          <xy-dropdown-menu>
            <xy-dropdown-item command="copy-link">复制链接</xy-dropdown-item>
            <xy-dropdown-item command="pin-record" description="会在列表顶部显示">
              置顶记录
            </xy-dropdown-item>
            <xy-dropdown-item danger command="delete-record">删除记录</xy-dropdown-item>
          </xy-dropdown-menu>
        </template>
      </xy-dropdown>
    </xy-space>

    <xy-tag status="primary">{{ feedback }}</xy-tag>
  </div>
</template>
