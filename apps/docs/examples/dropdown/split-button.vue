<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("等待操作");

function handlePrimaryClick() {
  feedback.value = "已触发主按钮操作";
}

function handleCommand(command: string | number | Record<string, unknown> | undefined) {
  feedback.value = `菜单命令：${String(command ?? "undefined")}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-dropdown split-button trigger="click" @click="handlePrimaryClick" @command="handleCommand">
      立即处理

      <template #dropdown>
        <xy-dropdown-menu>
          <xy-dropdown-item command="save-draft">保存草稿</xy-dropdown-item>
          <xy-dropdown-item command="schedule">加入排期</xy-dropdown-item>
          <xy-dropdown-item divided danger command="discard">放弃变更</xy-dropdown-item>
        </xy-dropdown-menu>
      </template>
    </xy-dropdown>

    <xy-tag status="primary">{{ feedback }}</xy-tag>
  </div>
</template>
