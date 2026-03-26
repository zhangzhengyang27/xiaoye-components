<script setup lang="ts">
import { ref } from "vue";

const placement = ref<"bottom-start" | "top-start" | "right-start" | "left-start">("bottom-start");
const lastAction = ref("最近操作：暂无");

function handleCommand(command: string | number | Record<string, unknown> | undefined) {
  lastAction.value = `最近操作：${String(command ?? "undefined")}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="placement = 'bottom-start'">bottom-start</xy-button>
      <xy-button plain @click="placement = 'top-start'">top-start</xy-button>
      <xy-button plain @click="placement = 'right-start'">right-start</xy-button>
      <xy-button plain @click="placement = 'left-start'">left-start</xy-button>
    </xy-space>

    <xy-dropdown :placement="placement" trigger="click" show-arrow @command="handleCommand">
      <xy-button type="primary">打开操作菜单</xy-button>

      <template #dropdown>
        <xy-dropdown-menu>
          <xy-dropdown-item command="assign">分配负责人</xy-dropdown-item>
          <xy-dropdown-item icon="mdi:sync" command="sync">立即同步</xy-dropdown-item>
          <xy-dropdown-item danger command="archive">归档当前记录</xy-dropdown-item>
        </xy-dropdown-menu>
      </template>
    </xy-dropdown>

    <xy-space wrap>
      <xy-tag status="primary">当前 placement：{{ placement }}</xy-tag>
      <xy-tag status="neutral">{{ lastAction }}</xy-tag>
    </xy-space>
  </div>
</template>
