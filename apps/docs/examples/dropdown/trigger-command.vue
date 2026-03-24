<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("等待触发");
const items = [
  { key: "copy", label: "复制链接", command: "copy-link" },
  { key: "pin", label: "置顶记录", description: "会在列表顶部显示", command: "pin-record" },
  { key: "delete", label: "删除记录", danger: true, command: "delete-record" }
];

function handleCommand(command: string | number | Record<string, unknown>) {
  feedback.value = `最近命令：${String(command)}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-dropdown
        trigger="click"
        :items="items"
        :max-height="120"
        @command="handleCommand"
      >
        <xy-button plain>Click 菜单</xy-button>
      </xy-dropdown>

      <xy-dropdown trigger="contextmenu" :items="items" @command="handleCommand">
        <xy-button type="primary">右键我试试</xy-button>
      </xy-dropdown>
    </xy-space>

    <xy-tag status="primary">{{ feedback }}</xy-tag>
  </div>
</template>
